# CoverUtilV1.sol

View Source: [contracts/libraries/CoverUtilV1.sol](../contracts/libraries/CoverUtilV1.sol)

**CoverUtilV1**

## Functions

- [mustBeValidCover(IStore s, bytes32 key)](#mustbevalidcover)
- [mustBeCoverOwner(IStore s, bytes32 key, address sender, address owner)](#mustbecoverowner)
- [getCoverOwner(IStore s, bytes32 key)](#getcoverowner)
- [getStatus(IStore s, bytes32 key)](#getstatus)
- [getCoverPoolSummary(IStore s, bytes32 key)](#getcoverpoolsummary)
- [getPolicyRates(IStore s, bytes32 key)](#getpolicyrates)
- [getLiquidity(IStore s, bytes32 key)](#getliquidity)
- [getStake(IStore s, bytes32 key)](#getstake)
- [getClaimable(IStore s, bytes32 key)](#getclaimable)
- [getCoverInfo(IStore s, bytes32 key)](#getcoverinfo)
- [getStakingContract(IStore s)](#getstakingcontract)
- [getCTokenFactory(IStore s)](#getctokenfactory)
- [getPolicyContract(IStore s)](#getpolicycontract)
- [getAssuranceContract(IStore s)](#getassurancecontract)
- [getVault(IStore s, bytes32 key)](#getvault)
- [getVaultFactoryContract(IStore s)](#getvaultfactorycontract)
- [_getCoverOwner(IStore s, bytes32 key)](#_getcoverowner)
- [_getClaimable(IStore s, bytes32 key)](#_getclaimable)
- [_getStatus(IStore s, bytes32 key)](#_getstatus)

### mustBeValidCover

Reverts if the key does not resolve in a valid cover contract.

```js
function mustBeValidCover(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key to check | 

### mustBeCoverOwner

Reverts if the sender is not the cover owner or owner

```js
function mustBeCoverOwner(IStore s, bytes32 key, address sender, address owner) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender The `msg.sender` value | 
| key | bytes32 | Enter the cover key to check | 
| sender | address | The `msg.sender` value | 
| owner | address | Enter the owner address | 

### getCoverOwner

```js
function getCoverOwner(IStore s, bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getStatus

Gets the current status of the protocol
 0 - normal
 1 - stopped, can not purchase covers or add liquidity
 2 - reporting, incident happened
 3 - reporting, false reporting
 4 - claimable, claims accepted for payout

```js
function getStatus(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getCoverPoolSummary

Todo: Returns the values of the given cover key

```js
function getCoverPoolSummary(IStore s, bytes32 key) external view
returns(_values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getPolicyRates

```js
function getPolicyRates(IStore s, bytes32 key) external view
returns(floor uint256, ceiling uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getLiquidity

```js
function getLiquidity(IStore s, bytes32 key) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getStake

```js
function getStake(IStore s, bytes32 key) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getClaimable

```js
function getClaimable(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getCoverInfo

```js
function getCoverInfo(IStore s, bytes32 key) external view
returns(owner address, info bytes32, values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getStakingContract

```js
function getStakingContract(IStore s) public view
returns(contract ICoverStake)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getCTokenFactory

```js
function getCTokenFactory(IStore s) public view
returns(contract ICTokenFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getPolicyContract

```js
function getPolicyContract(IStore s) public view
returns(contract IPolicy)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getAssuranceContract

```js
function getAssuranceContract(IStore s) public view
returns(contract ICoverAssurance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getVault

```js
function getVault(IStore s, bytes32 key) public view
returns(contract IVault)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### getVaultFactoryContract

```js
function getVaultFactoryContract(IStore s) public view
returns(contract IVaultFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### _getCoverOwner

```js
function _getCoverOwner(IStore s, bytes32 key) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### _getClaimable

```js
function _getClaimable(IStore s, bytes32 key) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### _getStatus

```js
function _getStatus(IStore s, bytes32 key) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

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
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
