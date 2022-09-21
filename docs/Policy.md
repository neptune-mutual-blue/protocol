# Policy Contract (Policy.sol)

View Source: [\contracts\core\policy\Policy.sol](..\contracts\core\policy\Policy.sol)

**↗ Extends: [IPolicy](IPolicy.md), [Recoverable](Recoverable.md)**

**Policy**

The policy contract enables you to a purchase cover

## Functions

- [constructor(IStore store)](#)
- [purchaseCover(struct IPolicy.PurchaseCoverArgs args)](#purchasecover)
- [getCxToken(bytes32 coverKey, bytes32 productKey, uint256 coverDuration)](#getcxtoken)
- [getCxTokenByExpiryDate(bytes32 coverKey, bytes32 productKey, uint256 expiryDate)](#getcxtokenbyexpirydate)
- [getExpiryDate(uint256 today, uint256 coverDuration)](#getexpirydate)
- [getCommitment(bytes32 coverKey, bytes32 productKey)](#getcommitment)
- [getAvailableLiquidity(bytes32 coverKey)](#getavailableliquidity)
- [getCoverFeeInfo(bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover)](#getcoverfeeinfo)
- [getCoverPoolSummary(bytes32 coverKey, bytes32 productKey)](#getcoverpoolsummary)
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

### purchaseCover

Purchase cover for the specified amount. <br /> <br />
 When you purchase covers, you receive equal amount of cxTokens back.
 You need the cxTokens to claim the cover when resolution occurs.
 Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
 stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.
 https://docs.neptunemutual.com/covers/purchasing-covers
 ## Payouts and Incident Date

```solidity
function purchaseCover(struct IPolicy.PurchaseCoverArgs args) external nonpayable nonReentrant 
returns(address, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct IPolicy.PurchaseCoverArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseCover(PurchaseCoverArgs calldata args) external override nonReentrant returns (address, uint256) {

    // @todo: When the POT system is replaced with NPM tokens in the future, upgrade this contract

    // and uncomment the following line

    // require(IERC20(s.getNpmTokenAddress()).balanceOf(msg.sender) >= 1 ether, "No NPM balance");

    require(args.coverKey > 0, "Invalid cover key");

    require(args.onBehalfOf != address(0), "Invalid `onBehalfOf`");

    require(args.amountToCover > 0, "Enter an amount");

    require(args.coverDuration > 0 && args.coverDuration <= ProtoUtilV1.MAX_POLICY_DURATION, "Invalid cover duration");

    s.mustNotBePaused();

    s.mustNotExceedProposalThreshold(args.amountToCover);

    s.mustBeSupportedProductOrEmpty(args.coverKey, args.productKey);

    s.mustHaveNormalProductStatus(args.coverKey, args.productKey);

    s.mustNotHavePolicyDisabled(args.coverKey, args.productKey);

    s.senderMustBeWhitelistedIfRequired(args.coverKey, args.productKey, args.onBehalfOf);

    uint256 lastPolicyId = s.incrementPolicyId();

    (ICxToken cxToken, uint256 fee, uint256 platformFee) = s.purchaseCoverInternal(args);

    emit CoverPurchased(args, address(cxToken), fee, platformFee, cxToken.expiresOn(), lastPolicyId);

    return (address(cxToken), lastPolicyId);

  }
```
</details>

### getCxToken

Gets cxToken and its expiry address by the supplied arguments.
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getCxToken(bytes32 coverKey, bytes32 productKey, uint256 coverDuration) external view
returns(cxToken address, expiryDate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 | Enter the cover key | 
| coverDuration | uint256 | Enter the cover's policy duration. Valid values: 1-3. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxToken(

    bytes32 coverKey,

    bytes32 productKey,

    uint256 coverDuration

  ) external view override returns (address cxToken, uint256 expiryDate) {

    require(coverDuration > 0 && coverDuration <= ProtoUtilV1.MAX_POLICY_DURATION, "Invalid cover duration");

    return s.getCxTokenInternal(coverKey, productKey, coverDuration);

  }
```
</details>

### getCxTokenByExpiryDate

Returns cxToken address by the cover key, product key, and expiry date.
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getCxTokenByExpiryDate(bytes32 coverKey, bytes32 productKey, uint256 expiryDate) external view
returns(cxToken address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 | Enter the cover key | 
| expiryDate | uint256 | Enter the cxToken's expiry date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenByExpiryDate(

    bytes32 coverKey,

    bytes32 productKey,

    uint256 expiryDate

  ) external view override returns (address cxToken) {

    return s.getCxTokenByExpiryDateInternal(coverKey, productKey, expiryDate);

  }
```
</details>

### getExpiryDate

Gets the expiry date based on cover duration

```solidity
function getExpiryDate(uint256 today, uint256 coverDuration) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| today | uint256 | Enter the current timestamp | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getExpiryDate(uint256 today, uint256 coverDuration) external pure override returns (uint256) {

    return CoverUtilV1.getExpiryDateInternal(today, coverDuration);

  }
```
</details>

### getCommitment

Gets the sum total of cover commitment that has not expired yet.
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getCommitment(bytes32 coverKey, bytes32 productKey) external view
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
function getCommitment(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {

    uint256 precision = s.getStablecoinPrecision();

    return s.getActiveLiquidityUnderProtection(coverKey, productKey, precision);

  }
```
</details>

### getAvailableLiquidity

Gets the available liquidity in the pool.
 Warning: this function does not validate the cover key supplied.

```solidity
function getAvailableLiquidity(bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAvailableLiquidity(bytes32 coverKey) external view override returns (uint256) {

    return s.getStablecoinOwnedByVaultInternal(coverKey);

  }
```
</details>

### getCoverFeeInfo

Gets the cover fee info for the given cover key, duration, and amount
 Warning: this function does not validate the cover key supplied.

```solidity
function getCoverFeeInfo(bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover) external view
returns(struct IPolicy.CoverFeeInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 |  | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin to cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverFeeInfo(

    bytes32 coverKey,

    bytes32 productKey,

    uint256 coverDuration,

    uint256 amountToCover

  ) external view override returns (CoverFeeInfoType memory) {

    PolicyHelperV1.CalculatePolicyFeeArgs memory args = PolicyHelperV1.CalculatePolicyFeeArgs({coverKey: coverKey, productKey: productKey, coverDuration: coverDuration, amountToCover: amountToCover});

    return s.calculatePolicyFeeInternal(args);

  }
```
</details>

### getCoverPoolSummary

Returns the pool summary of the given cover key
 Warning: this function does not validate the cover key supplied.

```solidity
function getCoverPoolSummary(bytes32 coverKey, bytes32 productKey) external view
returns(summary struct IPolicy.CoverPoolSummaryType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverPoolSummary(bytes32 coverKey, bytes32 productKey) external view override returns (IPolicy.CoverPoolSummaryType memory summary) {

    return s.getCoverPoolSummaryInternal(coverKey, productKey);

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

    return ProtoUtilV1.CNAME_POLICY;

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
