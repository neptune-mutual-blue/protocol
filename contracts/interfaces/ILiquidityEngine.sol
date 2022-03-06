// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./IMember.sol";

pragma solidity 0.8.0;

interface ILiquidityEngine is IMember {
  event StrategyAdded(address indexed strategy);
  event StrategyDisabled(address indexed strategy);

  function addStrategies(address[] memory strategies) external;

  function disableStrategy(address strategy) external;

  function setLendingPeriods(
    bytes32 coverKey,
    uint256 lendingPeriod,
    uint256 withdrawalWindow
  ) external;

  function setLendingPeriodsDefault(uint256 lendingPeriod, uint256 withdrawalWindow) external;

  function getDisabledStrategies() external view returns (address[] memory strategies);

  function getActiveStrategies() external view returns (address[] memory strategies);
}
