// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./IMember.sol";

interface IProtocol is IMember {
  function depositToVault(
    bytes32 contractName,
    bytes32 key,
    IERC20 asset,
    address sender,
    uint256 amount
  ) external;

  function withdrawFromVault(
    bytes32 contractName,
    bytes32 key,
    IERC20 asset,
    address recipient,
    uint256 amount
  ) external;

  function getCoverFee() external view returns (uint256);

  function getMinCoverStake() external view returns (uint256);

  function getMinLiquidityPeriod() external view returns (uint256);
}
