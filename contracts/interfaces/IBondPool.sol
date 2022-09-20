// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface IBondPool is IMember {
  struct BondPoolInfoType {
    address lpToken;
    uint256 marketPrice;
    uint256 discountRate;
    uint256 vestingTerm;
    uint256 maxBond;
    uint256 totalNpmAllocated;
    uint256 totalNpmDistributed;
    uint256 npmAvailable;
    uint256 bondContribution;
    uint256 claimable;
    uint256 unlockDate;
  }

  struct SetupBondPoolArgs {
    address lpToken;
    address treasury;
    uint256 bondDiscountRate;
    uint256 maxBondAmount;
    uint256 vestingTerm;
    uint256 npmToTopUpNow;
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
