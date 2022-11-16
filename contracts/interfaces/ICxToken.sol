// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.0;

interface ICxToken is IERC20 {
  event CoverageStartSet(uint256 policyId, bytes32 coverKey, bytes32 productKey, address account, uint256 effectiveFrom, uint256 amount);

  function mint(
    uint256 policyId,
    bytes32 coverKey,
    bytes32 productKey,
    address to,
    uint256 amount
  ) external;

  function burn(uint256 amount) external;

  function createdOn() external view returns (uint256);

  function expiresOn() external view returns (uint256);

  // slither-disable-next-line naming-convention
  function COVER_KEY() external view returns (bytes32); // solhint-disable

  // slither-disable-next-line naming-convention
  function PRODUCT_KEY() external view returns (bytes32); // solhint-disable

  function getCoverageStartsFrom(address account, uint256 date) external view returns (uint256);

  function getClaimablePolicyOf(address account) external view returns (uint256);
}
