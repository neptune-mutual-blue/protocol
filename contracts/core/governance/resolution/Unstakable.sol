// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./Resolvable.sol";
import "../../../interfaces/IResolution.sol";
import "../../../interfaces/IUnstakable.sol";
import "../../../libraries/GovernanceUtilV1.sol";
import "../../../libraries/ValidationLibV1.sol";
import "../../../libraries/NTransferUtilV2.sol";

/**
 * @title Unstakable Contract
 * @dev Enables voters to unstake their NPM tokens after
 * resolution is achieved on any cover product.
 */
abstract contract Unstakable is Resolvable, IUnstakable {
  using GovernanceUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using ValidationLibV1 for bytes32;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Reporters on the valid camp can unstake their tokens even after the claim period is over.
   * Unlike `unstakeWithClaim`, stakers can unstake but do not receive any reward if they choose to
   * use this function.
   *
   * @custom:warning Warning:
   *
   * You should instead use `unstakeWithClaim` throughout the claim period.
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

    (, , uint256 myStakeInWinningCamp, uint256 toBurn, uint256 toReporter, uint256 myReward, ) = s.getUnstakeInfoForInternal(msg.sender, coverKey, productKey, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetailsInternal(msg.sender, coverKey, productKey, incidentDate, myStakeInWinningCamp, myReward, toBurn, toReporter);

    uint256 myStakeWithReward = myReward + myStakeInWinningCamp;

    s.npmToken().ensureTransfer(msg.sender, myStakeWithReward);

    if (toReporter > 0) {
      s.npmToken().ensureTransfer(finalReporter, toReporter);
    }

    if (toBurn > 0) {
      s.npmToken().ensureTransfer(burner, toBurn);
    }

    s.updateStateAndLiquidity(coverKey);

    emit Unstaken(coverKey, productKey, msg.sender, myStakeInWinningCamp, myReward);
    emit ReporterRewardDistributed(coverKey, productKey, msg.sender, finalReporter, myReward, toReporter);
    emit GovernanceBurned(coverKey, productKey, msg.sender, burner, myReward, toBurn);
  }

  /**
   * @dev Gets the unstake information for the supplied account
   *
   * @param account Enter account to get the unstake information of
   * @param coverKey Enter the cover key
   * @param incidentDate Enter the incident date
   * @param totalStakeInWinningCamp Returns the sum total of the stakes contributed by the winning camp
   * @param totalStakeInLosingCamp Returns the sum total of the stakes contributed by the losing camp
   * @param myStakeInWinningCamp Returns the sum total of the supplied account's stakes in the winning camp
   * @param toBurn Returns the amount of tokens that will be booked as protocol revenue and immediately burned
   * @param toReporter Returns the amount of tokens that will be sent to the final reporter as the `first reporter` reward
   * @param myReward Returns the amount of tokens that the supplied account will receive as `reporting reward`
   */
  function getUnstakeInfoFor(
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  )
    external
    view
    override
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
    return s.getUnstakeInfoForInternal(account, coverKey, productKey, incidentDate);
  }
}
