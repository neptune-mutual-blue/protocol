# Cover.sol

View Source: [contracts/cover/Cover.sol](../contracts/cover/Cover.sol)

**↗ Extends: [ICover](ICover.md), [Recoverable](Recoverable.md)**

**Cover**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;
contract ICoverStake public staking;

```

**Events**

```js
event CoverCreated(bytes32  key, bytes32  info, uint256  stakeWithFee, uint256  liquidity);
```

## Functions

- [(IStore store, address liquidity, string liquidityName)](#)
- [addCover(bytes32 key, bytes32 info, uint256 stakeWithFee, uint256 liquidity)](#addcover)
- [updateCover(bytes32 key, bytes32 info)](#updatecover)
- [getCover(bytes32 key)](#getcover)
- [version()](#version)
- [getStakingContract()](#getstakingcontract)
- [getLiquidityContract()](#getliquiditycontract)
- [getName()](#getname)
- [_burn(IERC20 token, uint256 amount)](#_burn)

### 

```js
function (IStore store, address liquidity, string liquidityName) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 
| liquidity | address |  | 
| liquidityName | string |  | 

### addCover

Adds a new cover contract

```js
function addCover(bytes32 key, bytes32 info, uint256 stakeWithFee, uint256 liquidity) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| stakeWithFee | uint256 | Enter the total NEP amount (stake + fee) to transfer to this contract. | 
| liquidity | uint256 | Optional. Enter the initial stablecoin liquidity for this cover. | 

### updateCover

```js
function updateCover(bytes32 key, bytes32 info) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| info | bytes32 |  | 

### getCover

```js
function getCover(bytes32 key) external view
returns(owner address, info bytes32, values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

### version

```js
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getStakingContract

```js
function getStakingContract() public view
returns(contract ICoverStake)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getLiquidityContract

```js
function getLiquidityContract() public view
returns(contract ICoverLiquidity)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getName

```js
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _burn

```js
function _burn(IERC20 token, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | IERC20 |  | 
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
