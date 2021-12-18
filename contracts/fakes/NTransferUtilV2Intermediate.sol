// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../libraries/NTransferUtilV2.sol";

contract NTransferUtilV2Intermediate {
  using NTransferUtilV2 for IERC20;

  function iTransfer(
    IERC20 token,
    address recipient,
    uint256 amount
  ) external {
    token.ensureTransfer(recipient, amount);
  }

  function iTransferFrom(
    IERC20 token,
    address sender,
    address recipient,
    uint256 amount
  ) external {
    token.ensureTransferFrom(sender, recipient, amount);
  }
}
