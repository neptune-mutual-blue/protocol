# Cover Assurance (CoverAssurance.sol)

View Source: [contracts/core/lifecycle/CoverAssurance.sol](../contracts/core/lifecycle/CoverAssurance.sol)

**↗ Extends: [ICoverAssurance](ICoverAssurance.md), [Recoverable](Recoverable.md)**

**CoverAssurance**

Assurance tokens can be added by a covered project to demonstrate coverage support
 for their project. This helps bring the cover fee down and enhances
 liquidity provider confidence. Along with the NEP tokens, the assurance tokens are rewarded
 as a support to the liquidity providers when a cover incident occurs.
 Without negatively affecting the price much,
 the protocol will gradually convert the assurance tokens
 to stablecoin liquidity.

## Functions

- [constructor(IStore store)](#)
- [addAssurance(bytes32 key, address account, uint256 amount)](#addassurance)
- [setWeight(bytes32 key, uint256 weight)](#setweight)
- [getAssurance(bytes32 key)](#getassurance)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {
    this;
  }
```
</details>

### addAssurance

Adds assurance to the specified cover contract

```solidity
function addAssurance(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address |  | 
| amount | uint256 | Enter the amount you would like to supply | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addAssurance(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCoverKey(key); // Ensures the key is valid cover

    require(amount > 0, "Provide valid amount");

    IERC20 assuranceToken = IERC20(s.getAddressByKeys(ProtoUtilV1.NS_COVER_ASSURANCE_TOKEN, key));
    address vault = s.getAssuranceVault();

    s.addUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE, key, amount);

    assuranceToken.ensureTransferFrom(account, vault, amount);

    emit AssuranceAdded(key, amount);
  }
```
</details>

### setWeight

```solidity
function setWeight(bytes32 key, uint256 weight) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| weight | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setWeight(bytes32 key, uint256 weight) external override nonReentrant {
    _mustBeOwnerOrProtoOwner();
    _mustBeUnpaused();
    s.mustBeValidCoverKey(key); // Ensures the key is valid cover

    s.setUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE_WEIGHT, key, weight);
  }
```
</details>

### getAssurance

Gets the assurance amount of the specified cover contract

```solidity
function getAssurance(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAssurance(bytes32 key) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE, key);
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
    return ProtoUtilV1.CNAME_COVER_ASSURANCE;
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
