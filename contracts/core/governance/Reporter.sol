// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/IReporter.sol";
import "./Witness.sol";

/**
 * @title Reporter Contract
 * @dev This contract enables any NPM tokenholder to
 * report an incident or dispute a reported incident.
 *
 * The reporters can submit incidents and/or dispute them as well.
 * When a cover pool is reporting, other tokenholders can also join
 * the reporters to achieve a resolution.
 *
 * The reporter who first submits an incident is known as `First Reporter` whereas
 * the reporter who disputes the reported incident is called `Candidate Reporter`.
 *
 * Valid reporter is the reporter getting resolution in their favor.
 */
abstract contract Reporter is IReporter, Witness {
  using GovernanceUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Stake a specified minimum NPM tokens to submit an incident.
   * Check out the function `getFirstReportingStake(coverKey)` to
   * check the minimum amount needed to report this cover.
   *
   * https://docs.neptunemutual.com/covers/cover-reporting
   *
   * ## Rewards:
   *
   * If you get resolution in your favor, you will receive these rewards:
   *
   * - A 10% commission on all reward received by valid camp voters (check `Unstakeable.unstakeWithClaim`) in NPM tokens.
   * - A 5% commission on the protocol earnings of all claim payouts in stablecoin.
   * - Your proportional share of the 60% pool of the invalid camp.
   *
   * ## Incident Date and Payouts
   *
   * Please note the differences between the following:
   *
   * **Observed Date**
   * The date an time when incident occurred in the real world.
   *
   * **Incident Date**
   * Instead of observed date or the real date and time of the trigger incident,
   * the timestamp when this report is submitted is "the incident date".
   *
   * Payouts to policyholders is given only if the reported incident date
   * falls within the coverage period.
   *
   *
   * ## Warning
   *
   * Please carefully check the cover rules, cover exclusions, and standard exclusion
   * in detail before you submit this report. You entire stake will be forfeited
   * if resolution does not go in your favor. You will be able to unstake
   * and receive back your NPM only if:
   *
   * - incident resolution is in your favor
   * - after reporting period ends
   *
   * **By using this function directly via a smart contract call,
   * through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
   * you are completely aware, fully understand, and accept the risk that you may lose all of
   * your stake.**
   *
   * @param coverKey Enter the cover key you are reporting
   * @param productKey Enter the product key you are reporting
   * @param info Enter IPFS hash of the incident in the following format:
   * `{
   *    incidentTitle: 'Animated Brands Exploit, August 2024',
   *    observed: 1723484937,
   *    proofOfIncident: 'https://twitter.com/AnimatedBrand/status/5739383124571205635',
   *    description: 'In a recent exploit, attackers were able to drain 50M USDC from Animated Brands lending vaults',
   *  }`
   * @param stake Enter the amount you would like to stake to submit this report
   */
  function report(
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    s.mustHaveNormalProductStatus(coverKey, productKey);

    uint256 incidentDate = block.timestamp; // solhint-disable-line
    require(stake > 0, "Stake insufficient");
    require(stake >= s.getMinReportingStakeInternal(coverKey), "Stake insufficient");

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, productKey, incidentDate);

    // Set the Resolution Timestamp
    uint256 resolutionDate = block.timestamp + s.getReportingPeriodInternal(coverKey); // solhint-disable-line
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey, productKey, resolutionDate);

    // Update the values
    s.addAttestationInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    // Transfer the stake to the resolution contract
    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Reported(coverKey, productKey, msg.sender, incidentDate, info, stake, resolutionDate);
    emit Attested(coverKey, productKey, msg.sender, incidentDate, stake);
  }

  /**
   * @dev If you believe that a reported incident is wrong, you can stake a specified
   * minimum NPM tokens to refute an active incident.
   *
   * Check out the function `getFirstReportingStake(coverKey)` to
   * check the minimum amount needed to dispute this cover.
   *
   * **Rewards:**
   *
   * If you get resolution in your favor, you will receive these rewards:
   *
   * - A 10% commission on all reward received by valid camp voters (check `Unstakeable.unstakeWithClaim`) in NPM tokens.
   * - Your proportional share of the 60% pool of the invalid camp.
   *
   * **Warning:**
   *
   * Please carefully check the coverage rules and exclusions in detail
   * before you submit this report. You entire stake will be forfeited
   * if resolution does not go in your favor. You will be able to unstake
   * and receive back your NPM only if:
   *
   *
   * By using this function directly via a smart contract call,
   * through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
   * you are completely aware, fully understand, and accept the risk that you may lose all of
   * your stake.
   *
   * - incident resolution is in your favor
   * - after reporting period ends
   *
   * @param coverKey Enter the cover key you are reporting
   * @param productKey Enter the product key you are reporting
   * @param info Enter IPFS hash of the incident in the following format:
   * `{
   *    incidentTitle: 'Wrong Incident Reporting',
   *    observed: 1723484937,
   *    proofOfIncident: 'https://twitter.com/AnimatedBrand/status/5739383124571205635',
   *    description: 'Animated Brands emphasised in its most recent tweet that the report regarding their purported hack was false.',
   *  }`
   * @param stake Enter the amount you would like to stake to submit this dispute
   */
  function dispute(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustNotHaveDispute(coverKey, productKey);
    s.mustBeReporting(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey, productKey);

    require(stake > 0, "Stake insufficient");
    require(stake >= s.getMinReportingStakeInternal(coverKey), "Stake insufficient");

    s.addRefutationInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    // Transfer the stake to the resolution contract
    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Disputed(coverKey, productKey, msg.sender, incidentDate, info, stake);
    emit Refuted(coverKey, productKey, msg.sender, incidentDate, stake);
  }

  /**
   * @dev Allows a cover manager set first reporting (minimum) stake of a given cover.
   *
   * @param coverKey Provide a coverKey or leave it empty. If empty, the stake is set as
   * fallback value. Covers that do not have customized first reporting stake will infer to the fallback value.
   * @param value Enter the first reporting stake in NPM units
   */
  function setFirstReportingStake(bytes32 coverKey, uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    require(value > 0, "Please specify value");

    uint256 previous = getFirstReportingStake(coverKey);

    if (coverKey > 0) {
      s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey, value);
    } else {
      s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, value);
    }

    emit FirstReportingStakeSet(coverKey, previous, value);
  }

  /**
   * @dev Returns the minimum amount of NPM tokens required to `report` or `dispute`
   * a cover.
   * @param coverKey Specify the cover you want to get the minimum stake required value of.
   */
  function getFirstReportingStake(bytes32 coverKey) public view override returns (uint256) {
    return s.getMinReportingStakeInternal(coverKey);
  }

  /**
   * @dev Allows a cover manager set burn rate of the NPM tokens of the invalid camp.
   * The protocol forfeits all stakes of invalid camp voters. During `unstakeWithClaim`,
   * NPM tokens get proportionately burned as configured here.
   *
   * The unclaimed and thus unburned NPM stakes will be manually pulled and burned on a periodic but not-so-frequent basis.
   *
   * @param value Enter the burn rate in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   */
  function setReportingBurnRate(uint256 value) external override nonReentrant {
    require(value > 0, "Please specify value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE, value);

    emit ReportingBurnRateSet(previous, value);
  }

  /**
   * @dev Allows a cover manager set reporter comission of the NPM tokens from the invalid camp.
   * The protocol forfeits all stakes of invalid camp voters. During `unstakeWithClaim`,
   * NPM tokens get proportionately transferred to the **valid reporter** as configured here.
   *
   * The unclaimed and thus unrewarded NPM stakes will be manually pulled and burned on a periodic but not-so-frequent basis.
   *
   * @param value Enter the valid reporter comission in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   */
  function setReporterCommission(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    require(value > 0, "Please specify value");

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION, value);

    emit ReporterCommissionSet(previous, value);
  }

  /**
   * @dev Gets the latest incident date of a given cover and product
   * @param coverKey Enter the cover key you want to get the incident of
   * @param productKey Enter the product key you want to get the incident of
   */
  function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getActiveIncidentDateInternal(coverKey, productKey);
  }

  /**
   * @dev Gets the reporter of a cover by its incident date
   *
   * Please note that until resolution deadline is over, the returned
   * reporter might keep changing.
   *
   * @param coverKey Enter the cover key you would like to get the reporter of
   * @param productKey Enter the product key you would like to get the reporter of
   * @param productKey Enter the cover's incident date you would like to get the reporter of
   */
  function getReporter(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view override returns (address) {
    return s.getReporterInternal(coverKey, productKey, incidentDate);
  }

  /**
   * @dev Retuns the resolution date of a given cover
   * @param coverKey Enter the cover key to get the resolution date of
   * @param productKey Enter the product key to get the resolution date of
   */
  function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getResolutionTimestampInternal(coverKey, productKey);
  }

  /**
   * @dev Gets an account's attestation details. Please also check `getRefutation` since an account
   * is not restricted to submit both `attestations` and `refutations`.
   *
   * @param coverKey Enter the cover key you want to get attestation of
   * @param productKey Enter the product key you want to get attestation of
   * @param who Enter the account you want to get attestation of
   * @param who Enter the specified cover's indicent date for which attestation will be returned
   */
  function getAttestation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view override returns (uint256 myStake, uint256 totalStake) {
    return s.getAttestationInternal(coverKey, productKey, who, incidentDate);
  }

  /**
   * @dev Gets an account's refutation details. Please also check `getAttestation` since an account
   * is not restricted to submit both `attestations` and `refutations`.
   *
   * @param coverKey Enter the cover key you want to get refutation of
   * @param productKey Enter the product key you want to get refutation of
   * @param who Enter the account you want to get refutation of
   * @param who Enter the specified cover's indicent date for which refutation will be returned
   */
  function getRefutation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view override returns (uint256 myStake, uint256 totalStake) {
    return s.getRefutationInternal(coverKey, productKey, who, incidentDate);
  }
}
