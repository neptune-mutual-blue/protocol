// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface IVault is IMember {
  function addLiquidityInternal(
    bytes32 key,
    address account,
    uint256 amount
  ) external;

  function addLiquidity(bytes32 coverKey, uint256 amount) external;

  function removeLiquidity(bytes32 coverKey, uint256 amount) external;
}
