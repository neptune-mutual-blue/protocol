# Protocol.sol

View Source: [contracts/Protocol.sol](../contracts/Protocol.sol)

**↗ Extends: [Recoverable](Recoverable.md)**

**Protocol**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

**Events**

```js
event ContractUpgraded(address indexed previous, address indexed current);
```

## Modifiers

- [onlyProtocol](#onlyprotocol)

### onlyProtocol

This modifier ensures that the caller is one of the latest protocol contracts

```js
modifier onlyProtocol(address contractAddress) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractAddress | address |  | 

## Functions

- [(IStore store, address nep)](#)
- [_getMemberHash(address contractAddress)](#_getmemberhash)
- [vaultWithdrawal(bytes32 contractName, bytes32 key, IERC20 asset, address recipient, uint256 amount)](#vaultwithdrawal)
- [vaultDeposit(bytes32 contractName, bytes32 key, IERC20 asset, address sender, uint256 amount)](#vaultdeposit)
- [upgradeContract(bytes32 name, address previous, address current)](#upgradecontract)
- [_addContract(bytes32 name, address contractAddress)](#_addcontract)
- [_deleteContract(bytes32 name, address contractAddress)](#_deletecontract)

### 

```js
function (IStore store, address nep) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 
| nep | address |  | 

### _getMemberHash

This function ensures that the supplied address is one of the latest protocol contracts

```js
function _getMemberHash(address contractAddress) internal view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractAddress | address |  | 

### vaultWithdrawal

```js
function vaultWithdrawal(bytes32 contractName, bytes32 key, IERC20 asset, address recipient, uint256 amount) public nonpayable nonReentrant onlyProtocol 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractName | bytes32 |  | 
| key | bytes32 |  | 
| asset | IERC20 |  | 
| recipient | address |  | 
| amount | uint256 |  | 

### vaultDeposit

```js
function vaultDeposit(bytes32 contractName, bytes32 key, IERC20 asset, address sender, uint256 amount) public nonpayable nonReentrant onlyProtocol 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractName | bytes32 |  | 
| key | bytes32 |  | 
| asset | IERC20 |  | 
| sender | address |  | 
| amount | uint256 |  | 

### upgradeContract

```js
function upgradeContract(bytes32 name, address previous, address current) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| name | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

### _addContract

```js
function _addContract(bytes32 name, address contractAddress) private nonpayable onlyProtocol 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| name | bytes32 |  | 
| contractAddress | address |  | 

### _deleteContract

```js
function _deleteContract(bytes32 name, address contractAddress) private nonpayable onlyProtocol 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| name | bytes32 |  | 
| contractAddress | address |  | 

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
