// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

abstract contract WithRecovery is Ownable {
  using SafeERC20 for IERC20;

  /**
   * @dev Recover all Ether held by the contract.
   */
  function recoverEther(address sendTo) external onlyOwner {
    // slither-disable-next-line arbitrary-send
    payable(sendTo).transfer(address(this).balance);
  }

  /**
   * @dev Recover an ERC-20 compatible token sent to this contract.
   * @param malicious ERC-20 The address of the token contract
   * @param sendTo The address that receives the recovered tokens
   */
  function recoverToken(IERC20 malicious, address sendTo) external onlyOwner {
    malicious.safeTransfer(sendTo, malicious.balanceOf(address(this)));
  }
}
