// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

abstract contract WithRecovery is Ownable {
  using SafeERC20 for IERC20;

  /**
   * @dev Recover all Ether held by the contract.
   *
   * @custom:suppress-pausable Risk tolerable because of the ACL
   *
   */
  function recoverEther(address sendTo) external onlyOwner {
    // slither-disable-next-line low-level-calls
    (bool success, ) = payable(sendTo).call{value: address(this).balance}(""); // solhint-disable-line avoid-low-level-calls
    require(success, "Recipient may have reverted");
  }

  /**
   * @dev Recover an ERC-20 compatible token sent to this contract.
   * @param malicious ERC-20 The address of the token contract
   * @param sendTo The address that receives the recovered tokens
   *
   * @custom:suppress-pausable Risk tolerable because of the ACL
   *
   */
  function recoverToken(IERC20 malicious, address sendTo) external onlyOwner {
    malicious.safeTransfer(sendTo, malicious.balanceOf(address(this)));
  }
}
