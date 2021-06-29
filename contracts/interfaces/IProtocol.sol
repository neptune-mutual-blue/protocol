// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./IMember.sol";

interface IProtocol is IMember {
  // function getCoverFee() external view returns (uint256);
  // function getMinCoverStake() external view returns (uint256);
  // function getMinLiquidityPeriod() external view returns (uint256);
}
