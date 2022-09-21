// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface IBondPool is IMember {
     
  struct BondPoolInfoType {
    address lpToken; //lpToken -> Returns the LP token address
    uint256 marketPrice; //marketPrice -> Returns the market price of NPM token
    uint256 discountRate; //discountRate -> Returns the discount rate for bonding
    uint256 vestingTerm; //vestingTerm -> Returns the bond vesting period
    uint256 maxBond; //maxBond -> Returns maximum amount of bond. To clarify, this means the final NPM amount received by bonders after vesting period.
    uint256 totalNpmAllocated; //totalNpmAllocated -> Returns the total amount of NPM tokens allocated for bonding.
    uint256 totalNpmDistributed; //totalNpmDistributed -> Returns the total amount of NPM tokens that have been distributed under bond.
    uint256 npmAvailable; //npmAvailable -> Returns the available NPM tokens that can be still bonded.
    uint256 bondContribution; //bondContribution --> total lp tokens contributed by you
    uint256 claimable; //claimable --> your total claimable NPM tokens at the end of the vesting period or "unlock date"
    uint256 unlockDate; //unlockDate --> your vesting period end or "unlock date"
  }

  struct SetupBondPoolArgs {
    address lpToken; //LP Token Address
    address treasury; //Treasury Address
    uint256 bondDiscountRate; //Bond Discount Rate
    uint256 maxBondAmount; //Maximum Bond Amount
    uint256 vestingTerm; //Vesting Term
    uint256 npmToTopUpNow; //NPM to Top Up Now
  }

  event BondPoolSetup(SetupBondPoolArgs args);
  event BondCreated(address indexed account, uint256 lpTokens, uint256 npmToVest, uint256 unlockDate);
  event BondClaimed(address indexed account, uint256 amount);

  function setup(SetupBondPoolArgs calldata args) external;

  function createBond(uint256 lpTokens, uint256 minNpmDesired) external;

  function claimBond() external;

  function getNpmMarketPrice() external view returns (uint256);

  function calculateTokensForLp(uint256 lpTokens) external view returns (uint256);

  function getInfo(address forAccount) external view returns (BondPoolInfoType memory info);
}
