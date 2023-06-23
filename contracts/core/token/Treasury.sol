// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {IERC20} from "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import {WithRecovery} from "./WithRecovery.sol";
import {WithPausability} from "./WithPausability.sol";
import {SafeERC20} from "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";

contract Treasury is WithPausability, WithRecovery {
  using SafeERC20 for IERC20;

  constructor(address timelockOrOwner) {
    require(timelockOrOwner != address(0), "Invalid owner");
    super._transferOwnership(timelockOrOwner);
  }

  function transferMany(IERC20 token, address[] calldata receivers, uint256[] calldata amounts) external onlyOwner whenNotPaused {
    require(receivers.length > 0, "No receiver");
    require(receivers.length == amounts.length, "Invalid args");
    require(token.balanceOf(address(this)) >= _sumOf(amounts), "Insufficient Balance");

    for (uint256 i = 0; i < receivers.length; i++) {
      token.safeTransfer(receivers[i], amounts[i]);
    }
  }

  function _sumOf(uint256[] calldata amounts) private pure returns (uint256 total) {
    for (uint256 i = 0; i < amounts.length; i++) {
      total += amounts[i];
    }
  }
}
