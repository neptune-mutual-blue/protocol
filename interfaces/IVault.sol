// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./IMember.sol";

interface IVault is IMember {
  function transferOut(
    IERC20 token,
    address recipient,
    uint256 amount
  ) external;
}
