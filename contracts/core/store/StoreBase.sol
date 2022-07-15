// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract StoreBase is IStore, Pausable, Ownable {
  using SafeERC20 for IERC20;

  mapping(bytes32 => int256) public intStorage;
  mapping(bytes32 => uint256) public uintStorage;
  mapping(bytes32 => uint256[]) public uintsStorage;
  mapping(bytes32 => address) public addressStorage;
  mapping(bytes32 => mapping(address => bool)) public addressBooleanStorage;
  mapping(bytes32 => string) public stringStorage;
  mapping(bytes32 => bytes) public bytesStorage;
  mapping(bytes32 => bytes32) public bytes32Storage;
  mapping(bytes32 => bool) public boolStorage;
  mapping(bytes32 => address[]) public addressArrayStorage;
  mapping(bytes32 => mapping(address => uint256)) public addressArrayPositionMap;
  mapping(bytes32 => bytes32[]) public bytes32ArrayStorage;
  mapping(bytes32 => mapping(bytes32 => uint256)) public bytes32ArrayPositionMap;

  bytes32 private constant _NS_MEMBERS = "ns:members";

  constructor() {
    boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, msg.sender))] = true;
    boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, address(this)))] = true;
  }

  /**
   * @dev Recover all Ether held by the contract.
   * @custom:suppress-reentrancy Risk tolerable. Can only be called by the owner.
   * @custom:suppress-pausable Risk tolerable. Can only be called by the owner.
   */
  function recoverEther(address sendTo) external onlyOwner {
    // slither-disable-next-line arbitrary-send
    payable(sendTo).transfer(address(this).balance);
  }

  /**
   * @dev Recover all IERC-20 compatible tokens sent to this address.
   *
   * @custom:suppress-reentrancy Risk tolerable. Can only be called by the owner.
   * @custom:suppress-pausable Risk tolerable. Can only be called by the owner.
   * @custom:suppress-malicious-erc Risk tolerable. Although the token can't be trusted, the owner has to check the token code manually.
   * @custom:suppress-address-trust-issue Risk tolerable. Although the token can't be trusted, the owner has to check the token code manually.
   *
   * @param token IERC-20 The address of the token contract
   */
  function recoverToken(address token, address sendTo) external onlyOwner {
    IERC20 erc20 = IERC20(token);

    uint256 balance = erc20.balanceOf(address(this));

    if (balance > 0) {
      // slither-disable-next-line unchecked-transfer
      erc20.safeTransfer(sendTo, balance);
    }
  }

  /**
   * @dev Pauses the store
   *
   * @custom:suppress-reentrancy Risk tolerable. Can only be called by the owner.
   *
   */
  function pause() external onlyOwner {
    super._pause();
  }

  /**
   * @dev Unpauses the store
   *
   * @custom:suppress-reentrancy Risk tolerable. Can only be called by the owner.
   *
   */
  function unpause() external onlyOwner {
    super._unpause();
  }

  function isProtocolMember(address contractAddress) public view returns (bool) {
    return boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, contractAddress))];
  }

  function _throwIfPaused() internal view {
    require(!super.paused(), "Pausable: paused");
  }

  function _throwIfSenderNotProtocolMember() internal view {
    require(isProtocolMember(msg.sender), "Forbidden");
  }
}
