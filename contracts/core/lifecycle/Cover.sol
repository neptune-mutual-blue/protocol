// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./CoverBase.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/IVault.sol";
import "../liquidity/Vault.sol";

/**
 * @title Cover Contract
 * @dev The cover contract enables you to manage onchain covers.
 *
 */
contract Cover is CoverBase {
  using AccessControlLibV1 for IStore;
  using CoverLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Enter the store
   */
  constructor(IStore store) CoverBase(store) {} // solhint-disable-line

  /**
   * @dev Adds a new coverage pool or cover contract.
   * To add a new cover, you need to pay cover creation fee
   * and stake minimum amount of NPM in the Vault. <br /> <br />
   *
   * Through the governance portal, projects will be able redeem
   * the full cover fee at a later date. <br /> <br />
   *
   * **Apply for Fee Redemption** <br />
   *
   * https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
   *
   * Read the documentation to learn more about the fees: <br />
   * https://docs.neptunemutual.com/covers/contract-creators
   *
   *
   * @custom:suppress-acl This is a publicly accessible feature. Can only be called by a whitelisted address.
   *
   * @param coverKey Enter a unique key for this cover
   * @param info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
   * @param tokenName Enter the token name of the POD contract that will be deployed.
   * @param tokenSymbol Enter the token symbol of the POD contract that will be deployed.
   * @param supportsProducts Indicates that this cover supports product(s)
   * @param requiresWhitelist Signifies if this cover only enables whitelisted addresses to purchase policies.
   * @param values[0] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * @param values[1] initialReassuranceAmount **Optional.** Enter the initial amount of
   * reassurance tokens you'd like to add to this pool.
   * @param values[2] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * @param values[3] reportingPeriod The period during when reporting happens.
   * @param values[4] cooldownperiod Enter the cooldown period for governance.
   * @param values[5] claimPeriod Enter the claim period.
   * @param values[6] floor Enter the policy floor rate.
   * @param values[7] ceiling Enter the policy ceiling rate.
   * @param values[8] reassuranceRate Enter the reassurance rate.
   * @param values[9] leverageFactor Leverage Factor
   */
  function addCover(
    bytes32 coverKey,
    string calldata info,
    string calldata tokenName,
    string calldata tokenSymbol,
    bool supportsProducts,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external override nonReentrant returns (address) {
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();

    require(values[0] >= s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE), "Your stake is too low");

    s.addCoverInternal(coverKey, supportsProducts, info, requiresWhitelist, values);

    emit CoverCreated(coverKey, info, tokenName, tokenSymbol, supportsProducts, requiresWhitelist);

    address vault = s.deployVaultInternal(coverKey, tokenName, tokenSymbol);
    emit VaultDeployed(coverKey, vault);

    return vault;
  }

  /**
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover manager during withdrawal period.
   *
   * @param coverKey Enter the cover key
   * @param info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
   *
   */
  function updateCover(bytes32 coverKey, string calldata info) external override nonReentrant {
    s.mustNotBePaused();
    s.mustEnsureAllProductsAreNormal(coverKey);
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeDuringWithdrawalPeriod(coverKey);

    require(keccak256(bytes(s.getStringByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey))) != keccak256(bytes(info)), "Duplicate content");

    s.updateCoverInternal(coverKey, info);
    emit CoverUpdated(coverKey, info);
  }

  /**
   * @dev Adds a product under a diversified cover pool
   *
   * @custom:suppress-acl This function can only be accessed by the cover owner or an admin
   *
   * @param coverKey Enter a cover key
   * @param productKey Enter the product key
   * @param info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
   * @param requiresWhitelist Enter true if you want to maintain a whitelist and restrict non-whitelisted users to purchase policies.
   * @param values[0] Product status
   * @param values[1] Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   *
   */
  function addProduct(
    bytes32 coverKey,
    bytes32 productKey,
    string calldata info,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external override {
    // @suppress-zero-value-check The uint values are validated in the function `addProductInternal`
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();
    s.senderMustBeCoverOwnerOrAdmin(coverKey);

    s.addProductInternal(coverKey, productKey, info, requiresWhitelist, values);
    emit ProductCreated(coverKey, productKey, info, requiresWhitelist, values);
  }

  /**
   * @dev Updates a cover product.
   * This feature is accessible only to the cover manager during withdrawal period.
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param info Enter a new IPFS hash to update
   * @param values[0] Product status
   * @param values[1] Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   *
   */
  function updateProduct(
    bytes32 coverKey,
    bytes32 productKey,
    string calldata info,
    uint256[] calldata values
  ) external override {
    // @suppress-zero-value-check The uint values are validated in the function `updateProductInternal`
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeDuringWithdrawalPeriod(coverKey);

    s.updateProductInternal(coverKey, productKey, info, values);
    emit ProductUpdated(coverKey, productKey, info, values);
  }

  /**
   * @dev Allows disabling and enabling the purchase of policy for a product or cover.
   *
   * This function enables governance admin to disable or enable the purchase of policy for a product or cover.
   * A cover contract when stopped restricts new policy purchases
   * and frees up liquidity as policies expires.
   *
   * 1. The policy purchases can be disabled and later enabled after current policies expire and liquidity is withdrawn.
   * 2. The policy purchases can be disabled temporarily to allow liquidity providers a chance to exit.
   *
   * @param coverKey Enter the cover key you want to disable policy purchases
   * @param productKey Enter the product key you want to disable policy purchases
   * @param status Set this to true if you disable or false to enable policy purchases
   * @param reason Provide a reason to disable the policy purchases
   *
   */
  function disablePolicy(
    bytes32 coverKey,
    bytes32 productKey,
    bool status,
    string calldata reason
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    require(status != s.isPolicyDisabledInternal(coverKey, productKey), status ? "Already disabled" : "Already enabled");

    s.disablePolicyInternal(coverKey, productKey, status);

    emit ProductStateUpdated(coverKey, productKey, msg.sender, status, reason);
  }

  /**
   * @dev Adds or removes an account to the cover creator whitelist.
   * For the first version of the protocol, a cover creator has to be whitelisted
   * before they can call the `addCover` function.
   *
   * @param account Enter the address of the cover creator
   * @param status Set this to true if you want to add to or false to remove from the whitelist
   *
   */
  function updateCoverCreatorWhitelist(address account, bool status) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    s.updateCoverCreatorWhitelistInternal(account, status);
    emit CoverCreatorWhitelistUpdated(account, status);
  }

  /**
   * @dev Adds or removes an account from the cover user whitelist.
   * Whitelisting is an optional feature cover creators can enable.
   *
   * When a cover requires whitelist, you must add accounts
   * to the cover user whitelist before they are able to purchase policies.
   *
   * @custom:suppress-acl This function is only accessilbe to the cover owner or admin
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param accounts Enter a list of accounts you would like to update the whitelist statuses of.
   * @param statuses Enter respective statuses of the specified whitelisted accounts.
   *
   */
  function updateCoverUsersWhitelist(
    bytes32 coverKey,
    bytes32 productKey,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.senderMustBeCoverOwnerOrAdmin(coverKey);

    s.updateCoverUsersWhitelistInternal(coverKey, productKey, accounts, statuses);
  }

  /**
   * @dev Signifies if the given account is a whitelisted cover creator
   */
  function checkIfWhitelistedCoverCreator(address account) external view override returns (bool) {
    return s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, account);
  }

  /**
   * @dev Signifies if the given account is a whitelisted user
   */
  function checkIfWhitelistedUser(
    bytes32 coverKey,
    bytes32 productKey,
    address account
  ) external view override returns (bool) {
    return s.getAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, productKey, account);
  }
}
