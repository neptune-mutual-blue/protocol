// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../Recoverable.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../interfaces/IWitness.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../../libraries/GovernanceUtilV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/RegistryLibV1.sol";
import "../../interfaces/IVault.sol";

/**
 * @title Witness Contract
 *
 * @dev The witeness contract enables NPM tokenholders to
 * participate in an active cover incident.
 *
 * <br /><br />
 *
 * The participants can choose to support an incident by `attesting`
 * or they can also disagree by `refuting` the incident. In both cases,
 * the tokenholders can choose to submit any amount of
 * NEP stake during the (7 day, configurable) reporting period.
 *
 * <br /><br />
 *
 * After the reporting period, whichever side loses, loses all their tokens.
 * While each `witness` and `reporter` on the winning side will proportionately
 * receive a portion of these tokens as a reward, some forfeited tokens are
 * burned too.
 *
 * <br /><br />
 *
 * **Warning:**
 *
 * <br /> <br />
 *
 * Please carefully check the cover rules, cover exclusions, and standard exclusion
 * in detail before you interact with the Governace contract(s). You entire stake will be forfeited
 * if resolution does not go in your favor. You will be able to unstake
 * and receive back your NPM only if:
 *
 * - incident resolution is in your favor
 * - after reporting period ends
 *
 * <br /> <br />
 *
 * **By using this contract directly via a smart contract call,
 * through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
 * you are completely aware, fully understand, and accept the risk that you may lose all of
 * your stake.**
 *
 */
abstract contract Witness is Recoverable, IWitness {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using GovernanceUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Support the reported incident by staking your NPM token.
   * Your tokens will be frozen until the incident is fully resolved.
   *
   * <br /> <br />
   *
   * Ensure that you not only thoroughly comprehend the terms, exclusion, standard exclusion, etc of the policy,
   * but that you also have all the necessary proof to verify that the requirement has been met.
   *
   * @custom:warning **Warning:**
   *
   * Although you may believe that the incident did actually occur, you may still be wrong.
   * Even when you are right, the governance participants could outcast you.
   *
   *
   * By using this function directly via a smart contract call,
   * through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
   * you are completely aware, fully understand, and accept the risk that you may lose all of
   * your stake.
   *
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   *
   * @param coverKey Enter the key of the active cover
   * @param incidentDate Enter the active cover's date of incident
   * @param stake Enter the amount of NPM tokens you wish to stake.
   * Note that you cannot unstake this amount if the decision was not in your favor.
   */
  function attest(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeReportingOrDisputed(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey, productKey);

    require(stake > 0, "Enter a stake");

    s.addAttestationInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Attested(coverKey, productKey, msg.sender, incidentDate, stake);
  }

  /**
   * @dev Reject the reported incident by staking your NPM token.
   * Your tokens will be frozen until the incident is fully resolved.
   *
   * <br /> <br />
   *
   * Ensure that you not only thoroughly comprehend the terms, exclusion, standard exclusion, etc of the policy,
   * but that you also have all the necessary proof to verify that the requirement has NOT been met.
   *
   * @custom:warning **Warning:**
   *
   * Although you may believe that the incident did not occur, you may still be wrong.
   * Even when you are right, the governance participants could outcast you.
   *
   *
   * By using this function directly via a smart contract call,
   * through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
   * you are completely aware, fully understand, and accept the risk that you may lose all of
   * your stake.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   *
   * @param coverKey Enter the key of the active cover
   * @param incidentDate Enter the active cover's date of incident
   * @param stake Enter the amount of NPM tokens you wish to stake.
   * Note that you cannot unstake this amount if the decision was not in your favor.
   */
  function refute(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustHaveDispute(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey, productKey);

    require(stake > 0, "Enter a stake");

    s.addRefutationInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Refuted(coverKey, productKey, msg.sender, incidentDate, stake);
  }

  /**
   * @dev Gets the status of a given cover
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter the key of the cover you'd like to check the status of
   * @return Returns the cover status as an integer.
   * For more, check the enum `ProductStatus` on `CoverUtilV1` library.
   *
   */
  function getStatus(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return uint256(s.getProductStatusInternal(coverKey, productKey));
  }

  /**
   * @dev Gets the stakes of each side of a given cover governance pool
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter the key of the cover you'd like to check the stakes of
   * @param incidentDate Enter the active cover's date of incident
   * @return Returns an array of integers --> [yes, no]
   *
   */
  function getStakes(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view override returns (uint256, uint256) {
    return s.getStakesInternal(coverKey, productKey, incidentDate);
  }

  /**
   * @dev Gets the stakes of each side of a given cover governance pool for the specified account.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter the key of the cover you'd like to check the stakes of
   * @param incidentDate Enter the active cover's date of incident
   * @param account Enter the account you'd like to get the stakes of
   * @return Returns an array of integers --> [yes, no]
   *
   */
  function getStakesOf(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) external view override returns (uint256, uint256) {
    return s.getStakesOfInternal(account, coverKey, productKey, incidentDate);
  }
}
