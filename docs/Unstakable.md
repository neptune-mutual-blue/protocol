# Neptune Mutual Governance: Unstakable Contract (Unstakable.sol)

View Source: [contracts/core/governance/resolution/Unstakable.sol](../contracts/core/governance/resolution/Unstakable.sol)

**↗ Extends: [Resolvable](Resolvable.md), [IUnstakable](IUnstakable.md)**
**↘ Derived Contracts: [Resolution](Resolution.md)**

**Unstakable**

Enables tokenholders unstake their tokens after
 resolution is achieved on any cover product.

## Functions

- [unstake(bytes32 key, uint256 incidentDate)](#unstake)
- [unstakeWithClaim(bytes32 key, uint256 incidentDate)](#unstakewithclaim)
- [getUnstakeInfoFor(address account, bytes32 key, uint256 incidentDate)](#getunstakeinfofor)

### unstake

Reporters on the winning camp can unstake their tokens even after the claim period is over.
 Warning: during claim periods, you must use `unstakeWithClaim` instead of this to also receive reward.

```solidity
function unstake(bytes32 key, uint256 incidentDate) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| incidentDate | uint256 | Enter the incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function unstake(bytes32 key, uint256 incidentDate) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    // @suppress-pausable Already checked inside `validateUnstakeAfterClaimPeriod`
    s.validateUnstakeAfterClaimPeriod(key, incidentDate);

    (, , uint256 myStakeInWinningCamp) = s.getResolutionInfoFor(msg.sender, key, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetails(msg.sender, key, incidentDate, myStakeInWinningCamp, 0, 0, 0);

    s.npmToken().ensureTransfer(msg.sender, myStakeInWinningCamp);
    s.updateStateAndLiquidity(key);

    emit Unstaken(msg.sender, myStakeInWinningCamp, 0);
  }
```
</details>

### unstakeWithClaim

Reporters on the winning camp can unstake their token with a `claim` to receive
 back their original stake with a certain portion of the losing camp's stake
 as an additional reward.
 During each `unstake with claim` processing, the protocol distributes reward to
 the final reporter and also burns some NPM tokens, as described in the documentation.

```solidity
function unstakeWithClaim(bytes32 key, uint256 incidentDate) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| incidentDate | uint256 | Enter the incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function unstakeWithClaim(bytes32 key, uint256 incidentDate) external nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    // @suppress-pausable Already checked inside `validateUnstakeWithClaim`
    s.validateUnstakeWithClaim(key, incidentDate);

    address finalReporter = s.getReporter(key, incidentDate);
    address burner = s.getBurnAddress();

    (, , uint256 myStakeInWinningCamp, uint256 toBurn, uint256 toReporter, uint256 myReward) = s.getUnstakeInfoForInternal(msg.sender, key, incidentDate);

    // Set the unstake details
    s.updateUnstakeDetails(msg.sender, key, incidentDate, myStakeInWinningCamp, myReward, toBurn, toReporter);

    uint256 myStakeWithReward = myReward + myStakeInWinningCamp;

    s.npmToken().ensureTransfer(msg.sender, myStakeWithReward);
    s.npmToken().ensureTransfer(finalReporter, toReporter);
    s.npmToken().ensureTransfer(burner, toBurn);

    s.updateStateAndLiquidity(key);

    emit Unstaken(msg.sender, myStakeInWinningCamp, myReward);
    emit ReporterRewardDistributed(msg.sender, finalReporter, myReward, toReporter);
    emit GovernanceBurned(msg.sender, burner, myReward, toBurn);
  }
```
</details>

### getUnstakeInfoFor

s Gets the unstake information for the supplied account

```solidity
function getUnstakeInfoFor(address account, bytes32 key, uint256 incidentDate) external view
returns(totalStakeInWinningCamp uint256, totalStakeInLosingCamp uint256, myStakeInWinningCamp uint256, toBurn uint256, toReporter uint256, myReward uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Enter account to get the unstake information of | 
| key | bytes32 | Enter the cover key | 
| incidentDate | uint256 | Enter the incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUnstakeInfoFor(
    address account,
    bytes32 key,
    uint256 incidentDate
  )
    external
    view
    override
    returns (
      uint256 totalStakeInWinningCamp,
      uint256 totalStakeInLosingCamp,
      uint256 myStakeInWinningCamp,
      uint256 toBurn,
      uint256 toReporter,
      uint256 myReward
    )
  {
    return s.getUnstakeInfoForInternal(account, key, incidentDate);
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
