# Neptune Mutual Governance: Witness Contract (Witness.sol)

View Source: [contracts/core/governance/Witness.sol](../contracts/core/governance/Witness.sol)

**↗ Extends: [Recoverable](Recoverable.md), [IWitness](IWitness.md)**
**↘ Derived Contracts: [Reporter](Reporter.md)**

**Witness**

The witeness contract enables NPM tokenholders to
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

```solidity
function attest(bytes32 key, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the active cover | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| stake | uint256 | Enter the amount of NPM tokens you wish to stake.  Note that you cannot unstake this amount if the decision was not in your favor. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function attest(
    bytes32 key,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    require(stake > 0, "Enter a stake");

    s.addAttestation(key, msg.sender, incidentDate, stake);

    s.npmToken().ensureTransferFrom(msg.sender, address(this), stake);

    emit Attested(key, msg.sender, incidentDate, stake);
  }
```
</details>

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

```solidity
function refute(bytes32 key, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the active cover | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| stake | uint256 | Enter the amount of NPM tokens you wish to stake.  Note that you cannot unstake this amount if the decision was not in your favor. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function refute(
    bytes32 key,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    require(stake > 0, "Enter a stake");

    s.addDispute(key, msg.sender, incidentDate, stake);

    s.npmToken().ensureTransferFrom(msg.sender, address(this), stake);

    emit Refuted(key, msg.sender, incidentDate, stake);
  }
```
</details>

### getStatus

Gets the status of a given cover

```solidity
function getStatus(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the cover you'd like to check the status of | 

**Returns**

Returns the cover status as an integer.
 For more, check the enum `CoverStatus` on `CoverUtilV1` library.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStatus(bytes32 key) external view override returns (uint256) {
    return s.getStatus(key);
  }
```
</details>

### getStakes

Gets the stakes of each side of a given cover governance pool

```solidity
function getStakes(bytes32 key, uint256 incidentDate) external view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the cover you'd like to check the stakes of | 
| incidentDate | uint256 | Enter the active cover's date of incident | 

**Returns**

Returns an array of integers --> [yes, no]

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakes(bytes32 key, uint256 incidentDate) external view override returns (uint256, uint256) {
    return s.getStakes(key, incidentDate);
  }
```
</details>

### getStakesOf

Gets the stakes of each side of a given cover governance pool for the specified account.

```solidity
function getStakesOf(bytes32 key, uint256 incidentDate, address account) external view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the cover you'd like to check the stakes of | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| account | address | Enter the account you'd like to get the stakes of | 

**Returns**

Returns an array of integers --> [yes, no]

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakesOf(
    bytes32 key,
    uint256 incidentDate,
    address account
  ) external view override returns (uint256, uint256) {
    return s.getStakesOf(account, key, incidentDate);
  }
```
</details>

## Contracts

* [AaveStrategy](AaveStrategy.md)
* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
* [CompoundStrategy](CompoundStrategy.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
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
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundERC20Delegator](FakeCompoundERC20Delegator.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Detailed](IERC20Detailed.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [ILendingStrategy](ILendingStrategy.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IRecoverable](IRecoverable.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PriceDiscovery](PriceDiscovery.md)
* [PriceLibV1](PriceLibV1.md)
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
* [RoutineInvokerLibV1](RoutineInvokerLibV1.md)
* [SafeERC20](SafeERC20.md)
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolCoreLibV1](StakingPoolCoreLibV1.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [StrategyLibV1](StrategyLibV1.md)
* [Strings](Strings.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [WithFlashLoan](WithFlashLoan.md)
* [Witness](Witness.md)
