// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface ICoverLiquidity is IMember {
  function addLiquidity(
    bytes32 key,
    address account,
    uint256 amount
  ) external;

  function removeLiquidity(
    bytes32 key,
    address account,
    uint256 amount
  ) external;

  function liquidityOf(bytes32 key, address account) external view returns (uint256);
}
