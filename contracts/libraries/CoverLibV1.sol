// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./AccessControlLibV1.sol";
import "./CoverUtilV1.sol";
import "./RegistryLibV1.sol";
import "./StoreKeyUtil.sol";
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

  event CoverUserWhitelistUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed account, bool status);

  /**
   * Initializes cover
   *
   * @custom:suppress-address-trust-issue This instance of stablecoin can be trusted because of the ACL requirement.
   * @custom:suppress-initialization Can only be initialized once by a cover manager. Check caller.
   *
   * @param s Specify store instance
   * @param stablecoin Provide the address of the token this cover will be quoted against.
   * @param friendlyName Enter a description or ENS name of your liquidity token.
   *
   */
  function initializeCoverInternal(
    IStore s,
    address stablecoin,
    bytes32 friendlyName
  ) external {
    s.setAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN, stablecoin);
    s.setBytes32ByKey(ProtoUtilV1.NS_COVER_STABLECOIN_NAME, friendlyName);

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
   * @param supportsProducts Indicates that this cover supports product(s)
   * @param info IPFS info of the cover contract
   * @param requiresWhitelist Signifies if this cover only enables whitelisted addresses to purchase policies.
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
   *
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

  /**
   * @dev Adds a new cover
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param supportsProducts Indicates that this cover supports product(s)
   * @param info IPFS info of the cover contract
   * @param requiresWhitelist Signifies if this cover only enables whitelisted addresses to purchase policies.
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
   *
   */
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

  /**
   * @dev Adds a product under a diversified cover pool
   *
   * @custom:suppress-acl This function can only be accessed by the cover owner or an admin
   *
   * @param s Specify store instance
   * @param coverKey Enter a cover key
   * @param productKey Enter the product key
   * @param info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
   * @param requiresWhitelist Enter true if you want to maintain a whitelist and restrict non-whitelisted users to purchase policies.
   * @param values[0] Product status
   * @param values[1] Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   *
   */
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

  /**
   * @dev Updates a cover product.
   *
   * @param s Specify store instance
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param info Enter a new IPFS URL to update
   * @param values[0] Product status
   * @param values[1] Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   *
   */
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

  /**
   * @dev Deploys vault contract for the given cover key.
   * The vault contract is also an ERC-20-compatible contract.
   *
   * Reverts if the vault was previously deployed.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param tokenName Enter a name for the ERC-20 token
   * @param tokenSymbol Enter a symbol for the ERC-20 token
   *
   */
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

  /**
   * @dev Updates the cover info.
   *
   * @param s Specify store instance
   * @param coverKey Enter the cover key
   * @param info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
   *
   */
  function updateCoverInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 info
  ) external {
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
  }

  /**
   * @dev Adds or removes an account to the cover creator whitelist.
   * For the first version of the protocol, a cover creator has to be whitelisted
   * before they can call the `addCover` function.
   *
   * @param s Specify store instance
   * @param account Enter the address of the cover creator
   * @param status Set this to true if you want to add to or false to remove from the whitelist
   *
   */
  function updateCoverCreatorWhitelistInternal(
    IStore s,
    address account,
    bool status
  ) external {
    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, account, status);
  }

  /**
   * @dev Adds or removes an account from the cover users whitelist
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param account Enter the account you would like to add or remove fom the whitelist
   * @param status Enter `true` to add or `false` to remove the specified account from the whitelist
   *
   */
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

  /**
   * @dev Adds or removes an account from the cover user whitelist.
   * Whitelisting is an optional feature cover creators can enable.
   *
   * When a cover requires whitelist, you must add accounts
   * to the cover user whitelist before they are able to purchase policies.
   *
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param accounts Enter a list of accounts you would like to update the whitelist statuses of.
   * @param statuses Enter respective statuses of the specified whitelisted accounts.
   *
   */
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

  /**
   * @dev Sets cover creation fee in NPM token units
   *
   * @param s Specify store instance
   * @param value Enter the amount of NPM tokens to be charged as the cover creation fee.
   *
   * @return previous Returns the previous cover creation fee.
   *
   */
  function setCoverCreationFeeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    previous = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, value);

    s.updateStateAndLiquidity(0);
  }

  /**
   * @dev Sets the minimum amount of NPM stake required to create a new cover
   *
   * @param s Specify store instance
   * @param value Enter the amount of NPM tokens to be staked when creating a new cover.
   *
   * @return previous Returns the previous minimum cover creation stake.
   *
   */
  function setMinCoverCreationStakeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinCoverCreationStake();
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }

  /**
   * @dev Sets the minimum amount of NPM stake required to add liquidity
   *
   * @param s Specify store instance
   * @param value Enter the amount of NPM tokens to be staked when adding liquidity.
   *
   * @return previous Returns the previous minimum stake to add liquidity.
   *
   */
  function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinStakeToAddLiquidity();
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }
}
