// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IStore.sol";

interface IUnstakable {

/*
   * @param totalStakeInWinningCamp Returns the sum total of the stakes contributed by the winning camp
   * @param totalStakeInLosingCamp Returns the sum total of the stakes contributed by the losing camp
   * @param myStakeInWinningCamp Returns the sum total of the supplied account's stakes in the winning camp
   * @param toBurn Returns the amount of tokens that will be booked as protocol revenue and immediately burned
   * @param toReporter Returns the amount of tokens that will be sent to the final reporter as the `first reporter` reward
   * @param myReward Returns the amount of tokens that the supplied account will receive as `reporting reward`
*/  
struct UnstakeInfoType {
    uint256 totalStakeInWinningCamp;
    uint256 totalStakeInLosingCamp;
    uint256 myStakeInWinningCamp;
    uint256 toBurn;
    uint256 toReporter;
    uint256 myReward;
    uint256 unstaken;
  }

  event Unstaken(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed caller, uint256 originalStake, uint256 reward);
  event ReporterRewardDistributed(bytes32 indexed coverKey, bytes32 indexed productKey, address caller, address indexed reporter, uint256 originalReward, uint256 reporterReward);
  event GovernanceBurned(bytes32 indexed coverKey, bytes32 indexed productKey, address caller, address indexed burner, uint256 originalReward, uint256 burnedAmount);

  function unstake(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external;

  function unstakeWithClaim(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external;

  function getUnstakeInfoFor(
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (UnstakeInfoType memory);
}
