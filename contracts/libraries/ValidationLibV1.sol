// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/access/IAccessControl.sol";
import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";
import "./RegistryLibV1.sol";
import "./CoverUtilV1.sol";
import "./GovernanceUtilV1.sol";
import "./AccessControlLibV1.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IPausable.sol";
import "../interfaces/ICxToken.sol";

library ValidationLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using CoverUtilV1 for IStore;
  using GovernanceUtilV1 for IStore;
  using RegistryLibV1 for IStore;

  /*********************************************************************************************
    _______ ______    ________ ______
    |      |     |\  / |______|_____/
    |_____ |_____| \/  |______|    \_
                                  
   *********************************************************************************************/

  /**
   * @dev Reverts if the protocol is paused
   */
  function mustNotBePaused(IStore s) public view {
    address protocol = s.getProtocolAddress();
    require(IPausable(protocol).paused() == false, "Protocol is paused");
  }

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract
   * or if the cover is under governance.
   * @param coverKey Enter the cover key to check
   */
  function mustHaveNormalCoverStatus(IStore s, bytes32 coverKey) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
    require(s.getCoverStatus(coverKey) == CoverUtilV1.CoverStatus.Normal, "Status not normal");
  }

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract
   * or if the cover is under governance.
   * @param coverKey Enter the cover key to check
   */
  function mustHaveStoppedCoverStatus(IStore s, bytes32 coverKey) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
    require(s.getCoverStatus(coverKey) == CoverUtilV1.CoverStatus.Stopped, "Cover isn't stopped");
  }

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract.
   * @param coverKey Enter the cover key to check
   */
  function mustBeValidCoverKey(IStore s, bytes32 coverKey) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
  }

  /**
   * @dev Reverts if the sender is not the cover owner
   * @param coverKey Enter the cover key to check
   * @param sender The `msg.sender` value
   */
  function mustBeCoverOwner(
    IStore s,
    bytes32 coverKey,
    address sender
  ) public view {
    bool isCoverOwner = s.getCoverOwner(coverKey) == sender;
    require(isCoverOwner, "Forbidden");
  }

  /**
   * @dev Reverts if the sender is not the cover owner or the cover contract
   * @param coverKey Enter the cover key to check
   * @param sender The `msg.sender` value
   */
  function mustBeCoverOwnerOrCoverContract(
    IStore s,
    bytes32 coverKey,
    address sender
  ) external view {
    bool isCoverOwner = s.getCoverOwner(coverKey) == sender;
    bool isCoverContract = address(s.getCoverContract()) == sender;

    require(isCoverOwner || isCoverContract, "Forbidden");
  }

  function senderMustBeCoverOwnerOrAdmin(IStore s, bytes32 coverKey) external view {
    if (AccessControlLibV1.hasAccess(s, AccessControlLibV1.NS_ROLES_ADMIN, msg.sender) == false) {
      mustBeCoverOwner(s, coverKey, msg.sender);
    }
  }

  function senderMustBePolicyContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY);
  }

  function senderMustBePolicyManagerContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY_MANAGER);
  }

  function senderMustBeCoverContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER);
  }

  function senderMustBeVaultContract(IStore s, bytes32 coverKey) external view {
    address vault = s.getVaultAddress(coverKey);
    require(msg.sender == vault, "Forbidden");
  }

  function senderMustBeGovernanceContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_GOVERNANCE);
  }

  function senderMustBeClaimsProcessorContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR);
  }

  function callerMustBeClaimsProcessorContract(IStore s, address caller) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR, caller);
  }

  function senderMustBeStrategyContract(IStore s) external view {
    bool senderIsStrategyContract = s.getBoolByKey(_getIsActiveStrategyKey(msg.sender));
    require(senderIsStrategyContract == true, "Not a strategy contract");
  }

  function callerMustBeStrategyContract(IStore s, address caller) external view {
    bool callerIsStrategyContract = s.getBoolByKey(_getIsActiveStrategyKey(caller));
    require(callerIsStrategyContract == true, "Not a strategy contract");
  }

  function callerMustBeSpecificStrategyContract(
    IStore s,
    address caller,
    bytes32 /*strategyName*/
  ) external view {
    bool callerIsStrategyContract = s.getBoolByKey(_getIsActiveStrategyKey(caller));
    require(callerIsStrategyContract == true, "Not a strategy contract");
  }

  function _getIsActiveStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE, strategyAddress));
  }

  function senderMustBeProtocolMember(IStore s) external view {
    require(s.isProtocolMember(msg.sender), "Forbidden");
  }

  /*********************************************************************************************
   ______  _____  _    _ _______  ______ __   _ _______ __   _ _______ _______
  |  ____ |     |  \  /  |______ |_____/ | \  | |_____| | \  | |       |______
  |_____| |_____|   \/   |______ |    \_ |  \_| |     | |  \_| |_____  |______

  *********************************************************************************************/

  function mustBeReporting(IStore s, bytes32 coverKey) external view {
    require(s.getCoverStatus(coverKey) == CoverUtilV1.CoverStatus.IncidentHappened, "Not reporting");
  }

  function mustBeDisputed(IStore s, bytes32 coverKey) external view {
    require(s.getCoverStatus(coverKey) == CoverUtilV1.CoverStatus.FalseReporting, "Not disputed");
  }

  function mustBeClaimable(IStore s, bytes32 coverKey) public view {
    require(s.getCoverStatus(coverKey) == CoverUtilV1.CoverStatus.Claimable, "Not claimable");
  }

  function mustBeClaimingOrDisputed(IStore s, bytes32 coverKey) external view {
    CoverUtilV1.CoverStatus status = s.getCoverStatus(coverKey);

    bool claiming = status == CoverUtilV1.CoverStatus.Claimable;
    bool falseReporting = status == CoverUtilV1.CoverStatus.FalseReporting;

    require(claiming || falseReporting, "Not claimable nor disputed");
  }

  function mustBeReportingOrDisputed(IStore s, bytes32 coverKey) external view {
    CoverUtilV1.CoverStatus status = s.getCoverStatus(coverKey);
    bool incidentHappened = status == CoverUtilV1.CoverStatus.IncidentHappened;
    bool falseReporting = status == CoverUtilV1.CoverStatus.FalseReporting;

    require(incidentHappened || falseReporting, "Not reported nor disputed");
  }

  function mustBeBeforeResolutionDeadline(IStore s, bytes32 coverKey) external view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey);

    if (deadline > 0) {
      require(block.timestamp < deadline, "Emergency resolution deadline over"); // solhint-disable-line
    }
  }

  function mustNotHaveResolutionDeadline(IStore s, bytes32 coverKey) external view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey);
    require(deadline == 0, "Resolution already has deadline");
  }

  function mustBeAfterResolutionDeadline(IStore s, bytes32 coverKey) public view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey);
    require(deadline > 0 && block.timestamp > deadline, "Still unresolved"); // solhint-disable-line
  }

  function mustBeValidIncidentDate(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) public view {
    require(s.getLatestIncidentDateInternal(coverKey) == incidentDate, "Invalid incident date");
  }

  function mustHaveDispute(IStore s, bytes32 coverKey) external view {
    bool hasDispute = s.getBoolByKey(GovernanceUtilV1.getHasDisputeKeyInternal(coverKey));
    require(hasDispute == true, "Not disputed");
  }

  function mustNotHaveDispute(IStore s, bytes32 coverKey) external view {
    bool hasDispute = s.getBoolByKey(GovernanceUtilV1.getHasDisputeKeyInternal(coverKey));
    require(hasDispute == false, "Already disputed");
  }

  function mustBeDuringReportingPeriod(IStore s, bytes32 coverKey) external view {
    require(s.getResolutionTimestampInternal(coverKey) >= block.timestamp, "Reporting window closed"); // solhint-disable-line
  }

  function mustBeAfterReportingPeriod(IStore s, bytes32 coverKey) public view {
    require(block.timestamp > s.getResolutionTimestampInternal(coverKey), "Reporting still active"); // solhint-disable-line
  }

  function mustBeValidCxToken(
    IStore s,
    bytes32 coverKey,
    address cxToken,
    uint256 incidentDate
  ) public view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken) == true, "Unknown cxToken");

    bytes32 COVER_KEY = ICxToken(cxToken).COVER_KEY(); // solhint-disable-line
    require(coverKey == COVER_KEY, "Invalid cxToken");

    uint256 expires = ICxToken(cxToken).expiresOn();
    require(expires > incidentDate, "Invalid or expired cxToken");
  }

  function mustBeValidClaim(
    IStore s,
    address account,
    bytes32 coverKey,
    address cxToken,
    uint256 incidentDate,
    uint256 amount
  ) external view {
    // @note: cxTokens are no longer protocol members
    // as we will end up with way too many contracts
    // s.mustBeProtocolMember(cxToken);
    mustBeValidCxToken(s, coverKey, cxToken, incidentDate);
    mustBeClaimable(s, coverKey);
    mustBeValidIncidentDate(s, coverKey, incidentDate);
    mustBeDuringClaimPeriod(s, coverKey);

    require(ICxToken(cxToken).getClaimablePolicyOf(account) >= amount, "Claim exceeds your coverage");
  }

  function mustNotHaveUnstaken(
    IStore s,
    address account,
    bytes32 coverKey,
    uint256 incidentDate
  ) public view {
    uint256 withdrawal = s.getReportingUnstakenAmountInternal(account, coverKey, incidentDate);
    require(withdrawal == 0, "Already unstaken");
  }

  function validateUnstakeWithoutClaim(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustNotHaveUnstaken(s, msg.sender, coverKey, incidentDate);
    mustBeAfterReportingPeriod(s, coverKey);

    // Before the deadline, emergency resolution can still happen
    // that may have an impact on the final decision. We, therefore, have to wait.
    mustBeAfterResolutionDeadline(s, coverKey);

    // @note: when this reporting gets finalized, the emergency resolution deadline resets to 0
    // The above code is not useful after finalization but it helps avoid
    // people calling unstake before a decision is obtained
  }

  function validateUnstakeWithClaim(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustNotHaveUnstaken(s, msg.sender, coverKey, incidentDate);
    mustBeAfterReportingPeriod(s, coverKey);

    // If this reporting gets finalized, incident date will become invalid
    // meaning this execution will revert thereby restricting late comers
    // to access this feature. But they can still access `unstake` feature
    // to withdraw their stake.
    mustBeValidIncidentDate(s, coverKey, incidentDate);

    // Before the deadline, emergency resolution can still happen
    // that may have an impact on the final decision. We, therefore, have to wait.
    mustBeAfterResolutionDeadline(s, coverKey);

    bool incidentHappened = s.getCoverStatus(coverKey) == CoverUtilV1.CoverStatus.Claimable;

    if (incidentHappened) {
      // Incident occurred. Must unstake with claim during the claim period.
      mustBeDuringClaimPeriod(s, coverKey);
      return;
    }
  }

  function mustBeDuringClaimPeriod(IStore s, bytes32 coverKey) public view {
    uint256 beginsFrom = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, coverKey);
    uint256 expiresAt = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey);

    require(beginsFrom > 0, "Invalid claim begin date");
    require(expiresAt > beginsFrom, "Invalid claim period");

    require(block.timestamp >= beginsFrom, "Claim period hasn't begun"); // solhint-disable-line
    require(block.timestamp <= expiresAt, "Claim period has expired"); // solhint-disable-line
  }

  function mustBeAfterClaimExpiry(IStore s, bytes32 coverKey) external view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey), "Claim still active"); // solhint-disable-line
  }

  /**
   * @dev Reverts if the sender is not whitelisted cover creator.
   */
  function senderMustBeWhitelistedCoverCreator(IStore s) external view {
    require(s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, msg.sender), "Not whitelisted");
  }

  function senderMustBeWhitelistedIfRequired(
    IStore s,
    bytes32 coverKey,
    address sender
  ) external view {
    bool required = s.checkIfRequiresWhitelist(coverKey);

    if (required == false) {
      return;
    }

    require(s.getAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, sender), "You are not whitelisted");
  }
}
