// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "../../Recoverable.sol";
import "../../../interfaces/ILendingStrategy.sol";
import "../../../dependencies/compound/ICompoundERC20DelegatorLike.sol";
import "../../../libraries/ProtoUtilV1.sol";
import "../../../libraries/StoreKeyUtil.sol";
import "../../../libraries/NTransferUtilV2.sol";

contract CompoundStrategy is ILendingStrategy, Recoverable {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  mapping(bytes32 => uint256) private _counters;
  mapping(bytes32 => uint256) private _depositTotal;
  mapping(bytes32 => uint256) private _withdrawalTotal;

  bytes32 private constant _KEY = keccak256(abi.encodePacked("lending", "strategy", "compound", "v2"));
  bytes32 public constant NS_DEPOSITS = "deposits";
  bytes32 public constant NS_WITHDRAWALS = "withdrawals";

  address public depositCertificate;
  ICompoundERC20DelegatorLike public delegator;
  mapping(uint256 => bool) public supportedChains;

  constructor(
    IStore _s,
    ICompoundERC20DelegatorLike _delegator,
    address _compoundWrappedStablecoin
  ) Recoverable(_s) {
    depositCertificate = _compoundWrappedStablecoin;
    delegator = _delegator;
  }

  function getDepositAsset() public view override returns (IERC20) {
    return IERC20(s.getStablecoin());
  }

  function getDepositCertificate() public view override returns (IERC20) {
    return IERC20(depositCertificate);
  }

  /**
   * @dev Gets info of this strategy by cover key
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the cover key
   * @param values[0] deposits Total amount deposited
   * @param values[1] withdrawals Total amount withdrawn
   */
  function getInfo(bytes32 coverKey) external view override returns (uint256[] memory values) {
    values = new uint256[](2);

    values[0] = s.getUintByKey(_getDepositsKey(coverKey));
    values[1] = s.getUintByKey(_getWithdrawalsKey(coverKey));
  }

  function _getCertificateBalance() private view returns (uint256) {
    return getDepositCertificate().balanceOf(address(this));
  }

  function _drain(IERC20 asset) private {
    uint256 amount = asset.balanceOf(address(this));

    if (amount > 0) {
      asset.ensureTransfer(s.getTreasury(), amount);

      emit Drained(asset, amount);
    }
  }

  /**
   * @dev Deposits the tokens to Compound
   * Ensure that you `approve` stablecoin before you call this function
   *
   * @custom:suppress-acl This function is only accessible to protocol members
   * @custom:suppress-malicious-erc This tokens `aToken` and `stablecoin` are well-known addresses.
   * @custom:suppress-address-trust-issue The addresses `compoundWrappedStablecoin` or `stablecoin` can't be manipulated via user input.
   * 
   * @param coverKey Enter cover key to deposit
   * @param amount Enter amount to deposit
   */
  function deposit(bytes32 coverKey, uint256 amount) external override nonReentrant returns (uint256 compoundWrappedStablecoinMinted) {
    s.mustNotBePaused();
    s.senderMustBeProtocolMember();

    IVault vault = s.getVault(coverKey);

    if (amount == 0) {
      return 0;
    }

    IERC20 stablecoin = getDepositAsset();
    IERC20 compoundWrappedStablecoin = getDepositCertificate();

    require(stablecoin.balanceOf(address(vault)) >= amount, "Balance insufficient");

    // This strategy should never have token balances
    _drain(compoundWrappedStablecoin);
    _drain(stablecoin);

    // Transfer DAI to this contract; then approve and send it to delegator to mint compoundWrappedStablecoin
    vault.transferToStrategy(stablecoin, coverKey, getName(), amount);
    stablecoin.ensureApproval(address(delegator), amount);

    uint256 result = delegator.mint(amount);

    require(result == 0, "Compound delegator mint failed");

    // Check how many compoundWrappedStablecoin we received
    compoundWrappedStablecoinMinted = _getCertificateBalance();

    require(compoundWrappedStablecoinMinted > 0, "Minting cUS$ failed");

    // Immediately send compoundWrappedStablecoin to the original vault stablecoin came from
    compoundWrappedStablecoin.ensureApproval(address(vault), compoundWrappedStablecoinMinted);
    vault.receiveFromStrategy(compoundWrappedStablecoin, coverKey, getName(), compoundWrappedStablecoinMinted);

    s.addUintByKey(_getDepositsKey(coverKey), amount);

    _counters[coverKey] += 1;
    _depositTotal[coverKey] += amount;

    emit LogDeposit(getName(), _counters[coverKey], amount, compoundWrappedStablecoinMinted, _depositTotal[coverKey], _withdrawalTotal[coverKey]);
    emit Deposited(coverKey, address(vault), amount, compoundWrappedStablecoinMinted);
  }

  /**
   * @dev Redeems compoundWrappedStablecoin from Compound to receive stablecoin
   * Ensure that you `approve` compoundWrappedStablecoin before you call this function
   *
   * @custom:suppress-acl This function is only accessible to protocol members
   * @custom:suppress-malicious-erc This tokens `aToken` and `stablecoin` are well-known addresses.
   * @custom:suppress-address-trust-issue The addresses `compoundWrappedStablecoin` or `stablecoin` can't be manipulated via user input.
   * 
   * @param coverKey Enter cover key to withdraw
   */
  function withdraw(bytes32 coverKey) external virtual override nonReentrant returns (uint256 stablecoinWithdrawn) {
    s.mustNotBePaused();
    s.senderMustBeProtocolMember();
    IVault vault = s.getVault(coverKey);

    IERC20 stablecoin = getDepositAsset();
    IERC20 compoundWrappedStablecoin = getDepositCertificate();

    // This strategy should never have token balances without any exception, especially `compoundWrappedStablecoin` and `DAI`
    _drain(compoundWrappedStablecoin);
    _drain(stablecoin);

    uint256 compoundWrappedStablecoinRedeemed = compoundWrappedStablecoin.balanceOf(address(vault));

    if (compoundWrappedStablecoinRedeemed == 0) {
      return 0;
    }

    // Transfer compoundWrappedStablecoin to this contract; then approve and send it to delegator to redeem DAI
    vault.transferToStrategy(compoundWrappedStablecoin, coverKey, getName(), compoundWrappedStablecoinRedeemed);
    compoundWrappedStablecoin.ensureApproval(address(delegator), compoundWrappedStablecoinRedeemed);
    uint256 result = delegator.redeem(compoundWrappedStablecoinRedeemed);

    require(result == 0, "Compound delegator redeem failed");

    // Check how many DAI we received
    stablecoinWithdrawn = stablecoin.balanceOf(address(this));

    require(stablecoinWithdrawn > 0, "Redeeming cUS$ failed");

    // Immediately send DAI to the vault compoundWrappedStablecoin came from
    stablecoin.ensureApproval(address(vault), stablecoinWithdrawn);
    vault.receiveFromStrategy(stablecoin, coverKey, getName(), stablecoinWithdrawn);

    s.addUintByKey(_getWithdrawalsKey(coverKey), stablecoinWithdrawn);

    _counters[coverKey] += 1;
    _withdrawalTotal[coverKey] += stablecoinWithdrawn;

    emit LogWithdrawal(getName(), _counters[coverKey], stablecoinWithdrawn, compoundWrappedStablecoinRedeemed, _depositTotal[coverKey], _withdrawalTotal[coverKey]);
    emit Withdrawn(coverKey, address(vault), stablecoinWithdrawn, compoundWrappedStablecoinRedeemed);
  }

  /**
   * @dev Hash key of the Compound deposits for the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function _getDepositsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_DEPOSITS));
  }

  /**
   * @dev Hash key of the Compound withdrawal for the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function _getWithdrawalsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_WITHDRAWALS));
  }

  function getWeight() external pure override returns (uint256) {
    return 10_000; // 100%
  }

  function getKey() external pure override returns (bytes32) {
    return _KEY;
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_STRATEGY_COMPOUND;
  }
}
