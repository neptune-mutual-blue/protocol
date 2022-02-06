// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
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

  function calculateTokensForLpInternal(IStore s, uint256 lpTokens) public view returns (uint256) {
    IUniswapV2PairLike pair = IUniswapV2PairLike(_getLpTokenAddress(s));
    uint256 dollarValue = s.getPairLiquidityInStablecoin(pair, lpTokens);

    uint256 npmPrice = s.getNpmPriceInternal(1 ether);
    uint256 discount = _getDiscountRate(s);
    uint256 discountedNpmPrice = (npmPrice * (ProtoUtilV1.MULTIPLIER - discount)) / ProtoUtilV1.MULTIPLIER;

    uint256 npmForContribution = (dollarValue * 1 ether) / discountedNpmPrice;

    return npmForContribution;
  }

  /**
   * @dev Gets the bond pool information
   * @param s Provide a store instance
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
  function getBondPoolInfoInternal(IStore s, address you) external view returns (address[] memory addresses, uint256[] memory values) {
    addresses = new address[](1);
    values = new uint256[](10);

    addresses[0] = _getLpTokenAddress(s);

    values[0] = s.getNpmPriceInternal(1 ether); // marketPrice
    values[1] = _getDiscountRate(s); // discountRate
    values[2] = _getVestingTerm(s); // vestingTerm
    values[3] = _getMaxBondInUnit(s); // maxBond
    values[4] = _getTotalNpmAllocated(s); // totalNpmAllocated
    values[5] = _getTotalNpmDistributed(s); // totalNpmDistributed
    values[6] = IERC20(s.npmToken()).balanceOf(address(this)); // npmAvailable

    values[7] = _getYourBondContribution(s, you); // bondContribution --> total lp tokens contributed by you
    values[8] = _getYourBondClaimable(s, you); // claimable --> your total claimable NPM tokens at the end of the vesting period or "unlock date"
    values[9] = _getYourBondUnlockDate(s, you); // unlockDate --> your vesting period end or "unlock date"
  }

  function _getLpTokenAddress(IStore s) private view returns (address) {
    return s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN);
  }

  function _getYourBondContribution(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_CONTRIBUTION, you)));
  }

  function _getYourBondClaimable(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, you)));
  }

  function _getYourBondUnlockDate(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, you)));
  }

  function _getDiscountRate(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_DISCOUNT_RATE);
  }

  function _getVestingTerm(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_VESTING_TERM);
  }

  function _getMaxBondInUnit(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_MAX_UNIT);
  }

  function _getTotalNpmAllocated(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_TOTAL_NPM_ALLOCATED);
  }

  function _getTotalNpmDistributed(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_TOTAL_NPM_DISTRIBUTED);
  }

  function createBondInternal(
    IStore s,
    uint256 lpTokens,
    uint256 minNpmDesired
  ) external returns (uint256[] memory values) {
    s.mustNotBePaused();

    values = new uint256[](2);
    values[0] = calculateTokensForLpInternal(s, lpTokens); // npmToVest

    require(minNpmDesired > 0, "Invalid value: `minNpmDesired`");
    require(values[0] >= minNpmDesired, "Min bond `minNpmDesired` failed");

    // Pull the tokens from the requester's account
    IERC20(s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN)).ensureTransferFrom(msg.sender, s.getAddressByKey(BondPoolLibV1.NS_LQ_TREASURY), lpTokens);

    // To claim later
    bytes32 k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender));
    s.addUintByKey(k, values[0]);

    // Amount contributed
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_CONTRIBUTION, msg.sender));
    s.addUintByKey(k, lpTokens);

    // unlock date
    values[1] = block.timestamp + _getVestingTerm(s); // solhint-disable-line

    // Unlock date
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender));
    s.setUintByKey(k, values[1]);
  }

  function claimBondInternal(IStore s) external returns (uint256[] memory values) {
    s.mustNotBePaused();

    values = new uint256[](1);

    values[0] = _getYourBondClaimable(s, msg.sender); // npmToTransfer

    // Clear the claim amount
    s.setUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender)), 0);

    uint256 unlocksOn = _getYourBondUnlockDate(s, msg.sender);

    // Clear the unlock date
    s.setUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender)), 0);

    require(block.timestamp >= unlocksOn, "Still vesting"); // solhint-disable-line
    require(values[0] > 0, "Nothing to claim");

    s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_DISTRIBUTED, values[0]);
    IERC20(s.npmToken()).ensureTransfer(msg.sender, values[0]);
  }

  /**
   * @dev Sets up the bond pool
   * @param s Provide an instance of the store
   * @param addresses[0] - LP Token Address
   * @param addresses[1] - Treasury Address
   * @param values[0] - Bond Discount Rate
   * @param values[1] - Maximum Bond Amount
   * @param values[2] - Vesting Term
   * @param values[3] - NPM to Top Up Now
   */
  function setupBondPoolInternal(
    IStore s,
    address[] memory addresses,
    uint256[] memory values
  ) external {
    if (addresses[0] != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN, addresses[0]);
    }

    if (addresses[1] != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_LQ_TREASURY, addresses[1]);
    }

    if (values[0] > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_DISCOUNT_RATE, values[0]);
    }

    if (values[1] > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_MAX_UNIT, values[1]);
    }

    if (values[2] > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_VESTING_TERM, values[2]);
    }

    if (values[3] > 0) {
      IERC20(s.npmToken()).ensureTransferFrom(msg.sender, address(this), values[3]);
      s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_ALLOCATED, values[3]);
    }
  }
}
