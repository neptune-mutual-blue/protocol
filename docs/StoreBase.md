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

```solidity
function () internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor() {
    boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, msg.sender))] = true;
    boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, address(this)))] = true;
  }
```
</details>

### recoverEther

Recover all Ether held by the contract.

```solidity
function recoverEther(address sendTo) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| sendTo | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function recoverEther(address sendTo) external onlyOwner {
    // slither-disable-next-line arbitrary-send
    payable(sendTo).transfer(address(this).balance);
  }
```
</details>

### recoverToken

Recover all BEP-20 compatible tokens sent to this address.

```solidity
function recoverToken(address token, address sendTo) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address | BEP-20 The address of the token contract | 
| sendTo | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function recoverToken(address token, address sendTo) external onlyOwner {
    IERC20 bep20 = IERC20(token);

    uint256 balance = bep20.balanceOf(address(this));
    require(bep20.transfer(sendTo, balance), "Transfer failed");
  }
```
</details>

### pause

```solidity
function pause() external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function pause() external onlyOwner {
    super._pause();
  }
```
</details>

### unpause

```solidity
function unpause() external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function unpause() external onlyOwner {
    super._unpause();
  }
```
</details>

### isProtocolMember

```solidity
function isProtocolMember(address contractAddress) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isProtocolMember(address contractAddress) public view returns (bool) {
    return boolStorage[keccak256(abi.encodePacked(_NS_MEMBERS, contractAddress))];
  }
```
</details>

### _throwIfPaused

```solidity
function _throwIfPaused() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _throwIfPaused() internal view {
    require(!super.paused(), "Pausable: paused");
  }
```
</details>

### _throwIfSenderNotProtocol

```solidity
function _throwIfSenderNotProtocol() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _throwIfSenderNotProtocol() internal view {
    require(isProtocolMember(super._msgSender()), "Forbidden");
  }
```
</details>

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
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [PriceDiscovery](PriceDiscovery.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
