# Cover Contract (Cover.sol)

View Source: [contracts/core/lifecycle/Cover.sol](../contracts/core/lifecycle/Cover.sol)

**↗ Extends: [CoverBase](CoverBase.md)**

**Cover**

## Functions

- [constructor(IStore store, address liquidityToken, bytes32 liquidityName)](#)
- [updateCover(bytes32 key, bytes32 info)](#updatecover)
- [addCover(bytes32 key, bytes32 info, uint256 stakeWithFee, address assuranceToken, uint256 initialAssuranceAmount, uint256 initialLiquidity)](#addcover)
- [_addCover(bytes32 key, bytes32 info, uint256 fee, address assuranceToken)](#_addcover)
- [_validateAndGetFee(bytes32 key, bytes32 info, uint256 stakeWithFee)](#_validateandgetfee)

### 

```js
function (IStore store, address liquidityToken, bytes32 liquidityName) public nonpayable CoverBase 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 
| liquidityToken | address |  | 
| liquidityName | bytes32 |  | 

### updateCover

Updates the cover contract

```js
function updateCover(bytes32 key, bytes32 info) external nonpayable onlyValidCover onlyCoverOwner nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| info | bytes32 | Enter a new IPFS URL to update | 

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
| assuranceToken | address | **Optional.** Token added as an assurance of this cover. <br /><br /> Assurance tokens can be added by a project to demonstrate coverage support
 for their own project. This helps bring the cover fee down and enhances
 liquidity provider confidence. Along with the NEP tokens, the assurance tokens are rewarded
 as a support to the liquidity providers when a cover incident occurs. | 
| initialAssuranceAmount | uint256 | **Optional.** Enter the initial amount of<br /> assurance tokens you'd like to add to this pool. | 
| initialLiquidity | uint256 | **Optional.** Enter the initial stablecoin liquidity for this cover. | 

### _addCover

```js
function _addCover(bytes32 key, bytes32 info, uint256 fee, address assuranceToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| fee | uint256 | Fee paid to create this cover | 
| assuranceToken | address | **Optional.** Token added as an assurance of this cover. | 

### _validateAndGetFee

Validation checks before adding a new cover

```js
function _validateAndGetFee(bytes32 key, bytes32 info, uint256 stakeWithFee) private view
returns(uint256)
```

**Returns**

Returns fee required to create a new cover

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| info | bytes32 |  | 
| stakeWithFee | uint256 |  | 

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
