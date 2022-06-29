# Reporter Contract (Reporter.sol)

View Source: [contracts/core/governance/Reporter.sol](../contracts/core/governance/Reporter.sol)

**↗ Extends: [IReporter](IReporter.md), [Witness](Witness.md)**
**↘ Derived Contracts: [Governance](Governance.md)**

**Reporter**

This contract enables any NPM tokenholder to
 report an incident or dispute a reported incident.
 The reporters can submit incidents and/or dispute them as well.
 When a cover pool is reporting, other tokenholders can also join
 the reporters to achieve a resolution.
 The reporter who first submits an incident is known as `First Reporter` whereas
 the reporter who disputes the reported incident is called `Candidate Reporter`.
 Valid reporter is the reporter getting resolution in their favor.

## Functions

- [report(bytes32 coverKey, bytes32 productKey, bytes32 info, uint256 stake)](#report)
- [dispute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, bytes32 info, uint256 stake)](#dispute)
- [setFirstReportingStake(bytes32 coverKey, uint256 value)](#setfirstreportingstake)
- [getFirstReportingStake(bytes32 coverKey)](#getfirstreportingstake)
- [setReportingBurnRate(uint256 value)](#setreportingburnrate)
- [setReporterCommission(uint256 value)](#setreportercommission)
- [getActiveIncidentDate(bytes32 coverKey, bytes32 productKey)](#getactiveincidentdate)
- [getReporter(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getreporter)
- [getResolutionTimestamp(bytes32 coverKey, bytes32 productKey)](#getresolutiontimestamp)
- [getAttestation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getattestation)
- [getRefutation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getrefutation)

### report

Stake a specified minimum NPM tokens to submit an incident.
 Check out the function `getFirstReportingStake(coverKey)` to
 check the minimum amount needed to report this cover.
 **Rewards:**
 If you get resolution in your favor, you will receive these rewards:
 - A 10% commission on all reward received by valid camp voters (check `Unstakeable.unstakeWithClaim`) in NPM tokens.
 - A 5% commission on the protocol earnings of all claim payouts in stablecoin.
 - Your proportional share of the 60% pool of the invalid camp.
 **Warning:**
 Please carefully check the coverage rules and exclusions in detail
 before you submit this report. You entire stake will be forfeited
 if resolution does not go in your favor. You will be able to unstake
 and receive back your NPM only if:
 By using this function directly via a smart contract call,
 through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
 you are completely aware, fully understand, and accept the risk that you may lose all of
 your stake.
 - incident resolution is in your favor
 - after reporting period ends

```solidity
function report(bytes32 coverKey, bytes32 productKey, bytes32 info, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key you are reporting | 
| productKey | bytes32 | Enter the product key you are reporting | 
| info | bytes32 | Enter IPFS hash of the incident in the following format:  `{     incidentTitle: 'Animated Brands Exploit, August 2024',     observed: 1723484937,     proofOfIncident: 'https://twitter.com/AnimatedBrand/status/5739383124571205635',     description: 'In a recent exploit, attackers were able to drain 50M USDC from Animated Brands lending vaults',   }` | 
| stake | uint256 | Enter the amount you would like to stake to submit this report | 

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

If you believe that a reported incident is wrong, you can stake a specified
 minimum NPM tokens to refute an active incident.
 Check out the function `getFirstReportingStake(coverKey)` to
 check the minimum amount needed to dispute this cover.
 **Rewards:**
 If you get resolution in your favor, you will receive these rewards:
 - A 10% commission on all reward received by valid camp voters (check `Unstakeable.unstakeWithClaim`) in NPM tokens.
 - Your proportional share of the 60% pool of the invalid camp.
 **Warning:**
 Please carefully check the coverage rules and exclusions in detail
 before you submit this report. You entire stake will be forfeited
 if resolution does not go in your favor. You will be able to unstake
 and receive back your NPM only if:
 By using this function directly via a smart contract call,
 through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
 you are completely aware, fully understand, and accept the risk that you may lose all of
 your stake.
 - incident resolution is in your favor
 - after reporting period ends

```solidity
function dispute(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, bytes32 info, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key you are reporting | 
| productKey | bytes32 | Enter the product key you are reporting | 
| incidentDate | uint256 |  | 
| info | bytes32 | Enter IPFS hash of the incident in the following format:  `{     incidentTitle: 'Wrong Incident Reporting',     observed: 1723484937,     proofOfIncident: 'https://twitter.com/AnimatedBrand/status/5739383124571205635',     description: 'Animated Brands emphasised in its most recent tweet that the report regarding their purported hack was false.',   }` | 
| stake | uint256 | Enter the amount you would like to stake to submit this dispute | 

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

Allows a cover manager set first reporting (minimum) stake of a given cover.

```solidity
function setFirstReportingStake(bytes32 coverKey, uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Provide a coverKey or leave it empty. If empty, the stake is set as  fallback value. Covers that do not have customized first reporting stake will infer to the fallback value. | 
| value | uint256 | Enter the first reporting stake in NPM units | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setFirstReportingStake(bytes32 coverKey, uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    require(value > 0, "Please specify value");

    uint256 previous = getFirstReportingStake(coverKey);

    if (coverKey > 0) {
      s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey, value);
    } else {
      s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, value);
    }

    emit FirstReportingStakeSet(coverKey, previous, value);
  }
```
</details>

### getFirstReportingStake

Returns the minimum amount of NPM tokens required to `report` or `dispute`
 a cover.

```solidity
function getFirstReportingStake(bytes32 coverKey) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Specify the cover you want to get the minimum stake required value of. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFirstReportingStake(bytes32 coverKey) public view override returns (uint256) {
    return s.getMinReportingStakeInternal(coverKey);
  }
```
</details>

### setReportingBurnRate

Allows a cover manager set burn rate of the NPM tokens of the invalid camp.
 The protocol forfeits all stakes of invalid camp voters. During `unstakeWithClaim`,
 NPM tokens get proportionately burned as configured here.
 The unclaimed and thus unburned NPM stakes will be manually pulled and burned on a periodic but not-so-frequent basis.

```solidity
function setReportingBurnRate(uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 | Enter the burn rate in percentage value (Check ProtoUtilV1.MULTIPLIER for division) | 

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

Allows a cover manager set reporter comission of the NPM tokens from the invalid camp.
 The protocol forfeits all stakes of invalid camp voters. During `unstakeWithClaim`,
 NPM tokens get proportionately transferred to the **valid reporter** as configured here.
 The unclaimed and thus unrewarded NPM stakes will be manually pulled and burned on a periodic but not-so-frequent basis.

```solidity
function setReporterCommission(uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 | Enter the valid reporter comission in percentage value (Check ProtoUtilV1.MULTIPLIER for division) | 

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

Gets the latest incident date of a given cover and product

```solidity
function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key you want to get the incident of | 
| productKey | bytes32 | Enter the product key you want to get the incident of | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getActiveIncidentDateInternal(coverKey, productKey);
  }
```
</details>

### getReporter

Gets the reporter of a cover by its incident date
 Please note that until resolution deadline is over, the returned
 reporter might keep changing.

```solidity
function getReporter(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key you would like to get the reporter of | 
| productKey | bytes32 | Enter the product key you would like to get the reporter of | 
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

Retuns the resolution date of a given cover

```solidity
function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key to get the resolution date of | 
| productKey | bytes32 | Enter the product key to get the resolution date of | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getResolutionTimestampInternal(coverKey, productKey);
  }
```
</details>

### getAttestation

Gets an account's attestation details. Please also check `getRefutation` since an account
 is not restricted to submit both `attestations` and `refutations`.

```solidity
function getAttestation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key you want to get attestation of | 
| productKey | bytes32 | Enter the product key you want to get attestation of | 
| who | address | Enter the account you want to get attestation of | 
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

### getRefutation

Gets an account's refutation details. Please also check `getAttestation` since an account
 is not restricted to submit both `attestations` and `refutations`.

```solidity
function getRefutation(bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key you want to get refutation of | 
| productKey | bytes32 | Enter the product key you want to get refutation of | 
| who | address | Enter the account you want to get refutation of | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getRefutation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view override returns (uint256 myStake, uint256 totalStake) {
    return s.getRefutationInternal(coverKey, productKey, who, incidentDate);
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
