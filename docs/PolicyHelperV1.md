# PolicyHelperV1.sol

View Source: [contracts/libraries/PolicyHelperV1.sol](../contracts/libraries/PolicyHelperV1.sol)

**PolicyHelperV1**

## Structs
### CalculatePolicyFeeArgs

```js
struct CalculatePolicyFeeArgs {
 bytes32 coverKey,
 bytes32 productKey,
 uint256 coverDuration,
 uint256 amountToCover
}
```

## Functions

- [calculatePolicyFeeInternal(IStore s, struct PolicyHelperV1.CalculatePolicyFeeArgs args)](#calculatepolicyfeeinternal)
- [getPolicyFeeInternal(IStore s, struct PolicyHelperV1.CalculatePolicyFeeArgs args)](#getpolicyfeeinternal)
- [_getCoverPoolAmounts(IStore s, bytes32 coverKey, bytes32 productKey)](#_getcoverpoolamounts)
- [getPolicyRatesInternal(IStore s, bytes32 coverKey)](#getpolicyratesinternal)
- [getCxTokenInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration)](#getcxtokeninternal)
- [getCxTokenOrDeployInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration)](#getcxtokenordeployinternal)
- [_getMonthName(uint256 date)](#_getmonthname)
- [_getCxTokenName(bytes32 coverKey, bytes32 productKey, uint256 expiry)](#_getcxtokenname)
- [purchaseCoverInternal(IStore s, struct IPolicy.PurchaseCoverArgs args)](#purchasecoverinternal)
- [getEODInternal(uint256 date)](#geteodinternal)
- [incrementPolicyIdInternal(IStore s)](#incrementpolicyidinternal)

### calculatePolicyFeeInternal

```solidity
function calculatePolicyFeeInternal(IStore s, struct PolicyHelperV1.CalculatePolicyFeeArgs args) public view
returns(policyFee struct IPolicy.CoverFeeInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| args | struct PolicyHelperV1.CalculatePolicyFeeArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePolicyFeeInternal(IStore s, CalculatePolicyFeeArgs memory args) public view returns (IPolicy.CoverFeeInfoType memory policyFee) {
    (policyFee.floor, policyFee.ceiling) = getPolicyRatesInternal(s, args.coverKey);
    (uint256 availableLiquidity, uint256 commitment, uint256 reassuranceFund) = _getCoverPoolAmounts(s, args.coverKey, args.productKey);

    require(args.amountToCover > 0, "Please enter an amount");
    require(args.coverDuration > 0 && args.coverDuration <= ProtoUtilV1.MAX_POLICY_DURATION, "Invalid duration");
    require(policyFee.floor > 0 && policyFee.ceiling > policyFee.floor, "Policy rate config error");

    require(availableLiquidity - commitment > args.amountToCover, "Insufficient fund");

    policyFee.totalAvailableLiquidity = availableLiquidity + reassuranceFund;
    policyFee.utilizationRatio = (ProtoUtilV1.MULTIPLIER * (commitment + args.amountToCover)) / policyFee.totalAvailableLiquidity;

    // console.log("[sc] s: %s, p: %s, u: %s", availableLiquidity, reassuranceFund, policyFee.utilizationRatio);
    // console.log("[sc] c: %s, a: %s, t: %s", commitment, args.amountToCover, policyFee.totalAvailableLiquidity);

    policyFee.rate = policyFee.utilizationRatio > policyFee.floor ? policyFee.utilizationRatio : policyFee.floor;

    policyFee.rate = policyFee.rate + (args.coverDuration * 100);

    if (policyFee.rate > policyFee.ceiling) {
      policyFee.rate = policyFee.ceiling;
    }

    uint256 expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, args.coverDuration); // solhint-disable-line
    uint256 effectiveFrom = getEODInternal(block.timestamp + s.getCoverageLagInternal(args.coverKey)); // solhint-disable-line
    uint256 daysCovered = BokkyPooBahsDateTimeLibrary.diffDays(effectiveFrom, expiryDate);

    policyFee.fee = (args.amountToCover * policyFee.rate * daysCovered) / (365 * ProtoUtilV1.MULTIPLIER);
  }
```
</details>

### getPolicyFeeInternal

```solidity
function getPolicyFeeInternal(IStore s, struct PolicyHelperV1.CalculatePolicyFeeArgs args) public view
returns(fee uint256, platformFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| args | struct PolicyHelperV1.CalculatePolicyFeeArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyFeeInternal(IStore s, CalculatePolicyFeeArgs memory args) public view returns (uint256 fee, uint256 platformFee) {
    IPolicy.CoverFeeInfoType memory coverFeeInfo = calculatePolicyFeeInternal(s, args);
    fee = coverFeeInfo.fee;

    uint256 rate = s.getUintByKey(ProtoUtilV1.NS_COVER_PLATFORM_FEE);
    platformFee = (fee * rate) / ProtoUtilV1.MULTIPLIER;
  }
```
</details>

### _getCoverPoolAmounts

```solidity
function _getCoverPoolAmounts(IStore s, bytes32 coverKey, bytes32 productKey) private view
returns(availableLiquidity uint256, commitment uint256, reassuranceFund uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCoverPoolAmounts(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  )
    private
    view
    returns (
      uint256 availableLiquidity,
      uint256 commitment,
      uint256 reassuranceFund
    )
  {
    IPolicy.CoverPoolSummaryType memory summary = s.getCoverPoolSummaryInternal(coverKey, productKey);

    availableLiquidity = summary.totalAmountInPool;
    commitment = summary.totalCommitment;

    reassuranceFund = (summary.reassuranceAmount * summary.reassurancePoolWeight) / ProtoUtilV1.MULTIPLIER;

    if (s.supportsProductsInternal(coverKey)) {
      require(summary.productCount > 0, "Misconfigured or retired product");
      availableLiquidity = (summary.totalAmountInPool * summary.leverage * summary.productCapitalEfficiency) / (summary.productCount * ProtoUtilV1.MULTIPLIER);
    }
  }
```
</details>

### getPolicyRatesInternal

```solidity
function getPolicyRatesInternal(IStore s, bytes32 coverKey) public view
returns(floor uint256, ceiling uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyRatesInternal(IStore s, bytes32 coverKey) public view returns (uint256 floor, uint256 ceiling) {
    if (coverKey > 0) {
      floor = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, coverKey);
      ceiling = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, coverKey);
    }

    if (floor == 0) {
      // Fallback to default values
      floor = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR);
      ceiling = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING);
    }
  }
```
</details>

### getCxTokenInternal

```solidity
function getCxTokenInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration) public view
returns(cxToken address, expiryDate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| coverDuration | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration
  ) public view returns (address cxToken, uint256 expiryDate) {
    expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, coverDuration); // solhint-disable-line
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, coverKey, productKey, expiryDate));

    cxToken = s.getAddress(k);
  }
```
</details>

### getCxTokenOrDeployInternal

Gets the instance of cxToken or deploys a new one based on the cover expiry timestamp

```solidity
function getCxTokenOrDeployInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration) public nonpayable
returns(contract ICxToken)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 |  | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenOrDeployInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration
  ) public returns (ICxToken) {
    (address cxToken, uint256 expiryDate) = getCxTokenInternal(s, coverKey, productKey, coverDuration);

    if (cxToken != address(0)) {
      return ICxToken(cxToken);
    }

    ICxTokenFactory factory = s.getCxTokenFactory();
    cxToken = factory.deploy(coverKey, productKey, _getCxTokenName(coverKey, productKey, expiryDate), expiryDate);

    // @warning: Do not uncomment the following line
    // Reason: cxTokens are no longer protocol members
    // as we will end up with way too many contracts
    // s.getProtocolInternal().addMember(cxToken);
    return ICxToken(cxToken);
  }
```
</details>

### _getMonthName

Returns month name of a given date

```solidity
function _getMonthName(uint256 date) private pure
returns(bytes3)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| date | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getMonthName(uint256 date) private pure returns (bytes3) {
    bytes3[13] memory m = [bytes3(0), "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    uint256 month = BokkyPooBahsDateTimeLibrary.getMonth(date);

    return m[month];
  }
```
</details>

### _getCxTokenName

Returns cxToken name from the supplied inputs.
 Format:
 For basket cover pool product
 --> dex:uni:nov (cxUSD)
 For standalone cover pool
 --> bal:nov (cxUSD)

```solidity
function _getCxTokenName(bytes32 coverKey, bytes32 productKey, uint256 expiry) private pure
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| expiry | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCxTokenName(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiry
  ) private pure returns (string memory) {
    bytes3 month = _getMonthName(expiry);

    if (productKey > 0) {
      return string(abi.encodePacked(string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(productKey)), ":", string(abi.encodePacked(month))));
    }

    return string(abi.encodePacked(string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(month))));
  }
```
</details>

### purchaseCoverInternal

Purchase cover for the specified amount. <br /> <br />
 When you purchase covers, you receive equal amount of cxTokens back.
 You need the cxTokens to claim the cover when resolution occurs.
 Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
 stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.

```solidity
function purchaseCoverInternal(IStore s, struct IPolicy.PurchaseCoverArgs args) external nonpayable
returns(cxToken contract ICxToken, fee uint256, platformFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| args | struct IPolicy.PurchaseCoverArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseCoverInternal(IStore s, IPolicy.PurchaseCoverArgs calldata args)
    external
    returns (
      ICxToken cxToken,
      uint256 fee,
      uint256 platformFee
    )
  {
    CalculatePolicyFeeArgs memory policyFeeArgs = CalculatePolicyFeeArgs({coverKey: args.coverKey, productKey: args.productKey, coverDuration: args.coverDuration, amountToCover: args.amountToCover});

    (fee, platformFee) = getPolicyFeeInternal(s, policyFeeArgs);
    require(fee > 0, "Insufficient fee");
    require(platformFee > 0, "Insufficient platform fee");

    address stablecoin = s.getStablecoinAddressInternal();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    IERC20(stablecoin).ensureTransferFrom(msg.sender, address(this), fee);
    IERC20(stablecoin).ensureTransfer(s.getVaultAddress(args.coverKey), fee - platformFee);
    IERC20(stablecoin).ensureTransfer(s.getTreasuryAddressInternal(), platformFee);

    uint256 stablecoinPrecision = s.getStablecoinPrecisionInternal();
    uint256 toMint = (args.amountToCover * ProtoUtilV1.CXTOKEN_PRECISION) / stablecoinPrecision;

    cxToken = getCxTokenOrDeployInternal(s, args.coverKey, args.productKey, args.coverDuration);
    cxToken.mint(args.coverKey, args.productKey, args.onBehalfOf, toMint);

    s.updateStateAndLiquidityInternal(args.coverKey);
  }
```
</details>

### getEODInternal

Gets the EOD (End of Day) time

```solidity
function getEODInternal(uint256 date) public pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| date | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getEODInternal(uint256 date) public pure returns (uint256) {
    (uint256 year, uint256 month, uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, day, 23, 59, 59);
  }
```
</details>

### incrementPolicyIdInternal

Increases the "last policy id" and returns new id

```solidity
function incrementPolicyIdInternal(IStore s) external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function incrementPolicyIdInternal(IStore s) external returns (uint256) {
    s.addUintByKey(ProtoUtilV1.NS_POLICY_LAST_PURCHASE_ID, 1);

    return s.getUintByKey(ProtoUtilV1.NS_POLICY_LAST_PURCHASE_ID);
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
