# StakingPoolLibV1.sol

View Source: [contracts/libraries/StakingPoolLibV1.sol](../contracts/libraries/StakingPoolLibV1.sol)

**StakingPoolLibV1**

## Functions

- [getInfoInternal(IStore s, bytes32 key, address you)](#getinfointernal)
- [getPoolStakeBalanceInternal(IStore s, bytes32 key)](#getpoolstakebalanceinternal)
- [getPoolCumulativeDeposits(IStore s, bytes32 key)](#getpoolcumulativedeposits)
- [getAccountStakingBalanceInternal(IStore s, bytes32 key, address account)](#getaccountstakingbalanceinternal)
- [getTotalBlocksSinceLastRewardInternal(IStore s, bytes32 key, address account)](#gettotalblockssincelastrewardinternal)
- [canWithdrawFromBlockHeightInternal(IStore s, bytes32 key, address account)](#canwithdrawfromblockheightinternal)
- [getLastDepositHeight(IStore s, bytes32 key, address account)](#getlastdepositheight)
- [getLastRewardHeight(IStore s, bytes32 key, address account)](#getlastrewardheight)
- [calculateRewardsInternal(IStore s, bytes32 key, address account)](#calculaterewardsinternal)
- [withdrawRewardsInternal(IStore s, bytes32 key, address account)](#withdrawrewardsinternal)
- [depositInternal(IStore s, bytes32 key, uint256 amount)](#depositinternal)
- [withdrawInternal(IStore s, bytes32 key, uint256 amount)](#withdrawinternal)

### getInfoInternal

Gets the info of a given staking pool by key

```solidity
function getInfoInternal(IStore s, bytes32 key, address you) external view
returns(name string, addresses address[], values uint256[])
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
  )
    external
    view
    returns (
      string memory name,
      address[] memory addresses,
      uint256[] memory values
    )
  {
    addresses = new address[](4);
    values = new uint256[](15);

    name = s.getStringByKeys(StakingPoolCoreLibV1.NS_POOL, key);

    addresses[0] = s.getStakingTokenAddressInternal(key);
    addresses[1] = s.getStakingTokenStablecoinPairAddressInternal(key);
    addresses[2] = s.getRewardTokenAddressInternal(key);
    addresses[3] = s.getRewardTokenStablecoinPairAddressInternal(key);

    values[0] = s.getTotalStaked(key);
    values[1] = s.getTarget(key);
    values[2] = s.getMaximumStakeInternal(key);
    values[3] = getPoolStakeBalanceInternal(s, key);
    values[4] = getPoolCumulativeDeposits(s, key);
    values[5] = s.getRewardPerBlock(key);
    values[6] = s.getRewardPlatformFee(key);
    values[7] = s.getLockupPeriodInBlocks(key);
    values[8] = s.getRewardTokenBalance(key);
    values[9] = getAccountStakingBalanceInternal(s, key, you);
    values[10] = getTotalBlocksSinceLastRewardInternal(s, key, you);
    values[11] = calculateRewardsInternal(s, key, you);
    values[12] = canWithdrawFromBlockHeightInternal(s, key, you);
    values[13] = getLastDepositHeight(s, key, you);
    values[14] = getLastRewardHeight(s, key, you);
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

### getPoolCumulativeDeposits

```solidity
function getPoolCumulativeDeposits(IStore s, bytes32 key) public view
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
function getPoolCumulativeDeposits(IStore s, bytes32 key) public view returns (uint256) {
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
    uint256 from = getLastRewardHeight(s, key, account);

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
    uint256 lastDepositHeight = getLastDepositHeight(s, key, account);
    uint256 lockupPeriod = s.getLockupPeriodInBlocks(key);

    return lastDepositHeight + lockupPeriod;
  }
```
</details>

### getLastDepositHeight

```solidity
function getLastDepositHeight(IStore s, bytes32 key, address account) public view
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
function getLastDepositHeight(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_DEPOSIT_HEIGHTS, key, account);
  }
```
</details>

### getLastRewardHeight

```solidity
function getLastRewardHeight(IStore s, bytes32 key, address account) public view
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
function getLastRewardHeight(
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

    uint256 rewardPerBlock = s.getRewardPerBlock(key);
    uint256 myStake = getAccountStakingBalanceInternal(s, key, account);
    return (myStake * rewardPerBlock * totalBlocks) / 1 ether;
  }
```
</details>

### withdrawRewardsInternal

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

    platformFee = (rewards * s.getRewardPlatformFee(key)) / ProtoUtilV1.MULTIPLIER;

    IERC20(rewardToken).ensureTransfer(msg.sender, rewards - platformFee);
    IERC20(rewardToken).ensureTransfer(s.getTreasury(), rewards);
  }
```
</details>

### depositInternal

```solidity
function depositInternal(IStore s, bytes32 key, uint256 amount) external nonpayable
returns(stakingToken address)
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
  ) external returns (address stakingToken) {
    require(key > 0, "Invalid key");
    require(amount > 0, "Enter an amount");
    require(amount <= s.getMaximumStakeInternal(key), "Stake too high");
    require(amount <= s.getAvailableToStakeInternal(key), "Target achieved or cap exceeded");

    stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    withdrawRewardsInternal(s, key, msg.sender);

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

```solidity
function withdrawInternal(IStore s, bytes32 key, uint256 amount) external nonpayable
returns(stakingToken address)
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
  ) external returns (address stakingToken) {
    require(key > 0, "Invalid key");
    require(amount > 0, "Enter an amount");

    require(getAccountStakingBalanceInternal(s, key, msg.sender) >= amount, "Insufficient balance");
    require(block.number > canWithdrawFromBlockHeightInternal(s, key, msg.sender), "Withdrawal too early");

    stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    withdrawRewardsInternal(s, key, msg.sender);

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
