# CoverUtilV1.sol

View Source: [contracts/libraries/CoverUtilV1.sol](../contracts/libraries/CoverUtilV1.sol)

**CoverUtilV1**

## Functions

- [ensureValidCover(IStore s, bytes32 key)](#ensurevalidcover)
- [ensureCoverOwner(IStore s, bytes32 key, address sender, address owner)](#ensurecoverowner)
- [getCoverOwner(IStore s, bytes32 key)](#getcoverowner)
- [getStatus(IStore s, bytes32 key)](#getstatus)
- [getLiquidity(IStore s, bytes32 key)](#getliquidity)
- [getStake(IStore s, bytes32 key)](#getstake)
- [getClaimable(IStore s, bytes32 key)](#getclaimable)
- [getCoverInfo(IStore s, bytes32 key)](#getcoverinfo)
- [getStakingContract(IStore s)](#getstakingcontract)
- [getPolicyContract(IStore s)](#getpolicycontract)
- [getAssuranceContract(IStore s)](#getassurancecontract)
- [getVault(IStore s, bytes32 key)](#getvault)
- [getVaultFactoryContract(IStore s)](#getvaultfactorycontract)
- [_getCoverOwner(IStore s, bytes32 key)](#_getcoverowner)
- [_getClaimable(IStore s, bytes32 key)](#_getclaimable)
- [_getStatus(IStore s, bytes32 key)](#_getstatus)

### ensureValidCover

```js
function ensureValidCover(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### ensureCoverOwner

```js
function ensureCoverOwner(IStore s, bytes32 key, address sender, address owner) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| sender | address |  | 
| owner | address |  | 

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
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ERC20](ERC20.md)
* [Factory](Factory.md)
* [Governance](Governance.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverStake](ICoverStake.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
