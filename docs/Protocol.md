# Protocol.sol

View Source: [contracts/core/Protocol.sol](../contracts/core/Protocol.sol)

**↗ Extends: [IProtocol](IProtocol.md), [Recoverable](Recoverable.md)**

**Protocol**

## Functions

- [constructor(IStore store)](#)
- [initialize(address uniswapV2RouterLike, address npm, address treasury, address assuranceVault, uint256 coverFee, uint256 minStake, uint256 minReportingStake, uint256 minLiquidityPeriod, uint256 claimPeriod)](#initialize)
- [setClaimPeriod(uint256 value)](#setclaimperiod)
- [setCoverFees(uint256 value)](#setcoverfees)
- [setMinStake(uint256 value)](#setminstake)
- [setMinReportingStake(uint256 value)](#setminreportingstake)
- [setMinLiquidityPeriod(uint256 value)](#setminliquidityperiod)
- [upgradeContract(bytes32 namespace, address previous, address current)](#upgradecontract)
- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [removeMember(address member)](#removemember)
- [addMember(address member)](#addmember)
- [version()](#version)
- [getName()](#getname)

### 

```js
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

### initialize

```js
function initialize(address uniswapV2RouterLike, address npm, address treasury, address assuranceVault, uint256 coverFee, uint256 minStake, uint256 minReportingStake, uint256 minLiquidityPeriod, uint256 claimPeriod) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| uniswapV2RouterLike | address |  | 
| npm | address |  | 
| treasury | address |  | 
| assuranceVault | address |  | 
| coverFee | uint256 |  | 
| minStake | uint256 |  | 
| minReportingStake | uint256 |  | 
| minLiquidityPeriod | uint256 |  | 
| claimPeriod | uint256 |  | 

### setClaimPeriod

```js
function setClaimPeriod(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

### setCoverFees

```js
function setCoverFees(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

### setMinStake

```js
function setMinStake(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

### setMinReportingStake

```js
function setMinReportingStake(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

### setMinLiquidityPeriod

```js
function setMinLiquidityPeriod(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

### upgradeContract

```js
function upgradeContract(bytes32 namespace, address previous, address current) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

### addContract

```js
function addContract(bytes32 namespace, address contractAddress) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### removeMember

```js
function removeMember(address member) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

### addMember

```js
function addMember(address member) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

### version

Version number of this contract

```js
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getName

Name of this contract

```js
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Contracts

* [Address](Address.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [cTokenFactoryLibV1](cTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
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
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
