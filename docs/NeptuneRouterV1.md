# NeptuneRouterV1.sol

View Source: [contracts/examples/.router/NeptuneRouter.sol](../contracts/examples/.router/NeptuneRouter.sol)

**↗ Extends: [INeptuneRouterV1](INeptuneRouterV1.md), [Recoverable](Recoverable.md)**

**NeptuneRouterV1**

## Functions

- [constructor(IStore store)](#)
- [addCovers(struct ICover.AddCoverArgs[] args)](#addcovers)
- [addProducts(struct ICover.AddProductArgs[] args)](#addproducts)
- [_getFee(struct IPolicy.PurchaseCoverArgs[] args)](#_getfee)
- [purchaseCovers(struct IPolicy.PurchaseCoverArgs[] args)](#purchasecovers)
- [addLiquidities(struct IVault.AddLiquidityArgs[] args)](#addliquidities)

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

### addCovers

```solidity
function addCovers(struct ICover.AddCoverArgs[] args) external nonpayable
returns(vaults address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddCoverArgs[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCovers(ICover.AddCoverArgs[] calldata args) external override returns (address[] memory vaults) {
    IERC20 npm = s.npmToken();
    IERC20 stablecoin = IERC20(s.getStablecoin());

    ICover cover = s.getCoverContract();

    uint256 totalStakeWithFee;
    uint256 totalReassurance;

    for (uint256 i = 0; i < args.length; i++) {
      totalStakeWithFee += args[i].stakeWithFee;
      totalReassurance += args[i].initialReassuranceAmount;
    }

    npm.ensureTransferFrom(msg.sender, address(this), totalStakeWithFee);

    npm.ensureApproval(address(cover), totalStakeWithFee);

    if (totalReassurance > 0) {
      stablecoin.ensureTransferFrom(msg.sender, address(this), totalReassurance);
      stablecoin.ensureApproval(address(cover), totalReassurance);
    }

    vaults = new address[](args.length + 1);

    for (uint256 i = 0; i < args.length; i++) {
      vaults[i] = cover.addCover(args[i]);
    }
  }
```
</details>

### addProducts

```solidity
function addProducts(struct ICover.AddProductArgs[] args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddProductArgs[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addProducts(ICover.AddProductArgs[] calldata args) external override {
    ICover cover = s.getCoverContract();

    for (uint256 i = 0; i < args.length; i++) {
      cover.addProduct(args[i]);
    }
  }
```
</details>

### _getFee

```solidity
function _getFee(struct IPolicy.PurchaseCoverArgs[] args) private view
returns(total uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct IPolicy.PurchaseCoverArgs[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getFee(IPolicy.PurchaseCoverArgs[] calldata args) private view returns (uint256 total) {
    for (uint256 i = 0; i < args.length; i++) {
      PolicyHelperV1.CalculatePolicyFeeArgs memory policyFeeArgs = PolicyHelperV1.CalculatePolicyFeeArgs({
        coverKey: args[i].coverKey,
        productKey: args[i].productKey,
        coverDuration: args[i].coverDuration,
        amountToCover: args[i].amountToCover
      });

      (uint256 fee, ) = s.getPolicyFeeInternal(policyFeeArgs);
      total += fee;
    }
  }
```
</details>

### purchaseCovers

```solidity
function purchaseCovers(struct IPolicy.PurchaseCoverArgs[] args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct IPolicy.PurchaseCoverArgs[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseCovers(IPolicy.PurchaseCoverArgs[] calldata args) external override {
    uint256 fee = _getFee(args);

    IERC20 stablecoin = IERC20(s.getStablecoin());
    IPolicy policy = s.getPolicyContract();

    stablecoin.ensureTransferFrom(msg.sender, address(this), fee);
    stablecoin.ensureApproval(address(policy), fee);

    for (uint256 i = 0; i < args.length; i++) {
      policy.purchaseCover(args[i]);
    }
  }
```
</details>

### addLiquidities

```solidity
function addLiquidities(struct IVault.AddLiquidityArgs[] args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct IVault.AddLiquidityArgs[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidities(IVault.AddLiquidityArgs[] calldata args) external override {
    IERC20 stablecoin = IERC20(s.getStablecoin());
    IERC20 npm = s.npmToken();

    uint256 totalAmount;
    uint256 totalNpm;

    for (uint256 i = 0; i < args.length; i++) {
      totalAmount += args[i].amount;
      totalNpm += args[i].npmStakeToAdd;
    }

    stablecoin.ensureTransferFrom(msg.sender, address(this), totalAmount);
    npm.ensureTransferFrom(msg.sender, address(this), totalNpm);

    for (uint256 i = 0; i < args.length; i++) {
      IVault vault = s.getVault(args[i].coverKey);

      stablecoin.approve(address(vault), args[i].amount);
      npm.approve(address(vault), args[i].npmStakeToAdd);

      vault.addLiquidity(args[i]);

      IERC20(vault).ensureTransfer(msg.sender, vault.balanceOf(address(this)));
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
