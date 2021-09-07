# StoreKeyUtil.sol

View Source: [contracts/libraries/StoreKeyUtil.sol](../contracts/libraries/StoreKeyUtil.sol)

**StoreKeyUtil**

## Functions

- [setUintByKey(IStore s, bytes32 key, uint256 value)](#setuintbykey)
- [setUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value)](#setuintbykeys)
- [setUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value)](#setuintbykeys)
- [addUintByKey(IStore s, bytes32 key, uint256 value)](#adduintbykey)
- [addUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value)](#adduintbykeys)
- [addUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value)](#adduintbykeys)
- [subtractUintByKey(IStore s, bytes32 key, uint256 value)](#subtractuintbykey)
- [subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value)](#subtractuintbykeys)
- [subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value)](#subtractuintbykeys)
- [setBytes32ByKey(IStore s, bytes32 key, bytes32 value)](#setbytes32bykey)
- [setBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value)](#setbytes32bykeys)
- [setBoolByKey(IStore s, bytes32 key, bool value)](#setboolbykey)
- [setBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bool value)](#setboolbykeys)
- [setBoolByKeys(IStore s, bytes32 key, address account, bool value)](#setboolbykeys)
- [setAddressByKey(IStore s, bytes32 key, address value)](#setaddressbykey)
- [setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, address value)](#setaddressbykeys)
- [setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value)](#setaddressbykeys)
- [deleteUintByKey(IStore s, bytes32 key)](#deleteuintbykey)
- [deleteUintByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteuintbykeys)
- [deleteBytes32ByKey(IStore s, bytes32 key)](#deletebytes32bykey)
- [deleteBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2)](#deletebytes32bykeys)
- [deleteBoolByKey(IStore s, bytes32 key)](#deleteboolbykey)
- [deleteBoolByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteboolbykeys)
- [deleteBoolByKeys(IStore s, bytes32 key, address account)](#deleteboolbykeys)
- [deleteAddressByKey(IStore s, bytes32 key)](#deleteaddressbykey)
- [deleteAddressByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteaddressbykeys)
- [getUintByKey(IStore s, bytes32 key)](#getuintbykey)
- [getUintByKeys(IStore s, bytes32 key1, bytes32 key2)](#getuintbykeys)
- [getUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account)](#getuintbykeys)
- [getBytes32ByKey(IStore s, bytes32 key)](#getbytes32bykey)
- [getBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2)](#getbytes32bykeys)
- [getBoolByKey(IStore s, bytes32 key)](#getboolbykey)
- [getBoolByKeys(IStore s, bytes32 key1, bytes32 key2)](#getboolbykeys)
- [getBoolByKeys(IStore s, bytes32 key, address account)](#getboolbykeys)
- [getAddressByKey(IStore s, bytes32 key)](#getaddressbykey)
- [getAddressByKeys(IStore s, bytes32 key1, bytes32 key2)](#getaddressbykeys)
- [getAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#getaddressbykeys)

### setUintByKey

```js
function setUintByKey(IStore s, bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | uint256 |  | 

### setUintByKeys

```js
function setUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

### setUintByKeys

```js
function setUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

### addUintByKey

```js
function addUintByKey(IStore s, bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | uint256 |  | 

### addUintByKeys

```js
function addUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

### addUintByKeys

```js
function addUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

### subtractUintByKey

```js
function subtractUintByKey(IStore s, bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | uint256 |  | 

### subtractUintByKeys

```js
function subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

### subtractUintByKeys

```js
function subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

### setBytes32ByKey

```js
function setBytes32ByKey(IStore s, bytes32 key, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | bytes32 |  | 

### setBytes32ByKeys

```js
function setBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bytes32 |  | 

### setBoolByKey

```js
function setBoolByKey(IStore s, bytes32 key, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | bool |  | 

### setBoolByKeys

```js
function setBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bool |  | 

### setBoolByKeys

```js
function setBoolByKeys(IStore s, bytes32 key, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

### setAddressByKey

```js
function setAddressByKey(IStore s, bytes32 key, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | address |  | 

### setAddressByKeys

```js
function setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | address |  | 

### setAddressByKeys

```js
function setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | address |  | 

### deleteUintByKey

```js
function deleteUintByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### deleteUintByKeys

```js
function deleteUintByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### deleteBytes32ByKey

```js
function deleteBytes32ByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### deleteBytes32ByKeys

```js
function deleteBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### deleteBoolByKey

```js
function deleteBoolByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### deleteBoolByKeys

```js
function deleteBoolByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### deleteBoolByKeys

```js
function deleteBoolByKeys(IStore s, bytes32 key, address account) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

### deleteAddressByKey

```js
function deleteAddressByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### deleteAddressByKeys

```js
function deleteAddressByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### getUintByKey

```js
function getUintByKey(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getUintByKeys

```js
function getUintByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### getUintByKeys

```js
function getUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 

### getBytes32ByKey

```js
function getBytes32ByKey(IStore s, bytes32 key) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getBytes32ByKeys

```js
function getBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### getBoolByKey

```js
function getBoolByKey(IStore s, bytes32 key) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getBoolByKeys

```js
function getBoolByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### getBoolByKeys

```js
function getBoolByKeys(IStore s, bytes32 key, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

### getAddressByKey

```js
function getAddressByKey(IStore s, bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getAddressByKeys

```js
function getAddressByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

### getAddressByKeys

```js
function getAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

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
