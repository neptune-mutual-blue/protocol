# Protocol.sol

View Source: [contracts/core/Protocol.sol](../contracts/core/Protocol.sol)

**↗ Extends: [Recoverable](Recoverable.md)**

**Protocol**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

**Events**

```js
event ContractAdded(bytes32  namespace, address  contractAddress);
event ContractUpgraded(bytes32  namespace, address indexed previous, address indexed current);
```

## Modifiers

- [onlyMember](#onlymember)
- [onlyOwnerOrProtocol](#onlyownerorprotocol)

### onlyMember

This modifier ensures that the caller is one of the latest protocol contracts

```js
modifier onlyMember(address contractAddress) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractAddress | address |  | 

### onlyOwnerOrProtocol

```js
modifier onlyOwnerOrProtocol() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [constructor(IStore store, address nep, address treasury, address assuranceVault)](#)
- [upgradeContract(bytes32 namespace, address previous, address current)](#upgradecontract)
- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [_addContract(bytes32 namespace, address contractAddress)](#_addcontract)
- [_deleteContract(bytes32 namespace, address contractAddress)](#_deletecontract)

### 

```js
function (IStore store, address nep, address treasury, address assuranceVault) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 
| nep | address |  | 
| treasury | address |  | 
| assuranceVault | address |  | 

### upgradeContract

```js
function upgradeContract(bytes32 namespace, address previous, address current) external nonpayable onlyOwner onlyMember whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

### addContract

```js
function addContract(bytes32 namespace, address contractAddress) external nonpayable onlyOwnerOrProtocol whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### _addContract

```js
function _addContract(bytes32 namespace, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### _deleteContract

```js
function _deleteContract(bytes32 namespace, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

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
