# CoverUtilV1.sol

View Source: [contracts/libraries/CoverUtilV1.sol](../contracts/libraries/CoverUtilV1.sol)

**CoverUtilV1**

**Enums**
### CoverStatus

```js
enum CoverStatus {
 Normal,
 Stopped,
 IncidentHappened,
 FalseReporting,
 Claimable
}
```

## Functions

- [mustBeValidCover(IStore s, bytes32 key)](#mustbevalidcover)
- [mustBeValidCoverKey(IStore s, bytes32 key)](#mustbevalidcoverkey)
- [mustBeCoverOwner(IStore s, bytes32 key, address sender, address owner)](#mustbecoverowner)
- [getCoverOwner(IStore s, bytes32 key)](#getcoverowner)
- [getReportingPeriod(IStore s, bytes32 key)](#getreportingperiod)
- [getClaimPeriod(IStore s, bytes32 key)](#getclaimperiod)
- [getResolutionTimestamp(IStore s, bytes32 key)](#getresolutiontimestamp)
- [getStatus(IStore s, bytes32 key)](#getstatus)
- [getCoverPoolSummary(IStore s, bytes32 key)](#getcoverpoolsummary)
- [getPolicyRates(IStore s, bytes32 key)](#getpolicyrates)
- [getLiquidity(IStore s, bytes32 key)](#getliquidity)
- [getStake(IStore s, bytes32 key)](#getstake)
- [getClaimable(IStore s, bytes32 key)](#getclaimable)
- [getCoverInfo(IStore s, bytes32 key)](#getcoverinfo)
- [getPriceDiscoveryContract(IStore s)](#getpricediscoverycontract)
- [getStakingContract(IStore s)](#getstakingcontract)
- [getCTokenFactory(IStore s)](#getctokenfactory)
- [getPolicyContract(IStore s)](#getpolicycontract)
- [getAssuranceContract(IStore s)](#getassurancecontract)
- [getVault(IStore s, bytes32 key)](#getvault)
- [getVaultFactoryContract(IStore s)](#getvaultfactorycontract)
- [setStatus(IStore s, bytes32 key, enum CoverUtilV1.CoverStatus status)](#setstatus)
- [_getCoverOwner(IStore s, bytes32 key)](#_getcoverowner)
- [_getClaimable(IStore s, bytes32 key)](#_getclaimable)
- [_getStatus(IStore s, bytes32 key)](#_getstatus)

### mustBeValidCover

Reverts if the key does not resolve in a valid cover contract
 or if the cover is under governance.

```solidity
function mustBeValidCover(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidCover(IStore s, bytes32 key) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key), "Cover does not exist");
    require(_getStatus(s, key) == CoverStatus.Normal, "Actively Reporting");
  }
```
</details>

### mustBeValidCoverKey

Reverts if the key does not resolve in a valid cover contract.

```solidity
function mustBeValidCoverKey(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidCoverKey(IStore s, bytes32 key) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key), "Cover does not exist");
  }
```
</details>

### mustBeCoverOwner

Reverts if the sender is not the cover owner or owner

```solidity
function mustBeCoverOwner(IStore s, bytes32 key, address sender, address owner) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender The `msg.sender` value | 
| key | bytes32 | Enter the cover key to check | 
| sender | address | The `msg.sender` value | 
| owner | address | Enter the owner address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeCoverOwner(
    IStore s,
    bytes32 key,
    address sender,
    address owner
  ) external view {
    bool isCoverOwner = _getCoverOwner(s, key) == sender;
    bool isOwner = sender == owner;

    require(isOwner || isCoverOwner, "Forbidden");
  }
```
</details>

### getCoverOwner

```solidity
function getCoverOwner(IStore s, bytes32 key) external view
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
function getCoverOwner(IStore s, bytes32 key) external view returns (address) {
    return _getCoverOwner(s, key);
  }
```
</details>

### getReportingPeriod

```solidity
function getReportingPeriod(IStore s, bytes32 key) external view
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
function getReportingPeriod(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_REPORTING_PERIOD, key);
  }
```
</details>

### getClaimPeriod

```solidity
function getClaimPeriod(IStore s, bytes32 key) external view
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
function getClaimPeriod(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, key);
  }
```
</details>

### getResolutionTimestamp

```solidity
function getResolutionTimestamp(IStore s, bytes32 key) external view
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
function getResolutionTimestamp(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key);
  }
```
</details>

### getStatus

Gets the current status of a given cover
 0 - normal
 1 - stopped, can not purchase covers or add liquidity
 2 - reporting, incident happened
 3 - reporting, false reporting
 4 - claimable, claims accepted for payout

```solidity
function getStatus(IStore s, bytes32 key) external view
returns(enum CoverUtilV1.CoverStatus)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStatus(IStore s, bytes32 key) external view returns (CoverStatus) {
    return _getStatus(s, key);
  }
```
</details>

### getCoverPoolSummary

Todo: Returns the values of the given cover key

```solidity
function getCoverPoolSummary(IStore s, bytes32 key) external view
returns(_values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverPoolSummary(IStore s, bytes32 key) external view returns (uint256[] memory _values) {
    require(_getStatus(s, key) == CoverStatus.Normal, "Invalid cover");
    IPriceDiscovery discovery = getPriceDiscoveryContract(s);

    _values = new uint256[](7);

    _values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
    _values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_COMMITTED, key); // <-- Todo: liquidity commitment should expire as policies expire
    _values[2] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);
    _values[3] = discovery.getTokenPriceInLiquidityToken(address(s.nepToken()), s.getLiquidityToken(), 1 ether);
    _values[4] = s.getUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE, key);
    _values[5] = discovery.getTokenPriceInLiquidityToken(address(s.getAddressByKeys(ProtoUtilV1.NS_COVER_ASSURANCE_TOKEN, key)), s.getLiquidityToken(), 1 ether);
    _values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE_WEIGHT, key);
  }
```
</details>

### getPolicyRates

```solidity
function getPolicyRates(IStore s, bytes32 key) external view
returns(floor uint256, ceiling uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyRates(IStore s, bytes32 key) external view returns (uint256 floor, uint256 ceiling) {
    floor = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, key);
    ceiling = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, key);

    if (floor == 0) {
      // Fallback to default values
      floor = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR);
      ceiling = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING);
    }
  }
```
</details>

### getLiquidity

```solidity
function getLiquidity(IStore s, bytes32 key) public view
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
function getLiquidity(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
  }
```
</details>

### getStake

```solidity
function getStake(IStore s, bytes32 key) public view
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
function getStake(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
  }
```
</details>

### getClaimable

```solidity
function getClaimable(IStore s, bytes32 key) external view
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
function getClaimable(IStore s, bytes32 key) external view returns (uint256) {
    return _getClaimable(s, key);
  }
```
</details>

### getCoverInfo

```solidity
function getCoverInfo(IStore s, bytes32 key) external view
returns(owner address, info bytes32, values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverInfo(IStore s, bytes32 key)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    info = s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key);
    owner = s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);

    values = new uint256[](5);

    values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_FEE, key);
    values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
    values[2] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
    values[3] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    values[4] = _getClaimable(s, key);
  }
```
</details>

### getPriceDiscoveryContract

```solidity
function getPriceDiscoveryContract(IStore s) public view
returns(contract IPriceDiscovery)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPriceDiscoveryContract(IStore s) public view returns (IPriceDiscovery) {
    return IPriceDiscovery(ProtoUtilV1.getContract(s, ProtoUtilV1.NS_PRICE_DISCOVERY));
  }
```
</details>

### getStakingContract

```solidity
function getStakingContract(IStore s) public view
returns(contract ICoverStake)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakingContract(IStore s) public view returns (ICoverStake) {
    return ICoverStake(ProtoUtilV1.getContract(s, ProtoUtilV1.NS_COVER_STAKE));
  }
```
</details>

### getCTokenFactory

```solidity
function getCTokenFactory(IStore s) public view
returns(contract ICTokenFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCTokenFactory(IStore s) public view returns (ICTokenFactory) {
    return ICTokenFactory(ProtoUtilV1.getContract(s, ProtoUtilV1.NS_COVER_CTOKEN_FACTORY));
  }
```
</details>

### getPolicyContract

```solidity
function getPolicyContract(IStore s) public view
returns(contract IPolicy)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyContract(IStore s) public view returns (IPolicy) {
    return IPolicy(ProtoUtilV1.getContract(s, ProtoUtilV1.NS_COVER_POLICY));
  }
```
</details>

### getAssuranceContract

```solidity
function getAssuranceContract(IStore s) public view
returns(contract ICoverAssurance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAssuranceContract(IStore s) public view returns (ICoverAssurance) {
    return ICoverAssurance(ProtoUtilV1.getContract(s, ProtoUtilV1.NS_COVER_ASSURANCE));
  }
```
</details>

### getVault

```solidity
function getVault(IStore s, bytes32 key) public view
returns(contract IVault)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVault(IStore s, bytes32 key) public view returns (IVault) {
    address vault = s.getAddressByKeys(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.NS_COVER_VAULT, key);
    return IVault(vault);
  }
```
</details>

### getVaultFactoryContract

```solidity
function getVaultFactoryContract(IStore s) public view
returns(contract IVaultFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVaultFactoryContract(IStore s) public view returns (IVaultFactory) {
    address factory = ProtoUtilV1.getContract(s, ProtoUtilV1.NS_COVER_VAULT_FACTORY);
    return IVaultFactory(factory);
  }
```
</details>

### setStatus

Sets the current status of a given cover
 0 - normal
 1 - stopped, can not purchase covers or add liquidity
 2 - reporting, incident happened
 3 - reporting, false reporting
 4 - claimable, claims accepted for payout

```solidity
function setStatus(IStore s, bytes32 key, enum CoverUtilV1.CoverStatus status) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| status | enum CoverUtilV1.CoverStatus |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setStatus(
    IStore s,
    bytes32 key,
    CoverStatus status
  ) external {
    s.setUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key, uint256(status));
  }
```
</details>

### _getCoverOwner

```solidity
function _getCoverOwner(IStore s, bytes32 key) private view
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
function _getCoverOwner(IStore s, bytes32 key) private view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);
  }
```
</details>

### _getClaimable

```solidity
function _getClaimable(IStore s, bytes32 key) private view
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
function _getClaimable(IStore s, bytes32 key) private view returns (uint256) {
    // Todo: deduct the expired cover amounts
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_CLAIMABLE, key);
  }
```
</details>

### _getStatus

```solidity
function _getStatus(IStore s, bytes32 key) private view
returns(enum CoverUtilV1.CoverStatus)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getStatus(IStore s, bytes32 key) private view returns (CoverStatus) {
    return CoverStatus(s.getUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key));
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
