// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/IBondPool.sol";
import "../../libraries/BondPoolLibV1.sol";
import "../../core/Recoverable.sol";

abstract contract BondPoolBase is IBondPool, Recoverable {
  using AccessControlLibV1 for IStore;
  using BondPoolLibV1 for IStore;
  using PriceLibV1 for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore s) Recoverable(s) {} //solhint-disable-line

  function getNpmMarketPrice() external view override returns (uint256) {
    return s.getNpmPriceInternal(1 ether);
  }

  function calculateTokensForLp(uint256 lpTokens) external view override returns (uint256) {
    return s.calculateTokensForLpInternal(lpTokens);
  }

  /**
   * @dev Gets the bond pool information
   *
   */
  function getInfo(address forAccount) external view override returns (BondPoolInfoType memory) {
    return s.getBondPoolInfoInternal(forAccount);
  }

  /**
   * @dev Sets up the bond pool
   *
   */
  function setup(SetupBondPoolArgs calldata args) external override nonReentrant {
    // @suppress-zero-value-check The uint values are checked in the function `setupBondPoolInternal`
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setupBondPoolInternal(args);

    emit BondPoolSetup(args);
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
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_BOND_POOL;
  }
}
