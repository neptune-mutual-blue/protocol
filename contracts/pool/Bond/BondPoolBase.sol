// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/IBondPool.sol";
import "../../libraries/BondPoolLibV1.sol";
import "../../core/Recoverable.sol";

abstract contract BondPoolBase is IBondPool, Recoverable {
  using BondPoolLibV1 for IStore;

  constructor(IStore s) Recoverable(s) {} //solhint-disable-line

  function getNpmMarketPrice() external pure override returns (uint256) {
    return BondPoolLibV1.getNpmMarketPrice();
  }

  function calculateTokensForLp(uint256 lpTokens) external pure override returns (uint256) {
    return BondPoolLibV1.calculateTokensForLpInternal(lpTokens);
  }

  function getInfo() external view override returns (address[] memory addresses, uint256[] memory values) {
    return s.getBondPoolInfoInternal();
  }

  /**
   * @dev Sets up the bond pool
   * @param addresses[0] - LP Token Address
   * @param addresses[1] - Treasury Address
   * @param values[0] - Bond Discount Rate
   * @param values[1] - Maximum Bond Amount
   * @param values[2] - Vesting Term
   * @param values[3] - NPM to Top Up Now
   */
  function setup(address[] memory addresses, uint256[] memory values) external override nonReentrant {
    s.setupBondPoolInternal(addresses, values);

    emit BondPoolSetup(addresses, values);
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
