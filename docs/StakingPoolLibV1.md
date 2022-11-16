# StakingPoolLibV1.sol

View Source: [contracts/libraries/StakingPoolLibV1.sol](../contracts/libraries/StakingPoolLibV1.sol)

**StakingPoolLibV1**

## Functions

- [getInfoInternal(IStore s, bytes32 key, address you)](#getinfointernal)
- [getPoolStakeBalanceInternal(IStore s, bytes32 key)](#getpoolstakebalanceinternal)
- [getPoolCumulativeDepositsInternal(IStore s, bytes32 key)](#getpoolcumulativedepositsinternal)
- [getAccountStakingBalanceInternal(IStore s, bytes32 key, address account)](#getaccountstakingbalanceinternal)
- [getTotalBlocksSinceLastRewardInternal(IStore s, bytes32 key, address account)](#gettotalblockssincelastrewardinternal)
- [canWithdrawFromBlockHeightInternal(IStore s, bytes32 key, address account)](#canwithdrawfromblockheightinternal)
- [getLastDepositHeightInternal(IStore s, bytes32 key, address account)](#getlastdepositheightinternal)
- [getLastRewardHeightInternal(IStore s, bytes32 key, address account)](#getlastrewardheightinternal)
- [calculateRewardsInternal(IStore s, bytes32 key, address account)](#calculaterewardsinternal)
- [withdrawRewardsInternal(IStore s, bytes32 key, address account)](#withdrawrewardsinternal)
- [depositInternal(IStore s, bytes32 key, uint256 amount)](#depositinternal)
- [withdrawInternal(IStore s, bytes32 key, uint256 amount)](#withdrawinternal)

### getInfoInternal

Gets the info of a given staking pool by key

```solidity
function getInfoInternal(IStore s, bytes32 key, address you) external view
returns(info struct IStakingPools.StakingPoolInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify the store instance | 
| key | bytes32 | Provide the staking pool key to fetch info for | 
| you | address | Specify the address to customize the info for | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfoInternal(
    IStore s,
    bytes32 key,
    address you
  ) external view returns (IStakingPools.StakingPoolInfoType memory info) {
    bool valid = s.checkIfStakingPoolExistsInternal(key);

    if (valid) {
      info.name = s.getStringByKeys(StakingPoolCoreLibV1.NS_POOL, key);

      info.stakingToken = s.getStakingTokenAddressInternal(key);
      info.stakingTokenStablecoinPair = s.getStakingTokenStablecoinPairAddressInternal(key);
      info.rewardToken = s.getRewardTokenAddressInternal(key);
      info.rewardTokenStablecoinPair = s.getRewardTokenStablecoinPairAddressInternal(key);

      info.totalStaked = s.getTotalStakedInternal(key);
      info.target = s.getTargetInternal(key);
      info.maximumStake = s.getMaximumStakeInternal(key);
      info.stakeBalance = getPoolStakeBalanceInternal(s, key);
      info.cumulativeDeposits = getPoolCumulativeDepositsInternal(s, key);
      info.rewardPerBlock = s.getRewardPerBlockInternal(key);
      info.platformFee = s.getRewardPlatformFeeInternal(key);
      info.lockupPeriod = s.getLockupPeriodInBlocksInternal(key);
      info.rewardTokenBalance = s.getRewardTokenBalanceInternal(key);
      info.accountStakeBalance = getAccountStakingBalanceInternal(s, key, you);
      info.totalBlockSinceLastReward = getTotalBlocksSinceLastRewardInternal(s, key, you);
      info.rewards = calculateRewardsInternal(s, key, you);
      info.canWithdrawFromBlockHeight = canWithdrawFromBlockHeightInternal(s, key, you);
      info.lastDepositHeight = getLastDepositHeightInternal(s, key, you);
      info.lastRewardHeight = getLastRewardHeightInternal(s, key, you);
    }
  }
```
</details>

### getPoolStakeBalanceInternal

```solidity
function getPoolStakeBalanceInternal(IStore s, bytes32 key) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPoolStakeBalanceInternal(IStore s, bytes32 key) public view returns (uint256) {
    uint256 totalStake = s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key);
    return totalStake;
  }
```
</details>

### getPoolCumulativeDepositsInternal

```solidity
function getPoolCumulativeDepositsInternal(IStore s, bytes32 key) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPoolCumulativeDepositsInternal(IStore s, bytes32 key) public view returns (uint256) {
    uint256 totalStake = s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_CUMULATIVE_STAKING_AMOUNT, key);
    return totalStake;
  }
```
</details>

### getAccountStakingBalanceInternal

```solidity
function getAccountStakingBalanceInternal(IStore s, bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAccountStakingBalanceInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, account);
  }
```
</details>

### getTotalBlocksSinceLastRewardInternal

```solidity
function getTotalBlocksSinceLastRewardInternal(IStore s, bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getTotalBlocksSinceLastRewardInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 from = getLastRewardHeightInternal(s, key, account);

    if (from == 0) {
      return 0;
    }

    return block.number - from;
  }
```
</details>

### canWithdrawFromBlockHeightInternal

```solidity
function canWithdrawFromBlockHeightInternal(IStore s, bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function canWithdrawFromBlockHeightInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 lastDepositHeight = getLastDepositHeightInternal(s, key, account);

    if (lastDepositHeight == 0) {
      return 0;
    }

    uint256 lockupPeriod = s.getLockupPeriodInBlocksInternal(key);

    return lastDepositHeight + lockupPeriod;
  }
```
</details>

### getLastDepositHeightInternal

```solidity
function getLastDepositHeightInternal(IStore s, bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLastDepositHeightInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_DEPOSIT_HEIGHTS, key, account);
  }
```
</details>

### getLastRewardHeightInternal

```solidity
function getLastRewardHeightInternal(IStore s, bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLastRewardHeightInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_HEIGHTS, key, account);
  }
```
</details>

### calculateRewardsInternal

```solidity
function calculateRewardsInternal(IStore s, bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateRewardsInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 totalBlocks = getTotalBlocksSinceLastRewardInternal(s, key, account);

    if (totalBlocks == 0) {
      return 0;
    }

    uint256 rewardPerBlock = s.getRewardPerBlockInternal(key);
    uint256 myStake = getAccountStakingBalanceInternal(s, key, account);
    uint256 rewards = (myStake * rewardPerBlock * totalBlocks) / 1 ether;

    uint256 poolBalance = s.getRewardTokenBalanceInternal(key);

    return rewards > poolBalance ? poolBalance : rewards;
  }
```
</details>

### withdrawRewardsInternal

Withdraws the rewards of the caller (if any or if available).

```solidity
function withdrawRewardsInternal(IStore s, bytes32 key, address account) public nonpayable
returns(rewardToken address, rewards uint256, platformFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawRewardsInternal(
    IStore s,
    bytes32 key,
    address account
  )
    public
    returns (
      address rewardToken,
      uint256 rewards,
      uint256 platformFee
    )
  {
    require(s.getRewardPlatformFeeInternal(key) <= ProtoUtilV1.MULTIPLIER, "Invalid reward platform fee");
    rewards = calculateRewardsInternal(s, key, account);

    s.setUintByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_HEIGHTS, key, account, block.number);

    if (rewards == 0) {
      return (address(0), 0, 0);
    }

    rewardToken = s.getAddressByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_TOKEN, key);

    // Update (decrease) the balance of reward token
    s.subtractUintByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_TOKEN_BALANCE, key, rewards);

    // Update total rewards given
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_TOTAL_REWARD_GIVEN, key, account, rewards); // To this account
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_TOTAL_REWARD_GIVEN, key, rewards); // To everyone

    // @suppress-division Checked side effects. If the reward platform fee is zero
    // or a very small number, platform fee becomes zero because of data loss
    platformFee = (rewards * s.getRewardPlatformFeeInternal(key)) / ProtoUtilV1.MULTIPLIER;

    // @suppress-subtraction If `getRewardPlatformFeeInternal` is 100%, the following can result in zero value.
    if (rewards - platformFee > 0) {
      IERC20(rewardToken).ensureTransfer(msg.sender, rewards - platformFee);
    }

    if (platformFee > 0) {
      IERC20(rewardToken).ensureTransfer(s.getTreasuryAddressInternal(), platformFee);
    }
  }
```
</details>

### depositInternal

Deposit the specified amount of staking token to the specified pool.

```solidity
function depositInternal(IStore s, bytes32 key, uint256 amount) external nonpayable
returns(stakingToken address, rewardToken address, rewards uint256, rewardsPlatformFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function depositInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  )
    external
    returns (
      address stakingToken,
      address rewardToken,
      uint256 rewards,
      uint256 rewardsPlatformFee
    )
  {
    require(amount > 0, "Enter an amount");
    require(amount <= s.getMaximumStakeInternal(key), "Stake too high");
    require(amount <= s.getAvailableToStakeInternal(key), "Target achieved or cap exceeded");

    stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    (rewardToken, rewards, rewardsPlatformFee) = withdrawRewardsInternal(s, key, msg.sender);

    // Individual state
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, msg.sender, amount);
    s.setUintByKeys(StakingPoolCoreLibV1.NS_POOL_DEPOSIT_HEIGHTS, key, msg.sender, block.number);

    // Global state
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, amount);
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_CUMULATIVE_STAKING_AMOUNT, key, amount);

    IERC20(stakingToken).ensureTransferFrom(msg.sender, address(this), amount);
  }
```
</details>

### withdrawInternal

Withdraw the specified amount of staking token from the specified pool.

```solidity
function withdrawInternal(IStore s, bytes32 key, uint256 amount) external nonpayable
returns(stakingToken address, rewardToken address, rewards uint256, rewardsPlatformFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  )
    external
    returns (
      address stakingToken,
      address rewardToken,
      uint256 rewards,
      uint256 rewardsPlatformFee
    )
  {
    require(amount > 0, "Please specify amount");

    require(getAccountStakingBalanceInternal(s, key, msg.sender) >= amount, "Insufficient balance");
    require(block.number >= canWithdrawFromBlockHeightInternal(s, key, msg.sender), "Withdrawal too early");

    stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    (rewardToken, rewards, rewardsPlatformFee) = withdrawRewardsInternal(s, key, msg.sender);

    // @suppress-subtraction The maximum amount that can be withdrawn is the staked balance
    // and therefore underflow is not possible.
    // Individual state
    s.subtractUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, msg.sender, amount);

    // Global state
    s.subtractUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, amount);

    IERC20(stakingToken).ensureTransfer(msg.sender, amount);
  }
```
</details>

## Contracts

* [AaveStrategy](AaveStrategy.md)
* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
* [CompoundStrategy](CompoundStrategy.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Delayable](Delayable.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundStablecoinDelegator](FakeCompoundStablecoinDelegator.md)
* [FakePriceOracle](FakePriceOracle.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [FaultyAaveLendingPool](FaultyAaveLendingPool.md)
* [FaultyCompoundStablecoinDelegator](FaultyCompoundStablecoinDelegator.md)
* [Finalization](Finalization.md)
* [ForceEther](ForceEther.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Detailed](IERC20Detailed.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [ILendingStrategy](ILendingStrategy.md)
* [ILiquidityEngine](ILiquidityEngine.md)
* [IMember](IMember.md)
* [INeptuneRouterV1](INeptuneRouterV1.md)
* [InvalidStrategy](InvalidStrategy.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceOracle](IPriceOracle.md)
* [IProtocol](IProtocol.md)
* [IRecoverable](IRecoverable.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IStoreLike](IStoreLike.md)
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultDelegate](IVaultDelegate.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [MockAccessControlUser](MockAccessControlUser.md)
* [MockCoverUtilUser](MockCoverUtilUser.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockFlashBorrower](MockFlashBorrower.md)
* [MockLiquidityEngineUser](MockLiquidityEngineUser.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockRegistryClient](MockRegistryClient.md)
* [MockStore](MockStore.md)
* [MockStoreKeyUtilUser](MockStoreKeyUtilUser.md)
* [MockValidationLibUser](MockValidationLibUser.md)
* [MockVault](MockVault.md)
* [MockVaultLibUser](MockVaultLibUser.md)
* [NeptuneRouterV1](NeptuneRouterV1.md)
* [NPM](NPM.md)
* [NpmDistributor](NpmDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
* [POT](POT.md)
* [PriceLibV1](PriceLibV1.md)
* [Processor](Processor.md)
* [ProtoBase](ProtoBase.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [Resolution](Resolution.md)
* [Resolvable](Resolvable.md)
* [RoutineInvokerLibV1](RoutineInvokerLibV1.md)
* [SafeERC20](SafeERC20.md)
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolCoreLibV1](StakingPoolCoreLibV1.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [StrategyLibV1](StrategyLibV1.md)
* [Strings](Strings.md)
* [TimelockController](TimelockController.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultDelegate](VaultDelegate.md)
* [VaultDelegateBase](VaultDelegateBase.md)
* [VaultDelegateWithFlashLoan](VaultDelegateWithFlashLoan.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [VaultLiquidity](VaultLiquidity.md)
* [VaultStrategy](VaultStrategy.md)
* [WithFlashLoan](WithFlashLoan.md)
* [WithPausability](WithPausability.md)
* [WithRecovery](WithRecovery.md)
* [Witness](Witness.md)
