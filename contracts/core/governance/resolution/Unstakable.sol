// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./Resolvable.sol";
import "../../../interfaces/IResolution.sol";
import "../../../interfaces/IUnstakable.sol";
import "../../../libraries/GovernanceUtilV1.sol";
import "../../../libraries/ValidationLibV1.sol";
import "../../../libraries/NTransferUtilV2.sol";

/**
 * @title Neptune Mutual Governance: Unstakable Contract
 * @dev Enables tokenholders unstake their tokens after
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
   * @dev Reporters on the winning camp can unstake their tokens even after the claim period is over.
   * Warning: during claim periods, you must use `unstakeWithClaim` instead of this to also receive reward.
   * @param key Enter the cover key
   * @param incidentDate Enter the incident date
   */
  function unstake(bytes32 key, uint256 incidentDate) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    // @suppress-pausable Already checked inside `validateUnstakeAfterClaimPeriod`
    s.validateUnstakeAfterClaimPeriod(key, incidentDate);

    (, , uint256 myStakeInWinningCamp) = s.getResolutionInfoFor(msg.sender, key, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetails(msg.sender, key, incidentDate, myStakeInWinningCamp, 0, 0, 0);

    s.npmToken().ensureTransfer(msg.sender, myStakeInWinningCamp);
    s.updateStateAndLiquidity(key);

    emit Unstaken(msg.sender, myStakeInWinningCamp, 0);
  }

  /**
   * @dev Reporters on the winning camp can unstake their token with a `claim` to receive
   * back their original stake with a certain portion of the losing camp's stake
   * as an additional reward.
   *
   * During each `unstake with claim` processing, the protocol distributes reward to
   * the final reporter and also burns some NPM tokens, as described in the documentation.
   * @param key Enter the cover key
   * @param incidentDate Enter the incident date
   */
  function unstakeWithClaim(bytes32 key, uint256 incidentDate) external nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    // @suppress-pausable Already checked inside `validateUnstakeWithClaim`
    s.validateUnstakeWithClaim(key, incidentDate);

    address finalReporter = s.getReporter(key, incidentDate);
    address burner = s.getBurnAddress();

    (, , uint256 myStakeInWinningCamp, uint256 toBurn, uint256 toReporter, uint256 myReward) = s.getUnstakeInfoForInternal(msg.sender, key, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetails(msg.sender, key, incidentDate, myStakeInWinningCamp, myReward, toBurn, toReporter);

    uint256 myStakeWithReward = myReward + myStakeInWinningCamp;

    s.npmToken().ensureTransfer(msg.sender, myStakeWithReward);
    s.npmToken().ensureTransfer(finalReporter, toReporter);
    s.npmToken().ensureTransfer(burner, toBurn);

    s.updateStateAndLiquidity(key);

    emit Unstaken(msg.sender, myStakeInWinningCamp, myReward);
    emit ReporterRewardDistributed(msg.sender, finalReporter, myReward, toReporter);
    emit GovernanceBurned(msg.sender, burner, myReward, toBurn);
  }

  /**
   * @dev s Gets the unstake information for the supplied account
   * @param account Enter account to get the unstake information of
   * @param key Enter the cover key
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
    bytes32 key,
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
      uint256 myReward
    )
  {
    return s.getUnstakeInfoForInternal(account, key, incidentDate);
  }
}
