// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./CoverBase.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/IVault.sol";
import "../liquidity/Vault.sol";

/**
 * @title Cover Contract
 * @dev The cover contract facilitates you create and update covers
 */
contract Cover is CoverBase {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using AccessControlLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Constructs this contract
   * @param store Enter the store
   */
  constructor(IStore store) CoverBase(store) {} // solhint-disable-line

  /**
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover owner or protocol owner (governance).
   *
   * @param key Enter the cover key
   * @param info Enter a new IPFS URL to update
   */
  function updateCover(bytes32 key, bytes32 info) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCover(key);

    if (AccessControlLibV1.hasAccess(s, AccessControlLibV1.NS_ROLES_ADMIN, msg.sender) == false) {
      s.mustBeCoverOwner(key, msg.sender);
    }

    require(s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key) != info, "Duplicate content");

    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    emit CoverUpdated(key, info);
  }

  /**
   * @dev Adds a new coverage pool or cover contract.
   * To add a new cover, you need to pay cover creation fee
   * and stake minimum amount of NPM in the Vault. <br /> <br />
   *
   * Through the governance portal, projects will be able redeem
   * the full cover fee at a later date. <br /> <br />
   *
   * **Apply for Fee Redemption** <br />
   * https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
   *
   * As the cover creator, you will earn a portion of all cover fees
   * generated in this pool. <br /> <br />
   *
   * Read the documentation to learn more about the fees: <br />
   * https://docs.neptunemutual.com/covers/contract-creators
   *
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param reassuranceToken **Optional.** Token added as an reassurance of this cover. <br /><br />
   *
   * Reassurance tokens can be added by a project to demonstrate coverage support
   * for their own project. This helps bring the cover fee down and enhances
   * liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded
   * as a support to the liquidity providers when a cover incident occurs.
   * @param minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * @param reportingPeriod The period during when reporting happens.
   * @param initialReassuranceAmount **Optional.** Enter the initial amount of
   * reassurance tokens you'd like to add to this pool.
   * @param stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * @param initialLiquidity **Optional.** Enter the initial stablecoin liquidity for this cover.
   */
  function addCover(
    bytes32 key,
    bytes32 info,
    uint256 minStakeToReport,
    uint256 reportingPeriod,
    uint256 stakeWithFee,
    address reassuranceToken,
    uint256 initialReassuranceAmount,
    uint256 initialLiquidity
  ) external override nonReentrant {
    // @suppress-acl Can only be called by a whitelisted address
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.senderMustBeWhitelisted();

    require(minStakeToReport >= s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE), "Min NPM stake too low");
    require(reassuranceToken == s.getStablecoin(), "Invalid reassurance token");
    require(reportingPeriod >= 7 days, "Insufficient reporting period");

    // First validate the information entered
    uint256 fee = _validateAndGetFee(key, info, stakeWithFee);

    // Set the basic cover info
    _addCover(key, info, minStakeToReport, reportingPeriod, fee, reassuranceToken);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(key, msg.sender, stakeWithFee, fee);

    // Add cover reassurance
    if (initialReassuranceAmount > 0) {
      s.getReassuranceContract().addReassurance(key, msg.sender, initialReassuranceAmount);
    }

    // Add initial liquidity
    if (initialLiquidity > 0) {
      IVault vault = s.getVault(key);

      s.getVault(key).addLiquidityInternal(key, msg.sender, initialLiquidity);

      // Transfer liquidity only after minting the pods
      IERC20(s.getStablecoin()).ensureTransferFrom(msg.sender, address(vault), initialLiquidity);
    }

    emit CoverCreated(key, info, stakeWithFee, initialLiquidity);
  }

  /**
   * Adds a new cover contract
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param reportingPeriod The period during when reporting happens.
   * @param fee Fee paid to create this cover
   * @param reassuranceToken **Optional.** Token added as an reassurance of this cover.
   */
  function _addCover(
    bytes32 key,
    bytes32 info,
    uint256 minStakeToReport,
    uint256 reportingPeriod,
    uint256 fee,
    address reassuranceToken
  ) private {
    // Add a new cover
    s.setBoolByKeys(ProtoUtilV1.NS_COVER, key, true);

    // Set cover owner
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key, msg.sender);

    // Set cover info
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, key, reportingPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, key, minStakeToReport);

    // Set reassurance token
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key, reassuranceToken);

    // s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key, 500000000 gwei); // Default 50% weight
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key, 1 ether); // 100% weight because it's a stablecoin

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key, fee);

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(s, key);

    s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.CNS_COVER_VAULT, key, deployed);
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, deployed, true);
  }

  /**
   * @dev Validation checks before adding a new cover
   * @return Returns fee required to create a new cover
   */
  function _validateAndGetFee(
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee
  ) private view returns (uint256) {
    require(info > 0, "Invalid info");
    (uint256 fee, uint256 minStake) = s.getCoverFee();

    require(stakeWithFee > fee + minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key) == false, "Already exists");

    return fee;
  }

  /**
   * @dev Enables governance admin to stop a spam cover contract
   * @param key Enter the cover key you want to stop
   * @param reason Provide a reason to stop this cover
   */
  function stopCover(bytes32 key, string memory reason) external override nonReentrant {
    s.mustBeGovernanceAdmin();
    s.mustBeValidCover(key);

    s.setStatus(key, CoverUtilV1.CoverStatus.Stopped);
    emit CoverStopped(key, msg.sender, reason);
  }

  function updateWhitelist(address account, bool status) external override nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);

    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account, status);

    emit WhitelistUpdated(account, status);
  }

  function checkIfWhitelisted(address account) external view override returns (bool) {
    return s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account);
  }
}
