// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./CoverBase.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/IVault.sol";

/**
 * @title Cover Contract
 * @dev The cover contract enables you to manage onchain covers.
 *
 */
contract Cover is CoverBase {
  using CoverLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

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
   */
  function addCover(AddCoverArgs calldata args) public override nonReentrant returns (address) {
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();

    require(args.stakeWithFee >= s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE), "Your stake is too low");

    s.addCoverInternal(args);

    emit CoverCreated(args.coverKey, args.info, args.tokenName, args.tokenSymbol, args.supportsProducts, args.requiresWhitelist);

    address vault = s.deployVaultInternal(args.coverKey, args.tokenName, args.tokenSymbol);
    emit VaultDeployed(args.coverKey, vault);

    return vault;
  }

  function addCovers(AddCoverArgs[] calldata args) external override returns (address[] memory vaults) {
    vaults = new address[](args.length + 1);

    for (uint256 i = 0; i < args.length; i++) {
      vaults[i] = addCover(args[i]);
    }
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
   */
  function addProduct(AddProductArgs calldata args) public override nonReentrant {
    // @suppress-zero-value-check The uint values are validated in the function `addProductInternal`
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();
    s.senderMustBeCoverOwnerOrAdmin(args.coverKey);

    s.addProductInternal(args);
    emit ProductCreated(args.coverKey, args.productKey, args.info);
  }

  function addProducts(AddProductArgs[] calldata args) external override {
    for (uint256 i = 0; i < args.length; i++) {
      addProduct(args[i]);
    }
  }

  /**
   * @dev Updates a cover product.
   * This feature is accessible only to the cover manager during withdrawal period.
   *
   */
  function updateProduct(UpdateProductArgs calldata args) external override nonReentrant {
    // @suppress-zero-value-check The uint values are validated in the function `updateProductInternal`
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(args.coverKey, args.productKey);
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeDuringWithdrawalPeriod(args.coverKey);

    s.updateProductInternal(args);
    emit ProductUpdated(args.coverKey, args.productKey, args.info);
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
   * @param accounts Enter list of address of cover creators
   * @param statuses Set this to true if you want to add to or false to remove from the whitelist
   *
   */
  function updateCoverCreatorWhitelist(address[] calldata accounts, bool[] calldata statuses) external override nonReentrant {
    require(accounts.length > 0, "Please specify an account");
    require(accounts.length == statuses.length, "Invalid args");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    for (uint256 i = 0; i < accounts.length; i++) {
      s.updateCoverCreatorWhitelistInternal(accounts[i], statuses[i]);
      emit CoverCreatorWhitelistUpdated(accounts[i], statuses[i]);
    }
  }

  /**
   * @dev Adds or removes an account from the cover user whitelist.
   * Whitelisting is an optional feature cover creators can enable.
   *
   * When a cover requires whitelist, you must add accounts
   * to the cover user whitelist before they are able to purchase policies.
   *
   * @custom:suppress-acl This function is only accessible to the cover owner or admin
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
