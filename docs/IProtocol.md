# IProtocol.sol

View Source: [contracts/interfaces/IProtocol.sol](../contracts/interfaces/IProtocol.sol)

**↗ Extends: [IMember](IMember.md), [IAccessControl](IAccessControl.md)**
**↘ Derived Contracts: [Protocol](Protocol.md)**

**IProtocol**

## Structs
### AccountWithRoles

```js
struct AccountWithRoles {
 address account,
 bytes32[] roles
}
```

### InitializeArgs

```js
struct InitializeArgs {
 address burner,
 address uniswapV2RouterLike,
 address uniswapV2FactoryLike,
 address npm,
 address treasury,
 address priceOracle,
 uint256 coverCreationFee,
 uint256 minCoverCreationStake,
 uint256 firstReportingStake,
 uint256 claimPeriod,
 uint256 reportingBurnRate,
 uint256 governanceReporterCommission,
 uint256 claimPlatformFee,
 uint256 claimReporterCommission,
 uint256 flashLoanFee,
 uint256 flashLoanFeeProtocol,
 uint256 resolutionCoolDownPeriod,
 uint256 stateUpdateInterval,
 uint256 maxLendingRatio
}
```

**Events**

```js
event Initialized(struct IProtocol.InitializeArgs  args);
event ContractAdded(bytes32 indexed namespace, bytes32 indexed key, address indexed contractAddress);
event ContractUpgraded(bytes32 indexed namespace, bytes32 indexed key, address  previous, address indexed current);
event MemberAdded(address  member);
event MemberRemoved(address  member);
```

## Functions

- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [addContracts(bytes32[] namespaces, bytes32[] keys, address[] contractAddresses)](#addcontracts)
- [addContractWithKey(bytes32 namespace, bytes32 coverKey, address contractAddress)](#addcontractwithkey)
- [initialize(struct IProtocol.InitializeArgs args)](#initialize)
- [upgradeContract(bytes32 namespace, address previous, address current)](#upgradecontract)
- [upgradeContractWithKey(bytes32 namespace, bytes32 coverKey, address previous, address current)](#upgradecontractwithkey)
- [addMember(address member)](#addmember)
- [removeMember(address member)](#removemember)
- [grantRoles(struct IProtocol.AccountWithRoles[] detail)](#grantroles)

### addContract

```solidity
function addContract(bytes32 namespace, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContract(bytes32 namespace, address contractAddress) external;
```
</details>

### addContracts

```solidity
function addContracts(bytes32[] namespaces, bytes32[] keys, address[] contractAddresses) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespaces | bytes32[] |  | 
| keys | bytes32[] |  | 
| contractAddresses | address[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContracts(
    bytes32[] calldata namespaces,
    bytes32[] calldata keys,
    address[] calldata contractAddresses
  ) external;
```
</details>

### addContractWithKey

```solidity
function addContractWithKey(bytes32 namespace, bytes32 coverKey, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| coverKey | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContractWithKey(
    bytes32 namespace,
    bytes32 coverKey,
    address contractAddress
  ) external;
```
</details>

### initialize

```solidity
function initialize(struct IProtocol.InitializeArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct IProtocol.InitializeArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initialize(InitializeArgs calldata args) external;
```
</details>

### upgradeContract

```solidity
function upgradeContract(bytes32 namespace, address previous, address current) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external;
```
</details>

### upgradeContractWithKey

```solidity
function upgradeContractWithKey(bytes32 namespace, bytes32 coverKey, address previous, address current) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| coverKey | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgradeContractWithKey(
    bytes32 namespace,
    bytes32 coverKey,
    address previous,
    address current
  ) external;
```
</details>

### addMember

```solidity
function addMember(address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMember(address member) external;
```
</details>

### removeMember

```solidity
function removeMember(address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeMember(address member) external;
```
</details>

### grantRoles

```solidity
function grantRoles(struct IProtocol.AccountWithRoles[] detail) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| detail | struct IProtocol.AccountWithRoles[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function grantRoles(AccountWithRoles[] calldata detail) external;
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
