// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IPriceOracle.sol";
import "../dependencies/uniswap-v2/IUniswapV2RouterLike.sol";
import "../dependencies/uniswap-v2/IUniswapV2PairLike.sol";
import "../dependencies/uniswap-v2/IUniswapV2FactoryLike.sol";
import "./ProtoUtilV1.sol";

library PriceLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  function getPriceOracleInternal(IStore s) public view returns (IPriceOracle) {
    return IPriceOracle(s.getNpmPriceOracleInternal());
  }

  function setNpmPrice(IStore s) internal {
    getPriceOracleInternal(s).update();
  }

  function convertNpmLpUnitsToStabelcoinInternal(IStore s, uint256 amountIn) external view returns (uint256) {
    return getPriceOracleInternal(s).consultPair(amountIn);
  }

  function getLastUpdatedOnInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    bytes32 key = getLastUpdateKeyInternal(coverKey);
    return s.getUintByKey(key);
  }

  function setLastUpdatedOnInternal(IStore s, bytes32 coverKey) external {
    bytes32 key = getLastUpdateKeyInternal(coverKey);
    s.setUintByKey(key, block.timestamp); // solhint-disable-line
  }

  /**
   * @dev Hash key of the "last state update" for the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function getLastUpdateKeyInternal(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LAST_LIQUIDITY_STATE_UPDATE, coverKey));
  }

  function getNpmPriceInternal(IStore s, uint256 amountIn) external view returns (uint256) {
    return getPriceOracleInternal(s).consult(s.getNpmTokenAddressInternal(), amountIn);
  }
}
