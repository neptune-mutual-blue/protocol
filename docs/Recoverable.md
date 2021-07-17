# Recoverable.sol

View Source: [contracts/core/Recoverable.sol](../contracts/core/Recoverable.sol)

**↗ Extends: [Ownable](Ownable.md), [ReentrancyGuard](ReentrancyGuard.md), [Pausable](Pausable.md)**
**↘ Derived Contracts: [Commission](Commission.md), [Controller](Controller.md), [CoverAssurance](CoverAssurance.md), [CoverBase](CoverBase.md), [CoverProvision](CoverProvision.md), [CoverStake](CoverStake.md), [cToken](cToken.md), [Policy](Policy.md), [PolicyAdmin](PolicyAdmin.md), [PolicyManager](PolicyManager.md), [PriceDiscovery](PriceDiscovery.md), [Protocol](Protocol.md), [VaultPod](VaultPod.md), [Witness](Witness.md)**

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

```solidity
function (IStore store) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) {
    require(address(store) != address(0), "Invalid Store");

    s = store;
  }
```
</details>

### recoverEther

Recover all Ether held by the contract.

```solidity
function recoverEther(address sendTo) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| sendTo | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function recoverEther(address sendTo) external {
    _mustBeOwnerOrProtoOwner();

    // slither-disable-next-line arbitrary-send
    payable(sendTo).transfer(address(this).balance);
  }
```
</details>

### recoverToken

Recover all BEP-20 compatible tokens sent to this address.

```solidity
function recoverToken(address token, address sendTo) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address | BEP-20 The address of the token contract | 
| sendTo | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function recoverToken(address token, address sendTo) external {
    _mustBeOwnerOrProtoOwner();

    IERC20 bep20 = IERC20(token);

    uint256 balance = bep20.balanceOf(address(this));
    require(bep20.transfer(sendTo, balance), "Transfer failed");
  }
```
</details>

### pause

```solidity
function pause() external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function pause() external {
    _mustBeUnpaused();
    _mustBeOwnerOrProtoOwner();

    super._pause();
  }
```
</details>

### unpause

```solidity
function unpause() external nonpayable whenPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function unpause() external whenPaused {
    _mustBeOwnerOrProtoOwner();

    super._unpause();
  }
```
</details>

### _mustBeOwnerOrProtoMember

Reverts if the sender is not the contract owner or a protocol member.

```solidity
function _mustBeOwnerOrProtoMember() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _mustBeOwnerOrProtoMember() internal view {
    bool isProtocol = s.isProtocolMember(super._msgSender());

    if (isProtocol == false) {
      require(super._msgSender() == super.owner(), "Forbidden");
    }
  }
```
</details>

### _mustBeOwnerOrProtoOwner

Reverts if the sender is not the contract owner or protocol owner.

```solidity
function _mustBeOwnerOrProtoOwner() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _mustBeOwnerOrProtoOwner() internal view {
    IProtocol protocol = ProtoUtilV1.getProtocol(s);

    if (address(protocol) == address(0)) {
      require(super._msgSender() == owner(), "Forbidden");
      return;
    }

    address protocolOwner = Ownable(address(protocol)).owner();
    require(super._msgSender() == owner() || super._msgSender() == protocolOwner, "Forbidden");
  }
```
</details>

### _mustBeUnpaused

```solidity
function _mustBeUnpaused() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _mustBeUnpaused() internal view {
    require(super.paused() == false, "Contract paused");
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
