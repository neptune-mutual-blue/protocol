# Neptune Mutual Governance: Reporter Contract (Reporter.sol)

View Source: [contracts/core/governance/Reporter.sol](../contracts/core/governance/Reporter.sol)

**↗ Extends: [IReporter](IReporter.md), [Witness](Witness.md)**
**↘ Derived Contracts: [Governance](Governance.md)**

**Reporter**

This contract enables any NPM tokenholder to
 report an incident or dispute a reported incident.
 <br />
 The reporters can submit incidents and/or dispute them as well.
 When a cover pool is reporting, other tokenholders can also join
 the reporters achieve a resolution.
 The reporter who first submits an incident is known as `First Reporter` whereas
 the reporter who disputes the reported incident is called `Candidate Reporter`.

## Functions

- [report(bytes32 coverKey, bytes32 productKey, bytes32 info, uint256 stake)](#report)
- [dispute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, bytes32 info, uint256 stake)](#dispute)
- [setFirstReportingStake(uint256 value)](#setfirstreportingstake)
- [getFirstReportingStake()](#getfirstreportingstake)
- [getFirstReportingStake(bytes32 coverKey)](#getfirstreportingstake)
- [setReportingBurnRate(uint256 value)](#setreportingburnrate)
- [setReporterCommission(uint256 value)](#setreportercommission)
- [getActiveIncidentDate(bytes32 coverKey, bytes32 productKey)](#getactiveincidentdate)
- [getReporter(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getreporter)
- [getResolutionTimestamp(bytes32 coverKey, bytes32 productKey)](#getresolutiontimestamp)
- [getAttestation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getattestation)
- [getDispute(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getdispute)

### report

```solidity
function report(bytes32 coverKey, bytes32 productKey, bytes32 info, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| info | bytes32 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function report(
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    productKey > 0 ? s.mustHaveNormalCoverProductStatus(coverKey, productKey) : s.mustHaveNormalCoverStatus(coverKey);

    uint256 incidentDate = block.timestamp; // solhint-disable-line
    require(stake > 0, "Stake insufficient");
    require(stake >= s.getMinReportingStakeInternal(coverKey), "Stake insufficient");

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, productKey, incidentDate);

    // Set the Resolution Timestamp
    uint256 resolutionDate = block.timestamp + s.getReportingPeriodInternal(coverKey); // solhint-disable-line
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey, productKey, resolutionDate);

    // Update the values
    s.addAttestationInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    // Transfer the stake to the resolution contract
    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Reported(coverKey, productKey, msg.sender, incidentDate, info, stake, resolutionDate);
    emit Attested(coverKey, productKey, msg.sender, incidentDate, stake);
  }
```
</details>

### dispute

```solidity
function dispute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, bytes32 info, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 
| info | bytes32 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispute(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustNotHaveDispute(coverKey, productKey);
    s.mustBeReporting(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey, productKey);

    require(stake > 0, "Stake insufficient");
    require(stake >= s.getMinReportingStakeInternal(coverKey), "Stake insufficient");

    s.addDisputeInternal(coverKey, productKey, msg.sender, incidentDate, stake);

    // Transfer the stake to the resolution contract
    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Disputed(coverKey, productKey, msg.sender, incidentDate, info, stake);
    emit Refuted(coverKey, productKey, msg.sender, incidentDate, stake);
  }
```
</details>

### setFirstReportingStake

```solidity
function setFirstReportingStake(uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setFirstReportingStake(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    require(value > 0, "Please specify value");

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, value);

    emit FirstReportingStakeSet(previous, value);
  }
```
</details>

### getFirstReportingStake

```solidity
function getFirstReportingStake() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFirstReportingStake() external view override returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE);
  }
```
</details>

### getFirstReportingStake

```solidity
function getFirstReportingStake(bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFirstReportingStake(bytes32 coverKey) external view override returns (uint256) {
    return s.getMinReportingStakeInternal(coverKey);
  }
```
</details>

### setReportingBurnRate

```solidity
function setReportingBurnRate(uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReportingBurnRate(uint256 value) external override nonReentrant {
    require(value > 0, "Please specify value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE, value);

    emit ReportingBurnRateSet(previous, value);
  }
```
</details>

### setReporterCommission

```solidity
function setReporterCommission(uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReporterCommission(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    require(value > 0, "Please specify value");

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION, value);

    emit ReporterCommissionSet(previous, value);
  }
```
</details>

### getActiveIncidentDate

```solidity
function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getActiveIncidentDateInternal(coverKey, productKey);
  }
```
</details>

### getReporter

```solidity
function getReporter(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReporter(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view override returns (address) {
    return s.getReporterInternal(coverKey, productKey, incidentDate);
  }
```
</details>

### getResolutionTimestamp

```solidity
function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getResolutionTimestampInternal(coverKey, productKey);
  }
```
</details>

### getAttestation

```solidity
function getAttestation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAttestation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view override returns (uint256 myStake, uint256 totalStake) {
    return s.getAttestationInternal(coverKey, productKey, who, incidentDate);
  }
```
</details>

### getDispute

```solidity
function getDispute(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDispute(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view override returns (uint256 myStake, uint256 totalStake) {
    return s.getDisputeInternal(coverKey, productKey, who, incidentDate);
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
