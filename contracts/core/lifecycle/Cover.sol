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
  using StoreKeyUtil for IStore;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;

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

    s.updateCoverInternal(key, info);
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
   * @param values[0] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * @param values[1] reportingPeriod The period during when reporting happens.
   * @param values[2] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * @param values[3] initialReassuranceAmount **Optional.** Enter the initial amount of
   * reassurance tokens you'd like to add to this pool.
   * @param values[4] initialLiquidity **Optional.** Enter the initial stablecoin liquidity for this cover.
   */
  function addCover(
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    uint256[] memory values
  ) external override nonReentrant {
    // @suppress-acl Can only be called by a whitelisted address
    // @suppress-acl Marking this as publicly accessible
    // @suppress-address-trust-issue The reassuranceToken can only be the stablecoin supported by the protocol for this version.
    s.mustNotBePaused();
    s.senderMustBeWhitelisted();

    require(values[0] >= s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE), "Min NPM stake too low");
    require(reassuranceToken == s.getStablecoin(), "Invalid reassurance token");

    s.addCoverInternal(key, info, reassuranceToken, values);
    emit CoverCreated(key, info);
  }

  /**
   * @dev Enables governance admin to stop a spam cover contract
   * @param key Enter the cover key you want to stop
   * @param reason Provide a reason to stop this cover
   */
  function stopCover(bytes32 key, string memory reason) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCover(key);
    AccessControlLibV1.mustBeGovernanceAdmin(s);

    s.stopCoverInternal(key);
    emit CoverStopped(key, msg.sender, reason);
  }

  /**
   * @dev Adds or removes an account to the whitelist.
   * For the first version of the protocol, a cover creator has to be whitelisted
   * before they can call the `addCover` function.
   * @param account Enter the address of the cover creator
   * @param status Set this to true if you want to add to or false to remove from the whitelist
   */
  function updateWhitelist(address account, bool status) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    s.updateWhitelistInternal(account, status);
    emit WhitelistUpdated(account, status);
  }

  /**
   * @dev Signifies if a given account is whitelisted
   */
  function checkIfWhitelisted(address account) external view override returns (bool) {
    return s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account);
  }
}
