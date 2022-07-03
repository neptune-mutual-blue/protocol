# Liquidity Engine contract (LiquidityEngine.sol)

View Source: [contracts/core/liquidity/LiquidityEngine.sol](../contracts/core/liquidity/LiquidityEngine.sol)

**↗ Extends: [ILiquidityEngine](ILiquidityEngine.md), [Recoverable](Recoverable.md)**

**LiquidityEngine**

The liquidity engine contract enables liquidity manager(s)
 to add, disable, remove, or manage lending or other income strategies.

## Functions

- [constructor(IStore s)](#)
- [addStrategies(address[] strategies)](#addstrategies)
- [setLiquidityStateUpdateInterval(uint256 value)](#setliquiditystateupdateinterval)
- [disableStrategy(address strategy)](#disablestrategy)
- [deleteStrategy(address strategy)](#deletestrategy)
- [setRiskPoolingPeriods(bytes32 coverKey, uint256 lendingPeriod, uint256 withdrawalWindow)](#setriskpoolingperiods)
- [setMaxLendingRatio(uint256 ratio)](#setmaxlendingratio)
- [getMaxLendingRatio()](#getmaxlendingratio)
- [getRiskPoolingPeriods(bytes32 coverKey)](#getriskpoolingperiods)
- [getDisabledStrategies()](#getdisabledstrategies)
- [getActiveStrategies()](#getactivestrategies)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore s) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore s) Recoverable(s) {}
```
</details>

### addStrategies

Adds an array of strategies to the liquidity engine.

```solidity
function addStrategies(address[] strategies) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategies | address[] | Enter one or more strategies. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addStrategies(address[] calldata strategies) external override nonReentrant {
    require(strategies.length > 0, "No strategy specified");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.addStrategiesInternal(strategies);
  }
```
</details>

### setLiquidityStateUpdateInterval

The liquidity state update interval allows the protocol
 to perform various activies such as NPM token price update,
 deposits or withdrawals to lending strategies, and more.

```solidity
function setLiquidityStateUpdateInterval(uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 | Specify the update interval value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLiquidityStateUpdateInterval(uint256 value) external override nonReentrant {
    require(value > 0, "Invalid value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setUintByKey(ProtoUtilV1.NS_LIQUIDITY_STATE_UPDATE_INTERVAL, value);
    emit LiquidityStateUpdateIntervalSet(value);
  }
```
</details>

### disableStrategy

Disables a strategy by address.
 When a strategy is disabled, it immediately withdraws and cannot lend any further.

```solidity
function disableStrategy(address strategy) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | address | Enter the strategy contract address to disable | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disableStrategy(address strategy) external override nonReentrant {
    // because this function can only be invoked by a liquidity manager.
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.disableStrategyInternal(strategy);
    emit StrategyDisabled(strategy);
  }
```
</details>

### deleteStrategy

Permanently deletes a disabled strategy by address.

```solidity
function deleteStrategy(address strategy) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | address | Enter the strategy contract address to delete | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteStrategy(address strategy) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.deleteStrategyInternal(strategy);
    emit StrategyDeleted(strategy);
  }
```
</details>

### setRiskPoolingPeriods

In order to pool risks collectively, liquidity providers
 may lend their stablecoins to a cover pool of their choosing during "lending periods"
 and withdraw them during "withdrawal windows." These periods are known as risk pooling periods.
 <br /> <br />
 The default lending period is six months, and the withdrawal window is seven days.
 Specify a cover key if you want to configure or override these periods for a cover.
 If no cover key is specified, the values entered will be set as global parameters.

```solidity
function setRiskPoolingPeriods(bytes32 coverKey, uint256 lendingPeriod, uint256 withdrawalWindow) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter a cover key to set the periods. Enter `0x` if you want to set the values globally. | 
| lendingPeriod | uint256 | Enter the lending duration. Example: 180 days. | 
| withdrawalWindow | uint256 | Enter the withdrawal duration. Example: 7 days. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setRiskPoolingPeriods(
    bytes32 coverKey,
    uint256 lendingPeriod,
    uint256 withdrawalWindow
  ) external override nonReentrant {
    require(lendingPeriod > 0, "Please specify lending period");
    require(withdrawalWindow > 0, "Please specify withdrawal window");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setRiskPoolingPeriodsInternal(coverKey, lendingPeriod, withdrawalWindow);
    // event emitted in the above function
  }
```
</details>

### setMaxLendingRatio

Specify the maximum lending ratio a strategy can utilize, not to exceed 100 percent.

```solidity
function setMaxLendingRatio(uint256 ratio) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| ratio | uint256 | . Enter the ratio as a percentage value. Use `ProtoUtilV1.MULTIPLIER` as your divisor. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMaxLendingRatio(uint256 ratio) external override nonReentrant {
    require(ratio > 0, "Please specify lending ratio");
    require(ratio <= ProtoUtilV1.MULTIPLIER, "Invalid lending ratio");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setMaxLendingRatioInternal(ratio);
  }
```
</details>

### getMaxLendingRatio

Gets the maximum lending ratio a strategy can utilize.

```solidity
function getMaxLendingRatio() external view
returns(ratio uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMaxLendingRatio() external view override returns (uint256 ratio) {
    return s.getMaxLendingRatioInternal();
  }
```
</details>

### getRiskPoolingPeriods

Returns the risk pooling periods of a given cover key.
 Global values are returned if the risk pooling period for the given cover key was not defined.
 If global values are also undefined, fallback value of 180-day lending period
 and 7-day withdrawal window are returned.

```solidity
function getRiskPoolingPeriods(bytes32 coverKey) external view
returns(lendingPeriod uint256, withdrawalWindow uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the coverkey to retrieve the lending period of.  Warning: this function doesn't check if the supplied cover key is a valid. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getRiskPoolingPeriods(bytes32 coverKey) external view override returns (uint256 lendingPeriod, uint256 withdrawalWindow) {
    return s.getRiskPoolingPeriodsInternal(coverKey);
  }
```
</details>

### getDisabledStrategies

Returns a list of disabled strategies.

```solidity
function getDisabledStrategies() external view
returns(strategies address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDisabledStrategies() external view override returns (address[] memory strategies) {
    return s.getDisabledStrategiesInternal();
  }
```
</details>

### getActiveStrategies

Returns a list of actively lending strategies.

```solidity
function getActiveStrategies() external view
returns(strategies address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getActiveStrategies() external view override returns (address[] memory strategies) {
    return s.getActiveStrategiesInternal();
  }
```
</details>

### version

Version number of this contract

```solidity
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function version() external pure override returns (bytes32) {
    return "v0.1";
  }
```
</details>

### getName

Name of this contract

```solidity
function getName() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_LIQUIDITY_ENGINE;
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
