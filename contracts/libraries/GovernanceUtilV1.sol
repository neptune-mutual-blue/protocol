/* solhint-disable function-max-lines */
// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "../interfaces/IPolicy.sol";
import "../interfaces/ICoverStake.sol";
import "../interfaces/IPriceDiscovery.sol";
import "../interfaces/ICoverReassurance.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IVaultFactory.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./RoutineInvokerLibV1.sol";
import "./StoreKeyUtil.sol";
import "./CoverUtilV1.sol";

library GovernanceUtilV1 {
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;

  function getReportingPeriodInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, key);
  }

  function getReportingBurnRateInternal(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE);
  }

  function getGovernanceReporterCommissionInternal(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION);
  }

  function getClaimPlatformFeeInternal(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_PLATFORM_FEE);
  }

  function getClaimReporterCommissionInternal(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_REPORTER_COMMISSION);
  }

  function getMinReportingStakeInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, key);
  }

  function getLatestIncidentDateInternal(IStore s, bytes32 key) external view returns (uint256) {
    return _getLatestIncidentDateInternal(s, key);
  }

  function getResolutionTimestampInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, key);
  }

  function getReporterInternal(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) external view returns (address) {
    CoverUtilV1.CoverStatus status = CoverUtilV1.getCoverStatusOf(s, key, incidentDate);
    bool incidentHappened = status == CoverUtilV1.CoverStatus.IncidentHappened || status == CoverUtilV1.CoverStatus.Claimable;
    bytes32 prefix = incidentHappened ? ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES : ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO;

    return s.getAddressByKeys(prefix, key);
  }

  function getStakesInternal(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIncidentOccurredStakesKey(key, incidentDate));
    no = s.getUintByKey(_getFalseReportingStakesKey(key, incidentDate));
  }

  function _getReporterKey(bytes32 key) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, key));
  }

  function _getIncidentOccurredStakesKey(bytes32 key, uint256 incidentDate) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, key, incidentDate));
  }

  function _getIndividualIncidentOccurredStakeKey(
    bytes32 key,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES, key, incidentDate, account));
  }

  function _getDisputerKey(bytes32 key) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key));
  }

  function _getFalseReportingStakesKey(bytes32 key, uint256 incidentDate) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key, incidentDate));
  }

  function _getIndividualFalseReportingStakeKey(
    bytes32 key,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO, key, incidentDate, account));
  }

  function getStakesOfInternal(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(key, incidentDate, account));
    no = s.getUintByKey(_getIndividualFalseReportingStakeKey(key, incidentDate, account));
  }

  function getResolutionInfoForInternal(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  )
    public
    view
    returns (
      uint256 totalStakeInWinningCamp,
      uint256 totalStakeInLosingCamp,
      uint256 myStakeInWinningCamp
    )
  {
    (uint256 yes, uint256 no) = getStakesInternal(s, key, incidentDate);
    (uint256 myYes, uint256 myNo) = getStakesOfInternal(s, account, key, incidentDate);

    CoverUtilV1.CoverStatus decision = CoverUtilV1.getCoverStatusOf(s, key, incidentDate);
    bool incidentHappened = decision == CoverUtilV1.CoverStatus.IncidentHappened || decision == CoverUtilV1.CoverStatus.Claimable;

    totalStakeInWinningCamp = incidentHappened ? yes : no;
    totalStakeInLosingCamp = incidentHappened ? no : yes;
    myStakeInWinningCamp = incidentHappened ? myYes : myNo;
  }

  function getUnstakeInfoForInternal(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  )
    external
    view
    returns (
      uint256 totalStakeInWinningCamp,
      uint256 totalStakeInLosingCamp,
      uint256 myStakeInWinningCamp,
      uint256 toBurn,
      uint256 toReporter,
      uint256 myReward,
      uint256 unstaken
    )
  {
    (totalStakeInWinningCamp, totalStakeInLosingCamp, myStakeInWinningCamp) = getResolutionInfoForInternal(s, account, key, incidentDate);

    unstaken = getReportingUnstakenAmountInternal(s, account, key, incidentDate);
    require(myStakeInWinningCamp > 0, "Nothing to unstake");

    uint256 rewardRatio = (myStakeInWinningCamp * ProtoUtilV1.MULTIPLIER) / totalStakeInWinningCamp;

    uint256 reward = 0;

    // Incident dates are reset when a reporting is finalized.
    // This check ensures only the people who come to unstake
    // before the finalization will receive rewards
    if (_getLatestIncidentDateInternal(s, key) == incidentDate) {
      // slither-disable-next-line divide-before-multiply
      reward = (totalStakeInLosingCamp * rewardRatio) / ProtoUtilV1.MULTIPLIER;
    }

    toBurn = (reward * getReportingBurnRateInternal(s)) / ProtoUtilV1.MULTIPLIER;
    toReporter = (reward * getGovernanceReporterCommissionInternal(s)) / ProtoUtilV1.MULTIPLIER;
    myReward = reward - toBurn - toReporter;
  }

  function getReportingUnstakenAmountInternal(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  ) public view returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, key, incidentDate, account));
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, key, incidentDate, account));
    return s.getUintByKey(k);
  }

  function updateUnstakeDetailsInternal(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate,
    uint256 originalStake,
    uint256 reward,
    uint256 burned,
    uint256 reporterFee
  ) external {
    // Unstake timestamp of the account
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, key, incidentDate, account));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // Last unstake timestamp
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, key, incidentDate));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // ---------------------------------------------------------------------

    // Amount unstaken by the account
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, key, incidentDate, account));
    s.setUintByKey(k, originalStake);

    // Amount unstaken by everyone
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, key, incidentDate));
    s.addUintByKey(k, originalStake);

    // ---------------------------------------------------------------------

    if (reward > 0) {
      // Reward received by the account
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, key, incidentDate, account));
      s.setUintByKey(k, reward);

      // Total reward received
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, key, incidentDate));
      s.addUintByKey(k, reward);
    }

    // ---------------------------------------------------------------------

    if (burned > 0) {
      // Total burned
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_BURNED, key, incidentDate));
      s.addUintByKey(k, burned);
    }

    if (reporterFee > 0) {
      // Total fee paid to the final reporter
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REPORTER_FEE, key, incidentDate));
      s.addUintByKey(k, reporterFee);
    }
  }

  function _updateCoverStatusBeforeResolutionInternal(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) private {
    require(incidentDate > 0, "Invalid incident date");

    uint256 yes = s.getUintByKey(_getIncidentOccurredStakesKey(key, incidentDate));
    uint256 no = s.getUintByKey(_getFalseReportingStakesKey(key, incidentDate));

    if (no > yes) {
      s.setStatusInternal(key, incidentDate, CoverUtilV1.CoverStatus.FalseReporting);
      return;
    }

    s.setStatusInternal(key, incidentDate, CoverUtilV1.CoverStatus.IncidentHappened);
  }

  function addAttestationInternal(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    // @suppress-address-trust-issue The address `who` can be trusted here because we are not performing any direct calls to it.
    // Add individual stake of the reporter
    s.addUintByKey(_getIndividualIncidentOccurredStakeKey(key, incidentDate, who), stake);

    // All "incident happened" camp witnesses combined
    uint256 currentStake = s.getUintByKey(_getIncidentOccurredStakesKey(key, incidentDate));

    // No has reported yet, this is the first report
    if (currentStake == 0) {
      s.setAddressByKey(_getReporterKey(key), msg.sender);
    }

    s.addUintByKey(_getIncidentOccurredStakesKey(key, incidentDate), stake);
    _updateCoverStatusBeforeResolutionInternal(s, key, incidentDate);

    s.updateStateAndLiquidity(key);
  }

  function getAttestationInternal(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(key, incidentDate, who));
    totalStake = s.getUintByKey(_getIncidentOccurredStakesKey(key, incidentDate));
  }

  function addDisputeInternal(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    // @suppress-address-trust-issue The address `who` can be trusted here because we are not performing any direct calls to it.

    s.addUintByKey(_getIndividualFalseReportingStakeKey(key, incidentDate, who), stake);

    uint256 currentStake = s.getUintByKey(_getFalseReportingStakesKey(key, incidentDate));

    if (currentStake == 0) {
      // The first reporter who disputed
      s.setAddressByKey(_getDisputerKey(key), msg.sender);
      s.setBoolByKey(getHasDisputeKeyInternal(key), true);
    }

    s.addUintByKey(_getFalseReportingStakesKey(key, incidentDate), stake);
    _updateCoverStatusBeforeResolutionInternal(s, key, incidentDate);

    s.updateStateAndLiquidity(key);
  }

  function getHasDisputeKeyInternal(bytes32 key) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_HAS_A_DISPUTE, key));
  }

  function getDisputeInternal(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualFalseReportingStakeKey(key, incidentDate, who));
    totalStake = s.getUintByKey(_getFalseReportingStakesKey(key, incidentDate));
  }

  function _getLatestIncidentDateInternal(IStore s, bytes32 key) private view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, key);
  }

  function getCoolDownPeriodInternal(IStore s, bytes32 key) external view returns (uint256) {
    uint256 fromKey = s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, key);
    uint256 fallbackValue = s.getUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD);

    return fromKey > 0 ? fromKey : fallbackValue;
  }

  function getResolutionDeadlineInternal(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, key);
  }
}
