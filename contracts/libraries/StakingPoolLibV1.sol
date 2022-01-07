// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./StoreKeyUtil.sol";
import "./ProtoUtilV1.sol";
import "./NTransferUtilV2.sol";

library StakingPoolLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;

  bytes32 public constant NS_POOL = "ns:pool:staking";
  bytes32 public constant NS_POOL_NAME = "ns:pool:staking:name";
  bytes32 public constant NS_POOL_LOCKED = "ns:pool:staking:locked";
  bytes32 public constant NS_POOL_LOCKEDUP_PERIOD = "ns:pool:staking:lockup:period";
  bytes32 public constant NS_POOL_STAKING_TARGET = "ns:pool:staking:target";
  bytes32 public constant NS_POOL_CUMULATIVE_STAKING_AMOUNT = "ns:pool:staking:cum:amount";
  bytes32 public constant NS_POOL_STAKING_TOKEN = "ns:pool:staking:token";
  bytes32 public constant NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR = "ns:pool:staking:token:uni:pair";
  bytes32 public constant NS_POOL_REWARD_TOKEN = "ns:pool:reward:token";
  bytes32 public constant NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR = "ns:pool:reward:token:uni:pair";
  bytes32 public constant NS_POOL_STAKING_TOKEN_BALANCE = "ns:pool:staking:token:balance";
  bytes32 public constant NS_POOL_REWARD_TOKEN_DEPOSITS = "ns:pool:reward:token:deposits";
  bytes32 public constant NS_POOL_REWARD_TOKEN_DISTRIBUTION = "ns:pool:reward:token:distrib";
  bytes32 public constant NS_POOL_MAX_STAKE = "ns:pool:reward:token";
  bytes32 public constant NS_POOL_REWARD_PER_BLOCK = "ns:pool:reward:per:block";
  bytes32 public constant NS_POOL_REWARD_PLATFORM_FEE = "ns:pool:reward:platform:fee";
  bytes32 public constant NS_POOL_REWARD_TOKEN_BALANCE = "ns:pool:reward:token:balance";

  bytes32 public constant NS_POOL_DEPOSIT_HEIGHTS = "ns:pool:deposit:heights";
  bytes32 public constant NS_POOL_REWARD_HEIGHTS = "ns:pool:reward:heights";
  bytes32 public constant NS_POOL_TOTAL_REWARD_GIVEN = "ns:pool:reward:total:given";

  /**
   * @dev Reports the remaining amount of tokens that can be staked in this pool
   */
  function getAvailableToStakeInternal(IStore s, bytes32 key) external view returns (uint256) {
    uint256 totalStaked = s.getUintByKeys(NS_POOL_CUMULATIVE_STAKING_AMOUNT, key);
    uint256 target = s.getUintByKeys(NS_POOL_STAKING_TARGET, key);

    if (totalStaked >= target) {
      return 0;
    }

    return target - totalStaked;
  }

  function getMaximumStakeInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(StakingPoolLibV1.NS_POOL_MAX_STAKE, key);
  }

  function getStakingTokenAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN, key);
  }

  function getPoolStakeBalanceInternal(IStore s, bytes32 key) external view returns (uint256) {
    uint256 totalStake = s.getUintByKeys(NS_POOL_STAKING_TOKEN_BALANCE, key);
    return totalStake;
  }

  function getAccountStakingBalanceInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, account);
  }

  function getTotalBlocksSinceLastRewardInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 from = s.getUintByKeys(NS_POOL_REWARD_HEIGHTS, key, account);

    if (from == 0) {
      return 0;
    }

    return block.number - from;
  }

  function calculateRewardsInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 totalBlocks = getTotalBlocksSinceLastRewardInternal(s, key, account);

    if (totalBlocks == 0) {
      return 0;
    }

    uint256 rewardPerBlock = s.getUintByKeys(NS_POOL_REWARD_PER_BLOCK, key);
    uint256 myStake = getAccountStakingBalanceInternal(s, key, account);
    return (myStake * rewardPerBlock * totalBlocks) / 1 ether;
  }

  function canWithdrawFromInternal(
    IStore s,
    bytes32 key,
    address account
  ) external view returns (uint256) {
    uint256 lastDepositHeight = s.getUintByKeys(NS_POOL_DEPOSIT_HEIGHTS, key, account);
    uint256 lockupPeriod = s.getUintByKeys(NS_POOL_LOCKEDUP_PERIOD, key);

    return lastDepositHeight + lockupPeriod;
  }

  function ensureValidStakingPool(IStore s, bytes32 key) external view {
    require(s.getBoolByKeys(NS_POOL, key), "Pool invalid or closed");
  }

  function validateAddOrEditPoolInternal(
    IStore s,
    bytes32 key,
    string memory name,
    address[] memory addresses,
    uint256[] memory values
  ) public view returns (bool) {
    require(key > 0, "Invalid key");

    bool exists = s.getBoolByKeys(NS_POOL, key);

    if (exists == false) {
      require(bytes(name).length > 0, "Invalid name");
      require(addresses[0] != address(0), "Invalid staking token");
      require(addresses[1] != address(0), "Invalid staking token pair");
      require(addresses[2] != address(0), "Invalid reward token");
      require(addresses[3] != address(0), "Invalid reward token pair");
      require(values[4] > 0, "Provide lockup period");
      require(values[5] > 0, "Provide reward token balance");
      require(values[3] > 0, "Provide reward per block");
      require(values[0] > 0, "Please provide staking target");
    }

    return exists;
  }

  /**
   * @dev Adds or edits the pool by key
   * @param key Enter the key of the pool you want to create or edit
   * @param name Enter a name for this pool
   * @param addresses[0] stakingToken The token which is staked in this pool
   * @param addresses[1] uniStakingTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   * @param addresses[2] rewardToken The token which is rewarded in this pool
   * @param addresses[3] uniRewardTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   * @param values[0] stakingTarget Specify the target amount in the staking token. You can not exceed the target.
   * @param values[1] maxStake Specify the maximum amount that can be staken at a time.
   * @param values[2] platformFee Enter the platform fee which is deducted on reward and on the reward token
   * @param values[3] rewardPerBlock Specify the amount of reward token awarded per block
   * @param values[4] lockupPeriod Enter a lockup period during when the staked tokens can't be withdrawn
   * @param values[5] rewardTokenDeposit Enter the value of reward token you are depositing in this transaction.
   */
  function addOrEditPoolInternal(
    IStore s,
    bytes32 key,
    string memory name,
    address[] memory addresses,
    uint256[] memory values
  ) external {
    bool poolExists = validateAddOrEditPoolInternal(s, key, name, addresses, values);

    if (poolExists == false) {
      _initializeNewPool(s, key, addresses);
    }

    if (bytes(name).length > 0) {
      s.setStringByKeys(NS_POOL, key, name);
    }

    _updatePoolValues(s, key, values);

    // If `values[5] --> rewardTokenDeposit` is specified, the contract
    // pulls the reward tokens to this contract address
    if (values[5] > 0) {
      IERC20(addresses[2]).ensureTransferFrom(msg.sender, address(this), values[5]);
    }
  }

  /**
   * @dev Updates the values of a staking pool by the given key
   * @param s Provide an instance of the store
   * @param key Enter the key of the pool you want to create or edit
   * @param values[0] stakingTarget Specify the target amount in the staking token. You can not exceed the target.
   * @param values[1] maxStake Specify the maximum amount that can be staken at a time.
   * @param values[2] platformFee Enter the platform fee which is deducted on reward and on the reward token
   * @param values[3] rewardPerBlock Specify the amount of reward token awarded per block
   * @param values[4] lockupPeriod Enter a lockup period during when the staked tokens can't be withdrawn
   * @param values[5] rewardTokenDeposit Enter the value of reward token you are depositing in this transaction.
   */
  function _updatePoolValues(
    IStore s,
    bytes32 key,
    uint256[] memory values
  ) private {
    if (values[0] > 0) {
      s.setUintByKeys(NS_POOL_STAKING_TARGET, key, values[0]);
    }

    if (values[1] > 0) {
      s.setUintByKeys(NS_POOL_MAX_STAKE, key, values[1]);
    }

    if (values[2] > 0) {
      s.setUintByKeys(NS_POOL_REWARD_PLATFORM_FEE, key, values[2]);
    }

    if (values[3] > 0) {
      s.setUintByKeys(NS_POOL_REWARD_PER_BLOCK, key, values[3]);
    }

    if (values[4] > 0) {
      s.addUintByKeys(NS_POOL_LOCKEDUP_PERIOD, key, values[4]);
      s.addUintByKeys(NS_POOL_LOCKEDUP_PERIOD, key, values[4]);
    }

    if (values[5] > 0) {
      s.addUintByKeys(NS_POOL_REWARD_TOKEN_DEPOSITS, key, values[5]);
      s.addUintByKeys(NS_POOL_REWARD_TOKEN_BALANCE, key, values[5]);
    }
  }

  /**
   * @dev Initializes a new pool by the given key. Assumes that the pool does not exist.
   * Warning: this feature should not be accessible outside of this library.
   * @param s Provide an instance of the store
   * @param key Enter the key of the pool you want to create or edit
   * @param addresses[0] stakingToken The token which is staked in this pool
   * @param addresses[1] uniStakingTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   * @param addresses[2] rewardToken The token which is rewarded in this pool
   * @param addresses[3] uniRewardTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   */
  function _initializeNewPool(
    IStore s,
    bytes32 key,
    address[] memory addresses
  ) private {
    s.setAddressByKeys(NS_POOL_STAKING_TOKEN, key, addresses[0]);
    s.setAddressByKeys(NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR, key, addresses[1]);
    s.setAddressByKeys(NS_POOL_REWARD_TOKEN, key, addresses[2]);
    s.setAddressByKeys(NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR, key, addresses[3]);

    s.setBoolByKeys(NS_POOL, key, true);
  }

  function withdrawRewardsInternal(
    IStore s,
    bytes32 key,
    address account
  )
    external
    returns (
      address rewardToken,
      uint256 rewards,
      uint256 platformFee
    )
  {
    rewards = calculateRewardsInternal(s, key, account);

    s.setUintByKeys(NS_POOL_REWARD_HEIGHTS, key, account, block.number);

    if (rewards == 0) {
      return (address(0), 0, 0);
    }

    rewardToken = s.getAddressByKeys(NS_POOL_REWARD_TOKEN, key);

    // Update (decrease) the balance of reward token
    s.subtractUintByKeys(NS_POOL_REWARD_TOKEN_BALANCE, key, rewards);

    // Update total rewards given
    s.addUintByKeys(NS_POOL_TOTAL_REWARD_GIVEN, key, account, rewards); // To this account
    s.addUintByKeys(NS_POOL_TOTAL_REWARD_GIVEN, key, rewards); // To everyone

    platformFee = (rewards * s.getUintByKeys(NS_POOL_REWARD_PLATFORM_FEE, key)) / ProtoUtilV1.PERCENTAGE_DIVISOR;

    IERC20(rewardToken).ensureTransfer(msg.sender, rewards - platformFee);
    IERC20(rewardToken).ensureTransfer(s.getTreasury(), rewards);
  }
}
