# NEP Cover Provision (CoverProvision.sol)

View Source: [contracts/core/lifecycle/CoverProvision.sol](../contracts/core/lifecycle/CoverProvision.sol)

**↗ Extends: [ICoverProvision](ICoverProvision.md), [Recoverable](Recoverable.md)**

**CoverProvision**

Through governance, NEP tokens can be allocated as provision or `Reward Pool Support`
 for any given cover. This not only fosters community participation but also incentivizes
 the liquidity providers or acts as a defense/support during cover incidents.
 Along with the NEP provisions, the liquidity providers also have `[Assurance Token Support](CoverAssurance.md)`
 for the rainy day.

## Functions

- [constructor(IStore store)](#)
- [increaseProvision(bytes32 key, uint256 amount)](#increaseprovision)
- [decreaseProvision(bytes32 key, uint256 amount)](#decreaseprovision)
- [getProvision(bytes32 key)](#getprovision)
- [version()](#version)
- [getName()](#getname)

### 

Constructs this contract

```solidity
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {
    this;
  }
```
</details>

### increaseProvision

Increases NEP provision for the given cover key.
 This feature is accessible only to the contract owner (governance).

```solidity
function increaseProvision(bytes32 key, uint256 amount) external nonpayable onlyOwner nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Provide the cover key you wish to increase the provision of | 
| amount | uint256 | Specify the amount of NEP tokens you would like to add | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function increaseProvision(bytes32 key, uint256 amount) external override onlyOwner nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key); // Ensures the key is valid cover

    uint256 privision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    s.addUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), amount);

    emit ProvisionIncreased(key, privision, privision + amount);
  }
```
</details>

### decreaseProvision

Decreases NEP provision for the given cover key
 This feature is accessible only to the contract owner (governance).

```solidity
function decreaseProvision(bytes32 key, uint256 amount) external nonpayable onlyOwner nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Provide the cover key you wish to decrease the provision from | 
| amount | uint256 | Specify the amount of NEP tokens you would like to decrease | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decreaseProvision(bytes32 key, uint256 amount) external override onlyOwner nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key); // Ensures the key is valid cover

    uint256 privision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    require(privision >= amount, "Exceeds Balance"); // Exceeds balance
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.nepToken().ensureTransfer(super.owner(), amount);

    emit ProvisionDecreased(key, privision, privision - amount);
  }
```
</details>

### getProvision

Gets the NEP provision amount for the given cover key

```solidity
function getProvision(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key to get the provision | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProvision(bytes32 key) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);
  }
```
</details>

### version

Version number of this contract

```solidity
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function version() external pure override returns (bytes32) {
    return "v0.1";
  }
```
</details>

### getName

Name of this contract

```solidity
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_COVER_PROVISION;
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
