/* solhint-disable function-max-lines */
// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IPolicy.sol";
import "../interfaces/ICoverStake.sol";
import "../interfaces/IUnstakable.sol";
import "../interfaces/ICoverReassurance.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IVaultFactory.sol";
import "./RoutineInvokerLibV1.sol";

library GovernanceUtilV1 {
  using CoverUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;

  /**
   * @dev Gets the reporting period for the given cover.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   *
   */
  function getReportingPeriodInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, coverKey);
  }

  /**
   * @dev Gets the NPM stake burn rate (upon resolution) for the given cover.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   *
   */
  function getReportingBurnRateInternal(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE);
  }

  /**
   * @dev Gets the "valid" reporter's NPM commission rate
   * (upon each unstake claim invoked by individual "valid" stakers)
   * for the given cover.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   *
   */
  function getGovernanceReporterCommissionInternal(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION);
  }

  /**
   * @dev Gets the protocol's NPM commission rate
   * (upon each unstake claim invoked by individual "valid" stakers)
   * for the given cover.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   *
   */
  function getPlatformCoverFeeRateInternal(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_PLATFORM_FEE);
  }

  /**
   * @dev Gets the "valid" reporter's stablecoin commission rate
   * on protocol's earnings (upon each claim payout received by claimants)
   * for the given cover.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   *
   */
  function getClaimReporterCommissionInternal(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_REPORTER_COMMISSION);
  }

  /**
   * @dev Gets the minimum units of NPM tokens required to report the supplied cover.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   *
   */
  function getMinReportingStakeInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 fb = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE);
    uint256 custom = s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey);

    return custom > 0 ? custom : fb;
  }

  /**
   * @dev Gets a cover's resolution timestamp.
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function getResolutionTimestampInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey, productKey);
  }

  /**
   * @dev Gets the given cover incident's reporter.
   * Note that this keeps changing between "first reporter"
   * and "candidate reporter" until resolution is achieved.
   *
   * <br /> <br />
   *
   * [Read More](https://docs.neptunemutual.com/covers/cover-reporting)
   *
   * <br /> <br />
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function getReporterInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (address) {
    CoverUtilV1.ProductStatus status = s.getProductStatusOfInternal(coverKey, productKey, incidentDate);
    bool incidentHappened = status == CoverUtilV1.ProductStatus.IncidentHappened || status == CoverUtilV1.ProductStatus.Claimable;
    bytes32 prefix = incidentHappened ? ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES : ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO;

    return s.getAddressByKeys(prefix, coverKey, productKey);
  }

  /**
   * @dev Returns stakes of the given cover product's incident.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getStakesInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));
    no = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));
  }

  /**
   * @dev Hash key of the reporter for the given cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getReporterKey(bytes32 coverKey, bytes32 productKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, productKey));
  }

  /**
   * @dev Hash key of the stakes added under `Incident Happened` camp for the given cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getIncidentOccurredStakesKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, productKey, incidentDate));
  }

  /**
   * @dev Hash key of the claims payout given for the supplied cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getClaimPayoutsKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_CLAIM_PAYOUTS, coverKey, productKey, incidentDate));
  }

  /**
   * @dev Hash key of the reassurance payout granted for the supplied cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getReassurancePayoutKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE_PAYOUT, coverKey, productKey, incidentDate));
  }

  /**
   * @dev Hash key of an individual's stakes added under `Incident Happened` camp for the given cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getIndividualIncidentOccurredStakeKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES, coverKey, productKey, incidentDate, account));
  }

  /**
   * @dev Hash key of the "candidate reporter" for the supplied cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getDisputerKey(bytes32 coverKey, bytes32 productKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey, productKey));
  }

  /**
   * @dev Hash key of the stakes added under `False Reporting` camp for the given cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getFalseReportingStakesKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey, productKey, incidentDate));
  }

  /**
   * @dev Hash key of an individual's stakes added under `False Reporting` camp for the given cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function _getIndividualFalseReportingStakeKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO, coverKey, productKey, incidentDate, account));
  }

  /**
   * @dev Returns stakes of the given account for a cover product's incident.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param account Specify the account to get stakes
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getStakesOfInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, productKey, incidentDate, account));
    no = s.getUintByKey(_getIndividualFalseReportingStakeKey(coverKey, productKey, incidentDate, account));
  }

  /**
   * @dev Returns resolution info of the given account
   * for a cover product's incident.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param account Specify the account to get stakes
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   * @param totalStakeInWinningCamp Total NPM tokens in currently "winning" camp.
   * @param totalStakeInLosingCamp Total NPM tokens in currently "losing" camp.
   * @param myStakeInWinningCamp Your NPM tokens in the "winning" camp.
   *
   */
  function getResolutionInfoForInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
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
    (uint256 yes, uint256 no) = getStakesInternal(s, coverKey, productKey, incidentDate);
    (uint256 myYes, uint256 myNo) = getStakesOfInternal(s, account, coverKey, productKey, incidentDate);

    CoverUtilV1.ProductStatus decision = s.getProductStatusOfInternal(coverKey, productKey, incidentDate);
    bool incidentHappened = decision == CoverUtilV1.ProductStatus.IncidentHappened || decision == CoverUtilV1.ProductStatus.Claimable;

    totalStakeInWinningCamp = incidentHappened ? yes : no;
    totalStakeInLosingCamp = incidentHappened ? no : yes;
    myStakeInWinningCamp = incidentHappened ? myYes : myNo;
  }

  /**
   * @dev Returns unstake info of the given account
   * for a cover product's incident.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param account Specify the account to get stakes
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getUnstakeInfoForInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (IUnstakable.UnstakeInfoType memory info) {
    (info.totalStakeInWinningCamp, info.totalStakeInLosingCamp, info.myStakeInWinningCamp) = getResolutionInfoForInternal(s, account, coverKey, productKey, incidentDate);

    info.unstaken = getReportingUnstakenAmountInternal(s, account, coverKey, productKey, incidentDate);
    require(info.myStakeInWinningCamp > 0, "Nothing to unstake");

    uint256 rewardRatio = (info.myStakeInWinningCamp * ProtoUtilV1.MULTIPLIER) / info.totalStakeInWinningCamp;

    uint256 reward = 0;

    // Incident dates are reset when a reporting is finalized.
    // This check ensures only the people who come to unstake
    // before the finalization will receive rewards
    if (s.getActiveIncidentDateInternal(coverKey, productKey) == incidentDate) {
      // slither-disable-next-line divide-before-multiply
      reward = (info.totalStakeInLosingCamp * rewardRatio) / ProtoUtilV1.MULTIPLIER;
    }

    require(getReportingBurnRateInternal(s) + getGovernanceReporterCommissionInternal(s) <= ProtoUtilV1.MULTIPLIER, "Invalid configuration");

    info.toBurn = (reward * getReportingBurnRateInternal(s)) / ProtoUtilV1.MULTIPLIER;
    info.toReporter = (reward * getGovernanceReporterCommissionInternal(s)) / ProtoUtilV1.MULTIPLIER;
    info.myReward = reward - info.toBurn - info.toReporter;
  }

  /**
   * @dev Returns NPM already unstaken by the specified account for a cover incident.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param account Specify the account to get stakes
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getReportingUnstakenAmountInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, productKey, incidentDate, account));
    return s.getUintByKey(k);
  }

  function updateUnstakeDetailsInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 originalStake,
    uint256 reward,
    uint256 burned,
    uint256 reporterFee
  ) external {
    // Unstake timestamp of the account
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, coverKey, productKey, incidentDate, account));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // Last unstake timestamp
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, coverKey, productKey, incidentDate));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // ---------------------------------------------------------------------

    // Amount unstaken by the account
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, productKey, incidentDate, account));
    s.setUintByKey(k, originalStake);

    // Amount unstaken by everyone
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, productKey, incidentDate));
    s.addUintByKey(k, originalStake);

    // ---------------------------------------------------------------------

    if (reward > 0) {
      // Reward received by the account
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, coverKey, productKey, incidentDate, account));
      s.setUintByKey(k, reward);

      // Total reward received
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, coverKey, productKey, incidentDate));
      s.addUintByKey(k, reward);
    }

    // ---------------------------------------------------------------------

    if (burned > 0) {
      // Total burned
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_BURNED, coverKey, productKey, incidentDate));
      s.addUintByKey(k, burned);
    }

    if (reporterFee > 0) {
      // Total fee paid to the final reporter
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REPORTER_FEE, coverKey, productKey, incidentDate));
      s.addUintByKey(k, reporterFee);
    }
  }

  function _updateProductStatusBeforeResolutionInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private {
    require(incidentDate > 0, "Invalid incident date");

    uint256 yes = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));
    uint256 no = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));

    if (no > yes) {
      s.setStatusInternal(coverKey, productKey, incidentDate, CoverUtilV1.ProductStatus.FalseReporting);
      return;
    }

    s.setStatusInternal(coverKey, productKey, incidentDate, CoverUtilV1.ProductStatus.IncidentHappened);
  }

  /**
   * @dev Adds attestation to an incident report
   *
   * @custom:suppress-address-trust-issue The address `who` can be trusted here because we are not treating it like a contract.
   *
   */
  function addAttestationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    mustNotExceedNpmThreshold(stake);

    // Add individual stake of the reporter
    s.addUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, productKey, incidentDate, who), stake);

    // All "incident happened" camp witnesses combined
    uint256 currentStake = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));

    // No has reported yet, this is the first report
    if (currentStake == 0) {
      s.setAddressByKey(_getReporterKey(coverKey, productKey), who);
    }

    s.addUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate), stake);
    _updateProductStatusBeforeResolutionInternal(s, coverKey, productKey, incidentDate);

    s.updateStateAndLiquidityInternal(coverKey);
  }

  /**
   * @dev Returns sum total of NPM staken under `Incident Happened` camp.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param who Specify the account to get attestation info
   * @param incidentDate Enter incident date
   *
   * @param myStake The total NPM amount (under incident happened or yes) you have staken for this trigger incident.
   * @param totalStake The total NPM amount (under incident happened or yes) staken by all tokenholders.
   *
   */
  function getAttestationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, productKey, incidentDate, who));
    totalStake = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));
  }

  /**
   * @dev Adds refutation to an incident report
   *
   * @custom:suppress-address-trust-issue The address `who` can be trusted here because we are not treating it like a contract.
   *
   */
  function addRefutationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    mustNotExceedNpmThreshold(stake);

    s.addUintByKey(_getIndividualFalseReportingStakeKey(coverKey, productKey, incidentDate, who), stake);

    uint256 currentStake = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));

    if (currentStake == 0) {
      // The first reporter who disputed
      s.setAddressByKey(_getDisputerKey(coverKey, productKey), who);
      s.setBoolByKey(getHasDisputeKeyInternal(coverKey, productKey), true);
    }

    s.addUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate), stake);
    _updateProductStatusBeforeResolutionInternal(s, coverKey, productKey, incidentDate);

    s.updateStateAndLiquidityInternal(coverKey);
  }

  /**
   * @dev Hash key of the "has dispute flag" for the specified cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function getHasDisputeKeyInternal(bytes32 coverKey, bytes32 productKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_HAS_A_DISPUTE, coverKey, productKey));
  }

  /**
   * @dev Hash key of the "has finalized flag" for the specified cover product.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getHasFinalizedKeyInternal(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_FINALIZATION, coverKey, productKey, incidentDate));
  }

  /**
   * @dev Returns sum total of NPM staken under `False Reporting` camp.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param who Specify the account to get attestation info
   * @param incidentDate Enter incident date
   *
   * @param myStake The total NPM amount (under false reporting or no) you have staken for this trigger incident.
   * @param totalStake The total NPM amount (under false reporting or no) staken by all tokenholders.
   *
   */
  function getRefutationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualFalseReportingStakeKey(coverKey, productKey, incidentDate, who));
    totalStake = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));
  }

  /**
   * @dev Returns cooldown period. Cooldown period is a defense
   * against [collusion and last-block attacks](https://docs.neptunemutual.com/covers/cover-reporting#collusion-and-last-block-attacks).
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   *
   */
  function getCoolDownPeriodInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 fromKey = s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey);
    uint256 fallbackValue = s.getUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD);

    return fromKey > 0 ? fromKey : fallbackValue;
  }

  /**
   * @dev The date and time prior to which a governance administrator
   * may still initiate a "emergency resolution."
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function getResolutionDeadlineInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, coverKey, productKey);
  }

  function addClaimPayoutsInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 claimed
  ) external {
    s.addUintByKey(_getClaimPayoutsKey(coverKey, productKey, incidentDate), claimed);
  }

  /**
   * @dev Returns the total amount of payouts awarded to claimants for this incident.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getClaimPayoutsInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    return s.getUintByKey(_getClaimPayoutsKey(coverKey, productKey, incidentDate));
  }

  /**
   * @dev Returns the total amount of reassurance granted to vault for this incident.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getReassurancePayoutInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    return s.getUintByKey(_getReassurancePayoutKey(coverKey, productKey, incidentDate));
  }

  function addReassurancePayoutInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 capitalized
  ) external {
    s.addUintByKey(_getReassurancePayoutKey(coverKey, productKey, incidentDate), capitalized);
  }

  /**
   * @dev Returns the remaining reassurance amount that can be transferred
   * to the vault following the claim period but prior to finalisation.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getReassuranceTransferrableInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (uint256) {
    uint256 reassuranceRate = s.getReassuranceRateInternal(coverKey);
    uint256 available = s.getReassuranceAmountInternal(coverKey);
    uint256 reassurancePaid = getReassurancePayoutInternal(s, coverKey, productKey, incidentDate);

    uint256 totalReassurance = available + reassurancePaid;

    uint256 claimsPaid = getClaimPayoutsInternal(s, coverKey, productKey, incidentDate);

    uint256 principal = claimsPaid <= totalReassurance ? claimsPaid : totalReassurance;
    uint256 transferAmount = (principal * reassuranceRate) / ProtoUtilV1.MULTIPLIER;

    return transferAmount - reassurancePaid;
  }

  function mustNotExceedNpmThreshold(uint256 amount) public pure {
    require(amount <= ProtoUtilV1.MAX_NPM_STAKE * 1 ether, "NPM stake is above threshold");
  }
}
