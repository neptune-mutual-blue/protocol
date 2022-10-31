# Unstakable Contract (Unstakable.sol)

View Source: [contracts/core/governance/resolution/Unstakable.sol](../contracts/core/governance/resolution/Unstakable.sol)

**↗ Extends: [Resolvable](Resolvable.md), [IUnstakable](IUnstakable.md)**
**↘ Derived Contracts: [Resolution](Resolution.md)**

**Unstakable**

Enables voters to unstake their NPM tokens after
 resolution is achieved on any cover product.

## Functions

- [unstake(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#unstake)
- [unstakeWithClaim(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#unstakewithclaim)
- [getUnstakeInfoFor(address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getunstakeinfofor)

### unstake

Reporters on the valid camp can unstake their tokens even after finalization.
 Unlike `unstakeWithClaim`, stakers can unstake but do not receive any reward if they choose to
 use this function.

```solidity
function unstake(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 | Enter the product key | 
| incidentDate | uint256 | Enter the incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function unstake(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    // Incident date is reset (when cover is finalized) and
    // therefore shouldn't be validated otherwise "valid" reporters
    // will never be able to unstake

    // s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.validateUnstakeWithoutClaim(coverKey, productKey, incidentDate);

    (, , uint256 myStakeInWinningCamp) = s.getResolutionInfoForInternal(msg.sender, coverKey, productKey, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetailsInternal(msg.sender, coverKey, productKey, incidentDate, myStakeInWinningCamp, 0, 0, 0);

    s.getNpmTokenInstanceInternal().ensureTransfer(msg.sender, myStakeInWinningCamp);
    s.updateStateAndLiquidityInternal(coverKey);

    emit Unstaken(coverKey, productKey, msg.sender, myStakeInWinningCamp, 0);
  }
```
</details>

### unstakeWithClaim

Reporters on the valid camp can unstake their token with a `claim` to receive
 back their original stake with a portion of the invalid camp's stake
 as an additional reward.
 During each `unstake with claim` processing, the protocol distributes reward to
 the final reporter and also burns some NPM tokens, as described in the documentation.

```solidity
function unstakeWithClaim(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 | Enter the product key | 
| incidentDate | uint256 | Enter the incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function unstakeWithClaim(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");
    s.validateUnstakeWithClaim(coverKey, productKey, incidentDate);

    address finalReporter = s.getReporterInternal(coverKey, productKey, incidentDate);
    address burner = s.getBurnAddressInternal();

    UnstakeInfoType memory info = s.getUnstakeInfoForInternal(msg.sender, coverKey, productKey, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetailsInternal(msg.sender, coverKey, productKey, incidentDate, info.myStakeInWinningCamp, info.myReward, info.toBurn, info.toReporter);

    uint256 myStakeWithReward = info.myReward + info.myStakeInWinningCamp;

    s.getNpmTokenInstanceInternal().ensureTransfer(msg.sender, myStakeWithReward);

    if (info.toReporter > 0) {
      s.getNpmTokenInstanceInternal().ensureTransfer(finalReporter, info.toReporter);
    }

    if (info.toBurn > 0) {
      s.getNpmTokenInstanceInternal().ensureTransfer(burner, info.toBurn);
    }

    s.updateStateAndLiquidityInternal(coverKey);

    emit Unstaken(coverKey, productKey, msg.sender, info.myStakeInWinningCamp, info.myReward);
    emit ReporterRewardDistributed(coverKey, productKey, msg.sender, finalReporter, info.myReward, info.toReporter);
    emit GovernanceBurned(coverKey, productKey, msg.sender, burner, info.myReward, info.toBurn);
  }
```
</details>

### getUnstakeInfoFor

Gets the unstake information for the supplied account
 Warning: this function does not validate the input arguments.

```solidity
function getUnstakeInfoFor(address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(struct IUnstakable.UnstakeInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Enter account to get the unstake information of | 
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 |  | 
| incidentDate | uint256 | Enter the incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUnstakeInfoFor(
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view override returns (UnstakeInfoType memory) {
    return s.getUnstakeInfoForInternal(account, coverKey, productKey, incidentDate);
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
