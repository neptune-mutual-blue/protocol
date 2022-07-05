# Cover Reassurance (CoverReassurance.sol)

View Source: [contracts/core/lifecycle/CoverReassurance.sol](../contracts/core/lifecycle/CoverReassurance.sol)

**↗ Extends: [ICoverReassurance](ICoverReassurance.md), [Recoverable](Recoverable.md)**

**CoverReassurance**

A covered project can add reassurance fund to exhibit coverage support for their project.
 This reduces the cover fee and increases the confidence of liquidity providers.
 A portion of the reassurance fund is awarded to liquidity providers in the event of a cover incident.
 <br />
 - [https://docs.neptunemutual.com/sdk/cover-assurance](https://docs.neptunemutual.com/sdk/cover-assurance)
 - [https://docs.neptunemutual.com/definitions/cover-products](https://docs.neptunemutual.com/definitions/cover-products)

## Functions

- [constructor(IStore store)](#)
- [addReassurance(bytes32 coverKey, address account, uint256 amount)](#addreassurance)
- [setWeight(bytes32 coverKey, uint256 weight)](#setweight)
- [capitalizePool(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#capitalizepool)
- [getReassurance(bytes32 coverKey)](#getreassurance)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {}
```
</details>

### addReassurance

Adds reassurance to the specified cover contract

```solidity
function addReassurance(bytes32 coverKey, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account from which the reassurance fund will be transferred. | 
| amount | uint256 | Enter the amount you would like to supply | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addReassurance(
    bytes32 coverKey,
    address account,
    uint256 amount
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCoverKey(coverKey);
    s.mustBeCoverOwnerOrCoverContract(coverKey, msg.sender);

    require(amount > 0, "Provide valid amount");

    IERC20 stablecoin = IERC20(s.getStablecoin());

    s.addUintByKey(CoverUtilV1.getReassuranceKey(coverKey), amount);

    stablecoin.ensureTransferFrom(account, address(this), amount);

    // Do not update state during cover creation
    // s.updateStateAndLiquidity(coverKey);

    emit ReassuranceAdded(coverKey, amount);
  }
```
</details>

### setWeight

Sets the reassurance weight as a percentage value.

```solidity
function setWeight(bytes32 coverKey, uint256 weight) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key for which you want to set the weight. You can  provide `0x` as cover key if you want to set reassurance weight globally. | 
| weight | uint256 | Enter the weight value as percentage (see ProtoUtilV1.MULTIPLIER).  You can't exceed 100%. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setWeight(bytes32 coverKey, uint256 weight) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);
    s.mustBeValidCoverKey(coverKey);

    require(weight > 0 && weight <= ProtoUtilV1.MULTIPLIER, "Please specify weight");

    s.setUintByKey(CoverUtilV1.getReassuranceWeightKey(coverKey), weight);

    s.updateStateAndLiquidity(coverKey);

    emit WeightSet(coverKey, weight);
  }
```
</details>

### capitalizePool

Capitalizes the cover liquidity pool (or Vault) with whichever
 is less between 25% of the suffered loss or 25% of the reassurance pool balance.
 <br /> <br />
 This function can only be invoked if the specified cover was "claimable"
 and after "claim period" is over.

```solidity
function capitalizePool(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key that has suffered capital depletion or loss. | 
| productKey | bytes32 | Enter the product key that has suffered capital depletion or loss. | 
| incidentDate | uint256 | Enter the date of the incident report. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function capitalizePool(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeAfterResolutionDeadline(coverKey, productKey);
    s.mustBeClaimable(coverKey, productKey);
    s.mustBeAfterClaimExpiry(coverKey, productKey);

    IVault vault = s.getVault(coverKey);
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 toTransfer = s.getReassuranceTransferrableInternal(coverKey, productKey, incidentDate);

    require(toTransfer > 0, "Nothing to capitalize");

    stablecoin.ensureTransfer(address(vault), toTransfer);
    s.subtractUintByKey(CoverUtilV1.getReassuranceKey(coverKey), toTransfer);
    s.addReassurancePayoutInternal(coverKey, productKey, incidentDate, toTransfer);

    emit PoolCapitalized(coverKey, productKey, incidentDate, toTransfer);
  }
```
</details>

### getReassurance

Gets the reassurance amount of the specified cover contract
 Warning: this function does not validate the cover key supplied.

```solidity
function getReassurance(bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassurance(bytes32 coverKey) external view override returns (uint256) {
    return s.getReassuranceAmountInternal(coverKey);
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
function version() external pure override returns (bytes32) {
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
function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_COVER_REASSURANCE;
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
