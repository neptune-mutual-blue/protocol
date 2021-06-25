// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICover.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../Recoverable.sol";

/**
 * @title Base Cover Contract
 */
abstract contract CoverBase is ICover, Recoverable {
  using ProtoUtilV1 for bytes;
  using CoverUtilV1 for IStore;

  /** eternal storage */
  IStore public s;

  /**
   * Ensures this feature is accessed only by the cover owner or the owner of this contract.
   * @param key Enter the cover key to check
   */
  modifier onlyCoverOwner(bytes32 key) {
    s.ensureCoverOwner(key, super._msgSender(), owner());
    _;
  }

  /**
   * Ensures the given key is a valid cover contract
   * @param key Enter the cover key to check
   */
  modifier onlyValidCover(bytes32 key) {
    s.ensureValidCover(key); // Ensures the key is valid cover
    _;
  }

  /**
   * @dev Constructs this smart contract
   * @param store Provide the address of an eternal storage contract to use.
   * This contract must be a member of the Protocol for write access to the storage
   * @param liquidityToken Provide the address of the token this cover will be quoted against.
   * @param liquidityName Enter a description or ENS name of your liquidity token.
   *
   */
  constructor(
    IStore store,
    address liquidityToken,
    bytes32 liquidityName
  ) {
    s = store;

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_TOKEN).toKeccak256();
    s.setAddress(k, liquidityToken);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_NAME).toKeccak256();
    s.setBytes32(k, liquidityName);
  }

  /**
   * @dev Get more information about this cover contract
   * @param key Enter the cover key
   * @param coverOwner Returns the address of the cover creator or owner
   * @param info Gets the IPFS hash of the cover info
   * @param values Array of uint256 values
   */
  function getCover(bytes32 key)
    external
    view
    returns (
      address coverOwner,
      bytes32 info,
      uint256[] memory values
    )
  {
    return s.getCoverInfo(key);
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
    return ProtoUtilV1.CONTRACTS_COVER;
  }
}
