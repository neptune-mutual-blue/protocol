# ILiquidityEngine.sol

View Source: [contracts/interfaces/ILiquidityEngine.sol](../contracts/interfaces/ILiquidityEngine.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [LiquidityEngine](LiquidityEngine.md)**

**ILiquidityEngine**

**Events**

```js
event StrategyAdded(address indexed strategy);
event StrategyDisabled(address indexed strategy);
event StrategyDeleted(address indexed strategy);
event LendingPeriodSet(bytes32 indexed coverKey, uint256  lendingPeriod, uint256  withdrawalWindow);
event LiquidityStateUpdateIntervalSet(uint256  duration);
event MaxLendingRatioSet(uint256  ratio);
```

## Functions

- [addStrategies(address[] strategies)](#addstrategies)
- [disableStrategy(address strategy)](#disablestrategy)
- [deleteStrategy(address strategy)](#deletestrategy)
- [setLendingPeriods(bytes32 coverKey, uint256 lendingPeriod, uint256 withdrawalWindow)](#setlendingperiods)
- [setLendingPeriodsDefault(uint256 lendingPeriod, uint256 withdrawalWindow)](#setlendingperiodsdefault)
- [getLendingPeriods(bytes32 coverKey)](#getlendingperiods)
- [setLiquidityStateUpdateInterval(uint256 value)](#setliquiditystateupdateinterval)
- [setMaxLendingRatio(uint256 ratio)](#setmaxlendingratio)
- [getMaxLendingRatio()](#getmaxlendingratio)
- [getDisabledStrategies()](#getdisabledstrategies)
- [getActiveStrategies()](#getactivestrategies)

### addStrategies

```solidity
function addStrategies(address[] strategies) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategies | address[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addStrategies(address[] calldata strategies) external;
```
</details>

### disableStrategy

```solidity
function disableStrategy(address strategy) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disableStrategy(address strategy) external;
```
</details>

### deleteStrategy

```solidity
function deleteStrategy(address strategy) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteStrategy(address strategy) external;
```
</details>

### setLendingPeriods

```solidity
function setLendingPeriods(bytes32 coverKey, uint256 lendingPeriod, uint256 withdrawalWindow) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| lendingPeriod | uint256 |  | 
| withdrawalWindow | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLendingPeriods(
    bytes32 coverKey,
    uint256 lendingPeriod,
    uint256 withdrawalWindow
  ) external;
```
</details>

### setLendingPeriodsDefault

```solidity
function setLendingPeriodsDefault(uint256 lendingPeriod, uint256 withdrawalWindow) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| lendingPeriod | uint256 |  | 
| withdrawalWindow | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLendingPeriodsDefault(uint256 lendingPeriod, uint256 withdrawalWindow) external;
```
</details>

### getLendingPeriods

```solidity
function getLendingPeriods(bytes32 coverKey) external view
returns(lendingPeriod uint256, withdrawalWindow uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLendingPeriods(bytes32 coverKey) external view returns (uint256 lendingPeriod, uint256 withdrawalWindow);
```
</details>

### setLiquidityStateUpdateInterval

```solidity
function setLiquidityStateUpdateInterval(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLiquidityStateUpdateInterval(uint256 value) external;
```
</details>

### setMaxLendingRatio

```solidity
function setMaxLendingRatio(uint256 ratio) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| ratio | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMaxLendingRatio(uint256 ratio) external;
```
</details>

### getMaxLendingRatio

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
function getMaxLendingRatio() external view returns (uint256 ratio);
```
</details>

### getDisabledStrategies

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
function getDisabledStrategies() external view returns (address[] memory strategies);
```
</details>

### getActiveStrategies

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
function getActiveStrategies() external view returns (address[] memory strategies);
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
* [console](console.md)
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
