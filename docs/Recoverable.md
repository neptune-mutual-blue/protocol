# Recoverable.sol

View Source: [contracts/core/Recoverable.sol](../contracts/core/Recoverable.sol)

**↗ Extends: [Ownable](Ownable.md), [ReentrancyGuard](ReentrancyGuard.md), [Pausable](Pausable.md)**
**↘ Derived Contracts: [Commission](Commission.md), [Controller](Controller.md), [CoverAssurance](CoverAssurance.md), [CoverBase](CoverBase.md), [CoverProvision](CoverProvision.md), [CoverStake](CoverStake.md), [Factory](Factory.md), [Protocol](Protocol.md), [VaultPod](VaultPod.md), [Witness](Witness.md)**

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
