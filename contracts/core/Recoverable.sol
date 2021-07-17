// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../libraries/ProtoUtilV1.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";

abstract contract Recoverable is Ownable, ReentrancyGuard, Pausable {
  using ProtoUtilV1 for IStore;
  IStore public s;

  constructor(IStore store) {
    require(address(store) != address(0), "Invalid Store");

    s = store;
  }

  /**
   * @dev Recover all Ether held by the contract.
   */
  function recoverEther(address sendTo) external {
    _mustBeOwnerOrProtoOwner();

    // slither-disable-next-line arbitrary-send
    payable(sendTo).transfer(address(this).balance);
  }

  /**
   * @dev Recover all BEP-20 compatible tokens sent to this address.
   * @param token BEP-20 The address of the token contract
   */
  function recoverToken(address token, address sendTo) external {
    _mustBeOwnerOrProtoOwner();

    IERC20 bep20 = IERC20(token);

    uint256 balance = bep20.balanceOf(address(this));
    require(bep20.transfer(sendTo, balance), "Transfer failed");
  }

  function pause() external {
    _mustBeUnpaused();
    _mustBeOwnerOrProtoOwner();

    super._pause();
  }

  function unpause() external whenPaused {
    _mustBeOwnerOrProtoOwner();

    super._unpause();
  }

  /**
   * @dev Reverts if the sender is not the contract owner or a protocol member.
   */
  function _mustBeOwnerOrProtoMember() internal view {
    bool isProtocol = s.isProtocolMember(super._msgSender());

    if (isProtocol == false) {
      require(super._msgSender() == super.owner(), "Forbidden");
    }
  }

  /**
   * @dev Reverts if the sender is not the contract owner or protocol owner.
   */
  function _mustBeOwnerOrProtoOwner() internal view {
    IProtocol protocol = ProtoUtilV1.getProtocol(s);

    if (address(protocol) == address(0)) {
      require(super._msgSender() == owner(), "Forbidden");
      return;
    }

    address protocolOwner = Ownable(address(protocol)).owner();
    require(super._msgSender() == owner() || super._msgSender() == protocolOwner, "Forbidden");
  }

  function _mustBeUnpaused() internal view {
    require(super.paused() == false, "Contract is paused");

    address protocol = ProtoUtilV1.getProtocolAddress(s);
    require(Pausable(protocol).paused() == false, "Protocol is paused");
  }
}
