// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IPriceDiscovery.sol";
import "../../interfaces/IStore.sol";
import "../Recoverable.sol";

// solhint-disable-next-line
contract PriceDiscovery is IPriceDiscovery, Recoverable {
  constructor(IStore store) Recoverable(store) {
    this;
  }

  function getTokenPriceInLiquidityToken(
    address, /*token*/
    address, /*liquidityToken*/
    uint256 /*multiplier*/
  ) external view override returns (uint256) {
    this;
    // Todo: Implement this
    return 1 ether;
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
    return ProtoUtilV1.CNAME_PRICE_DISCOVERY;
  }
}
