// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./IMember.sol";

interface IProtocol is IMember {
  function getCoverFee() external returns (uint256);

  function getMinCoverStake() external returns (uint256);

  function getMinLiquidityPeriod() external returns (uint256);

  function vaultDeposit(
    bytes32 contractName,
    bytes32 key,
    IERC20 asset,
    address sender,
    uint256 amount
  ) external;

  function vaultWithdrawal(
    bytes32 contractName,
    bytes32 key,
    IERC20 asset,
    address recipient,
    uint256 amount
  ) external;
}
