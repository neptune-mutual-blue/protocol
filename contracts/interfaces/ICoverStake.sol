// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface ICoverStake is IMember {
  function decreaseStake(
    bytes32 key,
    address account,
    uint256 amount
  ) external;

  function increaseStake(
    bytes32 key,
    address account,
    uint256 amount,
    uint256 fees
  ) external;

  function stakeOf(bytes32 key, address account) external view returns (uint256);
}
