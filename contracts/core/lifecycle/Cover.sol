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
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover manager and during withdrawal period.
   *
   * @param coverKey Enter the cover key
   * @param info Enter a new IPFS URL to update
   */
  function updateCover(bytes32 coverKey, bytes32 info) external override nonReentrant {
    s.mustNotBePaused();
    s.mustHaveNormalCoverStatus(coverKey);
    s.mustBeCoverManager();
    s.mustBeDuringWithdrawalPeriod(coverKey);

    require(s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey) != info, "Duplicate content");

    s.updateCoverInternal(coverKey, info);
    emit CoverUpdated(coverKey, info);
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
   * @param coverKey Enter a unique key for this cover
   * @param supportsProducts Indicates that this cover supports product(s)
   * @param info IPFS info of the cover contract
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
    bytes32 info,
    string calldata tokenName,
    string calldata tokenSymbol,
    bool supportsProducts,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external override nonReentrant returns (address) {
    // @suppress-acl Can only be called by a whitelisted address
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();

    require(values[0] >= s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE), "Your stake is too low");

    s.addCoverInternal(coverKey, supportsProducts, info, requiresWhitelist, values);

    emit CoverCreated(coverKey, info, tokenName, tokenSymbol, supportsProducts, requiresWhitelist);

    address vault = s.deployVaultInternal(coverKey, tokenName, tokenSymbol);
    emit VaultDeployed(coverKey, vault);

    return vault;
  }

  function addProduct(
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external override {
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();
    s.senderMustBeCoverOwnerOrAdmin(coverKey);

    s.addProductInternal(coverKey, productKey, info, requiresWhitelist, values);
    emit ProductCreated(coverKey, productKey, info, requiresWhitelist, values);
  }

  function updateProduct(
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    uint256[] calldata values
  ) external override {
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeCoverManager();
    s.mustBeDuringWithdrawalPeriod(coverKey);

    s.updateProductInternal(coverKey, productKey, info, values);
    emit ProductUpdated(coverKey, productKey, info, values);
  }

  /**
   * @dev Allows stopping and resuming a product or cover.
   *
   * This function enables governance admin to stop or resume a cover contract.
   * A cover contract when stopped restricts new policy purchases
   * and frees up liquidity as policies expires.
   *
   * 1. A cover can be stopped and later removed after policies expire and liquidity is withdrawn.
   * 2. A cover can be stopped temporarily to allow liquidity providers a chance to exit.
   *
   * Note:
   * 1. This function does not allow governance admin to chage the reporting
   * status of the specified cover contract.
   * 2. A stopped cover does not restrict adding and removing liquidity.
   * 3. A stopped cover can still be reported if an incident is triggered.
   *
   * @param coverKey Enter the cover key you want to stop
   * @param reason Provide a reason to stop this cover
   */
  function updateProductState(
    bytes32 coverKey,
    bytes32 productKey,
    bool status,
    string calldata reason
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    if (status) {
      // A cover can only be resumed if it is stopped
      s.mustHaveStoppedProductStatus(coverKey, productKey);
    } else {
      // A cover can't be stopped at the middle of consensus
      s.mustHaveNormalProductStatus(coverKey, productKey);
    }

    s.updateProductStateInternal(coverKey, productKey, status);

    emit ProductStateUpdated(coverKey, productKey, msg.sender, status, reason);
  }

  /**
   * @dev Adds or removes an account to the cover creator whitelist.
   * For the first version of the protocol, a cover creator has to be whitelisted
   * before they can call the `addCover` function.
   * @param account Enter the address of the cover creator
   * @param status Set this to true if you want to add to or false to remove from the whitelist
   */
  function updateCoverCreatorWhitelist(address account, bool status) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);

    s.updateCoverCreatorWhitelistInternal(account, status);
    emit CoverCreatorWhitelistUpdated(account, status);
  }

  /*
   * @dev Adds or removes an account to the cover user whitelist.
   * Whitelisting is an optional feature cover creators can enable.
   * @param accounts Enter a list of accounts you would like to update the whitelist statuses of.
   * @param statuses Enter respective statuses of the specified whitelisted accounts.
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
   * @dev Signifies if a given account is a whitelisted cover creator
   */
  function checkIfWhitelistedCoverCreator(address account) external view override returns (bool) {
    return s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, account);
  }

  /**
   * @dev Signifies if a given account is a whitelisted user
   */
  function checkIfWhitelistedUser(
    bytes32 coverKey,
    bytes32 productKey,
    address account
  ) external view override returns (bool) {
    return s.getAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, productKey, account);
  }
}
