# Protocol.sol

View Source: [contracts/core/Protocol.sol](../contracts/core/Protocol.sol)

**↗ Extends: [IProtocol](IProtocol.md), [Recoverable](Recoverable.md)**

**Protocol**

**Events**

```js
event ContractAdded(bytes32  namespace, address  contractAddress);
event ContractUpgraded(bytes32  namespace, address indexed previous, address indexed current);
event MemberAdded(address  member);
event MemberRemoved(address  member);
```

## Functions

- [constructor(IStore store, address nep, address treasury, address assuranceVault)](#)
- [upgradeContract(bytes32 namespace, address previous, address current)](#upgradecontract)
- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [removeMember(address member)](#removemember)
- [addMember(address member)](#addmember)
- [_addContract(bytes32 namespace, address contractAddress)](#_addcontract)
- [_deleteContract(bytes32 namespace, address contractAddress)](#_deletecontract)
- [_addMember(address member)](#_addmember)
- [_removeMember(address member)](#_removemember)
- [version()](#version)
- [getName()](#getname)

### 

```js
function (IStore store, address nep, address treasury, address assuranceVault) public nonpayable Recoverable 
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
function upgradeContract(bytes32 namespace, address previous, address current) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

### addContract

```js
function addContract(bytes32 namespace, address contractAddress) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### removeMember

```js
function removeMember(address member) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

### addMember

```js
function addMember(address member) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

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

### _addMember

```js
function _addMember(address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

### _removeMember

```js
function _removeMember(address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

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
