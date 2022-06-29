# Witness Contract (Witness.sol)

View Source: [contracts/core/governance/Witness.sol](../contracts/core/governance/Witness.sol)

**↗ Extends: [Recoverable](Recoverable.md), [IWitness](IWitness.md)**
**↘ Derived Contracts: [Reporter](Reporter.md)**

**Witness**

The witeness contract enables NPM tokenholders to
 participate in an active cover incident.
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

- [attest(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 stake)](#attest)
- [refute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 stake)](#refute)
- [getStatus(bytes32 coverKey, bytes32 productKey)](#getstatus)
- [getStakes(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getstakes)
- [getStakesOf(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account)](#getstakesof)

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
 you are completely aware, fully understand, and accept the risk that you may lose all of
 your stake.

```solidity
function attest(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the key of the active cover | 
| productKey | bytes32 |  | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| stake | uint256 | Enter the amount of NPM tokens you wish to stake.  Note that you cannot unstake this amount if the decision was not in your favor. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function attest(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeReportingOrDisputed(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey, productKey);

    require(stake > 0, "Enter a stake");

    s.addAttestationInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Attested(coverKey, productKey, msg.sender, incidentDate, stake);
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
 you are completely aware, fully understand, and accept the risk that you may lose all of
 your stake.

```solidity
function refute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the key of the active cover | 
| productKey | bytes32 |  | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| stake | uint256 | Enter the amount of NPM tokens you wish to stake.  Note that you cannot unstake this amount if the decision was not in your favor. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function refute(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustHaveDispute(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey, productKey);

    require(stake > 0, "Enter a stake");

    s.addDisputeInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Refuted(coverKey, productKey, msg.sender, incidentDate, stake);
  }
```
</details>

### getStatus

Gets the status of a given cover

```solidity
function getStatus(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the key of the cover you'd like to check the status of | 
| productKey | bytes32 |  | 

**Returns**

Returns the cover status as an integer.
 For more, check the enum `CoverStatus` on `CoverUtilV1` library.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStatus(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getStatusInternal(coverKey, productKey);
  }
```
</details>

### getStakes

Gets the stakes of each side of a given cover governance pool

```solidity
function getStakes(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the key of the cover you'd like to check the stakes of | 
| productKey | bytes32 |  | 
| incidentDate | uint256 | Enter the active cover's date of incident | 

**Returns**

Returns an array of integers --> [yes, no]

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakes(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view override returns (uint256, uint256) {
    return s.getStakesInternal(coverKey, productKey, incidentDate);
  }
```
</details>

### getStakesOf

Gets the stakes of each side of a given cover governance pool for the specified account.

```solidity
function getStakesOf(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account) external view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the key of the cover you'd like to check the stakes of | 
| productKey | bytes32 |  | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| account | address | Enter the account you'd like to get the stakes of | 

**Returns**

Returns an array of integers --> [yes, no]

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakesOf(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) external view override returns (uint256, uint256) {
    return s.getStakesOfInternal(account, coverKey, productKey, incidentDate);
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
* [console](console.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Delayable](Delayable.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundDaiDelegator](FakeCompoundDaiDelegator.md)
* [FakePriceOracle](FakePriceOracle.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [FaultyAaveLendingPool](FaultyAaveLendingPool.md)
* [FaultyCompoundDaiDelegator](FaultyCompoundDaiDelegator.md)
* [Finalization](Finalization.md)
* [ForceEther](ForceEther.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
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
* [ILiquidityEngine](ILiquidityEngine.md)
* [IMember](IMember.md)
* [InvalidStrategy](InvalidStrategy.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceOracle](IPriceOracle.md)
* [IProtocol](IProtocol.md)
* [IRecoverable](IRecoverable.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IStoreLike](IStoreLike.md)
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultDelegate](IVaultDelegate.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [MockAccessControlUser](MockAccessControlUser.md)
* [MockCoverUtilUser](MockCoverUtilUser.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockFlashBorrower](MockFlashBorrower.md)
* [MockLiquidityEngineUser](MockLiquidityEngineUser.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockRegistryClient](MockRegistryClient.md)
* [MockStore](MockStore.md)
* [MockStoreKeyUtilUser](MockStoreKeyUtilUser.md)
* [MockValidationLibUser](MockValidationLibUser.md)
* [MockVault](MockVault.md)
* [MockVaultLibUser](MockVaultLibUser.md)
* [NPM](NPM.md)
* [NpmDistributor](NpmDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
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
* [TimelockController](TimelockController.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultDelegate](VaultDelegate.md)
* [VaultDelegateBase](VaultDelegateBase.md)
* [VaultDelegateWithFlashLoan](VaultDelegateWithFlashLoan.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [VaultLiquidity](VaultLiquidity.md)
* [VaultStrategy](VaultStrategy.md)
* [WithFlashLoan](WithFlashLoan.md)
* [WithPausability](WithPausability.md)
* [WithRecovery](WithRecovery.md)
* [Witness](Witness.md)
