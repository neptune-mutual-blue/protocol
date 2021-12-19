// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./Resolvable.sol";
import "../../../interfaces/IResolution.sol";
import "../../../interfaces/IUnstakable.sol";
import "../../../libraries/GovernanceUtilV1.sol";
import "../../../libraries/ValidationLibV1.sol";
import "../../../libraries/NTransferUtilV2.sol";

abstract contract Unstakable is Resolvable, IUnstakable {
  using GovernanceUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;
  using NTransferUtilV2 for IERC20;

  function unstake(bytes32 key, uint256 incidentDate) external override nonReentrant {
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringClaimPeriod(key);
    s.mustNotHaveUnstaken(msg.sender, key, incidentDate);

    address finalReporter = s.getReporter(key, incidentDate);
    address burner = s.getBurnAddress();

    // Set the unstake timestamp info
    s.setUnstakeTimestamp(msg.sender, key, incidentDate);

    (, , uint256 myStakeInWinningCamp, uint256 toBurn, uint256 toReporter, uint256 myReward) = getUnstakeInfoFor(s, msg.sender, key, incidentDate);

    uint256 myStakeWithReward = myReward + myStakeInWinningCamp;

    s.npmToken().ensureTransfer(msg.sender, myStakeWithReward);
    s.npmToken().ensureTransfer(finalReporter, toReporter);
    s.npmToken().ensureTransfer(burner, toBurn);

    emit Unstaken(msg.sender, myStakeInWinningCamp, myReward);
    emit ReporterRewardDistributed(msg.sender, finalReporter, myReward, toReporter);
    emit GovernanceBurned(msg.sender, burner, myReward, toBurn);
  }

  function getUnstakeInfoFor(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  )
    public
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
    return s.getUnstakeInfoFor(account, key, incidentDate);
  }
}
