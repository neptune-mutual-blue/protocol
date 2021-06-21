# IProtocol.sol

View Source: [interfaces/IProtocol.sol](../interfaces/IProtocol.sol)

**↗ Extends: [IMember](IMember.md)**

**IProtocol**

## Functions

- [depositToVault(bytes32 contractName, bytes32 key, IERC20 asset, address sender, uint256 amount)](#deposittovault)
- [withdrawFromVault(bytes32 contractName, bytes32 key, IERC20 asset, address recipient, uint256 amount)](#withdrawfromvault)
- [getCoverFee()](#getcoverfee)
- [getMinCoverStake()](#getmincoverstake)
- [getMinLiquidityPeriod()](#getminliquidityperiod)

### depositToVault

```js
function depositToVault(bytes32 contractName, bytes32 key, IERC20 asset, address sender, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractName | bytes32 |  | 
| key | bytes32 |  | 
| asset | IERC20 |  | 
| sender | address |  | 
| amount | uint256 |  | 

### withdrawFromVault

```js
function withdrawFromVault(bytes32 contractName, bytes32 key, IERC20 asset, address recipient, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractName | bytes32 |  | 
| key | bytes32 |  | 
| asset | IERC20 |  | 
| recipient | address |  | 
| amount | uint256 |  | 

### getCoverFee

```js
function getCoverFee() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getMinCoverStake

```js
function getMinCoverStake() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getMinLiquidityPeriod

```js
function getMinLiquidityPeriod() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Contracts

* [Address](Address.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverLiquidity](CoverLiquidity.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ICommission](ICommission.md)
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
