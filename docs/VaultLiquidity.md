# VaultLiquidity.sol

View Source: [contracts/core/liquidity/VaultLiquidity.sol](../contracts/core/liquidity/VaultLiquidity.sol)

**↗ Extends: [VaultBase](VaultBase.md)**
**↘ Derived Contracts: [VaultStrategy](VaultStrategy.md)**

**VaultLiquidity**

## Functions

- [transferGovernance(bytes32 coverKey, address to, uint256 amount)](#transfergovernance)
- [addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStakeToAdd, bytes32 referralCode)](#addliquidity)
- [removeLiquidity(bytes32 coverKey, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit)](#removeliquidity)
- [calculatePods(uint256 forStablecoinUnits)](#calculatepods)
- [calculateLiquidity(uint256 podsToBurn)](#calculateliquidity)
- [getStablecoinBalanceOf()](#getstablecoinbalanceof)
- [accrueInterest()](#accrueinterest)

### transferGovernance

```solidity
function transferGovernance(bytes32 coverKey, address to, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| to | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    require(coverKey == key, "Forbidden");
    require(amount > 0, "Please specify amount");

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    address stablecoin = delgate().preTransferGovernance(msg.sender, coverKey, to, amount);

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    IERC20(stablecoin).ensureTransfer(to, amount);

    /******************************************************************************************
      POST
     ******************************************************************************************/
    delgate().postTransferGovernance(msg.sender, coverKey, to, amount);
    emit GovernanceTransfer(to, amount);
  }
```
</details>

### addLiquidity

Adds liquidity to the specified cover contract

```solidity
function addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStakeToAdd, bytes32 referralCode) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStakeToAdd | uint256 | Enter the amount of NPM token to stake. | 
| referralCode | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    require(coverKey == key, "Forbidden");
    require(amount > 0, "Please specify amount");

    /******************************************************************************************
      PRE
     ******************************************************************************************/

    (uint256 podsToMint, uint256 previousNpmStake) = delgate().preAddLiquidity(msg.sender, coverKey, amount, npmStakeToAdd);

    require(podsToMint > 0, "Can't determine PODs");

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    IERC20(sc).ensureTransferFrom(msg.sender, address(this), amount);

    if (npmStakeToAdd > 0) {
      IERC20(s.getNpmTokenAddress()).ensureTransferFrom(msg.sender, address(this), npmStakeToAdd);
    }

    super._mint(msg.sender, podsToMint);

    /******************************************************************************************
      POST
     ******************************************************************************************/

    delgate().postAddLiquidity(msg.sender, coverKey, amount, npmStakeToAdd);

    emit PodsIssued(msg.sender, podsToMint, amount, referralCode);

    if (previousNpmStake == 0) {
      emit Entered(coverKey, msg.sender);
    }

    emit NPMStaken(msg.sender, npmStakeToAdd);
  }
```
</details>

### removeLiquidity

Removes liquidity from the specified cover contract

```solidity
function removeLiquidity(bytes32 coverKey, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| podsToRedeem | uint256 | Enter the amount of pods to redeem | 
| npmStakeToRemove | uint256 | Enter the amount of NPM stake to remove. | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(
    bytes32 coverKey,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    require(coverKey == key, "Forbidden");
    require(podsToRedeem > 0, "Please specify amount");

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    (address stablecoin, uint256 stablecoinToRelease) = delgate().preRemoveLiquidity(msg.sender, coverKey, podsToRedeem, npmStakeToRemove, exit);

    /******************************************************************************************
      BODY
     ******************************************************************************************/
    IERC20(address(this)).ensureTransferFrom(msg.sender, address(this), podsToRedeem);
    IERC20(stablecoin).ensureTransfer(msg.sender, stablecoinToRelease);

    super._burn(address(this), podsToRedeem);

    // Unstake NPM tokens
    if (npmStakeToRemove > 0) {
      IERC20(s.getNpmTokenAddress()).ensureTransfer(msg.sender, npmStakeToRemove);
    }

    /******************************************************************************************
      POST
     ******************************************************************************************/
    delgate().postRemoveLiquidity(msg.sender, coverKey, podsToRedeem, npmStakeToRemove, exit);

    emit PodsRedeemed(msg.sender, podsToRedeem, stablecoinToRelease);

    if (exit) {
      emit Exited(coverKey, msg.sender);
    }

    if (npmStakeToRemove > 0) {
      emit NPMUnstaken(msg.sender, npmStakeToRemove);
    }
  }
```
</details>

### calculatePods

Calculates the amount of PODS to mint for the given amount of liquidity to transfer

```solidity
function calculatePods(uint256 forStablecoinUnits) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| forStablecoinUnits | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePods(uint256 forStablecoinUnits) external view override returns (uint256) {
    return delgate().calculatePodsImplementation(key, forStablecoinUnits);
  }
```
</details>

### calculateLiquidity

Calculates the amount of stablecoins to withdraw for the given amount of PODs to redeem

```solidity
function calculateLiquidity(uint256 podsToBurn) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| podsToBurn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateLiquidity(uint256 podsToBurn) external view override returns (uint256) {
    return delgate().calculateLiquidityImplementation(key, podsToBurn);
  }
```
</details>

### getStablecoinBalanceOf

Returns the stablecoin balance of this vault
 This also includes amounts lent out in lending strategies

```solidity
function getStablecoinBalanceOf() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoinBalanceOf() external view override returns (uint256) {
    return delgate().getStablecoinBalanceOfImplementation(key);
  }
```
</details>

### accrueInterest

```solidity
function accrueInterest() external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function accrueInterest() external override nonReentrant {
    delgate().accrueInterestImplementation(msg.sender, key);
    emit InterestAccrued(key);
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
* [IPriceDiscovery](IPriceDiscovery.md)
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
* [NPMDistributor](NPMDistributor.md)
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
