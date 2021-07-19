// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";
import "./RegistryLibV1.sol";
import "./CoverUtilV1.sol";
import "./GovernanceUtilV1.sol";
import "../interfaces/ICToken.sol";

library ValidationLibV1 {
  using RegistryLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using CoverUtilV1 for IStore;
  using GovernanceUtilV1 for IStore;

  /*********************************************************************************************
    _______ ______    ________ ______
    |      |     |\  / |______|_____/
    |_____ |_____| \/  |______|    \_
                                  
   *********************************************************************************************/

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract
   * or if the cover is under governance.
   * @param key Enter the cover key to check
   */
  function mustBeValidCover(IStore s, bytes32 key) public view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key), "Cover does not exist");
    require(s.getReportingStatus(key) == CoverUtilV1.CoverStatus.Normal, "Actively Reporting");
  }

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract.
   * @param key Enter the cover key to check
   */
  function mustBeValidCoverKey(IStore s, bytes32 key) public view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key), "Cover does not exist");
  }

  /**
   * @dev Reverts if the sender is not the cover owner or owner
   * @param key Enter the cover key to check
   * @param sender The `msg.sender` value
   * @param owner Enter the owner address
   */
  function mustBeCoverOwner(
    IStore s,
    bytes32 key,
    address sender,
    address owner
  ) public view {
    bool isCoverOwner = s.getCoverOwner(key) == sender;
    bool isOwner = sender == owner;

    require(isOwner || isCoverOwner, "Forbidden");
  }

  function callerMustBePolicyContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.NS_COVER_POLICY);
  }

  function callerMustBePolicyManagerContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.NS_COVER_POLICY_MANAGER);
  }

  function callerMustBeCoverContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.NS_COVER);
  }

  function callerMustBeGovernanceContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.NS_GOVERNANCE);
  }

  function callerMustBeClaimsProcessorContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.NS_CLAIMS_PROCESSOR);
  }

  /*********************************************************************************************
   ______  _____  _    _ _______  ______ __   _ _______ __   _ _______ _______
  |  ____ |     |  \  /  |______ |_____/ | \  | |_____| | \  | |       |______
  |_____| |_____|   \/   |______ |    \_ |  \_| |     | |  \_| |_____  |______

  *********************************************************************************************/

  function mustBeReporting(IStore s, bytes32 key) public view {
    require(s.getReportingStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened, "Not reporting");
  }

  function mustBeDisputed(IStore s, bytes32 key) public view {
    require(s.getReportingStatus(key) == CoverUtilV1.CoverStatus.FalseReporting, "Not disputed");
  }

  function mustBeReportingOrDisputed(IStore s, bytes32 key) public view {
    CoverUtilV1.CoverStatus status = s.getReportingStatus(key);
    bool incidentHappened = status == CoverUtilV1.CoverStatus.IncidentHappened;
    bool falseReporting = status == CoverUtilV1.CoverStatus.FalseReporting;

    require(incidentHappened || falseReporting, "Not reporting or disputed");
  }

  function mustBeValidIncidentDate(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) public view {
    require(s.getLatestIncidentDate(key) == incidentDate, "Invalid incident date");
  }

  function mustNotHaveDispute(IStore s, bytes32 key) public view {
    address reporter = s.getAddressByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_NO, key);
    require(reporter == address(0), "Already disputed");
  }

  function mustBeDuringReportingPeriod(IStore s, bytes32 key) public view {
    require(s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key) >= block.timestamp, "Reporting window closed"); // solhint-disable-line
  }

  function mustBeAfterReportingPeriod(IStore s, bytes32 key) public view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key), "Reporting still active"); // solhint-disable-line
  }

  function mustBeValidCToken(
    bytes32 key,
    address cToken,
    uint256 incidentDate
  ) public view {
    bytes32 coverKey = ICToken(cToken).coverKey();
    require(coverKey == key, "Invalid cToken");

    uint256 expires = ICToken(cToken).expiresOn();
    require(expires > incidentDate, "Invalid or expired cToken");
  }

  function mustBeValidClaim(
    IStore s,
    bytes32 key,
    address cToken,
    uint256 incidentDate
  ) public view {
    require(s.getReportingStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened, "Claim denied");

    s.mustBeProtocolMember(cToken);
    mustBeValidIncidentDate(s, key, incidentDate);
    mustBeValidCToken(key, cToken, incidentDate);
    mustBeDuringClaimPeriod(s, key);
  }

  function mustBeDuringClaimPeriod(IStore s, bytes32 key) public view {
    uint256 resolutionDate = s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key);
    require(block.timestamp >= resolutionDate, "Reporting still active"); // solhint-disable-line

    uint256 claimExpiry = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key);
    require(block.timestamp <= claimExpiry, "Claim period has expired"); // solhint-disable-line
  }

  function mustBeAfterClaimExpiry(IStore s, bytes32 key) public view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key), "Claim still active"); // solhint-disable-line
  }
}
