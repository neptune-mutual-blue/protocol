// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./Resolvable.sol";
import "../../../interfaces/IResolution.sol";
import "../../../interfaces/IUnstakable.sol";
import "../../../libraries/NTransferUtilV2.sol";

/**
 * @title Unstakable Contract
 * @dev Enables voters to unstake their NPM tokens after
 * resolution is achieved on any cover product.
 */
abstract contract Unstakable is Resolvable, IUnstakable {
  using GovernanceUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using ValidationLibV1 for IStore;

  /**
   * @dev Reporters on the valid camp can unstake their tokens even after finalization.
   * Unlike `unstakeWithClaim`, stakers can unstake but do not receive any reward if they choose to
   * use this function.
   *
   * @custom:warning Warning:
   *
   * You should instead use `unstakeWithClaim` after resolution and before finalization.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   * @custom:suppress-pausable
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param incidentDate Enter the incident date
   */
  function unstake(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    // Incident date is reset (when cover is finalized) and
    // therefore shouldn't be validated otherwise "valid" reporters
    // will never be able to unstake

    // s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.validateUnstakeWithoutClaim(coverKey, productKey, incidentDate);

    (, , uint256 myStakeInWinningCamp) = s.getResolutionInfoForInternal(msg.sender, coverKey, productKey, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetailsInternal(msg.sender, coverKey, productKey, incidentDate, myStakeInWinningCamp, 0, 0, 0);

    s.npmToken().ensureTransfer(msg.sender, myStakeInWinningCamp);
    s.updateStateAndLiquidity(coverKey);

    emit Unstaken(coverKey, productKey, msg.sender, myStakeInWinningCamp, 0);
  }

  /**
   * @dev Reporters on the valid camp can unstake their token with a `claim` to receive
   * back their original stake with a portion of the invalid camp's stake
   * as an additional reward.
   *
   * During each `unstake with claim` processing, the protocol distributes reward to
   * the final reporter and also burns some NPM tokens, as described in the documentation.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   * @custom:suppress-pausable Already checked inside `validateUnstakeWithClaim`
   *
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param incidentDate Enter the incident date
   */
  function unstakeWithClaim(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");
    s.validateUnstakeWithClaim(coverKey, productKey, incidentDate);

    address finalReporter = s.getReporterInternal(coverKey, productKey, incidentDate);
    address burner = s.getBurnAddress();

    UnstakeInfoType memory info = s.getUnstakeInfoForInternal(msg.sender, coverKey, productKey, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetailsInternal(msg.sender, coverKey, productKey, incidentDate, info.myStakeInWinningCamp, info.myReward, info.toBurn, info.toReporter);

    uint256 myStakeWithReward = info.myReward + info.myStakeInWinningCamp;

    s.npmToken().ensureTransfer(msg.sender, myStakeWithReward);

    if (info.toReporter > 0) {
      s.npmToken().ensureTransfer(finalReporter, info.toReporter);
    }

    if (info.toBurn > 0) {
      s.npmToken().ensureTransfer(burner, info.toBurn);
    }

    s.updateStateAndLiquidity(coverKey);

    emit Unstaken(coverKey, productKey, msg.sender, info.myStakeInWinningCamp, info.myReward);
    emit ReporterRewardDistributed(coverKey, productKey, msg.sender, finalReporter, info.myReward, info.toReporter);
    emit GovernanceBurned(coverKey, productKey, msg.sender, burner, info.myReward, info.toBurn);
  }

  /**
   * @dev Gets the unstake information for the supplied account
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param account Enter account to get the unstake information of
   * @param coverKey Enter the cover key
   * @param incidentDate Enter the incident date
   */
  function getUnstakeInfoFor(
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view override returns (UnstakeInfoType memory) {
    return s.getUnstakeInfoForInternal(account, coverKey, productKey, incidentDate);
  }
}
