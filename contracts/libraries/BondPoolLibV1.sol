// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ValidationLibV1.sol";
import "./NTransferUtilV2.sol";
import "./AccessControlLibV1.sol";
import "../interfaces/IProtocol.sol";
import "../interfaces/IPausable.sol";

library BondPoolLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using AccessControlLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

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

  function calculateTokensForLpInternal(uint256 lpTokens) public pure returns (uint256) {
    // @todo: implement this function
    return 3 * lpTokens;
  }

  function getNpmMarketPrice() public pure returns (uint256) {
    // @todo
    return 2 ether;
  }

  function getBondPoolInfoInternal(IStore s) external view returns (address[] memory addresses, uint256[] memory values) {
    addresses = new address[](1);
    values = new uint256[](7);

    addresses[0] = s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN); // lpToken

    values[0] = getNpmMarketPrice(); // marketPrice
    values[1] = s.getUintByKey(NS_BOND_DISCOUNT_RATE); // discountRate
    values[2] = s.getUintByKey(NS_BOND_VESTING_TERM); // vestingTerm
    values[3] = s.getUintByKey(NS_BOND_MAX_UNIT); // maxBond
    values[4] = s.getUintByKey(NS_BOND_TOTAL_NPM_ALLOCATED); // totalNpmAllocated
    values[5] = s.getUintByKey(NS_BOND_TOTAL_NPM_DISTRIBUTED); // totalNpmDistributed
    values[6] = IERC20(s.npmToken()).balanceOf(address(this)); // npmAvailable
  }

  function createBondInternal(
    IStore s,
    uint256 lpTokens,
    uint256 minNpmDesired
  ) external returns (uint256[] memory values) {
    s.mustNotBePaused();

    values = new uint256[](2);
    values[0] = calculateTokensForLpInternal(lpTokens); // npmToVest

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
    values[1] = block.timestamp + s.getUintByKey(BondPoolLibV1.NS_BOND_VESTING_TERM); // solhint-disable-line

    // Unlock date
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender));
    s.setUintByKey(k, values[1]);
  }

  function claimBondInternal(IStore s) external returns (uint256[] memory values) {
    s.mustNotBePaused();

    values = new uint256[](1);

    bytes32 k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender));
    values[0] = s.getUintByKey(k); // npmToTransfer

    // Clear the claim amount
    s.setUintByKey(k, 0);

    // Unlock date
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender));
    uint256 unlocksOn = s.getUintByKey(k);

    // Clear the unlock date
    s.setUintByKey(k, 0);

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
    s.mustNotBePaused();
    s.mustBeAdmin();

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
