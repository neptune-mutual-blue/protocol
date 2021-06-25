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

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

**Events**

```js
event AssuranceAdded(bytes32  key, uint256  amount);
```

## Modifiers

- [onlyValidCover](#onlyvalidcover)

### onlyValidCover

```js
modifier onlyValidCover(bytes32 key) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key to check | 

## Functions

- [constructor(IStore store)](#)
- [addAssurance(bytes32 key, uint256 amount)](#addassurance)
- [getAssurance(bytes32 key)](#getassurance)
- [version()](#version)
- [getName()](#getname)

### 

```js
function (IStore store) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

### addAssurance

Adds assurance to the specified cover contract

```js
function addAssurance(bytes32 key, uint256 amount) external nonpayable onlyValidCover nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount you would like to supply | 

### getAssurance

Gets the assurance amount of the specified cover contract

```js
function getAssurance(bytes32 key) external view
returns(uint256)
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
