# ICover.sol

View Source: [contracts/interfaces/ICover.sol](../contracts/interfaces/ICover.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [CoverBase](CoverBase.md)**

**ICover**

**Events**

```js
event CoverCreated(bytes32  key, bytes32  info, uint256  stakeWithFee, uint256  liquidity);
event CoverUpdated(bytes32  key, bytes32  info);
event WhitelistUpdated(address  account, bool  status);
```

## Functions

- [initialize(address liquidityToken, bytes32 liquidityName)](#initialize)
- [addCover(bytes32 key, bytes32 info, uint256 reportingPeriod, uint256 stakeWithFee, address reassuranceToken, uint256 initialReassuranceAmount, uint256 initialLiquidity)](#addcover)
- [updateCover(bytes32 key, bytes32 info)](#updatecover)
- [updateWhitelist(address account, bool whitelisted)](#updatewhitelist)
- [getCover(bytes32 key)](#getcover)
- [checkIfWhitelisted(address account)](#checkifwhitelisted)

### initialize

Initializes this contract

```solidity
function initialize(address liquidityToken, bytes32 liquidityName) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| liquidityToken | address | Provide the address of the token this cover will be quoted against. | 
| liquidityName | bytes32 | Enter a description or ENS name of your liquidity token. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initialize(address liquidityToken, bytes32 liquidityName) external;
```
</details>

### addCover

Adds a new coverage pool or cover contract.
 To add a new cover, you need to pay cover creation fee
 and stake minimum amount of NPM in the Vault. <br /> <br />
 Through the governance portal, projects will be able redeem
 the full cover fee at a later date. <br /> <br />
 **Apply for Fee Redemption** <br />
 https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
 As the cover creator, you will earn a portion of all cover fees
 generated in this pool. <br /> <br />
 Read the documentation to learn more about the fees: <br />
 https://docs.neptunemutual.com/covers/contract-creators

```solidity
function addCover(bytes32 key, bytes32 info, uint256 reportingPeriod, uint256 stakeWithFee, address reassuranceToken, uint256 initialReassuranceAmount, uint256 initialLiquidity) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| reportingPeriod | uint256 | The period during when reporting happens. | 
| stakeWithFee | uint256 | Enter the total NPM amount (stake + fee) to transfer to this contract. | 
| reassuranceToken | address | **Optional.** Token added as an reassurance of this cover. <br /><br />  Reassurance tokens can be added by a project to demonstrate coverage support  for their own project. This helps bring the cover fee down and enhances  liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded  as a support to the liquidity providers when a cover incident occurs. | 
| initialReassuranceAmount | uint256 | **Optional.** Enter the initial amount of  reassurance tokens you'd like to add to this pool. | 
| initialLiquidity | uint256 | **Optional.** Enter the initial stablecoin liquidity for this cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCover(
    bytes32 key,
    bytes32 info,
    uint256 reportingPeriod,
    uint256 stakeWithFee,
    address reassuranceToken,
    uint256 initialReassuranceAmount,
    uint256 initialLiquidity
  ) external;
```
</details>

### updateCover

Updates the cover contract.
 This feature is accessible only to the cover owner or protocol owner (governance).

```solidity
function updateCover(bytes32 key, bytes32 info) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| info | bytes32 | Enter a new IPFS URL to update | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCover(bytes32 key, bytes32 info) external;
```
</details>

### updateWhitelist

```solidity
function updateWhitelist(address account, bool whitelisted) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 
| whitelisted | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateWhitelist(address account, bool whitelisted) external;
```
</details>

### getCover

Get info of a cover contract by key

```solidity
function getCover(bytes32 key) external view
returns(coverOwner address, info bytes32, values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCover(bytes32 key)
    external
    view
    returns (
      address coverOwner,
      bytes32 info,
      uint256[] memory values
    );
```
</details>

### checkIfWhitelisted

```solidity
function checkIfWhitelisted(address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function checkIfWhitelisted(address account) external view returns (bool);
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
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
* [Processor](Processor.md)
* [ProtoBase](ProtoBase.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [Resolution](Resolution.md)
* [Resolvable](Resolvable.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
