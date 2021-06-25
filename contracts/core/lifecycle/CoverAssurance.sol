// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICoverAssurance.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title Cover Assurance
 * @dev Assurance tokens can be added by a covered project to demonstrate coverage support
 * for their project. This helps bring the cover fee down and enhances
 * liquidity provider confidence. Along with the NEP tokens, the assurance tokens are rewarded
 * as a support to the liquidity providers when a cover incident occurs.
 *
 * Without negatively affecting the price much,
 * the protocol will gradually convert the assurance tokens
 * to stablecoin liquidity.
 */
contract CoverAssurance is ICoverAssurance, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;

  IStore public s;
  event AssuranceAdded(bytes32 key, uint256 amount);

  /**
   * Ensures the given key is a valid cover contract
   * @param key Enter the cover key to check
   */
  modifier onlyValidCover(bytes32 key) {
    s.ensureValidCover(key); // Ensures the key is valid cover
    _;
  }

  constructor(IStore store) {
    s = store;
  }

  /**
   * @dev Adds assurance to the specified cover contract
   * @param key Enter the cover key
   * @param amount Enter the amount you would like to supply
   */
  function addAssurance(bytes32 key, uint256 amount) external override onlyValidCover(key) nonReentrant whenNotPaused {
    require(amount > 0, "Provide amount");

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_ASSURANCE_TOKEN, key).toKeccak256();
    IERC20 assuranceToken = IERC20(s.getAddress(k));
    address vault = s.getAssuranceVault();

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_ASSURANCE, key).toKeccak256();
    s.addUint(k, amount);

    assuranceToken.ensureTransfer(vault, amount);

    emit AssuranceAdded(key, amount);
  }

  /**
   * @dev Gets the assurance amount of the specified cover contract
   * @param key Enter the cover key
   */
  function getAssurance(bytes32 key) external view override returns (uint256) {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_ASSURANCE, key).toKeccak256();
    return s.getUint(k);
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
    return ProtoUtilV1.CONTRACTS_COVER_PROVISION;
  }
}
