# GovernanceUtilV1.sol

View Source: [contracts/libraries/GovernanceUtilV1.sol](../contracts/libraries/GovernanceUtilV1.sol)

**GovernanceUtilV1**

## Functions

- [mustBeReporting(IStore s, bytes32 key)](#mustbereporting)
- [mustBeDisputed(IStore s, bytes32 key)](#mustbedisputed)
- [mustBeReportingOrDisputed(IStore s, bytes32 key)](#mustbereportingordisputed)
- [mustBeValidIncidentDate(IStore s, bytes32 key, uint256 incidentDate)](#mustbevalidincidentdate)
- [mustBeDuringReportingPeriod(IStore s, bytes32 key)](#mustbeduringreportingperiod)
- [mustBeAfterReportingPeriod(IStore s, bytes32 key)](#mustbeafterreportingperiod)
- [mustBeDuringClaimPeriod(IStore s, bytes32 key)](#mustbeduringclaimperiod)
- [mustBeAfterClaimExpiry(IStore s, bytes32 key)](#mustbeafterclaimexpiry)
- [getMinReportingStake(IStore s)](#getminreportingstake)
- [getReporter(IStore s, bytes32 key)](#getreporter)
- [getLatestIncidentDate(IStore s, bytes32 key)](#getlatestincidentdate)
- [_getLatestIncidentDate(IStore s, bytes32 key)](#_getlatestincidentdate)

### mustBeReporting

```solidity
function mustBeReporting(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeReporting(IStore s, bytes32 key) external view {
    require(s.getStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened, "Not reporting");
  }
```
</details>

### mustBeDisputed

```solidity
function mustBeDisputed(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDisputed(IStore s, bytes32 key) external view {
    require(s.getStatus(key) == CoverUtilV1.CoverStatus.FalseReporting, "Not disputed");
  }
```
</details>

### mustBeReportingOrDisputed

```solidity
function mustBeReportingOrDisputed(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeReportingOrDisputed(IStore s, bytes32 key) external view {
    CoverUtilV1.CoverStatus status = s.getStatus(key);
    bool incidentHappened = status == CoverUtilV1.CoverStatus.IncidentHappened;
    bool falseReporting = status == CoverUtilV1.CoverStatus.FalseReporting;

    require(incidentHappened || falseReporting, "Not reporting or disputed");
  }
```
</details>

### mustBeValidIncidentDate

```solidity
function mustBeValidIncidentDate(IStore s, bytes32 key, uint256 incidentDate) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidIncidentDate(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) external view {
    require(_getLatestIncidentDate(s, key) == incidentDate, "Invalid incident date");
  }
```
</details>

### mustBeDuringReportingPeriod

```solidity
function mustBeDuringReportingPeriod(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDuringReportingPeriod(IStore s, bytes32 key) external view {
    require(s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key) >= block.timestamp, "Reporting window closed"); // solhint-disable-line
  }
```
</details>

### mustBeAfterReportingPeriod

```solidity
function mustBeAfterReportingPeriod(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterReportingPeriod(IStore s, bytes32 key) external view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key), "Reporting still active"); // solhint-disable-line
  }
```
</details>

### mustBeDuringClaimPeriod

```solidity
function mustBeDuringClaimPeriod(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDuringClaimPeriod(IStore s, bytes32 key) external view {
    uint256 resolutionDate = s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key);
    require(block.timestamp >= resolutionDate, "Reporting still active"); // solhint-disable-line

    uint256 claimExpiry = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key);
    require(block.timestamp <= claimExpiry, "Claim period has expired"); // solhint-disable-line
  }
```
</details>

### mustBeAfterClaimExpiry

```solidity
function mustBeAfterClaimExpiry(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterClaimExpiry(IStore s, bytes32 key) external view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key), "Claim still active"); // solhint-disable-line
  }
```
</details>

### getMinReportingStake

```solidity
function getMinReportingStake(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinReportingStake(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_SETUP_REPORTING_STAKE);
  }
```
</details>

### getReporter

```solidity
function getReporter(IStore s, bytes32 key) external view
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
function getReporter(IStore s, bytes32 key) external view returns (address) {
    uint256 no = s.getUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_NO, key);
    uint256 yes = s.getUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key);

    bytes32 prefix = yes > no ? ProtoUtilV1.NS_REPORTING_WITNESS_YES : ProtoUtilV1.NS_REPORTING_WITNESS_NO;
    return s.getAddressByKeys(prefix, key);
  }
```
</details>

### getLatestIncidentDate

```solidity
function getLatestIncidentDate(IStore s, bytes32 key) external view
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
function getLatestIncidentDate(IStore s, bytes32 key) external view returns (uint256) {
    return _getLatestIncidentDate(s, key);
  }
```
</details>

### _getLatestIncidentDate

```solidity
function _getLatestIncidentDate(IStore s, bytes32 key) private view
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
function _getLatestIncidentDate(IStore s, bytes32 key) private view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_REPORTING_INCIDENT_DATE, key);
  }
```
</details>

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
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
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
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
