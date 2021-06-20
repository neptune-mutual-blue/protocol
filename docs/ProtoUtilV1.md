# ProtoUtilV1.sol

View Source: [libraries/ProtoUtilV1.sol](../libraries/ProtoUtilV1.sol)

**ProtoUtilV1**

## Contract Members
**Constants & Variables**

```js
bytes32 public constant KP_BURNER;
bytes32 public constant KP_CONTRACTS;
bytes32 public constant KP_CORE;
bytes32 public constant KP_COVER;
bytes32 public constant KP_COVER_CLAIMABLE;
bytes32 public constant KP_COVER_FEE;
bytes32 public constant KP_COVER_INFO;
bytes32 public constant KP_COVER_LIQUIDITY;
bytes32 public constant KP_COVER_LIQUIDITY_NAME;
bytes32 public constant KP_COVER_LIQUIDITY_OWNED;
bytes32 public constant KP_COVER_LIQUIDITY_TOKEN;
bytes32 public constant KP_COVER_LIQUIDITY_TS;
bytes32 public constant KP_COVER_OWNER;
bytes32 public constant KP_COVER_PROVISION;
bytes32 public constant KP_COVER_STAKE;
bytes32 public constant KP_COVER_STAKE_OWNED;
bytes32 public constant KP_COVER_STATUS;
bytes32 public constant KP_NEP;
bytes32 public constant KP_VAULT;
bytes32 public constant KP_VAULT_BALANCES;
bytes32 public constant CONTRACTS_PROTOCOL;
bytes32 public constant CONTRACTS_VAULT;
bytes32 public constant CONTRACTS_COVER;
bytes32 public constant CONTRACTS_COVER_PROVISION;
bytes32 public constant CONTRACTS_COVER_STAKE;
bytes32 public constant CONTRACTS_COVER_LIQUIDITY;

```

## Functions

- [getProtocol(IStore s)](#getprotocol)
- [getContract(IStore s, bytes32 name)](#getcontract)
- [onlyContract(IStore s, bytes32 name)](#onlycontract)
- [nepToken(IStore s)](#neptoken)
- [getVaultAddress(IStore s)](#getvaultaddress)
- [getVault(IStore s)](#getvault)
- [getLiquidityToken(IStore s)](#getliquiditytoken)
- [getBurnAddress(IStore s)](#getburnaddress)
- [toKeccak256(bytes value)](#tokeccak256)
- [_getContract(IStore s, bytes32 name)](#_getcontract)

### getProtocol

```js
function getProtocol(IStore s) external view
returns(contract IProtocol)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getContract

```js
function getContract(IStore s, bytes32 name) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

### onlyContract

```js
function onlyContract(IStore s, bytes32 name) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

### nepToken

```js
function nepToken(IStore s) external view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getVaultAddress

```js
function getVaultAddress(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getVault

```js
function getVault(IStore s) external view
returns(contract IVault)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getLiquidityToken

```js
function getLiquidityToken(IStore s) public view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getBurnAddress

```js
function getBurnAddress(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### toKeccak256

```js
function toKeccak256(bytes value) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | bytes |  | 

### _getContract

```js
function _getContract(IStore s, bytes32 name) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

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
