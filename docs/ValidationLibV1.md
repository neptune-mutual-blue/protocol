# ValidationLibV1.sol

View Source: [contracts/libraries/ValidationLibV1.sol](../contracts/libraries/ValidationLibV1.sol)

**ValidationLibV1**

## Functions

- [mustNotBePaused(IStore s)](#mustnotbepaused)
- [mustBeValidCover(IStore s, bytes32 key)](#mustbevalidcover)
- [mustBeValidCoverKey(IStore s, bytes32 key)](#mustbevalidcoverkey)
- [mustBeCoverOwner(IStore s, bytes32 key, address sender)](#mustbecoverowner)
- [callerMustBePolicyContract(IStore s)](#callermustbepolicycontract)
- [callerMustBePolicyManagerContract(IStore s)](#callermustbepolicymanagercontract)
- [callerMustBeCoverContract(IStore s)](#callermustbecovercontract)
- [callerMustBeGovernanceContract(IStore s)](#callermustbegovernancecontract)
- [callerMustBeClaimsProcessorContract(IStore s)](#callermustbeclaimsprocessorcontract)
- [mustBeReporting(IStore s, bytes32 key)](#mustbereporting)
- [mustBeDisputed(IStore s, bytes32 key)](#mustbedisputed)
- [mustBeClaimable(IStore s, bytes32 key)](#mustbeclaimable)
- [mustBeClaimingOrDisputed(IStore s, bytes32 key)](#mustbeclaimingordisputed)
- [mustBeReportingOrDisputed(IStore s, bytes32 key)](#mustbereportingordisputed)
- [mustBeValidIncidentDate(IStore s, bytes32 key, uint256 incidentDate)](#mustbevalidincidentdate)
- [mustNotHaveDispute(IStore s, bytes32 key)](#mustnothavedispute)
- [mustBeDuringReportingPeriod(IStore s, bytes32 key)](#mustbeduringreportingperiod)
- [mustBeAfterReportingPeriod(IStore s, bytes32 key)](#mustbeafterreportingperiod)
- [mustBeValidCToken(bytes32 key, address cToken, uint256 incidentDate)](#mustbevalidctoken)
- [mustBeValidClaim(IStore s, bytes32 key, address cToken, uint256 incidentDate)](#mustbevalidclaim)
- [mustBeDuringClaimPeriod(IStore s, bytes32 key)](#mustbeduringclaimperiod)
- [mustBeAfterClaimExpiry(IStore s, bytes32 key)](#mustbeafterclaimexpiry)

### mustNotBePaused

Reverts if the protocol is paused

```js
function mustNotBePaused(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeValidCover

Reverts if the key does not resolve in a valid cover contract
 or if the cover is under governance.

```js
function mustBeValidCover(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key to check | 

### mustBeValidCoverKey

Reverts if the key does not resolve in a valid cover contract.

```js
function mustBeValidCoverKey(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key to check | 

### mustBeCoverOwner

Reverts if the sender is not the cover owner

```js
function mustBeCoverOwner(IStore s, bytes32 key, address sender) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender The `msg.sender` value | 
| key | bytes32 | Enter the cover key to check | 
| sender | address | The `msg.sender` value | 

### callerMustBePolicyContract

```js
function callerMustBePolicyContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### callerMustBePolicyManagerContract

```js
function callerMustBePolicyManagerContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### callerMustBeCoverContract

```js
function callerMustBeCoverContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### callerMustBeGovernanceContract

```js
function callerMustBeGovernanceContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### callerMustBeClaimsProcessorContract

```js
function callerMustBeClaimsProcessorContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeReporting

```js
function mustBeReporting(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeDisputed

```js
function mustBeDisputed(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeClaimable

```js
function mustBeClaimable(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeClaimingOrDisputed

```js
function mustBeClaimingOrDisputed(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeReportingOrDisputed

```js
function mustBeReportingOrDisputed(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeValidIncidentDate

```js
function mustBeValidIncidentDate(IStore s, bytes32 key, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

### mustNotHaveDispute

```js
function mustNotHaveDispute(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeDuringReportingPeriod

```js
function mustBeDuringReportingPeriod(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeAfterReportingPeriod

```js
function mustBeAfterReportingPeriod(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeValidCToken

```js
function mustBeValidCToken(bytes32 key, address cToken, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| cToken | address |  | 
| incidentDate | uint256 |  | 

### mustBeValidClaim

```js
function mustBeValidClaim(IStore s, bytes32 key, address cToken, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| cToken | address |  | 
| incidentDate | uint256 |  | 

### mustBeDuringClaimPeriod

```js
function mustBeDuringClaimPeriod(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### mustBeAfterClaimExpiry

```js
function mustBeAfterClaimExpiry(IStore s, bytes32 key) public view
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
