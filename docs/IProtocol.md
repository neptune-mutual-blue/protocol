# IProtocol.sol

View Source: [interfaces/IProtocol.sol](../interfaces/IProtocol.sol)

**↗ Extends: [IMember](IMember.md)**

**IProtocol**

## Functions

- [getCoverFee()](#getcoverfee)
- [getMinCoverStake()](#getmincoverstake)
- [getMinLiquidityPeriod()](#getminliquidityperiod)
- [vaultDeposit(bytes32 contractName, bytes32 key, IERC20 asset, address sender, uint256 amount)](#vaultdeposit)
- [vaultWithdrawal(bytes32 contractName, bytes32 key, IERC20 asset, address recipient, uint256 amount)](#vaultwithdrawal)

### getCoverFee

```js
function getCoverFee() external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getMinCoverStake

```js
function getMinCoverStake() external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getMinLiquidityPeriod

```js
function getMinLiquidityPeriod() external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### vaultDeposit

```js
function vaultDeposit(bytes32 contractName, bytes32 key, IERC20 asset, address sender, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractName | bytes32 |  | 
| key | bytes32 |  | 
| asset | IERC20 |  | 
| sender | address |  | 
| amount | uint256 |  | 

### vaultWithdrawal

```js
function vaultWithdrawal(bytes32 contractName, bytes32 key, IERC20 asset, address recipient, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractName | bytes32 |  | 
| key | bytes32 |  | 
| asset | IERC20 |  | 
| recipient | address |  | 
| amount | uint256 |  | 

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
