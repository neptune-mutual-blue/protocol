// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";

abstract contract Recoverable is Ownable, ReentrancyGuard, Pausable {
  /**
   * @dev Recover all Ether held by the contract to the owner.
   */
  function recoverEther() external onlyOwner {
    // slither-disable-next-line arbitrary-send
    payable(super.owner()).transfer(address(this).balance);
  }

  /**
   * @dev Recover all BEP-20 compatible tokens sent to this address.
   * @param token BEP-20 The address of the token contract
   */
  function recoverToken(address token) external onlyOwner {
    IERC20 bep20 = IERC20(token);

    uint256 balance = bep20.balanceOf(address(this));
    require(bep20.transfer(super.owner(), balance), "Transfer failed");
  }

  function pause() external onlyOwner whenNotPaused {
    super._pause();
  }

  function unpause() external onlyOwner whenPaused {
    super._unpause();
  }
}
