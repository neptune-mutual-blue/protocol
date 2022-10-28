// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/access/IAccessControl.sol";
import "./IMember.sol";

interface IProtocol is IMember, IAccessControl {
  struct AccountWithRoles {
    address account;
    bytes32[] roles;
  }

  struct InitializeArgs {
    address burner;
    address uniswapV2RouterLike;
    address uniswapV2FactoryLike;
    address npm;
    address treasury;
    address priceOracle;
    uint256 coverCreationFee;
    uint256 minCoverCreationStake;
    uint256 minStakeToAddLiquidity;
    uint256 firstReportingStake;
    uint256 claimPeriod;
    uint256 reportingBurnRate;
    uint256 governanceReporterCommission;
    uint256 claimPlatformFee;
    uint256 claimReporterCommission;
    uint256 flashLoanFee;
    uint256 flashLoanFeeProtocol;
    uint256 resolutionCoolDownPeriod;
    uint256 stateUpdateInterval;
    uint256 maxLendingRatio;
  }

  event Initialized(InitializeArgs args);
  event ContractAdded(bytes32 indexed namespace, bytes32 indexed key, address indexed contractAddress);
  event ContractUpgraded(bytes32 indexed namespace, bytes32 indexed key, address previous, address indexed current);
  event MemberAdded(address member);
  event MemberRemoved(address member);

  function addContract(bytes32 namespace, address contractAddress) external;

  function addContracts(
    bytes32[] calldata namespaces,
    bytes32[] calldata keys,
    address[] calldata contractAddresses
  ) external;

  function addContractWithKey(
    bytes32 namespace,
    bytes32 coverKey,
    address contractAddress
  ) external;

  function initialize(InitializeArgs calldata args) external;

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external;

  function upgradeContractWithKey(
    bytes32 namespace,
    bytes32 coverKey,
    address previous,
    address current
  ) external;

  function addMember(address member) external;

  function removeMember(address member) external;

  function grantRoles(AccountWithRoles[] calldata detail) external;
}
