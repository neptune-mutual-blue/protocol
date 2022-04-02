// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

contract ForceEther {
  event Received(address indexed account, uint256 amount);

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  function destruct(address payable to) external {
    selfdestruct(to);
  }
}
