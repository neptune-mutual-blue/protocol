# PolicyHelperV1.sol

View Source: [contracts/libraries/PolicyHelperV1.sol](../contracts/libraries/PolicyHelperV1.sol)

**PolicyHelperV1**

## Contract Members
**Constants & Variables**

```js
uint256 public constant COVER_LAG_FALLBACK_VALUE;

```

## Functions

- [calculatePolicyFeeInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover)](#calculatepolicyfeeinternal)
- [getPolicyFeeInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover)](#getpolicyfeeinternal)
- [_getCoverPoolAmounts(IStore s, bytes32 coverKey, bytes32 productKey)](#_getcoverpoolamounts)
- [getPolicyRatesInternal(IStore s, bytes32 coverKey)](#getpolicyratesinternal)
- [getCxTokenInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration)](#getcxtokeninternal)
- [getCxTokenOrDeployInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration)](#getcxtokenordeployinternal)
- [_getMonthName(uint256 date)](#_getmonthname)
- [_getCxTokenName(bytes32 coverKey, bytes32 productKey, uint256 expiry)](#_getcxtokenname)
- [purchaseCoverInternal(IStore s, address onBehalfOf, bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover)](#purchasecoverinternal)
- [getCoverageLagInternal(IStore s, bytes32 coverKey)](#getcoveragelaginternal)

### calculatePolicyFeeInternal

```solidity
function calculatePolicyFeeInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover) public view
returns(fee uint256, utilizationRatio uint256, totalAvailableLiquidity uint256, floor uint256, ceiling uint256, rate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| coverDuration | uint256 |  | 
| amountToCover | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePolicyFeeInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  )
    public
    view
    returns (
      uint256 fee,
      uint256 utilizationRatio,
      uint256 totalAvailableLiquidity,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    )
  {
    (floor, ceiling) = getPolicyRatesInternal(s, coverKey);
    (uint256 availableLiquidity, uint256 commitment, uint256 reassuranceFund) = _getCoverPoolAmounts(s, coverKey, productKey);

    require(amountToCover > 0, "Please enter an amount");
    require(coverDuration > 0 && coverDuration <= ProtoUtilV1.MAX_POLICY_DURATION, "Invalid duration");
    require(floor > 0 && ceiling > floor, "Policy rate config error");

    require(availableLiquidity - commitment > amountToCover, "Insufficient fund");

    totalAvailableLiquidity = availableLiquidity + reassuranceFund;
    utilizationRatio = (ProtoUtilV1.MULTIPLIER * (commitment + amountToCover)) / totalAvailableLiquidity;

    rate = utilizationRatio > floor ? utilizationRatio : floor;

    rate = rate + (coverDuration * 100);

    if (rate > ceiling) {
      rate = ceiling;
    }

    uint256 expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, coverDuration); // solhint-disable-line
    uint256 daysCovered = BokkyPooBahsDateTimeLibrary.diffDays(block.timestamp, expiryDate); // solhint-disable-line

    fee = (amountToCover * rate * daysCovered) / (365 * ProtoUtilV1.MULTIPLIER);
  }
```
</details>

### getPolicyFeeInternal

```solidity
function getPolicyFeeInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover) public view
returns(fee uint256, platformFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| coverDuration | uint256 |  | 
| amountToCover | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyFeeInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  ) public view returns (uint256 fee, uint256 platformFee) {
    (fee, , , , , ) = calculatePolicyFeeInternal(s, coverKey, productKey, coverDuration, amountToCover);

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
    uint256[] memory values = s.getCoverPoolSummaryInternal(coverKey, productKey);

    /*
     * values[0] stablecoinOwnedByVault --> The total amount in the cover pool
     * values[1] commitment --> The total commitment amount
     * values[2] reassurance
     * values[3] reassurancePoolWeight
     * values[4] count --> Count of products under this cover
     * values[5] leverage
     * values[6] efficiency --> Cover product efficiency weight
     */

    availableLiquidity = values[0];
    commitment = values[1];

    // (reassurance * reassurancePoolWeight) / multiplier
    reassuranceFund = (values[2] * values[3]) / ProtoUtilV1.MULTIPLIER;

    if (s.supportsProductsInternal(coverKey)) {
      require(values[4] > 0, "Misconfigured or retired product");

      // (stablecoinOwnedByVault * leverage * efficiency) / (count * multiplier)
      availableLiquidity = (values[0] * values[5] * values[6]) / (values[4] * ProtoUtilV1.MULTIPLIER);
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
    // s.getProtocol().addMember(cxToken);
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
 --> cxusd:dex:uni:nov (cxUSD)
 For standalone cover pool
 --> cxusd:bal:nov (cxUSD)

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
      return string(abi.encodePacked("cxusd:", string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(productKey)), ":", string(abi.encodePacked(month))));
    }

    return string(abi.encodePacked("cxusd:", string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(month))));
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
function purchaseCoverInternal(IStore s, address onBehalfOf, bytes32 coverKey, bytes32 productKey, uint256 coverDuration, uint256 amountToCover) external nonpayable
returns(cxToken contract ICxToken, fee uint256, platformFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| onBehalfOf | address | Enter the address where the claim tokens (cxTokens) should be sent. | 
| coverKey | bytes32 | Enter the cover key you wish to purchase the policy for | 
| productKey | bytes32 |  | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin to cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseCoverInternal(
    IStore s,
    address onBehalfOf,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  )
    external
    returns (
      ICxToken cxToken,
      uint256 fee,
      uint256 platformFee
    )
  {
    (fee, platformFee) = getPolicyFeeInternal(s, coverKey, productKey, coverDuration, amountToCover);
    require(fee > 0, "Insufficient fee");
    require(platformFee > 0, "Insufficient platform fee");

    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    IERC20(stablecoin).ensureTransferFrom(msg.sender, address(this), fee);
    IERC20(stablecoin).ensureTransfer(s.getVaultAddress(coverKey), fee - platformFee);
    IERC20(stablecoin).ensureTransfer(s.getTreasury(), platformFee);

    uint256 stablecoinPrecision = s.getStablecoinPrecision();
    uint256 toMint = (amountToCover * ProtoUtilV1.CXTOKEN_PRECISION) / stablecoinPrecision;

    cxToken = getCxTokenOrDeployInternal(s, coverKey, productKey, coverDuration);
    cxToken.mint(coverKey, productKey, onBehalfOf, toMint);

    s.updateStateAndLiquidity(coverKey);
  }
```
</details>

### getCoverageLagInternal

```solidity
function getCoverageLagInternal(IStore s, bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverageLagInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 custom = s.getUintByKeys(ProtoUtilV1.NS_COVERAGE_LAG, coverKey);

    // Custom means set for this exact cover
    if (custom > 0) {
      return custom;
    }

    // Global means set for all covers (without specifying a cover key)
    uint256 global = s.getUintByKey(ProtoUtilV1.NS_COVERAGE_LAG);

    if (global > 0) {
      return global;
    }

    // Fallback means the default option
    return COVER_LAG_FALLBACK_VALUE;
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
