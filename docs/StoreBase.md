# StoreBase.sol

View Source: [contracts/core/store/StoreBase.sol](../contracts/core/store/StoreBase.sol)

**↗ Extends: [IStore](IStore.md), [Pausable](Pausable.md), [Ownable](Ownable.md)**
**↘ Derived Contracts: [Store](Store.md)**

**StoreBase**

## Contract Members
**Constants & Variables**

```js
//public members
mapping(bytes32 => int256) public intStorage;
mapping(bytes32 => uint256) public uintStorage;
mapping(bytes32 => uint256[]) public uintsStorage;
mapping(bytes32 => address) public addressStorage;
mapping(bytes32 => string) public stringStorage;
mapping(bytes32 => bytes) public bytesStorage;
mapping(bytes32 => bytes32) public bytes32Storage;
mapping(bytes32 => bool) public boolStorage;

//private members
bytes32 private constant _NS_MEMBERS;

```

## Functions

- [constructor()](#)
- [recoverEther(address sendTo)](#recoverether)
- [recoverToken(address token, address sendTo)](#recovertoken)
- [pause()](#pause)
- [unpause()](#unpause)
- [isProtocolMember(address contractAddress)](#isprotocolmember)
- [_throwIfPaused()](#_throwifpaused)
- [_throwIfSenderNotProtocol()](#_throwifsendernotprotocol)

### 

```js
function () internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### recoverEther

Recover all Ether held by the contract.

```js
function recoverEther(address sendTo) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| sendTo | address |  | 

### recoverToken

Recover all BEP-20 compatible tokens sent to this address.

```js
function recoverToken(address token, address sendTo) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address | BEP-20 The address of the token contract | 
| sendTo | address |  | 

### pause

```js
function pause() external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### unpause

```js
function unpause() external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### isProtocolMember

```js
function isProtocolMember(address contractAddress) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractAddress | address |  | 

### _throwIfPaused

```js
function _throwIfPaused() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _throwIfSenderNotProtocol

```js
function _throwIfSenderNotProtocol() internal view
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
