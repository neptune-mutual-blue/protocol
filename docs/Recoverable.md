# Recoverable.sol

View Source: [contracts/Recoverable.sol](../contracts/Recoverable.sol)

**↗ Extends: [Ownable](Ownable.md), [ReentrancyGuard](ReentrancyGuard.md), [Pausable](Pausable.md)**
**↘ Derived Contracts: [Commission](Commission.md), [Cover](Cover.md), [CoverAssurance](CoverAssurance.md), [CoverLiquidity](CoverLiquidity.md), [CoverProvision](CoverProvision.md), [CoverStake](CoverStake.md), [Protocol](Protocol.md), [Vault](Vault.md)**

**Recoverable**

## Functions

- [recoverEther()](#recoverether)
- [recoverToken(address token)](#recovertoken)
- [pause()](#pause)
- [unpause()](#unpause)

### recoverEther

Recover all Ether held by the contract to the owner.

```js
function recoverEther() external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### recoverToken

Recover all BEP-20 compatible tokens sent to this address.

```js
function recoverToken(address token) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address | BEP-20 The address of the token contract | 

### pause

```js
function pause() external nonpayable onlyOwner whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### unpause

```js
function unpause() external nonpayable onlyOwner whenPaused 
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
