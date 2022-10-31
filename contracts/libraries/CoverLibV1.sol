// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStore.sol";
import "./NTransferUtilV2.sol";
import "./ValidationLibV1.sol";

library CoverLibV1 {
  using AccessControlLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  event CoverUserWhitelistUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed account, bool status);

  /**
   * Initializes cover
   *
   * @custom:suppress-address-trust-issue This instance of stablecoin can be trusted because of the ACL requirement.
   * @custom:suppress-initialization Can only be initialized once by a cover manager. Check caller.
   *
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

    s.updateStateAndLiquidityInternal(0);
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
   *
   */
  function addCoverInternal(IStore s, ICover.AddCoverArgs calldata args) external {
    // Get the fee info required to create this cover
    (uint256 fee, ) = _getFee(s, args.coverKey, args.stakeWithFee);

    // Set the basic cover info
    _addCover(s, args, fee);

    IERC20 npm = s.getNpmTokenInstanceInternal();
    ICoverStake stakingContract = s.getStakingContract();

    npm.ensureTransferFrom(msg.sender, address(this), args.stakeWithFee);

    npm.ensureApproval(address(stakingContract), args.stakeWithFee);

    // Stake the supplied NPM tokens and burn the fees
    stakingContract.increaseStake(args.coverKey, msg.sender, args.stakeWithFee, fee);

    // Add cover reassurance
    if (args.initialReassuranceAmount > 0) {
      IERC20 stablecoin = IERC20(s.getStablecoinAddressInternal());
      ICoverReassurance reassurance = s.getReassuranceContract();

      stablecoin.ensureTransferFrom(msg.sender, address(this), args.initialReassuranceAmount);
      stablecoin.ensureApproval(address(reassurance), args.initialReassuranceAmount);

      reassurance.addReassurance(args.coverKey, msg.sender, args.initialReassuranceAmount);
    }
  }

  /**
   * @dev Adds a new cover
   *
   * @param s Specify store instance
   *
   */
  function _addCover(
    IStore s,
    ICover.AddCoverArgs calldata args,
    uint256 fee
  ) private {
    require(args.coverKey > 0, "Invalid cover key");
    require(bytes(args.info).length > 0, "Invalid info");
    require(args.minStakeToReport > 0, "Invalid min reporting stake");
    require(args.reportingPeriod > 0, "Invalid reporting period");
    require(args.cooldownPeriod > 0, "Invalid cooldown period");
    require(args.claimPeriod > 0, "Invalid claim period");
    require(args.floor > 0, "Invalid floor rate");
    require(args.ceiling > args.floor, "Invalid ceiling rate");
    require(args.reassuranceRate > 0, "Invalid reassurance rate");
    require(args.leverageFactor > 0 && args.leverageFactor < 25, "Invalid leverage");
    require(args.reportingPeriod >= s.getCoverageLagInternal(args.coverKey), "Invalid reporting period");

    if (args.supportsProducts == false) {
      // Standalone pools do not support any leverage
      require(args.leverageFactor == 1, "Invalid leverage");
    }

    s.setBoolByKeys(ProtoUtilV1.NS_COVER, args.coverKey, true);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_SUPPORTS_PRODUCTS, args.coverKey, args.supportsProducts);
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, args.coverKey, msg.sender);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_INFO, args.coverKey, args.info);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, args.coverKey, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_FEE_EARNING, args.coverKey, fee);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, args.coverKey, block.timestamp); // solhint-disable-line

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, args.coverKey, args.requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, args.coverKey, args.minStakeToReport);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, args.coverKey, args.reportingPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, args.coverKey, args.cooldownPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, args.coverKey, args.claimPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, args.coverKey, args.floor);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, args.coverKey, args.ceiling);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, args.coverKey, args.reassuranceRate);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LEVERAGE_FACTOR, args.coverKey, args.leverageFactor);
  }

  /**
   * @dev Adds a product under a diversified cover pool
   *
   * @custom:suppress-acl This function can only be accessed by the cover owner or an admin
   *
   * @param s Specify store instance
   *
   */
  function addProductInternal(IStore s, ICover.AddProductArgs calldata args) external {
    s.mustBeValidCoverKey(args.coverKey);
    s.mustSupportProducts(args.coverKey);

    require(args.productKey > 0, "Invalid product key");
    require(bytes(args.info).length > 0, "Invalid info");

    // Product Status
    // 0 --> Deleted
    // 1 --> Active
    // 2 --> Retired
    require(args.productStatus == 1, "Status must be active");
    require(args.efficiency > 0 && args.efficiency <= 10_000, "Invalid efficiency");

    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey) == false, "Already exists");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, true);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.info);
    s.setBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, args.coverKey, args.productKey, args.requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.productStatus);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, args.coverKey, args.productKey, args.efficiency);
  }

  /**
   * @dev Updates a cover product.
   *
   * @param s Specify store instance
   *
   */
  function updateProductInternal(IStore s, ICover.UpdateProductArgs calldata args) external {
    require(args.productStatus <= 2, "Invalid product status");
    require(args.efficiency > 0 && args.efficiency <= 10_000, "Invalid efficiency");

    s.mustBeValidCoverKey(args.coverKey);
    s.mustBeSupportedProductOrEmpty(args.coverKey, args.productKey);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.productStatus);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, args.coverKey, args.productKey, args.efficiency);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.info);
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

    s.getProtocolInternal().addContractWithKey(ProtoUtilV1.CNS_COVER_VAULT, coverKey, deployed);
    return deployed;
  }

  /**
   * @dev Gets the fee to create cover and minimum stake required
   */
  function _getFee(
    IStore s,
    bytes32 coverKey,
    uint256 stakeWithFee
  ) private view returns (uint256 fee, uint256 minCoverCreationStake) {
    (fee, minCoverCreationStake, ) = s.getCoverCreationFeeInfoInternal();

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
    string calldata info
  ) external {
    s.setStringByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
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

    s.updateStateAndLiquidityInternal(0);
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

    previous = s.getMinCoverCreationStakeInternal();
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, value);

    s.updateStateAndLiquidityInternal(0);
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

    previous = s.getMinStakeToAddLiquidityInternal();
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, value);

    s.updateStateAndLiquidityInternal(0);
  }
}
