// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./AccessControlLibV1.sol";
import "./CoverUtilV1.sol";
import "./RegistryLibV1.sol";
import "./StoreKeyUtil.sol";
import "./NTransferUtilV2.sol";
import "./RoutineInvokerLibV1.sol";
import "./StrategyLibV1.sol";

library CoverLibV1 {
  using CoverUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using AccessControlLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using StrategyLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  event CoverUserWhitelistUpdated(bytes32 key, address account, bool status);

  function getCoverInfo(IStore s, bytes32 key)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    info = s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key);
    owner = s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);

    values = new uint256[](5);

    values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key);
    values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
    values[2] = s.getStablecoinOwnedByVaultInternal(key);
    values[3] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    values[4] = s.getActiveLiquidityUnderProtection(key);
  }

  function initializeCoverInternal(
    IStore s,
    address liquidityToken,
    bytes32 liquidityName
  ) external {
    // @suppress-initialization Can only be initialized once by a cover manager. Check caller.
    // @suppress-address-trust-issue liquidityToken This instance of liquidityToken can be trusted because of the ACL requirement. Check caller.
    s.setAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN, liquidityToken);
    s.setBytes32ByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_NAME, liquidityName);

    s.updateStateAndLiquidity(0);
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
   * @param s Provide store instance
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param reassuranceToken **Optional.** Token added as an reassurance of this cover. <br /><br />
   *
   * Reassurance tokens can be added by a project to demonstrate coverage support
   * for their own project. This helps bring the cover fee down and enhances
   * liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded
   * as a support to the liquidity providers when a cover incident occurs.
   * @param values[0] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * @param values[1] initialReassuranceAmount **Optional.** Enter the initial amount of
   * @param values[2] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * @param values[3] reportingPeriod The period during when reporting happens.
   * reassurance tokens you'd like to add to this pool.
   * @param values[4] cooldownperiod Enter the cooldown period for governance.
   * @param values[5] claimPeriod Enter the claim period.
   * @param values[6] floor Enter the policy floor rate.
   * @param values[7] ceiling Enter the policy ceiling rate.
   */
  function addCoverInternal(
    IStore s,
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    bool requiresWhitelist,
    uint256[] memory values
  ) external {
    // @suppress-address-trust-issue The reassuranceToken can only be the stablecoin supported by the protocol for this version. Check caller.

    // First validate the information entered
    (uint256 fee, ) = _validateAndGetFee(s, key, info, values[0]);

    // Set the basic cover info
    _addCover(s, key, info, reassuranceToken, requiresWhitelist, values, fee);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(key, msg.sender, values[0], fee);

    // Add cover reassurance
    if (values[1] > 0) {
      s.getReassuranceContract().addReassurance(key, msg.sender, values[1]);
    }
  }

  function _addCover(
    IStore s,
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    bool requiresWhitelist,
    uint256[] memory values,
    uint256 fee
  ) private {
    s.setBoolByKeys(ProtoUtilV1.NS_COVER, key, true);

    s.setStatusInternal(key, 0, CoverUtilV1.CoverStatus.Stopped);

    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key, msg.sender);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key, reassuranceToken);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, key, requiresWhitelist);

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key, fee);

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, key, values[2]);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, key, values[3]);
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, key, values[4]);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, key, values[5]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, key, values[6]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, key, values[7]);
  }

  function deployVaultInternal(IStore s, bytes32 key) external returns (address) {
    address vault = s.getProtocolContract(ProtoUtilV1.CNS_COVER_VAULT, key);
    require(vault == address(0), "Vault already deployed");

    s.setStatusInternal(key, 0, CoverUtilV1.CoverStatus.Normal);

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(s, key);

    s.getProtocol().addContractWithKey(ProtoUtilV1.CNS_COVER_VAULT, key, address(deployed));
    return deployed;
  }

  /**
   * @dev Validation checks before adding a new cover
   */
  function _validateAndGetFee(
    IStore s,
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee
  ) private view returns (uint256 fee, uint256 minCoverCreationStake) {
    require(info > 0, "Invalid info");
    (fee, minCoverCreationStake, ) = s.getCoverFee();

    uint256 minStake = fee + minCoverCreationStake;

    require(stakeWithFee > minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key) == false, "Already exists");
  }

  function updateCoverInternal(
    IStore s,
    bytes32 key,
    bytes32 info
  ) external {
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
  }

  function stopCoverInternal(IStore s, bytes32 key) external {
    s.setStatusInternal(key, 0, CoverUtilV1.CoverStatus.Stopped);
  }

  function updateCoverCreatorWhitelistInternal(
    IStore s,
    address account,
    bool status
  ) external {
    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, account, status);
  }

  function _updateCoverUserWhitelistInternal(
    IStore s,
    bytes32 key,
    address account,
    bool status
  ) private {
    s.setAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, key, account, status);
    emit CoverUserWhitelistUpdated(key, account, status);
  }

  function updateCoverUsersWhitelistInternal(
    IStore s,
    bytes32 key,
    address[] memory accounts,
    bool[] memory statuses
  ) external {
    require(accounts.length == statuses.length, "Inconsistent array sizes");

    for (uint256 i = 0; i < accounts.length; i++) {
      _updateCoverUserWhitelistInternal(s, key, accounts[i], statuses[i]);
    }
  }

  function setCoverFeesInternal(IStore s, uint256 value) external returns (uint256 previous) {
    previous = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, value);

    s.updateStateAndLiquidity(0);
  }

  function setMinCoverCreationStakeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinCoverCreationStake();
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }

  function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinStakeToAddLiquidity();
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }

  function increaseProvisionInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  ) external returns (uint256 provision) {
    provision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    s.addUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.npmToken().ensureTransferFrom(msg.sender, address(this), amount);

    s.updateStateAndLiquidity(key);
  }

  function decreaseProvisionInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  ) external returns (uint256 provision) {
    provision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    require(provision >= amount, "Exceeds Balance");

    // @suppress-subtraction Checked usage. Amount is always less than current provision.
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.npmToken().ensureTransfer(msg.sender, amount);

    s.updateStateAndLiquidity(key);
  }
}
