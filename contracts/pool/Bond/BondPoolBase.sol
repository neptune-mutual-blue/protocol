// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
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
   * @param addresses[0] lpToken -> Returns the LP token address
   * @param values[0] marketPrice -> Returns the market price of NPM token
   * @param values[1] discountRate -> Returns the discount rate for bonding
   * @param values[2] vestingTerm -> Returns the bond vesting period
   * @param values[3] maxBond -> Returns maximum amount of bond. To clarify, this means the final NPM amount received by bonders after vesting period.
   * @param values[4] totalNpmAllocated -> Returns the total amount of NPM tokens allocated for bonding.
   * @param values[5] totalNpmDistributed -> Returns the total amount of NPM tokens that have been distributed under bond.
   * @param values[6] npmAvailable -> Returns the available NPM tokens that can be still bonded.
   * @param values[7] bondContribution --> total lp tokens contributed by you
   * @param values[8] claimable --> your total claimable NPM tokens at the end of the vesting period or "unlock date"
   * @param values[9] unlockDate --> your vesting period end or "unlock date"
   */
  function getInfo(address forAccount) external view override returns (address[] memory addresses, uint256[] memory values) {
    return s.getBondPoolInfoInternal(forAccount);
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
    s.mustNotBePaused();
    AccessControlLibV1.mustBeAdmin(s);

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
