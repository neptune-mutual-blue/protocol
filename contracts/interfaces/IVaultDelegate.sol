// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";

interface IVaultDelegate is IMember {
  function preAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake
  ) external returns (uint256 podsToMint, uint256 previousNPMStake);

  function postAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake
  ) external;

  function accrueInterestImplementation(address caller, bytes32 coverKey) external;

  function preRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bool exit
  ) external returns (address stablecoin, uint256 stableCoinToRelease);

  function postRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bool exit
  ) external;

  function preTransferGovernance(
    address caller,
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external returns (address stablecoin);

  function postTransferGovernance(
    address caller,
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external;

  function preTransferToStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;

  function postTransferToStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;

  function preReceiveFromStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;

  function postReceiveFromStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external returns (uint256 income, uint256 loss);

  function preFlashLoan(
    address caller,
    bytes32 coverKey,
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  )
    external
    returns (
      IERC20 stablecoin,
      uint256 fee,
      uint256 protocolFee
    );

  function postFlashLoan(
    address caller,
    bytes32 coverKey,
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  ) external;

  function calculatePodsImplementation(bytes32 coverKey, uint256 forStablecoinUnits) external view returns (uint256);

  function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view returns (uint256);

  function getInfoImplementation(bytes32 coverKey, address forAccount) external view returns (uint256[] memory result);

  function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view returns (uint256);

  function getFlashFee(
    address caller,
    bytes32 coverKey,
    address token,
    uint256 amount
  ) external view returns (uint256);

  function getMaxFlashLoan(
    address caller,
    bytes32 coverKey,
    address token
  ) external view returns (uint256);
}
