// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "../../Recoverable.sol";
import "../../../interfaces/ILendingStrategy.sol";
import "../../../dependencies/aave/IAaveV2LendingPoolLike.sol";
import "../../../libraries/ProtoUtilV1.sol";
import "../../../libraries/StoreKeyUtil.sol";
import "../../../libraries/NTransferUtilV2.sol";

contract AaveStrategy is ILendingStrategy, Recoverable {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  bytes32 private constant _KEY = keccak256(abi.encodePacked("lending", "strategy", "aave", "v2"));
  bytes32 public constant NS_DEPOSITS = "deposits";
  bytes32 public constant NS_WITHDRAWALS = "withdrawals";

  address public depositCertificate;
  IAaveV2LendingPoolLike public lendingPool;
  mapping(uint256 => bool) public supportedChains;

  mapping(bytes32 => uint256) private _counters;
  mapping(bytes32 => uint256) private _depositTotal;
  mapping(bytes32 => uint256) private _withdrawalTotal;

  constructor(
    IStore _s,
    IAaveV2LendingPoolLike _lendingPool,
    address _aToken
  ) Recoverable(_s) {
    depositCertificate = _aToken;
    lendingPool = _lendingPool;
  }

  function getDepositAsset() public view override returns (IERC20) {
    return IERC20(s.getStablecoin());
  }

  function getDepositCertificate() public view override returns (IERC20) {
    return IERC20(depositCertificate);
  }

  function _drain(IERC20 asset) private {
    uint256 amount = asset.balanceOf(address(this));

    if (amount > 0) {
      asset.ensureTransfer(s.getTreasury(), amount);

      emit Drained(asset, amount);
    }
  }

  /**
   * @dev Gets info of this strategy by cover key
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

  /**
   * @dev Lends stablecoin to the Aave protocol
   * Ensure that you `approve` stablecoin before you call this function
   */
  function deposit(bytes32 coverKey, uint256 amount) external override nonReentrant returns (uint256 aTokenReceived) {
    s.mustNotBePaused();
    s.senderMustBeProtocolMember();

    IVault vault = s.getVault(coverKey);

    if (amount == 0) {
      return 0;
    }

    // @suppress-malicious-erc20 The variables `stablecoin`, `aToken` can't be manipulated via user input.
    IERC20 stablecoin = getDepositAsset();
    IERC20 aToken = getDepositCertificate();

    require(stablecoin.balanceOf(address(vault)) >= amount, "Balance insufficient");

    // This strategy should never have token balances
    _drain(aToken);
    _drain(stablecoin);

    // Transfer DAI to this contract; then approve and deposit it to Aave Lending Pool to receive aToken certificates
    // stablecoin.ensureTransferFrom(fromVault, address(this), amount);

    vault.transferToStrategy(stablecoin, coverKey, getName(), amount);
    stablecoin.ensureApproval(address(lendingPool), amount);
    lendingPool.deposit(address(getDepositAsset()), amount, address(this), 0);

    // Check how many aTokens we received
    aTokenReceived = _getCertificateBalance();
    require(aTokenReceived > 0, "Deposit to Aave failed");

    // Immediately send aTokens to the original vault stablecoin came from
    aToken.ensureApproval(address(vault), aTokenReceived);
    vault.receiveFromStrategy(aToken, coverKey, getName(), aTokenReceived);

    s.addUintByKey(_getDepositsKey(coverKey), amount);

    _counters[coverKey] += 1;
    _depositTotal[coverKey] += amount;

    emit LogDeposit(getName(), _counters[coverKey], amount, aTokenReceived, _depositTotal[coverKey], _withdrawalTotal[coverKey]);
    emit Deposited(coverKey, address(vault), amount, aTokenReceived);
  }

  /**
   * @dev Redeems aToken from Aave to receive stablecoin
   * Ensure that you `approve` aToken before you call this function
   */
  function withdraw(bytes32 coverKey) external virtual override nonReentrant returns (uint256 stablecoinWithdrawn) {
    s.mustNotBePaused();
    s.senderMustBeProtocolMember();
    IVault vault = s.getVault(coverKey);

    // @suppress-malicious-erc20 `stablecoin`, `aToken` can't be manipulated via user input.
    IERC20 stablecoin = getDepositAsset();
    IERC20 aToken = getDepositCertificate();

    // This strategy should never have token balances
    _drain(aToken);
    _drain(stablecoin);

    uint256 aTokenRedeemed = aToken.balanceOf(address(vault));

    if (aTokenRedeemed == 0) {
      return 0;
    }

    // Transfer aToken to this contract; then approve and send it to the Aave Lending pool get back DAI + rewards
    vault.transferToStrategy(aToken, coverKey, getName(), aTokenRedeemed);

    aToken.ensureApproval(address(lendingPool), aTokenRedeemed);
    lendingPool.withdraw(address(stablecoin), aTokenRedeemed, address(this));

    // Check how many DAI we received
    stablecoinWithdrawn = stablecoin.balanceOf(address(this));

    require(stablecoinWithdrawn > 0, "Redeeming aToken failed");

    // Immediately send DAI to the vault aToken came from
    stablecoin.ensureApproval(address(vault), stablecoinWithdrawn);
    vault.receiveFromStrategy(stablecoin, coverKey, getName(), stablecoinWithdrawn);

    s.addUintByKey(_getWithdrawalsKey(coverKey), stablecoinWithdrawn);

    _counters[coverKey] += 1;
    _withdrawalTotal[coverKey] += stablecoinWithdrawn;

    emit LogWithdrawal(getName(), _counters[coverKey], stablecoinWithdrawn, aTokenRedeemed, _depositTotal[coverKey], _withdrawalTotal[coverKey]);
    emit Withdrawn(coverKey, address(vault), stablecoinWithdrawn, aTokenRedeemed);
  }

  function _getDepositsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_DEPOSITS));
  }

  function _getWithdrawalsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_WITHDRAWALS));
  }

  function getWeight() external pure virtual override returns (uint256) {
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
    return ProtoUtilV1.CNAME_STRATEGY_AAVE;
  }
}
