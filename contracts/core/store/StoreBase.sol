// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

abstract contract StoreBase is IStore, Pausable, Ownable {
  mapping(bytes32 => int256) public intStorage;
  mapping(bytes32 => uint256) public uintStorage;
  mapping(bytes32 => uint256[]) public uintsStorage;
  mapping(bytes32 => address) public addressStorage;
  mapping(bytes32 => string) public stringStorage;
  mapping(bytes32 => bytes) public bytesStorage;
  mapping(bytes32 => bytes32) public bytes32Storage;
  mapping(bytes32 => bool) public boolStorage;

  bytes32 private constant _NS_MEMBERS = "proto:members";

  constructor() {
    boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, msg.sender))] = true;
    boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, address(this)))] = true;
  }

  /**
   * @dev Recover all Ether held by the contract.
   */
  function recoverEther(address sendTo) external onlyOwner {
    // slither-disable-next-line arbitrary-send
    payable(sendTo).transfer(address(this).balance);
  }

  /**
   * @dev Recover all BEP-20 compatible tokens sent to this address.
   * @param token BEP-20 The address of the token contract
   */
  function recoverToken(address token, address sendTo) external onlyOwner {
    IERC20 bep20 = IERC20(token);

    uint256 balance = bep20.balanceOf(address(this));
    require(bep20.transfer(sendTo, balance), "Transfer failed");
  }

  function pause() external onlyOwner {
    super._pause();
  }

  function unpause() external onlyOwner {
    super._unpause();
  }

  function isProtocolMember(address contractAddress) public view returns (bool) {
    return boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, contractAddress))];
  }

  function _throwIfPaused() internal view {
    require(!super.paused(), "Pausable: paused");
  }

  function _throwIfSenderNotProtocol() internal view {
    require(isProtocolMember(super._msgSender()), "Forbidden");
  }
}
