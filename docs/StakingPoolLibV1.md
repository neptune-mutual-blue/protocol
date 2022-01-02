# StakingPoolLibV1.sol

View Source: [contracts/libraries/StakingPoolLibV1.sol](../contracts/libraries/StakingPoolLibV1.sol)

**StakingPoolLibV1**

## Contract Members
**Constants & Variables**

```js
bytes32 public constant NS_POOL;
bytes32 public constant NS_POOL_NAME;
bytes32 public constant NS_POOL_LOCKED;
bytes32 public constant NS_POOL_LOCKEDUP_PERIOD;
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
- [getMaximumStakeInternal(IStore s, bytes32 key)](#getmaximumstakeinternal)
- [getStakingTokenAddressInternal(IStore s, bytes32 key)](#getstakingtokenaddressinternal)
- [getPoolStakeBalanceInternal(IStore s, bytes32 key)](#getpoolstakebalanceinternal)
- [getAccountStakingBalanceInternal(IStore s, bytes32 key, address account)](#getaccountstakingbalanceinternal)
- [getTotalBlocksSinceLastRewardInternal(IStore s, bytes32 key, address account)](#gettotalblockssincelastrewardinternal)
- [calculateRewardsInternal(IStore s, bytes32 key, address account)](#calculaterewardsinternal)
- [canWithdrawFromInternal(IStore s, bytes32 key, address account)](#canwithdrawfrominternal)
- [ensureValidStakingPool(IStore s, bytes32 key)](#ensurevalidstakingpool)
- [validateAddOrEditPoolInternal(IStore s, bytes32 key, string name, address[] addresses, uint256[] values)](#validateaddoreditpoolinternal)
- [addOrEditPoolInternal(IStore s, bytes32 key, string name, address[] addresses, uint256[] values)](#addoreditpoolinternal)
- [_updatePoolValues(IStore s, bytes32 key, uint256[] values)](#_updatepoolvalues)
- [_initializeNewPool(IStore s, bytes32 key, address[] addresses)](#_initializenewpool)
- [withdrawRewardsInternal(IStore s, bytes32 key, address account)](#withdrawrewardsinternal)

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
    uint256 totalStaked = s.getUintByKeys(NS_POOL_CUMULATIVE_STAKING_AMOUNT, key);
    uint256 target = s.getUintByKeys(NS_POOL_STAKING_TARGET, key);

    if (totalStaked >= target) {
      return 0;
    }

    return target - totalStaked;
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
    return s.getUintByKeys(StakingPoolLibV1.NS_POOL_MAX_STAKE, key);
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
    return s.getAddressByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN, key);
  }
```
</details>

### getPoolStakeBalanceInternal

```solidity
function getPoolStakeBalanceInternal(IStore s, bytes32 key) external view
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
function getPoolStakeBalanceInternal(IStore s, bytes32 key) external view returns (uint256) {
    uint256 totalStake = s.getUintByKeys(NS_POOL_STAKING_TOKEN_BALANCE, key);
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
    return s.getUintByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, account);
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
    uint256 from = s.getUintByKeys(NS_POOL_REWARD_HEIGHTS, key, account);

    if (from == 0) {
      return 0;
    }

    return block.number - from;
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

    uint256 rewardPerBlock = s.getUintByKeys(NS_POOL_REWARD_PER_BLOCK, key);
    uint256 myStake = getAccountStakingBalanceInternal(s, key, account);
    return (myStake * rewardPerBlock * totalBlocks) / 1 ether;
  }
```
</details>

### canWithdrawFromInternal

```solidity
function canWithdrawFromInternal(IStore s, bytes32 key, address account) external view
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
function canWithdrawFromInternal(
    IStore s,
    bytes32 key,
    address account
  ) external view returns (uint256) {
    uint256 lastDepositHeight = s.getUintByKeys(NS_POOL_DEPOSIT_HEIGHTS, key, account);
    uint256 lockupPeriod = s.getUintByKeys(NS_POOL_LOCKEDUP_PERIOD, key);

    return lastDepositHeight + lockupPeriod;
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
      s.addUintByKeys(NS_POOL_LOCKEDUP_PERIOD, key, values[4]);
      s.addUintByKeys(NS_POOL_LOCKEDUP_PERIOD, key, values[4]);
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

### withdrawRewardsInternal

```solidity
function withdrawRewardsInternal(IStore s, bytes32 key, address account) external nonpayable
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

    platformFee = (rewards * s.getUintByKeys(NS_POOL_REWARD_PLATFORM_FEE, key)) / 1 ether;

    IERC20(rewardToken).ensureTransfer(msg.sender, rewards - platformFee);
    IERC20(rewardToken).ensureTransfer(s.getTreasury(), rewards);
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
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
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [PriceDiscovery](PriceDiscovery.md)
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
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
