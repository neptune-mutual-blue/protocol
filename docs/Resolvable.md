# Neptune Mutual Governance: Resolvable Contract (Resolvable.sol)

View Source: [contracts/core/governance/resolution/Resolvable.sol](../contracts/core/governance/resolution/Resolvable.sol)

**↗ Extends: [Finalization](Finalization.md), [IResolvable](IResolvable.md)**
**↘ Derived Contracts: [Unstakable](Unstakable.md)**

**Resolvable**

Enables governance agents to resolve a contract undergoing reporting.
 Provides a cool-down period of 24-hours during when governance admins
 can perform emergency resolution to defend against governance attacks.

## Functions

- [resolve(bytes32 key, uint256 incidentDate)](#resolve)
- [emergencyResolve(bytes32 key, uint256 incidentDate, bool decision)](#emergencyresolve)
- [_resolve(bytes32 key, uint256 incidentDate, bool decision, bool emergency)](#_resolve)
- [configureCoolDownPeriod(bytes32 key, uint256 period)](#configurecooldownperiod)
- [getCoolDownPeriod(bytes32 key)](#getcooldownperiod)
- [getResolutionDeadline(bytes32 key)](#getresolutiondeadline)

### resolve

```solidity
function resolve(bytes32 key, uint256 incidentDate) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function resolve(bytes32 key, uint256 incidentDate) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeAfterReportingPeriod(key);
    s.mustNotHaveResolutionDeadline(key);

    bool decision = s.getCoverStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened;

    _resolve(key, incidentDate, decision, false);
  }
```
</details>

### emergencyResolve

```solidity
function emergencyResolve(bytes32 key, uint256 incidentDate, bool decision) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| decision | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function emergencyResolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeAfterReportingPeriod(key);
    s.mustBeBeforeResolutionDeadline(key);

    _resolve(key, incidentDate, decision, true);
  }
```
</details>

### _resolve

```solidity
function _resolve(bytes32 key, uint256 incidentDate, bool decision, bool emergency) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| decision | bool |  | 
| emergency | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _resolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision,
    bool emergency
  ) private {
    // A grace period given to a governance admin(s) to defend
    // against a concensus attack(s).
    uint256 cooldownPeriod = s.getCoolDownPeriodInternal(key);

    // The timestamp until when a governance admin is allowed
    // to perform emergency resolution.
    // After this timestamp, the cover has to be claimable
    // or finalized
    uint256 deadline = s.getResolutionDeadlineInternal(key);

    // A cover, when being resolved, will either directly go to finalization or have a claim period.
    //
    // Decision: False Reporting
    // 1. A governance admin can still overwrite, override, or reverse this decision before `deadline`.
    // 2. After the deadline and before finalization, the NPM holders
    //    who staked for `False Reporting` camp can withdraw the original stake + reward.
    // 3. After finalization, the NPM holders who staked for this camp will only be able to receive
    // back the original stake. No rewards.
    //
    // Decision: Claimable
    //
    // 1. A governance admin can still overwrite, override, or reverse this decision before `deadline`.
    // 2. All policyholders must claim during the `Claim Period`. Otherwise, claims are not valid.
    // 3. After the deadline and before finalization, the NPM holders
    //    who staked for `Incident Happened` camp can withdraw the original stake + reward.
    // 4. After finalization, the NPM holders who staked for this camp will only be able to receive
    // back the original stake. No rewards.
    CoverUtilV1.CoverStatus status = decision ? CoverUtilV1.CoverStatus.Claimable : CoverUtilV1.CoverStatus.FalseReporting;

    // Status can change during `Emergency Resolution` attempt(s)
    s.setStatusInternal(key, incidentDate, status);

    if (deadline == 0) {
      // Deadline can't be before claim begin date.
      // In other words, once a cover becomes claimable, emergency resolution
      // can not be performed any longer
      deadline = block.timestamp + cooldownPeriod; // solhint-disable-line
      s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, key, deadline);
    }

    // Claim begins when deadline timestamp is passed
    uint256 claimBeginsFrom = decision ? deadline + 1 : 0;

    // Claim expires after the period specified by the cover creator.
    uint256 claimExpiresAt = decision ? claimBeginsFrom + s.getClaimPeriod(key) : 0;

    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, key, claimBeginsFrom);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, claimExpiresAt);

    s.updateStateAndLiquidity(key);

    emit Resolved(key, incidentDate, deadline, decision, emergency, claimBeginsFrom, claimExpiresAt);
  }
```
</details>

### configureCoolDownPeriod

```solidity
function configureCoolDownPeriod(bytes32 key, uint256 period) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| period | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function configureCoolDownPeriod(bytes32 key, uint256 period) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);

    require(period > 0, "Please specify period");

    if (key > 0) {
      s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, key, period);
    } else {
      s.setUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, period);
    }

    emit CooldownPeriodConfigured(key, period);
  }
```
</details>

### getCoolDownPeriod

```solidity
function getCoolDownPeriod(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoolDownPeriod(bytes32 key) external view override returns (uint256) {
    return s.getCoolDownPeriodInternal(key);
  }
```
</details>

### getResolutionDeadline

```solidity
function getResolutionDeadline(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionDeadline(bytes32 key) external view override returns (uint256) {
    return s.getResolutionDeadlineInternal(key);
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
* [CoverProvision](CoverProvision.md)
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
* [ILiquidityEngine](ILiquidityEngine.md)
* [IMember](IMember.md)
* [InvalidStrategy](InvalidStrategy.md)
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
* [IVaultDelegate](IVaultDelegate.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockFlashBorrower](MockFlashBorrower.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockRegistryClient](MockRegistryClient.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
* [NPM](NPM.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
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
