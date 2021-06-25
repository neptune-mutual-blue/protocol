// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../libraries/ProtoUtilV1.sol";
import "../libraries/NTransferUtilV2.sol";
import "./Recoverable.sol";

contract Protocol is Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  IStore public s;

  event ContractAdded(bytes32 namespace, address contractAddress);
  event ContractUpgraded(bytes32 namespace, address indexed previous, address indexed current);

  /**
   * @dev This modifier ensures that the caller is one of the latest protocol contracts
   */
  modifier onlyMember(address contractAddress) {
    s.ensureProtocolMember(contractAddress);
    _;
  }

  modifier onlyOwnerOrProtocol() {
    bool isProtocol = s.isProtocolMember(super._msgSender());

    if (!isProtocol) {
      require(super._msgSender() == super.owner(), "Forbidden");
    }

    _;
  }

  constructor(
    IStore store,
    address nep,
    address treasury,
    address assuranceVault
  ) {
    s = store;

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_CORE).toKeccak256();
    s.setAddress(k, address(this));

    k = abi.encodePacked(ProtoUtilV1.KP_NEP).toKeccak256();
    s.setAddress(k, nep);

    k = abi.encodePacked(ProtoUtilV1.KP_BURNER).toKeccak256();
    s.setAddress(k, 0x0000000000000000000000000000000000000001);

    k = abi.encodePacked(ProtoUtilV1.KP_TREASURY).toKeccak256();
    s.setAddress(k, treasury);

    k = abi.encodePacked(ProtoUtilV1.KP_ASSURANCE_VAULT).toKeccak256();
    s.setAddress(k, assuranceVault);
  }

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external onlyOwner onlyMember(previous) whenNotPaused {
    _deleteContract(namespace, previous);
    _addContract(namespace, current);

    emit ContractUpgraded(namespace, previous, current);
  }

  function addContract(bytes32 namespace, address contractAddress) external onlyOwnerOrProtocol whenNotPaused {
    _addContract(namespace, contractAddress);
    emit ContractAdded(namespace, contractAddress);
  }

  function _addContract(bytes32 namespace, address contractAddress) private {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractAddress).toKeccak256();
    require(!s.getBool(k), "Already exists");

    s.setBool(k, true);

    k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, namespace).toKeccak256();
    s.setAddress(k, contractAddress);
  }

  function _deleteContract(bytes32 namespace, address contractAddress) private {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractAddress).toKeccak256();
    s.deleteBool(k);

    k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, namespace).toKeccak256();
    s.deleteAddress(k);
  }
}
