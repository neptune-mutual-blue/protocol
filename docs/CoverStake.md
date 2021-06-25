# CoverStake.sol

View Source: [contracts/core/lifecycle/CoverStake.sol](../contracts/core/lifecycle/CoverStake.sol)

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
event FeeBurned(bytes32  key, uint256  amount);
```

## Modifiers

- [onlyFromCover](#onlyfromcover)
- [onlyValidCover](#onlyvalidcover)

### onlyFromCover

```js
modifier onlyFromCover() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### onlyValidCover

```js
modifier onlyValidCover(bytes32 key) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key to check | 

## Functions

- [constructor(IStore store)](#)
- [increaseStake(bytes32 key, address account, uint256 amount, uint256 fee)](#increasestake)
- [decreaseStake(bytes32 key, address account, uint256 amount)](#decreasestake)
- [version()](#version)
- [stakeOf(bytes32 key, address account)](#stakeof)
- [_getDrawingPower(bytes32 key, address account)](#_getdrawingpower)
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
function increaseStake(bytes32 key, address account, uint256 amount, uint256 fee) external nonpayable onlyFromCover onlyValidCover nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| amount | uint256 |  | 
| fee | uint256 |  | 

### decreaseStake

```js
function decreaseStake(bytes32 key, address account, uint256 amount) external nonpayable onlyFromCover onlyValidCover nonReentrant whenNotPaused 
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

### _getDrawingPower

```js
function _getDrawingPower(bytes32 key, address account) private view
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
