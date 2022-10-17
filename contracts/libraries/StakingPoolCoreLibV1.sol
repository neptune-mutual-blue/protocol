// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStakingPools.sol";
import "./NTransferUtilV2.sol";
import "./StoreKeyUtil.sol";

library StakingPoolCoreLibV1 {
  using NTransferUtilV2 for IERC20;
  using StoreKeyUtil for IStore;

  bytes32 public constant NS_POOL = "ns:pool:staking";
  bytes32 public constant NS_POOL_NAME = "ns:pool:staking:name";
  bytes32 public constant NS_POOL_LOCKED = "ns:pool:staking:locked";
  bytes32 public constant NS_POOL_LOCKUP_PERIOD_IN_BLOCKS = "ns:pool:staking:lockup:period";
  bytes32 public constant NS_POOL_STAKING_TARGET = "ns:pool:staking:target";
  bytes32 public constant NS_POOL_CUMULATIVE_STAKING_AMOUNT = "ns:pool:staking:cum:amount";
  bytes32 public constant NS_POOL_STAKING_TOKEN = "ns:pool:staking:token";
  bytes32 public constant NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR = "ns:pool:staking:token:uni:pair";
  bytes32 public constant NS_POOL_REWARD_TOKEN = "ns:pool:reward:token";
  bytes32 public constant NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR = "ns:pool:reward:token:uni:pair";
  bytes32 public constant NS_POOL_STAKING_TOKEN_BALANCE = "ns:pool:staking:token:balance";
  bytes32 public constant NS_POOL_REWARD_TOKEN_DEPOSITS = "ns:pool:reward:token:deposits";
  bytes32 public constant NS_POOL_REWARD_TOKEN_DISTRIBUTION = "ns:pool:reward:token:distrib";
  bytes32 public constant NS_POOL_MAX_STAKE = "ns:pool:max:stake";
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
    uint256 totalStaked = getTotalStaked(s, key);
    uint256 target = getTarget(s, key);

    if (totalStaked >= target) {
      return 0;
    }

    return target - totalStaked;
  }

  function getTarget(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(NS_POOL_STAKING_TARGET, key);
  }

  function getRewardPlatformFee(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_PLATFORM_FEE, key);
  }

  function getTotalStaked(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(NS_POOL_CUMULATIVE_STAKING_AMOUNT, key);
  }

  function getRewardPerBlock(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_PER_BLOCK, key);
  }

  function getLockupPeriodInBlocks(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_LOCKUP_PERIOD_IN_BLOCKS, key);
  }

  function getRewardTokenBalance(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_TOKEN_BALANCE, key);
  }

  function getMaximumStakeInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_MAX_STAKE, key);
  }

  function getStakingTokenAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_STAKING_TOKEN, key);
  }

  function getStakingTokenStablecoinPairAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR, key);
  }

  function getRewardTokenAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_REWARD_TOKEN, key);
  }

  function getRewardTokenStablecoinPairAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR, key);
  }

  function ensureValidStakingPool(IStore s, bytes32 key) external view {
    require(checkIfStakingPoolExists(s, key), "Pool invalid or closed");
  }

  function checkIfStakingPoolExists(IStore s, bytes32 key) public view returns (bool) {
    return s.getBoolByKeys(NS_POOL, key);
  }

  function validateAddOrEditPoolInternal(IStore s, IStakingPools.AddOrEditPoolArgs calldata args) public view returns (bool) {
    require(args.key > 0, "Invalid key");

    bool exists = checkIfStakingPoolExists(s, args.key);

    if (exists == false) {
      require(bytes(args.name).length > 0, "Invalid name");
      require(args.stakingToken != address(0), "Invalid staking token");
      // require(addresses[1] != address(0), "Invalid staking token pair"); // A POD doesn't have any pair with stablecion
      require(args.rewardToken != address(0), "Invalid reward token");
      require(args.uniRewardTokenDollarPair != address(0), "Invalid reward token pair");
      require(args.lockupPeriod > 0, "Provide lockup period in blocks");
      require(args.rewardTokenToDeposit > 0, "Provide reward token allocation");
      require(args.rewardPerBlock > 0, "Provide reward per block");
      require(args.stakingTarget > 0, "Please provide staking target");
    }

    return exists;
  }

  /**
   * @dev Adds or edits the pool by key
   *
   * @custom:suppress-malicious-erc Risk tolerable. The ERC-20 `addresses[1]`, `addresses[2]`, and `addresses[3]` can be trusted
   * as these can be supplied only by an admin.
   *
   */
  function addOrEditPoolInternal(IStore s, IStakingPools.AddOrEditPoolArgs calldata args) external {
    // @suppress-zero-value-check The uint values are checked in the function `validateAddOrEditPoolInternal`
    bool poolExists = validateAddOrEditPoolInternal(s, args);

    if (poolExists == false) {
      _initializeNewPool(s, args);
    }

    if (bytes(args.name).length > 0) {
      s.setStringByKeys(NS_POOL, args.key, args.name);
    }

    _updatePoolValues(s, args);

    if (args.rewardTokenToDeposit > 0) {
      IERC20(args.rewardToken).ensureTransferFrom(msg.sender, address(this), args.rewardTokenToDeposit);
    }
  }

  /**
   * @dev Updates the values of a staking pool by the given key
   * @param s Provide an instance of the store
   */
  function _updatePoolValues(IStore s, IStakingPools.AddOrEditPoolArgs calldata args) private {
    if (args.stakingTarget > 0) {
      s.setUintByKeys(NS_POOL_STAKING_TARGET, args.key, args.stakingTarget);
    }

    if (args.maxStake > 0) {
      s.setUintByKeys(NS_POOL_MAX_STAKE, args.key, args.maxStake);
    }

    if (args.platformFee > 0) {
      s.setUintByKeys(NS_POOL_REWARD_PLATFORM_FEE, args.key, args.platformFee);
    }

    if (args.rewardPerBlock > 0) {
      s.setUintByKeys(NS_POOL_REWARD_PER_BLOCK, args.key, args.rewardPerBlock);
    }

    if (args.lockupPeriod > 0) {
      s.setUintByKeys(NS_POOL_LOCKUP_PERIOD_IN_BLOCKS, args.key, args.lockupPeriod);
    }

    if (args.rewardTokenToDeposit > 0) {
      s.addUintByKeys(NS_POOL_REWARD_TOKEN_DEPOSITS, args.key, args.rewardTokenToDeposit);
      s.addUintByKeys(NS_POOL_REWARD_TOKEN_BALANCE, args.key, args.rewardTokenToDeposit);
    }
  }

  /**
   * @dev Initializes a new pool by the given key. Assumes that the pool does not exist.
   *
   * @custom:warning This feature should not be accessible outside of this library.
   *
   * @param s Provide an instance of the store
   *
   */
  function _initializeNewPool(IStore s, IStakingPools.AddOrEditPoolArgs calldata args) private {
    s.setAddressByKeys(NS_POOL_STAKING_TOKEN, args.key, args.stakingToken);
    s.setAddressByKeys(NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR, args.key, args.uniStakingTokenDollarPair);
    s.setAddressByKeys(NS_POOL_REWARD_TOKEN, args.key, args.rewardToken);
    s.setAddressByKeys(NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR, args.key, args.uniRewardTokenDollarPair);

    s.setBoolByKeys(NS_POOL, args.key, true);
  }
}
