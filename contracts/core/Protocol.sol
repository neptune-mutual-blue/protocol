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
  modifier onlyProtocol(address contractAddress) {
    s.ensureProtocolMember(contractAddress);
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

  function withdrawFromVault(
    bytes32 contractName,
    bytes32 key,
    IERC20 asset,
    address recipient,
    uint256 amount
  ) public nonReentrant onlyProtocol(msg.sender) whenNotPaused {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractName).toKeccak256();
    require(s.getAddress(k) == super._msgSender(), "Access denied");

    k = abi.encodePacked(ProtoUtilV1.KP_VAULT_BALANCES, contractName, key, asset).toKeccak256();
    require(amount <= s.getUint(k), "Exceeds balance");

    s.subtractUint(k, amount);

    IVault vault = s.getVault();
    vault.transferOut(asset, recipient, amount);
  }

  function depositToVault(
    bytes32 contractName,
    bytes32 key,
    IERC20 asset,
    address sender,
    uint256 amount
  ) public nonReentrant onlyProtocol(msg.sender) whenNotPaused {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractName).toKeccak256();
    require(s.getAddress(k) == super._msgSender(), "Access denied");

    k = abi.encodePacked(ProtoUtilV1.KP_VAULT_BALANCES, contractName, key, asset).toKeccak256();
    s.addUint(k, amount);

    address vault = s.getVaultAddress();
    asset.ensureTransferFrom(sender, vault, amount);
  }

  function upgradeContract(
    bytes32 name,
    address previous,
    address current
  ) external onlyOwner onlyProtocol(previous) whenNotPaused {
    _deleteContract(name, previous);
    _addContract(name, current);

    emit ContractUpgraded(name, previous, current);
  }

  function addContract(bytes32 name, address contractAddress) external onlyProtocol(contractAddress) whenNotPaused {
    _addContract(name, contractAddress);
    emit ContractAdded(name, contractAddress);
  }

  function _addContract(bytes32 name, address contractAddress) private {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractAddress).toKeccak256();
    require(!s.getBool(k), "Already exists");

    s.setBool(k, true);

    k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, name).toKeccak256();
    s.setAddress(k, contractAddress);
  }

  function _deleteContract(bytes32 name, address contractAddress) private {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractAddress).toKeccak256();
    s.deleteBool(k);

    k = abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, name).toKeccak256();
    s.deleteAddress(k);
  }
}
