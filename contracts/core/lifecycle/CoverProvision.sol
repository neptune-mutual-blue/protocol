// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/IMember.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

contract CoverProvision is IMember, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;

  IStore public s;
  event ProvisionIncreased(bytes32 key, uint256 previous, uint256 current);
  event ProvisionDecreased(bytes32 key, uint256 previous, uint256 current);

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

  function increaseProvision(bytes32 key, uint256 amount) external onlyOwner onlyValidCover(key) nonReentrant whenNotPaused {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_PROVISION, key).toKeccak256();
    uint256 privision = s.getUint(k);

    s.addUint(k, amount);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), amount);

    emit ProvisionIncreased(key, privision, privision + amount);
  }

  function decreaseProvision(bytes32 key, uint256 amount)
    external
    onlyOwner
    /* onlyValidCover(key) */
    nonReentrant
    whenNotPaused
  {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_PROVISION, key).toKeccak256();
    uint256 privision = s.getUint(k);

    require(privision >= amount, "Exceeds Balance"); // Exceeds balance
    s.subtractUint(k, amount);

    s.nepToken().ensureTransfer(super.owner(), amount);

    emit ProvisionDecreased(key, privision, privision - amount);
  }

  function getProvision(bytes32 key) external view returns (uint256) {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_PROVISION, key).toKeccak256();
    return s.getUint(k);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_COVER_PROVISION;
  }
}
