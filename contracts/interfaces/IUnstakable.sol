// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IStore.sol";

interface IUnstakable {
  event Unstaken(address indexed caller, uint256 originalStake, uint256 reward);
  event ReporterRewardDistributed(address indexed caller, address indexed reporter, uint256 originalReward, uint256 reporterReward);
  event GovernanceBurned(address indexed caller, address indexed burner, uint256 originalReward, uint256 burnedAmount);

  function unstake(bytes32 key, uint256 incidentDate) external;

  function getUnstakeInfoFor(
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
      uint256 myReward
    );
}
