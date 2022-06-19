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

  event CoverUserWhitelistUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed account, bool status);

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
   * @param coverKey Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param values[0] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * @param values[1] initialReassuranceAmount **Optional.** Enter the initial amount of
   * @param values[2] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * @param values[3] reportingPeriod The period during when reporting happens.
   * reassurance tokens you'd like to add to this pool.
   * @param values[4] cooldownperiod Enter the cooldown period for governance.
   * @param values[5] claimPeriod Enter the claim period.
   * @param values[6] floor Enter the policy floor rate.
   * @param values[7] ceiling Enter the policy ceiling rate.
   * @param values[8] reassuranceRate Enter the reassurance rate.
   */
  function addCoverInternal(
    IStore s,
    bytes32 coverKey,
    bool supportsProducts,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external {
    // First validate the information entered
    (uint256 fee, ) = _validateAndGetFee(s, coverKey, info, values[0]);

    // Set the basic cover info
    _addCover(s, coverKey, supportsProducts, info, requiresWhitelist, values, fee);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(coverKey, msg.sender, values[0], fee);

    // Add cover reassurance
    if (values[1] > 0) {
      s.getReassuranceContract().addReassurance(coverKey, msg.sender, values[1]);
    }
  }

  function _addCover(
    IStore s,
    bytes32 coverKey,
    bool supportsProducts,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] calldata values,
    uint256 fee
  ) private {
    require(coverKey > 0, "Invalid cover key");
    require(info > 0, "Invalid info");
    require(values[2] > 0, "Invalid min reporting stake");
    require(values[3] > 0, "Invalid reporting period");
    require(values[4] > 0, "Invalid cooldown period");
    require(values[5] > 0, "Invalid claim period");
    require(values[6] > 0, "Invalid floor rate");
    require(values[7] > 0, "Invalid ceiling rate");
    require(values[8] > 0, "Invalid reassurance rate");
    require(values[9] > 0 && values[9] < 25, "Invalid leverage");

    if (supportsProducts == false) {
      // Standalone pools do not support any leverage
      require(values[9] == 1, "Invalid leverage");
    }

    s.setBoolByKeys(ProtoUtilV1.NS_COVER, coverKey, true);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_SUPPORTS_PRODUCTS, coverKey, supportsProducts);
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, coverKey, msg.sender);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, coverKey, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_FEE_EARNING, coverKey, fee);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, coverKey, block.timestamp); // solhint-disable-line

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey, values[2]);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, coverKey, values[3]);
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey, values[4]);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey, values[5]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, coverKey, values[6]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, coverKey, values[7]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, coverKey, values[8]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LEVERAGE_FACTOR, coverKey, values[9]);
  }

  function addProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external {
    s.mustBeValidCoverKey(coverKey);
    s.mustSupportProducts(coverKey);

    require(productKey > 0, "Invalid product key");
    require(info > 0, "Invalid info");

    // Product Status
    // 0 --> Deleted
    // 1 --> Active
    // 2 --> Retired
    require(values[0] == 1, "Status must be active");
    require(values[1] > 0 && values[1] <= 10_000, "Invalid efficiency");

    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey) == false, "Already exists");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, true);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, info);
    s.setBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, productKey, requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, values[0]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, coverKey, productKey, values[1]);
  }

  function updateProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    uint256[] calldata values
  ) external {
    require(values[0] <= 2, "Invalid product status");
    require(values[1] > 0 && values[1] <= 10_000, "Invalid efficiency");

    s.mustBeValidCoverKey(coverKey);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, values[0]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, coverKey, productKey, values[1]);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, info);
  }

  function deployVaultInternal(
    IStore s,
    bytes32 coverKey,
    string calldata tokenName,
    string calldata tokenSymbol
  ) external returns (address) {
    address vault = s.getProtocolContract(ProtoUtilV1.CNS_COVER_VAULT, coverKey);
    require(vault == address(0), "Vault already deployed");

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(coverKey, tokenName, tokenSymbol);

    s.getProtocol().addContractWithKey(ProtoUtilV1.CNS_COVER_VAULT, coverKey, address(deployed));
    return deployed;
  }

  /**
   * @dev Validation checks before adding a new cover
   */
  function _validateAndGetFee(
    IStore s,
    bytes32 coverKey,
    bytes32 info,
    uint256 stakeWithFee
  ) private view returns (uint256 fee, uint256 minCoverCreationStake) {
    require(info > 0, "Invalid info");
    (fee, minCoverCreationStake, ) = s.getCoverCreationFeeInfo();

    uint256 minStake = fee + minCoverCreationStake;

    require(stakeWithFee > minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey) == false, "Already exists");
  }

  function updateCoverInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 info
  ) external {
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
  }

  function stopCoverInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external {
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.setStatusInternal(coverKey, productKey, 0, CoverUtilV1.CoverStatus.Stopped);
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
    bytes32 coverKey,
    bytes32 productKey,
    address account,
    bool status
  ) private {
    s.setAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, productKey, account, status);
    emit CoverUserWhitelistUpdated(coverKey, productKey, account, status);
  }

  function updateCoverUsersWhitelistInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external {
    require(accounts.length == statuses.length, "Inconsistent array sizes");

    for (uint256 i = 0; i < accounts.length; i++) {
      _updateCoverUserWhitelistInternal(s, coverKey, productKey, accounts[i], statuses[i]);
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
}
