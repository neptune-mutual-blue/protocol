# Claims Processor Contract (Processor.sol)

View Source: [contracts/core/claims/Processor.sol](../contracts/core/claims/Processor.sol)

**↗ Extends: [IClaimsProcessor](IClaimsProcessor.md), [Recoverable](Recoverable.md)**

**Processor**

The claims processor contract allows policyholders to file a claim and get instant payouts during the claim period.
 <br /> <br />
 There is a lag period before a policy begins coverage.
 After the next day's UTC EOD timestamp, policies take effect and are valid until the expiration period.
 Check [ProtoUtilV1.NS_COVERAGE_LAG](ProtoUtilV1.md) and [PolicyAdmin.getCoverageLag](PolicyAdmin.md#getcoveragelag)
 for more information on the lag configuration.
 <br /> <br />
 If a claim isn't made during the claim period, it isn't valid and there is no payout.

## Functions

- [constructor(IStore store)](#)
- [claim(address cxToken, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 amount)](#claim)
- [validate(address cxToken, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 amount)](#validate)
- [getClaimExpiryDate(bytes32 coverKey, bytes32 productKey)](#getclaimexpirydate)
- [setClaimPeriod(bytes32 coverKey, uint256 value)](#setclaimperiod)
- [setBlacklist(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address[] accounts, bool[] statuses)](#setblacklist)
- [isBlacklisted(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account)](#isblacklisted)
- [version()](#version)
- [getName()](#getname)

### 

Constructs this contract

```solidity
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide an implementation of IStore | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {}
```
</details>

### claim

Enables a policyholder to receive a payout redeeming cxTokens.
 Only when the active cover is marked as "Incident Happened" and
 has "Claimable" status is the payout made.

```solidity
function claim(address cxToken, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cxToken | address | Provide the address of the claim token that you're using for this claim. | 
| coverKey | bytes32 | Enter the key of the cover you're claiming | 
| productKey | bytes32 | Enter the key of the product you're claiming | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| amount | uint256 | Enter the amount of cxTokens you want to transfer | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claim(
    address cxToken,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 amount
  ) external override nonReentrant {
    validate(cxToken, coverKey, productKey, incidentDate, amount);

    IERC20(cxToken).ensureTransferFrom(msg.sender, address(this), amount);
    ICxToken(cxToken).burn(amount);

    IVault vault = s.getVault(coverKey);
    address finalReporter = s.getReporterInternal(coverKey, productKey, incidentDate);

    uint256 stablecoinPrecision = s.getStablecoinPrecision();
    uint256 payout = (amount * stablecoinPrecision) / ProtoUtilV1.CXTOKEN_PRECISION;

    require(payout > 0, "Invalid payout");

    s.addClaimPayoutsInternal(coverKey, productKey, incidentDate, payout);

    // @suppress-zero-value-check Checked side effects. If the claim platform fee is zero
    // or a very small number, platform fee becomes zero due to data loss.
    uint256 platformFee = (payout * s.getPlatformCoverFeeRateInternal()) / ProtoUtilV1.MULTIPLIER;

    // @suppress-zero-value-check Checked side effects. If the claim reporter commission rate is zero
    // or a very small number, reporterFee fee becomes zero due to data loss.
    uint256 reporterFee = (platformFee * s.getClaimReporterCommissionInternal()) / ProtoUtilV1.MULTIPLIER;

    require(payout >= platformFee, "Invalid platform fee");

    uint256 claimed = payout - platformFee;

    // @suppress-zero-value-check If the platform fee rate was 100%,
    // "claimed" can be zero
    if (claimed > 0) {
      vault.transferGovernance(coverKey, msg.sender, claimed);
    }

    if (reporterFee > 0) {
      vault.transferGovernance(coverKey, finalReporter, reporterFee);
    }

    if (platformFee - reporterFee > 0) {
      // @suppress-subtraction The following (or above) subtraction can cause
      // an underflow if `getClaimReporterCommissionInternal` is greater than 100%.
      vault.transferGovernance(coverKey, s.getTreasury(), platformFee - reporterFee);
    }

    s.updateStateAndLiquidity(coverKey);

    emit Claimed(cxToken, coverKey, productKey, incidentDate, msg.sender, finalReporter, amount, reporterFee, platformFee, claimed);
  }
```
</details>

### validate

Validates a given claim

```solidity
function validate(address cxToken, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 amount) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cxToken | address | Provide the address of the claim token that you're using for this claim. | 
| coverKey | bytes32 | Enter the key of the cover you're validating the claim for | 
| productKey | bytes32 | Enter the key of the product you're validating the claim for | 
| incidentDate | uint256 | Enter the active cover's date of incident | 
| amount | uint256 |  | 

**Returns**

If the given claim is valid and can result in a successful payout, returns true.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function validate(
    address cxToken,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 amount
  ) public view override returns (bool) {
    s.mustNotBePaused();
    s.mustBeValidClaim(msg.sender, coverKey, productKey, cxToken, incidentDate, amount);
    require(isBlacklisted(coverKey, productKey, incidentDate, msg.sender) == false, "Access denied");
    require(amount > 0, "Enter an amount");

    require(s.getClaimReporterCommissionInternal() <= ProtoUtilV1.MULTIPLIER, "Invalid claim reporter fee");
    require(s.getPlatformCoverFeeRateInternal() <= ProtoUtilV1.MULTIPLIER, "Invalid platform fee rate");

    return true;
  }
```
</details>

### getClaimExpiryDate

Returns claim expiration date.
 Even if the policy was still valid, it cannot be claimed after the claims expiry date.
 Warning: this function does not validate the cover key supplied.

```solidity
function getClaimExpiryDate(bytes32 coverKey, bytes32 productKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the key of the cover you're checking | 
| productKey | bytes32 | Enter the key of the product you're checking | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimExpiryDate(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey);
  }
```
</details>

### setClaimPeriod

Sets the cover's claim period using its key.
 If no cover key is specified, the value specified here will be used as a fallback.
 Covers without a specified claim period default to the fallback value.

```solidity
function setClaimPeriod(bytes32 coverKey, uint256 value) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the coverKey you want to set the claim period for | 
| value | uint256 | Enter a claim period you want to set | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
ction setClaimPeriod(bytes32 coverKey, uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    require(value > 0, "Please specify value");

    uint256 previous;

    if (coverKey > 0) {
      previous = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey);
      s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey, value);
      emit ClaimPeriodSet(coverKey, previous, value);
      return;
    }

    previous = s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD, value);

    emit ClaimPeriodSet(coverKey, previous, value);
  }

```
</details>

### setBlacklist

Accounts that are on a blacklist can't claim their cxTokens.
 Cover managers can stop an account from claiming their cover by putting it on the blacklist.
 Usually, this happens when we suspect a policyholder is the attacker.
 <br /> <br />
 After performing KYC, we might be able to lift the blacklist.

```solidity
function setBlacklist(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address[] accounts, bool[] statuses) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 | Enter the product key | 
| incidentDate | uint256 | Enter the incident date of the cover | 
| accounts | address[] | Enter list of accounts you want to blacklist | 
| statuses | bool[] | Enter true if you want to blacklist. False if you want to remove from the blacklist. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
ction setBlacklist(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external override nonReentrant {
    // @suppress-zero-value-check Checked
    require(accounts.length > 0, "Invalid accounts");
    require(accounts.length == statuses.length, "Invalid args");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);

    for (uint256 i = 0; i < accounts.length; i++) {
      s.setAddressBooleanByKey(CoverUtilV1.getBlacklistKey(coverKey, productKey, incidentDate), accounts[i], statuses[i]);
      emit BlacklistSet(coverKey, productKey, incidentDate, accounts[i], statuses[i]);
    }
  }

```
</details>

### isBlacklisted

Check to see if an account is blacklisted/banned from making a claim.

```solidity
function isBlacklisted(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 |  | 
| incidentDate | uint256 | Enter the incident date of this cover | 
| account | address | Enter the account to see if it is blacklisted | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
ction isBlacklisted(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) public view override returns (bool) {
    return s.getAddressBooleanByKey(CoverUtilV1.getBlacklistKey(coverKey, productKey, incidentDate), account);
  }

```
</details>

### version

Version number of this contract

```solidity
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
ction version() external pure override returns (bytes32) {
    return "v0.1";
  }

```
</details>

### getName

Name of this contract

```solidity
function getName() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
ction getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_CLAIMS_PROCESSOR;
  }
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
* [INeptuneRouterV1](INeptuneRouterV1.md)
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
* [NeptuneRouterV1](NeptuneRouterV1.md)
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
* [POT](POT.md)
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
