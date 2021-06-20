# Pausable.sol

View Source: [openzeppelin-solidity/contracts/security/Pausable.sol](../openzeppelin-solidity/contracts/security/Pausable.sol)

**↗ Extends: [Context](Context.md)**
**↘ Derived Contracts: [Recoverable](Recoverable.md)**

**Pausable**

Contract module which allows children to implement an emergency stop
 mechanism that can be triggered by an authorized account.
 This module is used through inheritance. It will make available the
 modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 the functions of your contract. Note that they will not be pausable by
 simply including this module, only once the modifiers are put in place.

## Contract Members
**Constants & Variables**

```js
bool private _paused;

```

**Events**

```js
event Paused(address  account);
event Unpaused(address  account);
```

## Modifiers

- [whenNotPaused](#whennotpaused)
- [whenPaused](#whenpaused)

### whenNotPaused

Modifier to make a function callable only when the contract is not paused.
 Requirements:
 - The contract must not be paused.

```js
modifier whenNotPaused() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### whenPaused

Modifier to make a function callable only when the contract is paused.
 Requirements:
 - The contract must be paused.

```js
modifier whenPaused() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [()](#)
- [paused()](#paused)
- [_pause()](#_pause)
- [_unpause()](#_unpause)

### 

Initializes the contract in unpaused state.

```js
function () internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### paused

Returns true if the contract is paused, and false otherwise.

```js
function paused() public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _pause

Triggers stopped state.
 Requirements:
 - The contract must not be paused.

```js
function _pause() internal nonpayable whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _unpause

Returns to normal state.
 Requirements:
 - The contract must be paused.

```js
function _unpause() internal nonpayable whenPaused 
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
