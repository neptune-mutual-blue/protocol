# Base Cover Contract (CoverBase.sol)

View Source: [contracts/core/lifecycle/CoverBase.sol](../contracts/core/lifecycle/CoverBase.sol)

**↗ Extends: [ICover](ICover.md), [Recoverable](Recoverable.md)**
**↘ Derived Contracts: [Cover](Cover.md)**

**CoverBase**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

## Modifiers

- [onlyCoverOwner](#onlycoverowner)
- [onlyValidCover](#onlyvalidcover)

### onlyCoverOwner

```js
modifier onlyCoverOwner(bytes32 key) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key to check | 

### onlyValidCover

```js
modifier onlyValidCover(bytes32 key) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key to check | 

## Functions

- [constructor(IStore store, address liquidityToken, bytes32 liquidityName)](#)
- [getCover(bytes32 key)](#getcover)
- [version()](#version)
- [getName()](#getname)

### 

Constructs this smart contract

```js
function (IStore store, address liquidityToken, bytes32 liquidityName) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the address of an eternal storage contract to use.<br /> This contract must be a member of the Protocol for write access to the storage | 
| liquidityToken | address | Provide the address of the token this cover will be quoted against. | 
| liquidityName | bytes32 | Enter a description or ENS name of your liquidity token. | 

### getCover

Get more information about this cover contract

```js
function getCover(bytes32 key) external view
returns(coverOwner address, info bytes32, values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 

### version

Version number of this contract

```js
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getName

Name of this contract

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
