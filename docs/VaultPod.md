# VaultPod.sol

View Source: [contracts/core/liquidity/VaultPod.sol](../contracts/core/liquidity/VaultPod.sol)

**↗ Extends: [IVault](IVault.md), [Recoverable](Recoverable.md), [ERC20](ERC20.md)**
**↘ Derived Contracts: [Vault](Vault.md)**

**VaultPod**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;
bytes32 public key;
address public lqt;

```

## Functions

- [constructor(IStore store, bytes32 coverKey, IERC20 liquidityToken)](#)
- [_mintPods(address account, uint256 liquidityToAdd)](#_mintpods)
- [_burnPods(address account, uint256 podsToBurn)](#_burnpods)
- [_calculateLiquidity(uint256 podsToBurn)](#_calculateliquidity)
- [_calculatePods(uint256 liquidityToAdd)](#_calculatepods)

### 

```js
function (IStore store, bytes32 coverKey, IERC20 liquidityToken) internal nonpayable ERC20 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 
| coverKey | bytes32 |  | 
| liquidityToken | IERC20 |  | 

### _mintPods

```js
function _mintPods(address account, uint256 liquidityToAdd) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 
| liquidityToAdd | uint256 |  | 

### _burnPods

```js
function _burnPods(address account, uint256 podsToBurn) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 
| podsToBurn | uint256 |  | 

### _calculateLiquidity

```js
function _calculateLiquidity(uint256 podsToBurn) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| podsToBurn | uint256 |  | 

### _calculatePods

```js
function _calculatePods(uint256 liquidityToAdd) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| liquidityToAdd | uint256 |  | 

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
