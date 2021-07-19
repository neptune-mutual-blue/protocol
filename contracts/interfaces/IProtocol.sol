// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./IMember.sol";

interface IProtocol is IMember {
  event ContractAdded(bytes32 namespace, address contractAddress);
  event ContractUpgraded(bytes32 namespace, address indexed previous, address indexed current);
  event MemberAdded(address member);
  event MemberRemoved(address member);
  event CoverFeeSet(uint256 previous, uint256 current);
  event MinStakeSet(uint256 previous, uint256 current);
  event MinReportingStakeSet(uint256 previous, uint256 current);
  event MinLiquidityPeriodSet(uint256 previous, uint256 current);
  event ClaimPeriodSet(uint256 previous, uint256 current);

  function addContract(bytes32 namespace, address contractAddress) external;

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external;

  function addMember(address member) external;

  function removeMember(address member) external;
}
