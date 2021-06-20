# CoverStake.sol

View Source: [contracts/cover/CoverStake.sol](../contracts/cover/CoverStake.sol)

**↗ Extends: [ICoverStake](ICoverStake.md), [Recoverable](Recoverable.md)**

**CoverStake**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

**Events**

```js
event StakeAdded(bytes32  key, uint256  amount);
event StakeRemoved(bytes32  key, uint256  amount);
```

## Functions

- [(IStore store)](#)
- [increaseStake(bytes32 key, address account, uint256 amount)](#increasestake)
- [decreaseStake(bytes32 key, address account, uint256 amount)](#decreasestake)
- [version()](#version)
- [stakeOf(bytes32 key, address account)](#stakeof)
- [getName()](#getname)

### 

```js
function (IStore store) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

### increaseStake

```js
function increaseStake(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| amount | uint256 |  | 

### decreaseStake

```js
function decreaseStake(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
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

### stakeOf

```js
function stakeOf(bytes32 key, address account) public view
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
