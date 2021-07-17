// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../Recoverable.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../interfaces/IWitness.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../../libraries/GovernanceUtilV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/RegistryLibV1.sol";
import "../../interfaces/ICToken.sol";
import "../../interfaces/IVault.sol";

abstract contract Witness is Recoverable, IWitness {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using GovernanceUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;

  function attest(
    bytes32 key,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    require(stake >= 0, "Enter a stake");

    s.addAttestation(key, super._msgSender(), incidentDate, stake);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Attested(key, super._msgSender(), incidentDate, stake);
  }

  function refute(
    bytes32 key,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    require(stake >= 0, "Enter a stake");

    s.addDispute(key, super._msgSender(), incidentDate, stake);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Refuted(key, super._msgSender(), incidentDate, stake);
  }
}
