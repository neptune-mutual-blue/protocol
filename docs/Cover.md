# Cover Contract (Cover.sol)

View Source: [contracts/cover/Cover.sol](../contracts/cover/Cover.sol)

**↗ Extends: [ICover](ICover.md), [Recoverable](Recoverable.md)**

**Cover**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

**Events**

```js
event CoverCreated(bytes32  key, bytes32  info, uint256  stakeWithFee, uint256  liquidity);
event CoverUpdated(bytes32  key, bytes32  info);
```

## Modifiers

- [onlyCoverOwner](#onlycoverowner)
- [validateKey](#validatekey)

### onlyCoverOwner

```js
modifier onlyCoverOwner(bytes32 key) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

### validateKey

```js
modifier validateKey(bytes32 key) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

## Functions

- [constructor(IStore store, address liquidityToken, bytes32 liquidityName)](#)
- [addCover(bytes32 key, bytes32 info, uint256 stakeWithFee, address assuranceToken, uint256 initialAssuranceAmount, uint256 initialLiquidity)](#addcover)
- [updateCover(bytes32 key, bytes32 info)](#updatecover)
- [getCover(bytes32 key)](#getcover)
- [version()](#version)
- [getName()](#getname)
- [_burn(IERC20 token, uint256 amount)](#_burn)

### 

Constructs this smart contract

```js
function (IStore store, address liquidityToken, bytes32 liquidityName) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the address of an eternal storage contract to use.<br > This contract must be a member of the Protocol for write access to the storage | 
| liquidityToken | address | Provide the address of the token this cover will be quoted against. | 
| liquidityName | bytes32 | Enter a description or ENS name of your liquidity token. | 

### addCover

Adds a new coverage pool or cover contract.
 To add a new cover, you need to pay cover creation fee
 and stake minimum amount of NEP in the Vault. <br /> <br />
 Through the governance portal, projects will be able redeem
 the full cover fee at a later date.
 As the cover creator, you will earn a portion of all cover fees
 generated in this pool. <br /> <br />
 Read the documentation to learn more about the fees:
 https://docs.neptunemutual.com/covers/contract-creators

```js
function addCover(bytes32 key, bytes32 info, uint256 stakeWithFee, address assuranceToken, uint256 initialAssuranceAmount, uint256 initialLiquidity) external nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| stakeWithFee | uint256 | Enter the total NEP amount (stake + fee) to transfer to this contract. | 
| assuranceToken | address | **Optional.** Token added as an assurance of this cover. <br /><br > Assurance tokens can be added by a project to demonstrate coverage support<br > for their own project. This helps bring the cover fee (or premium) down and enhances<br > liquidity provider confidence. Along with NEP tokens, the assurance tokens are rewarded<br > as a support to the liquidity providers when a cover incident occurs. | 
| initialAssuranceAmount | uint256 | **Optional.** Enter the initial amount of<br > assurance tokens you'd like to add to this pool. | 
| initialLiquidity | uint256 | **Optional.** Enter the initial stablecoin liquidity for this cover. | 

### updateCover

Updates the cover contract

```js
function updateCover(bytes32 key, bytes32 info) external nonpayable validateKey onlyCoverOwner nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| info | bytes32 | Enter a new IPFS URL to update | 

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

### _burn

Burns the supplied tokens held by the contract

```js
function _burn(IERC20 token, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | IERC20 |  | 
| amount | uint256 |  | 

## Contracts

* [Address](Address.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverLiquidity](CoverLiquidity.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverLiquidity](ICoverLiquidity.md)
* [ICoverStake](ICoverStake.md)
* [IERC20](IERC20.md)
* [IMember](IMember.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
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
