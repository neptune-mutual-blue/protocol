// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IProtocol.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

library ProtoUtilV1 {
  // Key prefixes
  bytes32 public constant KP_BURNER = "proto:core:burner";
  bytes32 public constant KP_CONTRACTS = "proto:contracts";
  bytes32 public constant KP_CORE = "proto:core";
  bytes32 public constant KP_COVER = "proto:cover";
  bytes32 public constant KP_COVER_CLAIMABLE = "proto:cover:claimable";
  bytes32 public constant KP_COVER_FEE = "proto:cover:fee";
  bytes32 public constant KP_COVER_INFO = "proto:cover:info";
  bytes32 public constant KP_COVER_LIQUIDITY = "proto:cover:liquidity";
  bytes32 public constant KP_COVER_LIQUIDITY_NAME = "proto:cover:liquidityName";
  bytes32 public constant KP_COVER_LIQUIDITY_OWNED = "proto:cover:liquidity:owned";
  bytes32 public constant KP_COVER_LIQUIDITY_TOKEN = "proto:cover:liquidityToken";
  bytes32 public constant KP_COVER_LIQUIDITY_TS = "proto:cover:liquidity:ts";
  bytes32 public constant KP_COVER_OWNER = "proto:cover:owner";
  bytes32 public constant KP_COVER_PROVISION = "proto:cover:provision";
  bytes32 public constant KP_COVER_STAKE = "proto:cover:stake";
  bytes32 public constant KP_COVER_STAKE_OWNED = "proto:cover:stake:owned";
  bytes32 public constant KP_COVER_STATUS = "proto:cover:status";
  bytes32 public constant KP_NEP = "proto:nep";
  bytes32 public constant KP_VAULT = "proto:vault";
  bytes32 public constant KP_VAULT_BALANCES = "proto:vault:balances";

  bytes32 public constant CONTRACTS_PROTOCOL = "Protocol";
  bytes32 public constant CONTRACTS_VAULT = "Vault";
  bytes32 public constant CONTRACTS_COVER = "Cover";
  bytes32 public constant CONTRACTS_COVER_PROVISION = "CoverProvison";
  bytes32 public constant CONTRACTS_COVER_STAKE = "CoverStake";
  bytes32 public constant CONTRACTS_COVER_LIQUIDITY = "CoverLiquidity";

  function getProtocol(IStore s) external view returns (IProtocol) {
    bytes32 k = keccak256(abi.encodePacked(KP_CORE));
    return IProtocol(s.getAddress(k));
  }

  function getContract(IStore s, bytes32 name) external view returns (address) {
    return _getContract(s, name);
  }

  function onlyContract(IStore s, bytes32 name) external view {
    address contractAddress = _getContract(s, name);
    require(msg.sender == contractAddress, "Access denied");
  }

  function nepToken(IStore s) external view returns (IERC20) {
    bytes32 k = keccak256(abi.encodePacked(KP_NEP));
    return IERC20(s.getAddress(k));
  }

  function getVaultAddress(IStore s) external view returns (address) {
    bytes32 k = keccak256(abi.encodePacked(KP_VAULT));
    return s.getAddress(k);
  }

  function getVault(IStore s) external view returns (IVault) {
    bytes32 k = keccak256(abi.encodePacked(KP_VAULT));
    return IVault(s.getAddress(k));
  }

  function getLiquidityToken(IStore s) public view returns (IERC20) {
    bytes32 k = keccak256(abi.encodePacked(KP_COVER_LIQUIDITY));
    return IERC20(s.getAddress(k));
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
}
