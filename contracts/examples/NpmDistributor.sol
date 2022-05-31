// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: Apache 2.0

pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IPolicy.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IClaimsProcessor.sol";

/**
 * @title Neptune Mutual Distributor contract
 * @dev The distributor contract enables resellers to interact with
 * the Neptune Mutual protocol and offer policies to their users.
 *
 * This contract demonstrates how a distributor may charge an extra fee
 * and deposit the proceeds in their own treasury account.
 */
contract NpmDistributor is ReentrancyGuard {
  using SafeERC20 for IERC20;
  using SafeERC20 for IVault;

  event PolicySold(
    bytes32 indexed coverKey,
    bytes32 indexed productKey,
    address indexed cxToken,
    address account,
    uint256 duration,
    uint256 protection,
    bytes32 referralCode,
    uint256 fee,
    uint256 premium
  );
  event LiquidityAdded(bytes32 indexed coverKey, address indexed account, bytes32 indexed referralCode, uint256 amount, uint256 npmStake);
  event LiquidityRemoved(bytes32 indexed coverKey, address indexed account, uint256 amount, uint256 npmStake, bool exit);
  event Drained(IERC20 indexed token, address indexed to, uint256 amount);

  bytes32 public constant NS_CONTRACTS = "ns:contracts";
  bytes32 public constant CNS_CLAIM_PROCESSOR = "cns:claim:processor";
  bytes32 public constant CNS_COVER_VAULT = "cns:cover:vault";
  bytes32 public constant CNS_COVER_POLICY = "cns:cover:policy";
  bytes32 public constant CNS_COVER_STABLECOIN = "cns:cover:sc";
  bytes32 public constant CNS_NPM_INSTANCE = "cns:core:npm:instance";

  uint256 public constant MULTIPLIER = 10_000;
  uint256 public immutable feePercentage;
  address public immutable treasury;
  IStoreLike public immutable store;

  /**
   * @dev Constructs this contract
   * @param _store Enter the address of NPM protocol store
   * @param _treasury Enter your treasury wallet address
   * @param _feePercentage Enter distributor fee percentage
   */
  constructor(
    IStoreLike _store,
    address _treasury,
    uint256 _feePercentage
  ) {
    require(address(_store) != address(0), "Invalid store");
    require(_treasury != address(0), "Invalid treasury");
    require(_feePercentage > 0 && _feePercentage < MULTIPLIER, "Invalid fee percentage");

    store = _store;
    treasury = _treasury;
    feePercentage = _feePercentage;
  }

  /**
   * @dev Returns the stablecoin used by the protocol in this blockchain.
   */
  function getStablecoin() public view returns (IERC20) {
    return IERC20(store.getAddress(CNS_COVER_STABLECOIN));
  }

  /**
   * @dev Returns NPM token instance in this blockchain.
   */
  function getNpm() public view returns (IERC20) {
    return IERC20(store.getAddress(CNS_NPM_INSTANCE));
  }

  /**
   * @dev Returns the protocol policy contract instance.
   */
  function getPolicyContract() public view returns (IPolicy) {
    return IPolicy(store.getAddress(keccak256(abi.encodePacked(NS_CONTRACTS, CNS_COVER_POLICY))));
  }

  /**
   * @dev Returns the vault contract instance by the given key.
   */
  function getVaultContract(bytes32 coverKey) public view returns (IVault) {
    return IVault(store.getAddress(keccak256(abi.encodePacked(NS_CONTRACTS, CNS_COVER_VAULT, coverKey))));
  }

  /**
   * @dev Returns the protocol claims processor contract instance.
   */
  function getClaimsProcessorContract() external view returns (IClaimsProcessor) {
    return IClaimsProcessor(store.getAddress(keccak256(abi.encodePacked(NS_CONTRACTS, CNS_CLAIM_PROCESSOR))));
  }

  /**
   * @dev Calculates the premium required to purchase policy.
   * @param coverKey Enter the cover key for which you want to buy policy.
   * @param duration Enter the period of the protection in months.
   * @param protection Enter the stablecoin dollar amount you want to protect.
   */
  function getPremium(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 duration,
    uint256 protection
  ) public view returns (uint256 premium, uint256 fee) {
    IPolicy policy = getPolicyContract();
    require(address(policy) != address(0), "Fatal: Policy missing");

    (premium, , , , , ) = policy.getCoverFeeInfo(coverKey, productKey, duration, protection);

    // Add your fee in addition to the protocol premium
    fee = (premium * feePercentage) / MULTIPLIER;
  }

  /**
   * @dev Purchases a new policy on behalf of your users.
   *
   * Prior to using this method, you must first call the "getPremium" function
   * and approve the policy fees that this contract would spend.
   *
   * In the event that this function succeeds, the recipient's wallet will be
   * credited with "cxToken". Take note that the "claimPolicy" method may be
   * used in the future to reclaim cxTokens and receive payouts
   * after the resolution of an incident.
   *
   * @param coverKey Enter the cover key for which you want to buy policy.
   * @param duration Enter the period of the protection in months.
   * @param protection Enter the stablecoin dollar amount you want to protect.
   * @param referralCode Provide a referral code if applicable.
   */
  function purchasePolicy(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 duration,
    uint256 protection,
    bytes32 referralCode
  ) external nonReentrant {
    require(coverKey > 0, "Invalid key");
    require(duration > 0 && duration < 4, "Invalid duration");
    require(protection > 0, "Invalid protection amount");

    IPolicy policy = getPolicyContract();
    require(address(policy) != address(0), "Fatal: Policy missing");

    IERC20 dai = getStablecoin();
    require(address(dai) != address(0), "Fatal: DAI missing");

    // Get fee info
    (uint256 premium, uint256 fee) = getPremium(coverKey, productKey, duration, protection);

    // Transfer DAI to this contract
    dai.safeTransferFrom(msg.sender, address(this), premium + fee);

    // Approve protocol to pull the protocol fee
    dai.safeIncreaseAllowance(address(policy), premium);

    // Purchase protection for this user
    (address cxTokenAt, ) = policy.purchaseCover(msg.sender, coverKey, productKey, duration, protection, referralCode);

    // Send your fee (+ any remaining DAI balance) to your treasury address
    dai.safeTransfer(treasury, dai.balanceOf(address(this)));

    emit PolicySold(coverKey, productKey, cxTokenAt, msg.sender, duration, protection, referralCode, fee, premium);
  }

  function addLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bytes32 referralCode
  ) external nonReentrant {
    require(coverKey > 0, "Invalid key");
    require(amount > 0, "Invalid amount");

    IVault nDai = getVaultContract(coverKey);
    IERC20 dai = getStablecoin();
    IERC20 npm = getNpm();

    require(address(nDai) != address(0), "Fatal: Vault missing");
    require(address(dai) != address(0), "Fatal: DAI missing");
    require(address(npm) != address(0), "Fatal: NPM missing");

    // Before moving forward, first drain all balances of this contract
    _drain(nDai);
    _drain(dai);
    _drain(npm);

    // Transfer DAI from sender's wallet here
    dai.safeTransferFrom(msg.sender, address(this), amount);

    // Approve the Vault (or nDai) contract to spend DAI
    dai.safeIncreaseAllowance(address(nDai), amount);

    if (npmStake > 0) {
      // Transfer NPM from the sender's wallet here
      npm.safeTransferFrom(msg.sender, address(this), npmStake);

      // Approve the Vault (or nDai) contract to spend NPM
      npm.safeIncreaseAllowance(address(nDai), npmStake);
    }

    nDai.addLiquidity(coverKey, amount, npmStake, referralCode);

    nDai.safeTransfer(msg.sender, nDai.balanceOf(address(this)));

    emit LiquidityAdded(coverKey, msg.sender, referralCode, amount, npmStake);
  }

  function removeLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bool exit
  ) external nonReentrant {
    require(coverKey > 0, "Invalid key");
    require(amount > 0, "Invalid amount");

    IVault nDai = getVaultContract(coverKey);
    IERC20 dai = getStablecoin();
    IERC20 npm = getNpm();

    require(address(nDai) != address(0), "Fatal: Vault missing");
    require(address(dai) != address(0), "Fatal: DAI missing");
    require(address(npm) != address(0), "Fatal: NPM missing");

    // Before moving forward, first drain all balances of this contract
    _drain(nDai);
    _drain(dai);
    _drain(npm);

    // Transfer nDai from sender's wallet here
    nDai.safeTransferFrom(msg.sender, address(this), amount);

    // Approve the Vault (or nDai) contract to spend nDai
    nDai.safeIncreaseAllowance(address(nDai), amount);

    nDai.removeLiquidity(coverKey, amount, npmStake, exit);

    dai.safeTransfer(msg.sender, nDai.balanceOf(address(this)));

    emit LiquidityRemoved(coverKey, msg.sender, amount, npmStake, exit);
  }

  /**
   * @dev Drains a given token to the treasury address
   */
  function _drain(IERC20 token) private {
    uint256 balance = token.balanceOf(address(this));

    if (balance > 0) {
      token.safeTransfer(treasury, balance);
      emit Drained(token, treasury, balance);
    }
  }
}

// @title NPM Store Interface
interface IStoreLike {
  function getAddress(bytes32 k) external view returns (address);
}
