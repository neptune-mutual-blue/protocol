// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

import "../../interfaces/ICoverLiquidity.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

contract CoverLiquidity is ICoverLiquidity, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;

  IStore public s;

  event LiquidityAdded(bytes32 key, address asset, uint256 amount);
  event LiquidityRemoved(bytes32 key, address asset, uint256 amount);

  constructor(IStore store) {
    s = store;
  }

  function addLiquidity(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    s.onlyValidCovers(key); // Ensures the key is valid cover
    s.onlyContract(ProtoUtilV1.CONTRACTS_COVER); // Only the cover contract can update the state

    IERC20 liquidityToken = s.getLiquidityToken();

    // First deposit into vault
    IProtocol proto = s.getProtocol();
    proto.vaultDeposit(getName(), key, liquidityToken, account, amount);

    // Update values
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY, key).toKeccak256();
    s.setUint(k, s.getUint(k) + amount);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_OWNED, key, account).toKeccak256();
    s.setUint(k, s.getUint(k) + amount);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_TS, key, account).toKeccak256();
    s.setUint(k, block.timestamp); // solhint-disable-line

    emit LiquidityAdded(key, address(liquidityToken), amount);
  }

  function removeLiquidity(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    s.onlyValidCovers(key); // Ensures the key is valid cover
    s.onlyContract(ProtoUtilV1.CONTRACTS_COVER); // Only the cover contract can update the state

    IERC20 liquidityToken = s.getLiquidityToken();

    s.onlyValidCovers(key); // Ensures the key is valid cover

    require(liquidityOf(key, account) >= amount, "Exceeds balance"); // Exceeds balance

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_TS, key, account).toKeccak256();
    uint256 liqts = s.getUint(k);

    uint256 minLiquidityPeriod = s.getProtocol().getMinLiquidityPeriod();

    require(block.timestamp > liqts + minLiquidityPeriod, "You are early"); // solhint-disable-line

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY, key).toKeccak256();
    s.setUint(k, s.getUint(k) - amount);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_OWNED, key, account).toKeccak256();
    s.setUint(k, s.getUint(k) - amount);

    IProtocol proto = s.getProtocol();
    proto.vaultWithdrawal(getName(), key, liquidityToken, account, amount);
    emit LiquidityRemoved(key, address(liquidityToken), amount);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function liquidityOf(bytes32 key, address account) public view override returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_OWNED, key, account));
    return s.getUint(k);
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_COVER_LIQUIDITY;
  }
}
