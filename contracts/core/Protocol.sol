// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../interfaces/IProtocol.sol";
import "../libraries/ProtoUtilV1.sol";
import "../libraries/StoreKeyUtil.sol";
import "./Recoverable.sol";

contract Protocol is IProtocol, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  event ContractAdded(bytes32 namespace, address contractAddress);
  event ContractUpgraded(bytes32 namespace, address indexed previous, address indexed current);
  event MemberAdded(address member);
  event MemberRemoved(address member);

  constructor(
    IStore store,
    address nep,
    address treasury,
    address assuranceVault
  ) Recoverable(store) {
    require(address(store) != address(0), "Invalid Store");
    require(nep != address(0), "Invalid NEP");
    require(treasury != address(0), "Invalid Treasury");
    require(assuranceVault != address(0), "Invalid Vault");

    s.setAddressByKey(ProtoUtilV1.NS_CORE, address(this));
    s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);
    s.setAddressByKey(ProtoUtilV1.NS_SETUP_NEP, nep);
    s.setAddressByKey(ProtoUtilV1.NS_BURNER, 0x0000000000000000000000000000000000000001);
    s.setAddressByKey(ProtoUtilV1.NS_TREASURY, treasury);
    s.setAddressByKey(ProtoUtilV1.NS_ASSURANCE_VAULT, assuranceVault);
  }

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external onlyOwner {
    _mustBeUnpaused(); // Ensures the contract isn't paused
    s.mustBeProtocolMember(previous); // Ensures the given address is a protocol member

    _deleteContract(namespace, previous);
    _addContract(namespace, current);

    emit ContractUpgraded(namespace, previous, current);
  }

  function addContract(bytes32 namespace, address contractAddress) external onlyOwner {
    _mustBeUnpaused(); // Ensures the contract isn't paused

    _addContract(namespace, contractAddress);
    emit ContractAdded(namespace, contractAddress);
  }

  function removeMember(address member) external onlyOwner {
    _mustBeUnpaused(); // Ensures the contract isn't paused

    _removeMember(member);
    emit MemberRemoved(member);
  }

  function addMember(address member) external onlyOwner {
    _mustBeUnpaused(); // Ensures the contract isn't paused

    _addMember(member);
    emit MemberAdded(member);
  }

  function _addContract(bytes32 namespace, address contractAddress) private {
    s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, contractAddress);
    _addMember(contractAddress);
  }

  function _deleteContract(bytes32 namespace, address contractAddress) private {
    s.deleteAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace);

    _removeMember(contractAddress);
  }

  function _addMember(address member) private {
    require(s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, member) == false, "Already exists");
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, member, true);
  }

  function _removeMember(address member) private {
    s.deleteBoolByKeys(ProtoUtilV1.NS_MEMBERS, member);
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() public pure override returns (bytes32) {
    return "Neptune Mutual Protocol";
  }
}
