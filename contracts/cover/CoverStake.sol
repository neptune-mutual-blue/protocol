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

  constructor(IStore store) {
    s = store;
  }

  function increaseStake(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    s.onlyValidCovers(key); // Ensures the key is valid cover
    s.onlyContract(ProtoUtilV1.CONTRACTS_COVER); // Only the cover contract can update the state

    IProtocol proto = s.getProtocol();
    proto.vaultDeposit(getName(), key, s.nepToken(), account, amount);

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE, key).toKeccak256();
    s.setUint(k, s.getUint(k) + amount);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE_OWNED, key, account).toKeccak256();
    s.setUint(k, s.getUint(k) + amount);

    emit StakeAdded(key, amount);
  }

  function decreaseStake(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    s.onlyValidCovers(key); // Ensures the key is valid cover
    s.onlyContract(ProtoUtilV1.CONTRACTS_COVER); // Only the cover contract can update the state

    require(stakeOf(key, account) >= amount, "Exceeds balance");

    uint256 minStake = s.getProtocol().getMinCoverStake();

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE, key).toKeccak256();
    uint256 currentStake = s.getUint(k);

    require(currentStake - amount >= minStake, "Min stake required");
    s.setUint(k, s.getUint(k) - amount);

    IProtocol proto = s.getProtocol();
    proto.vaultWithdrawal(getName(), key, s.nepToken(), account, amount);
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
