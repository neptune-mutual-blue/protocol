// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICoverAssurance.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

contract CoverAssurance is ICoverAssurance, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;

  IStore public s;
  event AssuranceAdded(bytes32 key, uint256 amount);

  modifier validateKey(bytes32 key) {
    s.ensureValidCover(key); // Ensures the key is valid cover
    _;
  }

  constructor(IStore store) {
    s = store;
  }

  function addAssurance(bytes32 key, uint256 amount) external override validateKey(key) nonReentrant whenNotPaused {
    require(amount > 0, "Provide amount");

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_ASSURANCE_TOKEN, key).toKeccak256();
    IERC20 assuranceToken = IERC20(s.getAddress(k));
    address vault = s.getAssuranceVault();

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_ASSURANCE, key).toKeccak256();
    s.addUint(k, amount);

    assuranceToken.ensureTransfer(vault, amount);

    emit AssuranceAdded(key, amount);
  }

  function getAssurance(bytes32 key) external view override returns (uint256) {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_ASSURANCE, key).toKeccak256();
    return s.getUint(k);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_COVER_PROVISION;
  }
}
