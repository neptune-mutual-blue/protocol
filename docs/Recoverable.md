# Recoverable.sol

View Source: [contracts/core/Recoverable.sol](../contracts/core/Recoverable.sol)

**↗ Extends: [Ownable](Ownable.md), [ReentrancyGuard](ReentrancyGuard.md), [Pausable](Pausable.md)**
**↘ Derived Contracts: [Commission](Commission.md), [Controller](Controller.md), [CoverAssurance](CoverAssurance.md), [CoverBase](CoverBase.md), [CoverProvision](CoverProvision.md), [CoverStake](CoverStake.md), [cToken](cToken.md), [Policy](Policy.md), [PolicyAdmin](PolicyAdmin.md), [PolicyManager](PolicyManager.md), [Protocol](Protocol.md), [VaultPod](VaultPod.md), [Witness](Witness.md)**

**Recoverable**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

## Functions

- [constructor(IStore store)](#)
- [recoverEther(address sendTo)](#recoverether)
- [recoverToken(address token, address sendTo)](#recovertoken)
- [pause()](#pause)
- [unpause()](#unpause)
- [_mustBeOwnerOrProtoMember()](#_mustbeownerorprotomember)
- [_mustBeOwnerOrProtoOwner()](#_mustbeownerorprotoowner)
- [_mustBeUnpaused()](#_mustbeunpaused)

### 

```js
function (IStore store) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

### recoverEther

Recover all Ether held by the contract.

```js
function recoverEther(address sendTo) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| sendTo | address |  | 

### recoverToken

Recover all BEP-20 compatible tokens sent to this address.

```js
function recoverToken(address token, address sendTo) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address | BEP-20 The address of the token contract | 
| sendTo | address |  | 

### pause

```js
function pause() external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### unpause

```js
function unpause() external nonpayable whenPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _mustBeOwnerOrProtoMember

Reverts if the sender is not the contract owner or a protocol member.

```js
function _mustBeOwnerOrProtoMember() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _mustBeOwnerOrProtoOwner

Reverts if the sender is not the contract owner or protocol owner.

```js
function _mustBeOwnerOrProtoOwner() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _mustBeUnpaused

```js
function _mustBeUnpaused() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Contracts

* [Address](Address.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [Governance](Governance.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
