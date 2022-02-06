# PolicyHelperV1.sol

View Source: [contracts/libraries/PolicyHelperV1.sol](../contracts/libraries/PolicyHelperV1.sol)

**PolicyHelperV1**

## Functions

- [getCoverFeeInfoInternal(IStore s, bytes32 key, uint256 coverDuration, uint256 amountToCover)](#getcoverfeeinfointernal)
- [getCoverFeeInternal(IStore s, bytes32 key, uint256 coverDuration, uint256 amountToCover)](#getcoverfeeinternal)
- [_getCoverFeeRate(uint256 floor, uint256 ceiling, uint256 coverRatio)](#_getcoverfeerate)
- [getHarmonicMean(uint256 x, uint256 y, uint256 z)](#getharmonicmean)
- [getPolicyRatesInternal(IStore s, bytes32 key)](#getpolicyratesinternal)
- [getCxTokenInternal(IStore s, bytes32 key, uint256 coverDuration)](#getcxtokeninternal)
- [getCxTokenOrDeployInternal(IStore s, bytes32 key, uint256 coverDuration)](#getcxtokenordeployinternal)
- [purchaseCoverInternal(IStore s, bytes32 key, uint256 coverDuration, uint256 amountToCover)](#purchasecoverinternal)
- [_setCommitments(IStore s, ICxToken cxToken, uint256 amountToCover)](#_setcommitments)
- [getCommitmentInternal(IStore s, bytes32 key)](#getcommitmentinternal)
- [getCoverableInternal(IStore , bytes32 )](#getcoverableinternal)

### getCoverFeeInfoInternal

Gets the cover fee info for the given cover key, duration, and amount

```solidity
function getCoverFeeInfoInternal(IStore s, bytes32 key, uint256 coverDuration, uint256 amountToCover) public view
returns(fee uint256, utilizationRatio uint256, totalAvailableLiquidity uint256, coverRatio uint256, floor uint256, ceiling uint256, rate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin `liquidityToken` to cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverFeeInfoInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  )
    public
    view
    returns (
      uint256 fee,
      uint256 utilizationRatio,
      uint256 totalAvailableLiquidity,
      uint256 coverRatio,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    )
  {
    (floor, ceiling) = getPolicyRatesInternal(s, key);
    uint256[] memory values = s.getCoverPoolSummaryInternal(key);

    require(coverDuration <= 3, "Invalid duration");
    require(floor > 0 && ceiling > floor, "Policy rate config error");

    // AMOUNT_IN_COVER_POOL - COVER_COMMITMENT > AMOUNT_TO_COVER
    require(values[0] - values[1] > amountToCover, "Insufficient fund");

    // UTILIZATION RATIO = COVER_COMMITMENT / AMOUNT_IN_COVER_POOL
    utilizationRatio = (ProtoUtilV1.MULTIPLIER * values[1]) / values[0];

    // TOTAL AVAILABLE LIQUIDITY = AMOUNT_IN_COVER_POOL - COVER_COMMITMENT + (NEP_REWARD_POOL_SUPPORT * NEP_PRICE) + (REASSURANCE_POOL_SUPPORT * REASSURANCE_TOKEN_PRICE * REASSURANCE_POOL_WEIGHT)
    totalAvailableLiquidity = values[0] - values[1] + ((values[2] * values[3]) / 1 ether) + ((values[4] * values[5] * values[6]) / (ProtoUtilV1.MULTIPLIER * 1 ether));

    // COVER RATIO = UTILIZATION_RATIO + COVER_DURATION * AMOUNT_TO_COVER / AVAILABLE_LIQUIDITY
    coverRatio = utilizationRatio + ((ProtoUtilV1.MULTIPLIER * coverDuration * amountToCover) / totalAvailableLiquidity);

    rate = _getCoverFeeRate(floor, ceiling, coverRatio);
    fee = (amountToCover * rate * coverDuration) / (12 * ProtoUtilV1.MULTIPLIER);
  }
```
</details>

### getCoverFeeInternal

```solidity
function getCoverFeeInternal(IStore s, bytes32 key, uint256 coverDuration, uint256 amountToCover) public view
returns(fee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| coverDuration | uint256 |  | 
| amountToCover | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverFeeInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  ) public view returns (uint256 fee) {
    (fee, , , , , , ) = getCoverFeeInfoInternal(s, key, coverDuration, amountToCover);
  }
```
</details>

### _getCoverFeeRate

Gets the harmonic mean rate of the given ratios. Stops/truncates at min/max values.

```solidity
function _getCoverFeeRate(uint256 floor, uint256 ceiling, uint256 coverRatio) private pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| floor | uint256 | The lowest cover fee rate | 
| ceiling | uint256 | The highest cover fee rate | 
| coverRatio | uint256 | Enter the ratio of the cover vs liquidity | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCoverFeeRate(
    uint256 floor,
    uint256 ceiling,
    uint256 coverRatio
  ) private pure returns (uint256) {
    // COVER FEE RATE = HARMEAN(FLOOR, COVER RATIO, CEILING)
    uint256 rate = getHarmonicMean(floor, coverRatio, ceiling);

    if (rate < floor) {
      return floor;
    }

    if (rate > ceiling) {
      return ceiling;
    }

    return rate;
  }
```
</details>

### getHarmonicMean

Returns the harmonic mean of the supplied values.

```solidity
function getHarmonicMean(uint256 x, uint256 y, uint256 z) public pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 
| y | uint256 |  | 
| z | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getHarmonicMean(
    uint256 x,
    uint256 y,
    uint256 z
  ) public pure returns (uint256) {
    require(x > 0 && y > 0 && z > 0, "Invalid arg");
    return 3e36 / ((1e36 / (x)) + (1e36 / (y)) + (1e36 / (z)));
  }
```
</details>

### getPolicyRatesInternal

```solidity
function getPolicyRatesInternal(IStore s, bytes32 key) public view
returns(floor uint256, ceiling uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyRatesInternal(IStore s, bytes32 key) public view returns (uint256 floor, uint256 ceiling) {
    floor = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, key);
    ceiling = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, key);

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
function getCxTokenInternal(IStore s, bytes32 key, uint256 coverDuration) public view
returns(cxToken address, expiryDate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| coverDuration | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration
  ) public view returns (address cxToken, uint256 expiryDate) {
    expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, coverDuration); // solhint-disable-line
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate));

    cxToken = s.getAddress(k);
  }
```
</details>

### getCxTokenOrDeployInternal

Gets the instance of cxToken or deploys a new one based on the cover expiry timestamp

```solidity
function getCxTokenOrDeployInternal(IStore s, bytes32 key, uint256 coverDuration) public nonpayable
returns(contract ICxToken)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenOrDeployInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration
  ) public returns (ICxToken) {
    (address cxToken, uint256 expiryDate) = getCxTokenInternal(s, key, coverDuration);

    if (cxToken != address(0)) {
      return ICxToken(cxToken);
    }

    ICxTokenFactory factory = s.getCxTokenFactory();
    cxToken = factory.deploy(s, key, expiryDate);
    s.addMemberInternal(cxToken);

    return ICxToken(cxToken);
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
function purchaseCoverInternal(IStore s, bytes32 key, uint256 coverDuration, uint256 amountToCover) external nonpayable
returns(cxToken contract ICxToken, fee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key you wish to purchase the policy for | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin `liquidityToken` to cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseCoverInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  ) external returns (ICxToken cxToken, uint256 fee) {
    fee = getCoverFeeInternal(s, key, coverDuration, amountToCover);
    cxToken = getCxTokenOrDeployInternal(s, key, coverDuration);

    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    _setCommitments(s, cxToken, amountToCover);

    // Transfer the fee to the vault
    IERC20(stablecoin).ensureTransferFrom(msg.sender, address(s.getVault(key)), fee);
    cxToken.mint(key, msg.sender, amountToCover);

    s.updateStateAndLiquidity(key);
  }
```
</details>

### _setCommitments

```solidity
function _setCommitments(IStore s, ICxToken cxToken, uint256 amountToCover) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| cxToken | ICxToken |  | 
| amountToCover | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setCommitments(
    IStore s,
    ICxToken cxToken,
    uint256 amountToCover
  ) private {
    uint256 expiryDate = cxToken.expiresOn();
    bytes32 coverKey = cxToken.coverKey();

    bytes32 k = CoverUtilV1.getCommitmentKey(coverKey, expiryDate);
    s.addUint(k, amountToCover);
  }
```
</details>

### getCommitmentInternal

```solidity
function getCommitmentInternal(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCommitmentInternal(IStore s, bytes32 key) external view returns (uint256) {
    // revert("Not implemented");
    // @todo: implementation needed
    return s.getCoverLiquidityCommitted(key);
  }
```
</details>

### getCoverableInternal

```solidity
function getCoverableInternal(IStore , bytes32 ) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | IStore |  | 
|  | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverableInternal(
    IStore,
    bytes32 /*key*/
  ) external pure returns (uint256) {
    revert("Not implemented");
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
