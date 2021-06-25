// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../interfaces/IProtocol.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

library ProtoUtilV1 {
  // Key prefixes
  bytes32 public constant KP_ASSURANCE_VAULT = "proto:core:assurance:vault";
  bytes32 public constant KP_BURNER = "proto:core:burner";
  bytes32 public constant KP_CONTRACTS = "proto:contracts";
  bytes32 public constant KP_CORE = "proto:core";
  bytes32 public constant KP_COVER = "proto:cover";
  bytes32 public constant KP_COVER_ASSURANCE = "proto:cover:assurance";
  bytes32 public constant KP_COVER_ASSURANCE_TOKEN = "proto:cover:assurancetoken";
  bytes32 public constant KP_COVER_CLAIMABLE = "proto:cover:claimable";
  bytes32 public constant KP_COVER_FEE = "proto:cover:fee";
  bytes32 public constant KP_COVER_INFO = "proto:cover:info";
  bytes32 public constant KP_COVER_LIQUIDITY = "proto:cover:liquidity";
  bytes32 public constant KP_COVER_LIQUIDITY_NAME = "proto:cover:liquidityName";
  bytes32 public constant KP_COVER_LIQUIDITY_TOKEN = "proto:cover:liquidityToken";
  bytes32 public constant KP_COVER_LIQUIDITY_RELEASE_DATE = "proto:cover:liquidity:release";
  bytes32 public constant KP_COVER_OWNER = "proto:cover:owner";
  bytes32 public constant KP_COVER_PROVISION = "proto:cover:provision";
  bytes32 public constant KP_COVER_STAKE = "proto:cover:stake";
  bytes32 public constant KP_COVER_STAKE_OWNED = "proto:cover:stake:owned";
  bytes32 public constant KP_COVER_STATUS = "proto:cover:status";
  bytes32 public constant KP_COVER_VAULT = "proto:cover:vault";
  bytes32 public constant KP_NEP = "proto:nep";
  bytes32 public constant KP_TREASURY = "proto:core:treasury";

  bytes32 public constant CONTRACTS_PROTOCOL = "Protocol";
  bytes32 public constant CONTRACTS_TREASURY = "Treasury";
  bytes32 public constant CONTRACTS_POLICY = "Policy";
  bytes32 public constant CONTRACTS_COVER = "Cover";
  bytes32 public constant CONTRACTS_VAULT_FACTORY = "VaultFactory";
  bytes32 public constant CONTRACTS_COVER_PROVISION = "CoverProvison";
  bytes32 public constant CONTRACTS_COVER_STAKE = "CoverStake";
  bytes32 public constant CONTRACTS_LIQUIDITY_VAULT = "Vault";

  function getProtocol(IStore s) external view returns (IProtocol) {
    return _getProtocol(s);
  }

  function getCoverFee(IStore s) external view returns (uint256 fee, uint256 minStake) {
    IProtocol proto = _getProtocol(s);
    fee = proto.getCoverFee();
    minStake = proto.getMinCoverStake();
  }

  function getContract(IStore s, bytes32 name) external view returns (address) {
    return _getContract(s, name);
  }

  function isProtocolMember(IStore s, address contractAddress) external view returns (bool) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractAddress));
    return s.getBool(k);
  }

  function ensureProtocolMember(IStore s, address contractAddress) external view {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_CONTRACTS, contractAddress));
    bool isMember = s.getBool(k);

    require(isMember, "Not a protocol contract");
  }

  function ensureMemberWithName(IStore s, bytes32 name) external view {
    address contractAddress = _getContract(s, name);
    require(msg.sender == contractAddress, "Access denied");
  }

  function nepToken(IStore s) external view returns (IERC20) {
    bytes32 k = keccak256(abi.encodePacked(KP_NEP));
    return IERC20(s.getAddress(k));
  }

  function getTreasury(IStore s) external view returns (address) {
    bytes32 k = keccak256(abi.encodePacked(KP_TREASURY));
    return s.getAddress(k);
  }

  function getAssuranceVault(IStore s) external view returns (address) {
    bytes32 k = keccak256(abi.encodePacked(KP_ASSURANCE_VAULT));
    return s.getAddress(k);
  }

  function getLiquidityToken(IStore s) public view returns (address) {
    bytes32 k = keccak256(abi.encodePacked(KP_COVER_LIQUIDITY_TOKEN));
    return s.getAddress(k);
  }

  function getBurnAddress(IStore s) external view returns (address) {
    bytes32 k = keccak256(abi.encodePacked(KP_BURNER));
    return s.getAddress(k);
  }

  function toKeccak256(bytes memory value) external pure returns (bytes32) {
    return keccak256(value);
  }

  function _getContract(IStore s, bytes32 name) private view returns (address) {
    bytes32 k = keccak256(abi.encodePacked(KP_CONTRACTS, name));
    return s.getAddress(k);
  }

  function _getProtocol(IStore s) private view returns (IProtocol) {
    bytes32 k = keccak256(abi.encodePacked(KP_CORE));
    return IProtocol(s.getAddress(k));
  }
}
