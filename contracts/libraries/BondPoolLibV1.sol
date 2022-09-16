// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ValidationLibV1.sol";
import "./NTransferUtilV2.sol";
import "./AccessControlLibV1.sol";
import "./PriceLibV1.sol";
import "../interfaces/IProtocol.sol";
import "../interfaces/IPausable.sol";

library BondPoolLibV1 {
  using AccessControlLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using PriceLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  bytes32 public constant NS_BOND_TO_CLAIM = "ns:pool:bond:to:claim";
  bytes32 public constant NS_BOND_CONTRIBUTION = "ns:pool:bond:contribution";
  bytes32 public constant NS_BOND_LP_TOKEN = "ns:pool:bond:lq:pair:token";
  bytes32 public constant NS_LQ_TREASURY = "ns:pool:bond:lq:treasury";
  bytes32 public constant NS_BOND_DISCOUNT_RATE = "ns:pool:bond:discount";
  bytes32 public constant NS_BOND_MAX_UNIT = "ns:pool:bond:max:unit";
  bytes32 public constant NS_BOND_VESTING_TERM = "ns:pool:bond:vesting:term";
  bytes32 public constant NS_BOND_UNLOCK_DATE = "ns:pool:bond:unlock:date";
  bytes32 public constant NS_BOND_TOTAL_NPM_ALLOCATED = "ns:pool:bond:total:npm:alloc";
  bytes32 public constant NS_BOND_TOTAL_NPM_DISTRIBUTED = "ns:pool:bond:total:npm:distrib";

  /**
   * @dev Calculates the discounted NPM token to be given
   * for the NPM/Stablecoin Uniswap v2 LP token units.
   *
   * @param s Specify store instance
   * @param lpTokens Enter the NPM/Stablecoin Uniswap v2 LP token units
   *
   */
  function calculateTokensForLpInternal(IStore s, uint256 lpTokens) public view returns (uint256) {
    uint256 dollarValue = s.convertNpmLpUnitsToStabelcoin(lpTokens);

    uint256 npmPrice = s.getNpmPriceInternal(1 ether);
    uint256 discount = _getDiscountRate(s);
    uint256 discountedNpmPrice = (npmPrice * (ProtoUtilV1.MULTIPLIER - discount)) / ProtoUtilV1.MULTIPLIER;

    uint256 npmForContribution = (dollarValue * 1 ether) / discountedNpmPrice;

    return npmForContribution;
  }

  /**
   * @dev Gets the bond pool information
   *
   * @param s Provide a store instance
   *
   */
  function getBondPoolInfoInternal(IStore s, address you) external view returns (IBondPool.BondPoolInfoType memory info) {
    info.lpToken = _getLpTokenAddress(s);

    info.marketPrice = s.getNpmPriceInternal(1 ether);
    info.discountRate = _getDiscountRate(s);
    info.vestingTerm = _getVestingTerm(s);
    info.maxBond = _getMaxBondInUnit(s);
    info.totalNpmAllocated = _getTotalNpmAllocated(s);
    info.totalNpmDistributed = _getTotalNpmDistributed(s);
    info.npmAvailable = IERC20(s.npmToken()).balanceOf(address(this));

    info.bondContribution = _getYourBondContribution(s, you); // total lp tokens contributed by you
    info.claimable = _getYourBondClaimable(s, you); // your total claimable NPM tokens at the end of the vesting period or "unlock date"
    info.unlockDate = _getYourBondUnlockDate(s, you); // your vesting period end or "unlock date"
  }

  /**
   * @dev Gets the NPM/Stablecoin Uniswap v2 LP token address
   */
  function _getLpTokenAddress(IStore s) private view returns (address) {
    return s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN);
  }

  /**
   * @dev Gets your unsettled bond contribution amount.
   */
  function _getYourBondContribution(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_CONTRIBUTION, you)));
  }

  /**
   * @dev Gets your claimable discounted NPM bond amount.
   */
  function _getYourBondClaimable(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, you)));
  }

  /**
   * @dev Returns the date when your discounted NPM token bond is unlocked
   * for claim.
   */
  function _getYourBondUnlockDate(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, you)));
  }

  /**
   * @dev Returns the NPM token bond discount rate
   */
  function _getDiscountRate(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_DISCOUNT_RATE);
  }

  /**
   * @dev Returns the bond vesting term
   */
  function _getVestingTerm(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_VESTING_TERM);
  }

  /**
   * @dev Returns the maximum NPM token units that can be bonded at a time
   */
  function _getMaxBondInUnit(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_MAX_UNIT);
  }

  /**
   * @dev Returns the total NPM tokens allocated for the bond
   */
  function _getTotalNpmAllocated(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_TOTAL_NPM_ALLOCATED);
  }

  /**
   * @dev Returns the total bonded NPM tokens distributed till date.
   */
  function _getTotalNpmDistributed(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_TOTAL_NPM_DISTRIBUTED);
  }

  /**
   * @dev Create a new NPM/DAI LP token bond
   *
   * @custom:suppress-malicious-erc The token `BondPoolLibV1.NS_BOND_LP_TOKEN` can't be manipulated via user input
   *
   * @param s Specify store instance
   * @param lpTokens Enter the total units of NPM/DAI Uniswap v2 tokens to be bonded
   * @param minNpmDesired Enter the minimum NPM tokens you desire for the given LP tokens.
   * This transaction will revert if the final NPM bond is less than your specified value.
   *
   */
  function createBondInternal(
    IStore s,
    uint256 lpTokens,
    uint256 minNpmDesired
  ) external returns (uint256 npmToVest, uint256 unlockDate) {
    s.mustNotBePaused();

    npmToVest = calculateTokensForLpInternal(s, lpTokens);

    require(npmToVest <= _getMaxBondInUnit(s), "Bond too big");
    require(npmToVest >= minNpmDesired, "Min bond `minNpmDesired` failed");
    require(_getNpmBalance(s) >= npmToVest + _getBondCommitment(s), "NPM balance insufficient to bond");

    // Pull the tokens from the requester's account
    IERC20(s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN)).ensureTransferFrom(msg.sender, s.getAddressByKey(BondPoolLibV1.NS_LQ_TREASURY), lpTokens);

    // Commitment: Total NPM to reserve for bond claims
    s.addUintByKey(BondPoolLibV1.NS_BOND_TO_CLAIM, npmToVest);

    // Your bond to claim later
    bytes32 k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender));
    s.addUintByKey(k, npmToVest);

    // Amount contributed
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_CONTRIBUTION, msg.sender));
    s.addUintByKey(k, lpTokens);

    // unlock date
    unlockDate = block.timestamp + _getVestingTerm(s); // solhint-disable-line

    // Unlock date
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender));
    s.setUintByKey(k, unlockDate);
  }

  /**
   * @dev Gets the NPM token balance of this contract.
   *
   * Please also see `_getBondCommitment` to check
   * the total NPM tokens already allocated to the bonders
   * to be claimed later.
   *
   * @param s Specify store instance
   */
  function _getNpmBalance(IStore s) private view returns (uint256) {
    return IERC20(s.npmToken()).balanceOf(address(this));
  }

  /**
   * @dev Returns the bond commitment amount.
   */
  function _getBondCommitment(IStore s) private view returns (uint256) {
    return s.getUintByKey(BondPoolLibV1.NS_BOND_TO_CLAIM);
  }

  /**
   * @dev Enables the caller to claim their bond after the lockup period.
   *
   * @custom:suppress-malicious-erc The token `s.npmToken()` can't be manipulated via user input
   *
   */
  function claimBondInternal(IStore s) external returns (uint256 npmToTransfer) {
    s.mustNotBePaused();

    npmToTransfer = _getYourBondClaimable(s, msg.sender); // npmToTransfer

    // Commitment: Reduce NPM reserved for claims
    s.subtractUintByKey(BondPoolLibV1.NS_BOND_TO_CLAIM, npmToTransfer);

    // Clear the claim amount
    s.deleteUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender)));

    uint256 unlocksOn = _getYourBondUnlockDate(s, msg.sender);

    // Clear the unlock date
    s.deleteUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender)));

    require(block.timestamp >= unlocksOn, "Still vesting"); // solhint-disable-line
    require(npmToTransfer > 0, "Nothing to claim");

    s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_DISTRIBUTED, npmToTransfer);
    IERC20(s.npmToken()).ensureTransfer(msg.sender, npmToTransfer);
  }

  /**
   * @dev Sets up the bond pool
   *
   * @custom:suppress-malicious-erc The token `s.npmToken()` can't be manipulated via user input
   *
   */
  function setupBondPoolInternal(IStore s, IBondPool.SetupBondPoolArgs calldata args) external {
    if (args.lpToken != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN, args.lpToken);
    }

    if (args.treasury != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_LQ_TREASURY, args.treasury);
    }

    if (args.bondDiscountRate > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_DISCOUNT_RATE, args.bondDiscountRate);
    }

    if (args.maxBondAmount > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_MAX_UNIT, args.maxBondAmount);
    }

    if (args.vestingTerm > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_VESTING_TERM, args.vestingTerm);
    }

    if (args.npmToTopUpNow > 0) {
      IERC20(s.npmToken()).ensureTransferFrom(msg.sender, address(this), args.npmToTopUpNow);
      s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_ALLOCATED, args.npmToTopUpNow);
    }
  }
}
