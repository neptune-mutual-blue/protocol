// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

import "../../interfaces/ICoverStake.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

contract CoverStake is ICoverStake, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;

  IStore public s;

  event StakeAdded(bytes32 key, uint256 amount);
  event StakeRemoved(bytes32 key, uint256 amount);
  event FeeBurned(bytes32 key, uint256 amount);

  modifier onlyFromCover() {
    s.ensureMemberWithName(ProtoUtilV1.CONTRACTS_COVER);
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

  constructor(IStore store) {
    s = store;
  }

  function increaseStake(
    bytes32 key,
    address account,
    uint256 amount,
    uint256 fee
  ) external override onlyFromCover onlyValidCover(key) nonReentrant whenNotPaused {
    require(amount >= fee, "Invalid fee");

    s.nepToken().ensureTransferFrom(account, address(this), amount);

    if (fee > 0) {
      s.nepToken().ensureTransferFrom(address(this), s.getBurnAddress(), fee);
      emit FeeBurned(key, fee);
    }

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE, key).toKeccak256();
    s.addUint(k, amount - fee);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE_OWNED, key, account).toKeccak256();
    s.addUint(k, amount - fee);

    emit StakeAdded(key, amount - fee);
  }

  function decreaseStake(
    bytes32 key,
    address account,
    uint256 amount
  ) external override onlyFromCover onlyValidCover(key) nonReentrant whenNotPaused {
    uint256 drawingPower = _getDrawingPower(key, account);
    require(drawingPower >= amount, "Exceeds your drawing power");

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE, key).toKeccak256();
    s.subtractUint(k, amount);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE_OWNED, key, account).toKeccak256();
    s.subtractUint(k, amount);

    s.nepToken().ensureTransfer(account, amount);
    emit StakeRemoved(key, amount);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function stakeOf(bytes32 key, address account) public view override returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE_OWNED, key, account));
    return s.getUint(k);
  }

  function _getDrawingPower(bytes32 key, address account) private view returns (uint256) {
    uint256 yourStake = stakeOf(key, account);
    bool isOwner = account == s.getCoverOwner(key);

    uint256 minStake = s.getProtocol().getMinCoverStake();

    return isOwner ? yourStake - minStake : yourStake;
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_COVER_STAKE;
  }
}
