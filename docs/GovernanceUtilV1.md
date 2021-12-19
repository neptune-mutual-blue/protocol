# GovernanceUtilV1.sol

View Source: [contracts/libraries/GovernanceUtilV1.sol](../contracts/libraries/GovernanceUtilV1.sol)

**GovernanceUtilV1**

## Functions

- [getReportingPeriod(IStore s, bytes32 key)](#getreportingperiod)
- [getMinReportingStake(IStore s)](#getminreportingstake)
- [getLatestIncidentDate(IStore s, bytes32 key)](#getlatestincidentdate)
- [getResolutionTimestamp(IStore s, bytes32 key)](#getresolutiontimestamp)
- [getReporter(IStore s, bytes32 key, uint256 incidentDate)](#getreporter)
- [getStakes(IStore s, bytes32 key, uint256 incidentDate)](#getstakes)
- [getStakesOf(IStore s, address account, bytes32 key, uint256 incidentDate)](#getstakesof)
- [updateCoverStatus(IStore s, bytes32 key, uint256 incidentDate)](#updatecoverstatus)
- [addAttestation(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake)](#addattestation)
- [getAttestation(IStore s, bytes32 key, address who, uint256 incidentDate)](#getattestation)
- [addDispute(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake)](#adddispute)
- [getDispute(IStore s, bytes32 key, address who, uint256 incidentDate)](#getdispute)
- [_getLatestIncidentDate(IStore s, bytes32 key)](#_getlatestincidentdate)

### getReportingPeriod

```js
function getReportingPeriod(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getMinReportingStake

```js
function getMinReportingStake(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getLatestIncidentDate

```js
function getLatestIncidentDate(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getResolutionTimestamp

```js
function getResolutionTimestamp(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getReporter

```js
function getReporter(IStore s, bytes32 key, uint256 incidentDate) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

### getStakes

```js
function getStakes(IStore s, bytes32 key, uint256 incidentDate) public view
returns(yes uint256, no uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

### getStakesOf

```js
function getStakesOf(IStore s, address account, bytes32 key, uint256 incidentDate) public view
returns(yes uint256, no uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

### updateCoverStatus

```js
function updateCoverStatus(IStore s, bytes32 key, uint256 incidentDate) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

### addAttestation

```js
function addAttestation(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

### getAttestation

```js
function getAttestation(IStore s, bytes32 key, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

### addDispute

```js
function addDispute(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

### getDispute

```js
function getDispute(IStore s, bytes32 key, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

### _getLatestIncidentDate

```js
function _getLatestIncidentDate(IStore s, bytes32 key) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
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
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
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
* [ProtoBase](ProtoBase.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [Resolution](Resolution.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
