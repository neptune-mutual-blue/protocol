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

  uint256 public constant REASSURANCE_RATE = 2500;

  function getReportingPeriodInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, coverKey);
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

  function getMinReportingStakeInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey);
  }

  function getLatestIncidentDateInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    return _getLatestIncidentDateInternal(s, coverKey);
  }

  function getResolutionTimestampInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey);
  }

  function getReporterInternal(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) external view returns (address) {
    CoverUtilV1.CoverStatus status = CoverUtilV1.getCoverStatusOf(s, coverKey, incidentDate);
    bool incidentHappened = status == CoverUtilV1.CoverStatus.IncidentHappened || status == CoverUtilV1.CoverStatus.Claimable;
    bytes32 prefix = incidentHappened ? ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES : ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO;

    return s.getAddressByKeys(prefix, coverKey);
  }

  function getStakesInternal(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, incidentDate));
    no = s.getUintByKey(_getFalseReportingStakesKey(coverKey, incidentDate));
  }

  function _getReporterKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey));
  }

  function _getIncidentOccurredStakesKey(bytes32 coverKey, uint256 incidentDate) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, incidentDate));
  }

  function _getClaimPayoutsKey(bytes32 coverKey, uint256 incidentDate) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_CLAIM_PAYOUTS, coverKey, incidentDate));
  }

  function _getReassuranceCapitalizedKey(bytes32 coverKey, uint256 incidentDate) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE_CAPITALIZED_INCIDENT, coverKey, incidentDate));
  }

  function _getIndividualIncidentOccurredStakeKey(
    bytes32 coverKey,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES, coverKey, incidentDate, account));
  }

  function _getDisputerKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey));
  }

  function _getFalseReportingStakesKey(bytes32 coverKey, uint256 incidentDate) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey, incidentDate));
  }

  function _getIndividualFalseReportingStakeKey(
    bytes32 coverKey,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO, coverKey, incidentDate, account));
  }

  function getStakesOfInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, incidentDate, account));
    no = s.getUintByKey(_getIndividualFalseReportingStakeKey(coverKey, incidentDate, account));
  }

  function getResolutionInfoForInternal(
    IStore s,
    address account,
    bytes32 coverKey,
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
    (uint256 yes, uint256 no) = getStakesInternal(s, coverKey, incidentDate);
    (uint256 myYes, uint256 myNo) = getStakesOfInternal(s, account, coverKey, incidentDate);

    CoverUtilV1.CoverStatus decision = CoverUtilV1.getCoverStatusOf(s, coverKey, incidentDate);
    bool incidentHappened = decision == CoverUtilV1.CoverStatus.IncidentHappened || decision == CoverUtilV1.CoverStatus.Claimable;

    totalStakeInWinningCamp = incidentHappened ? yes : no;
    totalStakeInLosingCamp = incidentHappened ? no : yes;
    myStakeInWinningCamp = incidentHappened ? myYes : myNo;
  }

  function getUnstakeInfoForInternal(
    IStore s,
    address account,
    bytes32 coverKey,
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
    (totalStakeInWinningCamp, totalStakeInLosingCamp, myStakeInWinningCamp) = getResolutionInfoForInternal(s, account, coverKey, incidentDate);

    unstaken = getReportingUnstakenAmountInternal(s, account, coverKey, incidentDate);
    require(myStakeInWinningCamp > 0, "Nothing to unstake");

    uint256 rewardRatio = (myStakeInWinningCamp * ProtoUtilV1.MULTIPLIER) / totalStakeInWinningCamp;

    uint256 reward = 0;

    // Incident dates are reset when a reporting is finalized.
    // This check ensures only the people who come to unstake
    // before the finalization will receive rewards
    if (_getLatestIncidentDateInternal(s, coverKey) == incidentDate) {
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
    bytes32 coverKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, incidentDate, account));
    return s.getUintByKey(k);
  }

  function updateUnstakeDetailsInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    uint256 incidentDate,
    uint256 originalStake,
    uint256 reward,
    uint256 burned,
    uint256 reporterFee
  ) external {
    // Unstake timestamp of the account
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, coverKey, incidentDate, account));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // Last unstake timestamp
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, coverKey, incidentDate));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // ---------------------------------------------------------------------

    // Amount unstaken by the account
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, incidentDate, account));
    s.setUintByKey(k, originalStake);

    // Amount unstaken by everyone
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, incidentDate));
    s.addUintByKey(k, originalStake);

    // ---------------------------------------------------------------------

    if (reward > 0) {
      // Reward received by the account
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, coverKey, incidentDate, account));
      s.setUintByKey(k, reward);

      // Total reward received
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, coverKey, incidentDate));
      s.addUintByKey(k, reward);
    }

    // ---------------------------------------------------------------------

    if (burned > 0) {
      // Total burned
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_BURNED, coverKey, incidentDate));
      s.addUintByKey(k, burned);
    }

    if (reporterFee > 0) {
      // Total fee paid to the final reporter
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REPORTER_FEE, coverKey, incidentDate));
      s.addUintByKey(k, reporterFee);
    }
  }

  function _updateCoverStatusBeforeResolutionInternal(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) private {
    require(incidentDate > 0, "Invalid incident date");

    uint256 yes = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, incidentDate));
    uint256 no = s.getUintByKey(_getFalseReportingStakesKey(coverKey, incidentDate));

    if (no > yes) {
      s.setStatusInternal(coverKey, incidentDate, CoverUtilV1.CoverStatus.FalseReporting);
      return;
    }

    s.setStatusInternal(coverKey, incidentDate, CoverUtilV1.CoverStatus.IncidentHappened);
  }

  function addAttestationInternal(
    IStore s,
    bytes32 coverKey,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    // @suppress-address-trust-issue The address `who` can be trusted here because we are not performing any direct calls to it.
    // Add individual stake of the reporter
    s.addUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, incidentDate, who), stake);

    // All "incident happened" camp witnesses combined
    uint256 currentStake = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, incidentDate));

    // No has reported yet, this is the first report
    if (currentStake == 0) {
      s.setAddressByKey(_getReporterKey(coverKey), msg.sender);
    }

    s.addUintByKey(_getIncidentOccurredStakesKey(coverKey, incidentDate), stake);
    _updateCoverStatusBeforeResolutionInternal(s, coverKey, incidentDate);

    s.updateStateAndLiquidity(coverKey);
  }

  function getAttestationInternal(
    IStore s,
    bytes32 coverKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, incidentDate, who));
    totalStake = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, incidentDate));
  }

  function addDisputeInternal(
    IStore s,
    bytes32 coverKey,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    // @suppress-address-trust-issue The address `who` can be trusted here because we are not performing any direct calls to it.

    s.addUintByKey(_getIndividualFalseReportingStakeKey(coverKey, incidentDate, who), stake);

    uint256 currentStake = s.getUintByKey(_getFalseReportingStakesKey(coverKey, incidentDate));

    if (currentStake == 0) {
      // The first reporter who disputed
      s.setAddressByKey(_getDisputerKey(coverKey), msg.sender);
      s.setBoolByKey(getHasDisputeKeyInternal(coverKey), true);
    }

    s.addUintByKey(_getFalseReportingStakesKey(coverKey, incidentDate), stake);
    _updateCoverStatusBeforeResolutionInternal(s, coverKey, incidentDate);

    s.updateStateAndLiquidity(coverKey);
  }

  function getHasDisputeKeyInternal(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_HAS_A_DISPUTE, coverKey));
  }

  function getDisputeInternal(
    IStore s,
    bytes32 coverKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualFalseReportingStakeKey(coverKey, incidentDate, who));
    totalStake = s.getUintByKey(_getFalseReportingStakesKey(coverKey, incidentDate));
  }

  function _getLatestIncidentDateInternal(IStore s, bytes32 coverKey) private view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey);
  }

  function getCoolDownPeriodInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 fromKey = s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey);
    uint256 fallbackValue = s.getUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD);

    return fromKey > 0 ? fromKey : fallbackValue;
  }

  function getResolutionDeadlineInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, coverKey);
  }

  function addClaimPayoutsInternal(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate,
    uint256 claimed
  ) external {
    s.addUintByKey(_getClaimPayoutsKey(coverKey, incidentDate), claimed);
  }

  function getClaimPayoutsInternal(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    return s.getUintByKey(_getClaimPayoutsKey(coverKey, incidentDate));
  }

  function getReassuranceCapitalizedInternal(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    return s.getUintByKey(_getReassuranceCapitalizedKey(coverKey, incidentDate));
  }

  function addReassuranceCapitalizedInternal(
    IStore s,
    bytes32 coverKey,
    uint256 incidentDate,
    uint256 capitalized
  ) external {
    s.addUintByKey(_getReassuranceCapitalizedKey(coverKey, incidentDate), capitalized);
  }

  function getReassuranceTransferAmountInternal(IStore s,bytes32 coverKey, uint256 incidentDate) external view returns (uint256) {
    uint256 alreadyUsed = getReassuranceCapitalizedInternal(s, coverKey, incidentDate);
    uint256 reassuranceAmount = s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, coverKey) + alreadyUsed;
    uint256 totalClaimPayouts = getClaimPayoutsInternal(s, coverKey, incidentDate);

    uint256 amountToConsider = reassuranceAmount > totalClaimPayouts ? totalClaimPayouts : reassuranceAmount;
    uint256 transferAmount = (amountToConsider * REASSURANCE_RATE) / ProtoUtilV1.MULTIPLIER;

    return transferAmount - alreadyUsed;
  }
}
