# StakingPoolCoreLibV1.sol

View Source: [contracts/libraries/StakingPoolCoreLibV1.sol](../contracts/libraries/StakingPoolCoreLibV1.sol)

**StakingPoolCoreLibV1**

## Contract Members
**Constants & Variables**

```js
bytes32 public constant NS_POOL;
bytes32 public constant NS_POOL_NAME;
bytes32 public constant NS_POOL_LOCKED;
bytes32 public constant NS_POOL_LOCKUP_PERIOD_IN_BLOCKS;
bytes32 public constant NS_POOL_STAKING_TARGET;
bytes32 public constant NS_POOL_CUMULATIVE_STAKING_AMOUNT;
bytes32 public constant NS_POOL_STAKING_TOKEN;
bytes32 public constant NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR;
bytes32 public constant NS_POOL_REWARD_TOKEN;
bytes32 public constant NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR;
bytes32 public constant NS_POOL_STAKING_TOKEN_BALANCE;
bytes32 public constant NS_POOL_REWARD_TOKEN_DEPOSITS;
bytes32 public constant NS_POOL_REWARD_TOKEN_DISTRIBUTION;
bytes32 public constant NS_POOL_MAX_STAKE;
bytes32 public constant NS_POOL_REWARD_PER_BLOCK;
bytes32 public constant NS_POOL_REWARD_PLATFORM_FEE;
bytes32 public constant NS_POOL_REWARD_TOKEN_BALANCE;
bytes32 public constant NS_POOL_DEPOSIT_HEIGHTS;
bytes32 public constant NS_POOL_REWARD_HEIGHTS;
bytes32 public constant NS_POOL_TOTAL_REWARD_GIVEN;

```

## Functions

- [getAvailableToStakeInternal(IStore s, bytes32 key)](#getavailabletostakeinternal)
- [getTargetInternal(IStore s, bytes32 key)](#gettargetinternal)
- [getRewardPlatformFeeInternal(IStore s, bytes32 key)](#getrewardplatformfeeinternal)
- [getTotalStakedInternal(IStore s, bytes32 key)](#gettotalstakedinternal)
- [getRewardPerBlockInternal(IStore s, bytes32 key)](#getrewardperblockinternal)
- [getLockupPeriodInBlocksInternal(IStore s, bytes32 key)](#getlockupperiodinblocksinternal)
- [getRewardTokenBalanceInternal(IStore s, bytes32 key)](#getrewardtokenbalanceinternal)
- [getMaximumStakeInternal(IStore s, bytes32 key)](#getmaximumstakeinternal)
- [getStakingTokenAddressInternal(IStore s, bytes32 key)](#getstakingtokenaddressinternal)
- [getStakingTokenStablecoinPairAddressInternal(IStore s, bytes32 key)](#getstakingtokenstablecoinpairaddressinternal)
- [getRewardTokenAddressInternal(IStore s, bytes32 key)](#getrewardtokenaddressinternal)
- [getRewardTokenStablecoinPairAddressInternal(IStore s, bytes32 key)](#getrewardtokenstablecoinpairaddressinternal)
- [ensureValidStakingPoolInternal(IStore s, bytes32 key)](#ensurevalidstakingpoolinternal)
- [checkIfStakingPoolExistsInternal(IStore s, bytes32 key)](#checkifstakingpoolexistsinternal)
- [validateAddOrEditPoolInternal(IStore s, struct IStakingPools.AddOrEditPoolArgs args)](#validateaddoreditpoolinternal)
- [addOrEditPoolInternal(IStore s, struct IStakingPools.AddOrEditPoolArgs args)](#addoreditpoolinternal)
- [_updatePoolValues(IStore s, struct IStakingPools.AddOrEditPoolArgs args)](#_updatepoolvalues)
- [_initializeNewPool(IStore s, struct IStakingPools.AddOrEditPoolArgs args)](#_initializenewpool)

### getAvailableToStakeInternal

Reports the remaining amount of tokens that can be staked in this pool

```solidity
function getAvailableToStakeInternal(IStore s, bytes32 key) external view
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
function getAvailableToStakeInternal(IStore s, bytes32 key) external view returns (uint256) {
    uint256 totalStaked = getTotalStakedInternal(s, key);
    uint256 target = getTargetInternal(s, key);

    if (totalStaked >= target) {
      return 0;
    }

    return target - totalStaked;
  }
```
</details>

### getTargetInternal

```solidity
function getTargetInternal(IStore s, bytes32 key) public view
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
function getTargetInternal(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(NS_POOL_STAKING_TARGET, key);
  }
```
</details>

### getRewardPlatformFeeInternal

```solidity
function getRewardPlatformFeeInternal(IStore s, bytes32 key) external view
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
function getRewardPlatformFeeInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_PLATFORM_FEE, key);
  }
```
</details>

### getTotalStakedInternal

```solidity
function getTotalStakedInternal(IStore s, bytes32 key) public view
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
function getTotalStakedInternal(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(NS_POOL_CUMULATIVE_STAKING_AMOUNT, key);
  }
```
</details>

### getRewardPerBlockInternal

```solidity
function getRewardPerBlockInternal(IStore s, bytes32 key) external view
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
function getRewardPerBlockInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_PER_BLOCK, key);
  }
```
</details>

### getLockupPeriodInBlocksInternal

```solidity
function getLockupPeriodInBlocksInternal(IStore s, bytes32 key) external view
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
function getLockupPeriodInBlocksInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_LOCKUP_PERIOD_IN_BLOCKS, key);
  }
```
</details>

### getRewardTokenBalanceInternal

```solidity
function getRewardTokenBalanceInternal(IStore s, bytes32 key) external view
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
function getRewardTokenBalanceInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_TOKEN_BALANCE, key);
  }
```
</details>

### getMaximumStakeInternal

```solidity
function getMaximumStakeInternal(IStore s, bytes32 key) external view
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
function getMaximumStakeInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_MAX_STAKE, key);
  }
```
</details>

### getStakingTokenAddressInternal

```solidity
function getStakingTokenAddressInternal(IStore s, bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakingTokenAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_STAKING_TOKEN, key);
  }
```
</details>

### getStakingTokenStablecoinPairAddressInternal

```solidity
function getStakingTokenStablecoinPairAddressInternal(IStore s, bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakingTokenStablecoinPairAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR, key);
  }
```
</details>

### getRewardTokenAddressInternal

```solidity
function getRewardTokenAddressInternal(IStore s, bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getRewardTokenAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_REWARD_TOKEN, key);
  }
```
</details>

### getRewardTokenStablecoinPairAddressInternal

```solidity
function getRewardTokenStablecoinPairAddressInternal(IStore s, bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getRewardTokenStablecoinPairAddressInternal(IStore s, bytes32 key) external view returns (address) {
    return s.getAddressByKeys(NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR, key);
  }
```
</details>

### ensureValidStakingPoolInternal

```solidity
function ensureValidStakingPoolInternal(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function ensureValidStakingPoolInternal(IStore s, bytes32 key) external view {
    require(checkIfStakingPoolExistsInternal(s, key), "Pool invalid or closed");
  }
```
</details>

### checkIfStakingPoolExistsInternal

```solidity
function checkIfStakingPoolExistsInternal(IStore s, bytes32 key) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function checkIfStakingPoolExistsInternal(IStore s, bytes32 key) public view returns (bool) {
    return s.getBoolByKeys(NS_POOL, key);
  }
```
</details>

### validateAddOrEditPoolInternal

```solidity
function validateAddOrEditPoolInternal(IStore s, struct IStakingPools.AddOrEditPoolArgs args) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| args | struct IStakingPools.AddOrEditPoolArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function validateAddOrEditPoolInternal(IStore s, IStakingPools.AddOrEditPoolArgs calldata args) public view returns (bool) {
    require(args.key > 0, "Invalid key");

    bool exists = checkIfStakingPoolExistsInternal(s, args.key);

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
```
</details>

### addOrEditPoolInternal

Adds or edits the pool by key

```solidity
function addOrEditPoolInternal(IStore s, struct IStakingPools.AddOrEditPoolArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| args | struct IStakingPools.AddOrEditPoolArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### _updatePoolValues

Updates the values of a staking pool by the given key

```solidity
function _updatePoolValues(IStore s, struct IStakingPools.AddOrEditPoolArgs args) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide an instance of the store | 
| args | struct IStakingPools.AddOrEditPoolArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### _initializeNewPool

Initializes a new pool by the given key. Assumes that the pool does not exist.

```solidity
function _initializeNewPool(IStore s, struct IStakingPools.AddOrEditPoolArgs args) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide an instance of the store | 
| args | struct IStakingPools.AddOrEditPoolArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _initializeNewPool(IStore s, IStakingPools.AddOrEditPoolArgs calldata args) private {
    s.setAddressByKeys(NS_POOL_STAKING_TOKEN, args.key, args.stakingToken);
    s.setAddressByKeys(NS_POOL_STAKING_TOKEN_UNI_STABLECOIN_PAIR, args.key, args.uniStakingTokenDollarPair);
    s.setAddressByKeys(NS_POOL_REWARD_TOKEN, args.key, args.rewardToken);
    s.setAddressByKeys(NS_POOL_REWARD_TOKEN_UNI_STABLECOIN_PAIR, args.key, args.uniRewardTokenDollarPair);

    s.setBoolByKeys(NS_POOL, args.key, true);
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
* [FakeCompoundDaiDelegator](FakeCompoundDaiDelegator.md)
* [FakePriceOracle](FakePriceOracle.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [FaultyAaveLendingPool](FaultyAaveLendingPool.md)
* [FaultyCompoundDaiDelegator](FaultyCompoundDaiDelegator.md)
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
