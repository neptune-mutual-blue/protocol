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
- [getTarget(IStore s, bytes32 key)](#gettarget)
- [getRewardPlatformFee(IStore s, bytes32 key)](#getrewardplatformfee)
- [getTotalStaked(IStore s, bytes32 key)](#gettotalstaked)
- [getRewardPerBlock(IStore s, bytes32 key)](#getrewardperblock)
- [getLockupPeriodInBlocks(IStore s, bytes32 key)](#getlockupperiodinblocks)
- [getRewardTokenBalance(IStore s, bytes32 key)](#getrewardtokenbalance)
- [getMaximumStakeInternal(IStore s, bytes32 key)](#getmaximumstakeinternal)
- [getStakingTokenAddressInternal(IStore s, bytes32 key)](#getstakingtokenaddressinternal)
- [getStakingTokenStablecoinPairAddressInternal(IStore s, bytes32 key)](#getstakingtokenstablecoinpairaddressinternal)
- [getRewardTokenAddressInternal(IStore s, bytes32 key)](#getrewardtokenaddressinternal)
- [getRewardTokenStablecoinPairAddressInternal(IStore s, bytes32 key)](#getrewardtokenstablecoinpairaddressinternal)
- [ensureValidStakingPool(IStore s, bytes32 key)](#ensurevalidstakingpool)
- [validateAddOrEditPoolInternal(IStore s, bytes32 key, string name, address[] addresses, uint256[] values)](#validateaddoreditpoolinternal)
- [addOrEditPoolInternal(IStore s, bytes32 key, string name, address[] addresses, uint256[] values)](#addoreditpoolinternal)
- [_updatePoolValues(IStore s, bytes32 key, uint256[] values)](#_updatepoolvalues)
- [_initializeNewPool(IStore s, bytes32 key, address[] addresses)](#_initializenewpool)

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
    uint256 totalStaked = getTotalStaked(s, key);
    uint256 target = getTarget(s, key);

    if (totalStaked >= target) {
      return 0;
    }

    return target - totalStaked;
  }
```
</details>

### getTarget

```solidity
function getTarget(IStore s, bytes32 key) public view
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
function getTarget(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(NS_POOL_STAKING_TARGET, key);
  }
```
</details>

### getRewardPlatformFee

```solidity
function getRewardPlatformFee(IStore s, bytes32 key) external view
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
function getRewardPlatformFee(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_PLATFORM_FEE, key);
  }
```
</details>

### getTotalStaked

```solidity
function getTotalStaked(IStore s, bytes32 key) public view
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
function getTotalStaked(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(NS_POOL_CUMULATIVE_STAKING_AMOUNT, key);
  }
```
</details>

### getRewardPerBlock

```solidity
function getRewardPerBlock(IStore s, bytes32 key) external view
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
function getRewardPerBlock(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_REWARD_PER_BLOCK, key);
  }
```
</details>

### getLockupPeriodInBlocks

```solidity
function getLockupPeriodInBlocks(IStore s, bytes32 key) external view
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
function getLockupPeriodInBlocks(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(NS_POOL_LOCKUP_PERIOD_IN_BLOCKS, key);
  }
```
</details>

### getRewardTokenBalance

```solidity
function getRewardTokenBalance(IStore s, bytes32 key) external view
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
function getRewardTokenBalance(IStore s, bytes32 key) external view returns (uint256) {
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

### ensureValidStakingPool

```solidity
function ensureValidStakingPool(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function ensureValidStakingPool(IStore s, bytes32 key) external view {
    require(s.getBoolByKeys(NS_POOL, key), "Pool invalid or closed");
  }
```
</details>

### validateAddOrEditPoolInternal

```solidity
function validateAddOrEditPoolInternal(IStore s, bytes32 key, string name, address[] addresses, uint256[] values) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| name | string |  | 
| addresses | address[] |  | 
| values | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
      // require(addresses[1] != address(0), "Invalid staking token pair"); // A POD doesn't have any pair with stablecion
      require(addresses[2] != address(0), "Invalid reward token");
      require(addresses[3] != address(0), "Invalid reward token pair");
      require(values[4] > 0, "Provide lockup period in blocks");
      require(values[5] > 0, "Provide reward token balance");
      require(values[3] > 0, "Provide reward per block");
      require(values[0] > 0, "Please provide staking target");
    }

    return exists;
  }
```
</details>

### addOrEditPoolInternal

Adds or edits the pool by key

```solidity
function addOrEditPoolInternal(IStore s, bytes32 key, string name, address[] addresses, uint256[] values) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the key of the pool you want to create or edit | 
| name | string | Enter a name for this pool | 
| addresses | address[] | [0] stakingToken The token which is staked in this pool | 
| values | uint256[] | [0] stakingTarget Specify the target amount in the staking token. You can not exceed the target. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### _updatePoolValues

Updates the values of a staking pool by the given key

```solidity
function _updatePoolValues(IStore s, bytes32 key, uint256[] values) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide an instance of the store | 
| key | bytes32 | Enter the key of the pool you want to create or edit | 
| values | uint256[] | [0] stakingTarget Specify the target amount in the staking token. You can not exceed the target. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
      s.setUintByKeys(NS_POOL_LOCKUP_PERIOD_IN_BLOCKS, key, values[4]);
    }

    if (values[5] > 0) {
      s.addUintByKeys(NS_POOL_REWARD_TOKEN_DEPOSITS, key, values[5]);
      s.addUintByKeys(NS_POOL_REWARD_TOKEN_BALANCE, key, values[5]);
    }
  }
```
</details>

### _initializeNewPool

Initializes a new pool by the given key. Assumes that the pool does not exist.
 Warning: this feature should not be accessible outside of this library.

```solidity
function _initializeNewPool(IStore s, bytes32 key, address[] addresses) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide an instance of the store | 
| key | bytes32 | Enter the key of the pool you want to create or edit | 
| addresses | address[] | [0] stakingToken The token which is staked in this pool | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
* [CoverProvision](CoverProvision.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundERC20Delegator](FakeCompoundERC20Delegator.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
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
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IRecoverable](IRecoverable.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PriceDiscovery](PriceDiscovery.md)
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
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [WithFlashLoan](WithFlashLoan.md)
* [Witness](Witness.md)
