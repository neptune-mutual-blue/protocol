# Neptune Mutual Governance: Witness Contract (Witness.sol)

View Source: [contracts/core/governance/Witness.sol](../contracts/core/governance/Witness.sol)

**↗ Extends: [Recoverable](Recoverable.md), [IWitness](IWitness.md)**
**↘ Derived Contracts: [Reporter](Reporter.md)**

**Witness**

The witenss contract enables NPM tokenholders to
 participate in an already-reported cover incident.
 <br />
 The participants can choose to support an incident by `attesting`
 or they can also disagree by `refuting` the incident. In both cases,
 the tokenholders can choose to submit any amount of
 NEP stake during the (7 day, configurable) reporting period.
 After the reporting period, whichever side loses, loses all their tokens.
 While each `witness` and `reporter` on the winning side will proportionately
 receive a portion of these tokens as a reward, some forfeited tokens are
 burned too.

## Functions

- [attest(bytes32 key, uint256 incidentDate, uint256 stake)](#attest)
- [refute(bytes32 key, uint256 incidentDate, uint256 stake)](#refute)
- [getStatus(bytes32 key)](#getstatus)
- [getStakes(bytes32 key, uint256 incidentDate)](#getstakes)
- [getStakesOf(bytes32 key, uint256 incidentDate, address account)](#getstakesof)

### attest

Support the reported incident by staking your NPM token.
 Your tokens will be locked until a full resolution is achieved.
 Ensure that you not only fully understand the rules of the cover
 but also you also can verify with all necessary evidence that
 the condition was met.
 <br /><strong>Warning</strong>
 Although you may believe that the incident did actually occur, you may still be wrong.
 Even when you are right, the governance participants could outcast you.
 By using this function directly via a smart contract call,
 through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
 you are completely aware and fully understand the risk that you may lose all of
 your stake.

```js
function attest(bytes32 key, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the active cover | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| stake | uint256 | Enter the amount of NPM tokens you wish to stake.  Note that you cannot unstake this amount if the decision was not in your favor. | 

### refute

Reject the reported incident by staking your NPM token.
 Your tokens will be locked until a full resolution is achieved.
 Ensure that you not only fully understand the rules of the cover
 but also you also can verify with all necessary evidence that
 the condition was NOT met.
 <br /><strong>Warning</strong>
 Although you may believe that the incident did not occur, you may still be wrong.
 Even when you are right, the governance participants could outcast you.
 By using this function directly via a smart contract call,
 through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
 you are completely aware and fully understand the risk that you may lose all of
 your stake.

```js
function refute(bytes32 key, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the active cover | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| stake | uint256 | Enter the amount of NPM tokens you wish to stake.  Note that you cannot unstake this amount if the decision was not in your favor. | 

### getStatus

Gets the status of a given cover

```js
function getStatus(bytes32 key) external view
returns(uint256)
```

**Returns**

Returns the cover status as an integer.
 For more, check the enum `CoverStatus` on `CoverUtilV1` library.

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the cover you'd like to check the status of | 

### getStakes

Gets the stakes of each side of a given cover governance pool

```js
function getStakes(bytes32 key, uint256 incidentDate) external view
returns(uint256, uint256)
```

**Returns**

Returns an array of integers --> [yes, no]

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the cover you'd like to check the stakes of | 
| incidentDate | uint256 | Enter the active cover's date of incident | 

### getStakesOf

Gets the stakes of each side of a given cover governance pool for the specified account.

```js
function getStakesOf(bytes32 key, uint256 incidentDate, address account) external view
returns(uint256, uint256)
```

**Returns**

Returns an array of integers --> [yes, no]

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the cover you'd like to check the stakes of | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| account | address | Enter the account you'd like to get the stakes of | 

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
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [cTokenFactoryLibV1](cTokenFactoryLibV1.md)
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
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
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
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
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
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
