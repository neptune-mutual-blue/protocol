# IReporter.sol

View Source: [contracts/interfaces/IReporter.sol](../contracts/interfaces/IReporter.sol)

**↘ Derived Contracts: [IGovernance](IGovernance.md), [Reporter](Reporter.md)**

**IReporter**

**Events**

```js
event Reported(bytes32 indexed coverKey, bytes32 indexed productKey, address  reporter, uint256 indexed incidentDate, bytes32  info, uint256  initialStake, uint256  resolutionTimestamp);
event Disputed(bytes32 indexed coverKey, bytes32 indexed productKey, address  reporter, uint256 indexed incidentDate, bytes32  info, uint256  initialStake);
event ReportingBurnRateSet(uint256  previous, uint256  current);
event FirstReportingStakeSet(bytes32  coverKey, uint256  previous, uint256  current);
event ReporterCommissionSet(uint256  previous, uint256  current);
```

## Functions

- [report(bytes32 coverKey, bytes32 productKey, bytes32 info, uint256 stake)](#report)
- [dispute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, bytes32 info, uint256 stake)](#dispute)
- [getActiveIncidentDate(bytes32 coverKey, bytes32 productKey)](#getactiveincidentdate)
- [getAttestation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getattestation)
- [getRefutation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getrefutation)
- [getReporter(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getreporter)
- [getResolutionTimestamp(bytes32 coverKey, bytes32 productKey)](#getresolutiontimestamp)
- [setFirstReportingStake(bytes32 coverKey, uint256 value)](#setfirstreportingstake)
- [getFirstReportingStake(bytes32 coverKey)](#getfirstreportingstake)
- [setReportingBurnRate(uint256 value)](#setreportingburnrate)
- [setReporterCommission(uint256 value)](#setreportercommission)

### report

```solidity
function report(bytes32 coverKey, bytes32 productKey, bytes32 info, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| info | bytes32 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function report(
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    uint256 stake
  ) external;
```
</details>

### dispute

```solidity
function dispute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, bytes32 info, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 
| info | bytes32 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispute(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    bytes32 info,
    uint256 stake
  ) external;
```
</details>

### getActiveIncidentDate

```solidity
function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view returns (uint256);
```
</details>

### getAttestation

```solidity
function getAttestation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAttestation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake);
```
</details>

### getRefutation

```solidity
function getRefutation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getRefutation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake);
```
</details>

### getReporter

```solidity
function getReporter(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReporter(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (address);
```
</details>

### getResolutionTimestamp

```solidity
function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view returns (uint256);
```
</details>

### setFirstReportingStake

```solidity
function setFirstReportingStake(bytes32 coverKey, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setFirstReportingStake(bytes32 coverKey, uint256 value) external;
```
</details>

### getFirstReportingStake

```solidity
function getFirstReportingStake(bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFirstReportingStake(bytes32 coverKey) external view returns (uint256);
```
</details>

### setReportingBurnRate

```solidity
function setReportingBurnRate(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReportingBurnRate(uint256 value) external;
```
</details>

### setReporterCommission

```solidity
function setReporterCommission(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReporterCommission(uint256 value) external;
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
