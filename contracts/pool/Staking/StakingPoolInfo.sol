// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./StakingPoolReward.sol";

abstract contract StakingPoolInfo is StakingPoolReward {
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) StakingPoolReward(s) {} //solhint-disable-line

  /**
   * @dev Gets the info of a given staking pool by key
   * @param key Provide the staking pool key to fetch info for
   * @param you Specify the address to customize the info for
   *
   */
  function getInfo(bytes32 key, address you) external view override returns (StakingPoolInfoType memory) {
    return s.getInfoInternal(key, you);
  }
}
