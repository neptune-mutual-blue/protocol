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

  modifier validateKey(bytes32 key) {
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
  ) external override onlyFromCover validateKey(key) nonReentrant whenNotPaused {
    IProtocol proto = s.getProtocol();

    proto.depositToVault(getName(), key, s.nepToken(), account, amount);

    if (fee > 0) {
      proto.withdrawFromVault(getName(), key, s.nepToken(), s.getBurnAddress(), fee);
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
  ) external override onlyFromCover validateKey(key) nonReentrant whenNotPaused {
    require(stakeOf(key, account) >= amount, "Exceeds balance");

    uint256 minStake = s.getProtocol().getMinCoverStake();

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE, key).toKeccak256();
    uint256 currentStake = s.getUint(k);

    require(currentStake - amount >= minStake, "Min stake required");
    s.subtractUint(k, amount);

    IProtocol proto = s.getProtocol();
    proto.withdrawFromVault(getName(), key, s.nepToken(), account, amount);
    emit StakeRemoved(key, amount);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function stakeOf(bytes32 key, address account) public view override returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE_OWNED, key, account));
    return s.getUint(k);
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_COVER_STAKE;
  }
}
