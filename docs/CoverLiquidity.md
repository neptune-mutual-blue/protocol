# CoverLiquidity.sol

View Source: [contracts/cover/CoverLiquidity.sol](../contracts/cover/CoverLiquidity.sol)

**↗ Extends: [ICoverLiquidity](ICoverLiquidity.md), [Recoverable](Recoverable.md)**

**CoverLiquidity**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

**Events**

```js
event LiquidityAdded(bytes32  key, address  asset, uint256  amount);
event LiquidityRemoved(bytes32  key, address  asset, uint256  amount);
```

## Functions

- [(IStore store)](#)
- [addLiquidity(bytes32 key, address account, uint256 amount)](#addliquidity)
- [removeLiquidity(bytes32 key, address account, uint256 amount)](#removeliquidity)
- [version()](#version)
- [liquidityOf(bytes32 key, address account)](#liquidityof)
- [getName()](#getname)

### 

```js
function (IStore store) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

### addLiquidity

```js
function addLiquidity(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| amount | uint256 |  | 

### removeLiquidity

```js
function removeLiquidity(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| amount | uint256 |  | 

### version

```js
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### liquidityOf

```js
function liquidityOf(bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 

### getName

```js
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

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
