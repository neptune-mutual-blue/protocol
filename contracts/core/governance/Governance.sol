// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./Reporter.sol";
import "../../interfaces/IGovernance.sol";
import "../../interfaces/ICToken.sol";

contract Governance is IGovernance, Reporter {
  using GovernanceUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  function finalize(bytes32 key, uint256 incidentDate) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);

    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeAfterClaimExpiry(key);

    // Reset to normal
    s.setStatus(key, CoverUtilV1.CoverStatus.Normal);
    s.deleteUintByKeys(ProtoUtilV1.NS_REPORTING_INCIDENT_DATE, key);
    s.deleteUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key);
    s.deleteUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key);

    s.deleteAddressByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key);
    s.deleteUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key);

    emit Finalized(key, msg.sender, incidentDate);
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_GOVERNANCE;
  }
}
