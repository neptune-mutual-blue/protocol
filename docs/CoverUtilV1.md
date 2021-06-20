# CoverUtilV1.sol

View Source: [libraries/CoverUtilV1.sol](../libraries/CoverUtilV1.sol)

**CoverUtilV1**

## Functions

- [onlyValidCovers(IStore s, bytes32 key)](#onlyvalidcovers)
- [onlyCoverOwner(IStore s, bytes32 key, address sender, address owner)](#onlycoverowner)
- [getStatus(IStore s, bytes32 key)](#getstatus)
- [getLiquidity(IStore s, bytes32 key)](#getliquidity)
- [getStake(IStore s, bytes32 key)](#getstake)
- [getClaimable(IStore s, bytes32 key)](#getclaimable)
- [getCoverInfo(IStore s, bytes32 key)](#getcoverinfo)
- [getStakingContract(IStore s)](#getstakingcontract)
- [getLiquidityContract(IStore s)](#getliquiditycontract)
- [_getClaimable(IStore s, bytes32 key)](#_getclaimable)
- [_getStatus(IStore s, bytes32 key)](#_getstatus)

### onlyValidCovers

```js
function onlyValidCovers(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

### onlyCoverOwner

```js
function onlyCoverOwner(IStore s, bytes32 key, address sender, address owner) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| sender | address |  | 
| owner | address |  | 

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

### getLiquidityContract

```js
function getLiquidityContract(IStore s) public view
returns(contract ICoverLiquidity)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

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
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverLiquidity](CoverLiquidity.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ICover](ICover.md)
* [ICoverLiquidity](ICoverLiquidity.md)
* [ICoverStake](ICoverStake.md)
* [IERC20](IERC20.md)
* [IMember](IMember.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
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
