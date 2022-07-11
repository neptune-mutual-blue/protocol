# CoverUtilV1.sol

View Source: [contracts/libraries/CoverUtilV1.sol](../contracts/libraries/CoverUtilV1.sol)

**CoverUtilV1**

**Enums**
### ProductStatus

```js
enum ProductStatus {
 Normal,
 Stopped,
 IncidentHappened,
 FalseReporting,
 Claimable
}
```

## Contract Members
**Constants & Variables**

```js
uint256 public constant REASSURANCE_WEIGHT_FALLBACK_VALUE;

```

## Functions

- [getCoverOwner(IStore s, bytes32 coverKey)](#getcoverowner)
- [getCoverCreationFeeInfo(IStore s)](#getcovercreationfeeinfo)
- [getMinCoverCreationStake(IStore s)](#getmincovercreationstake)
- [getCoverCreationDate(IStore s, bytes32 coverKey)](#getcovercreationdate)
- [getMinStakeToAddLiquidity(IStore s)](#getminstaketoaddliquidity)
- [getClaimPeriod(IStore s, bytes32 coverKey)](#getclaimperiod)
- [getCoverPoolSummaryInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#getcoverpoolsummaryinternal)
- [getReassuranceWeightInternal(IStore s, bytes32 coverKey)](#getreassuranceweightinternal)
- [getReassuranceAmountInternal(IStore s, bytes32 coverKey)](#getreassuranceamountinternal)
- [getReassuranceRateInternal(IStore s, bytes32 coverKey)](#getreassurancerateinternal)
- [getReassuranceKey(bytes32 coverKey)](#getreassurancekey)
- [getReassuranceRateKey(bytes32 coverKey)](#getreassuranceratekey)
- [getReassuranceWeightKey(bytes32 coverKey)](#getreassuranceweightkey)
- [isCoverNormalInternal(IStore s, bytes32 coverKey)](#iscovernormalinternal)
- [getProductStatusInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#getproductstatusinternal)
- [getProductStatusOfInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getproductstatusofinternal)
- [getProductStatusOfKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getproductstatusofkey)
- [getCoverLiquidityStakeKey(bytes32 coverKey)](#getcoverliquiditystakekey)
- [getLastDepositHeightKey(bytes32 coverKey)](#getlastdepositheightkey)
- [getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account)](#getcoverliquiditystakeindividualkey)
- [getBlacklistKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getblacklistkey)
- [getTotalLiquidityUnderProtection(IStore s, bytes32 coverKey, uint256 precision)](#gettotalliquidityunderprotection)
- [_getProducts(IStore s, bytes32 coverKey)](#_getproducts)
- [getActiveLiquidityUnderProtection(IStore s, bytes32 coverKey, bytes32 productKey, uint256 adjustPrecision)](#getactiveliquidityunderprotection)
- [_getCurrentCommitment(IStore s, bytes32 coverKey, bytes32 productKey)](#_getcurrentcommitment)
- [_getFutureCommitments(IStore s, bytes32 coverKey, bytes32 productKey, uint256 excludedExpiryDate)](#_getfuturecommitments)
- [getStake(IStore s, bytes32 coverKey)](#getstake)
- [setStatusInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, enum CoverUtilV1.ProductStatus status)](#setstatusinternal)
- [getExpiryDateInternal(uint256 today, uint256 coverDuration)](#getexpirydateinternal)
- [_getNextMonthEndDate(uint256 date, uint256 monthsToAdd)](#_getnextmonthenddate)
- [_getMonthEndDate(uint256 date)](#_getmonthenddate)
- [getCxTokenByExpiryDateInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 expiryDate)](#getcxtokenbyexpirydateinternal)
- [checkIfProductRequiresWhitelist(IStore s, bytes32 coverKey, bytes32 productKey)](#checkifproductrequireswhitelist)
- [checkIfRequiresWhitelist(IStore s, bytes32 coverKey)](#checkifrequireswhitelist)
- [supportsProductsInternal(IStore s, bytes32 coverKey)](#supportsproductsinternal)
- [isValidProductInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#isvalidproductinternal)
- [isActiveProductInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#isactiveproductinternal)
- [disablePolicyInternal(IStore s, bytes32 coverKey, bytes32 productKey, bool status)](#disablepolicyinternal)
- [isPolicyDisabledInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#ispolicydisabledinternal)
- [getPolicyDisabledKey(bytes32 coverKey, bytes32 productKey)](#getpolicydisabledkey)
- [getActiveIncidentDateInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#getactiveincidentdateinternal)

### getCoverOwner

Returns the given cover's owner.
 Warning: this function does not validate the cover key supplied.

```solidity
function getCoverOwner(IStore s, bytes32 coverKey) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverOwner(IStore s, bytes32 coverKey) external view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, coverKey);
  }
```
</details>

### getCoverCreationFeeInfo

Returns cover creation fee information.

```solidity
function getCoverCreationFeeInfo(IStore s) external view
returns(fee uint256, minCoverCreationStake uint256, minStakeToAddLiquidity uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

**Returns**

fee Returns the amount of NPM tokens you need to pay to create a new cover

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverCreationFeeInfo(IStore s)
    external
    view
    returns (
      uint256 fee,
      uint256 minCoverCreationStake,
      uint256 minStakeToAddLiquidity
    )
  {
    fee = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    minCoverCreationStake = getMinCoverCreationStake(s);
    minStakeToAddLiquidity = getMinStakeToAddLiquidity(s);
  }
```
</details>

### getMinCoverCreationStake

Returns minimum NPM stake to create a new cover.

```solidity
function getMinCoverCreationStake(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinCoverCreationStake(IStore s) public view returns (uint256) {
    uint256 value = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE);

    if (value == 0) {
      // Fallback to 250 NPM
      value = 250 ether;
    }

    return value;
  }
```
</details>

### getCoverCreationDate

Returns a cover's creation date
 Warning: this function does not validate the cover key supplied.

```solidity
function getCoverCreationDate(IStore s, bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverCreationDate(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, coverKey);
  }
```
</details>

### getMinStakeToAddLiquidity

Returns minimum NPM stake to add liquidity.

```solidity
function getMinStakeToAddLiquidity(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinStakeToAddLiquidity(IStore s) public view returns (uint256) {
    uint256 value = s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE);

    if (value == 0) {
      // Fallback to 250 NPM
      value = 250 ether;
    }

    return value;
  }
```
</details>

### getClaimPeriod

Gets claim period/duration of the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getClaimPeriod(IStore s, bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimPeriod(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 fromKey = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey);
    uint256 fallbackValue = s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);

    return fromKey > 0 ? fromKey : fallbackValue;
  }
```
</details>

### getCoverPoolSummaryInternal

Returns a summary of the given cover pool.
 Warning: this function does not validate the cover key supplied.

```solidity
function getCoverPoolSummaryInternal(IStore s, bytes32 coverKey, bytes32 productKey) external view
returns(_values uint256[])
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
function getCoverPoolSummaryInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (uint256[] memory _values) {
    _values = new uint256[](8);

    uint256 precision = s.getStablecoinPrecision();

    _values[0] = s.getStablecoinOwnedByVaultInternal(coverKey); // precision: stablecoin
    _values[1] = getActiveLiquidityUnderProtection(s, coverKey, productKey, precision); // <-- adjusted precision
    _values[2] = getReassuranceAmountInternal(s, coverKey); // precision: stablecoin
    _values[3] = getReassuranceWeightInternal(s, coverKey);
    _values[4] = s.countBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey);
    _values[5] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LEVERAGE_FACTOR, coverKey);
    _values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, coverKey, productKey);
  }
```
</details>

### getReassuranceWeightInternal

Gets the reassurance weight of a given cover key.
 Warning: this function does not validate the cover key supplied.

```solidity
function getReassuranceWeightInternal(IStore s, bytes32 coverKey) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide store instance | 
| coverKey | bytes32 | Enter the cover for which you want to obtain the reassurance weight for. | 

**Returns**

If reassurance weight value wasn't set for the specified cover pool,
 the global value will be returned.
 If global value, too, isn't available, a fallback value of `REASSURANCE_WEIGHT_FALLBACK_VALUE`
 is returned.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceWeightInternal(IStore s, bytes32 coverKey) public view returns (uint256) {
    uint256 setForTheCoverPool = s.getUintByKey(getReassuranceWeightKey(coverKey));

    if (setForTheCoverPool > 0) {
      return setForTheCoverPool;
    }

    // Globally set value: not set for any specifical cover
    uint256 setGlobally = s.getUintByKey(getReassuranceWeightKey(0));

    if (setGlobally > 0) {
      return setGlobally;
    }

    return REASSURANCE_WEIGHT_FALLBACK_VALUE;
  }
```
</details>

### getReassuranceAmountInternal

Gets the reassurance amount of the specified cover contract
 Warning: this function does not validate the cover key supplied.

```solidity
function getReassuranceAmountInternal(IStore s, bytes32 coverKey) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceAmountInternal(IStore s, bytes32 coverKey) public view returns (uint256) {
    return s.getUintByKey(getReassuranceKey(coverKey));
  }
```
</details>

### getReassuranceRateInternal

Returns reassurance rate of the specified cover key.
 When a cover is finalized after claims payout, a portion
 of the reassurance fund (if available) is transferred to the cover liquidity pool.
 If the reassurance rate is 25%, either 25% of the reassurance pool
 or 25% of the suffered loss is transferred prior to finalization, whichever is less.
 Warning: this function does not validate the cover key supplied.

```solidity
function getReassuranceRateInternal(IStore s, bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store | 
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceRateInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 rate = s.getUintByKey(getReassuranceRateKey(coverKey));

    if (rate > 0) {
      return rate;
    }

    // Default: 25%
    return 2500;
  }
```
</details>

### getReassuranceKey

Hash key of the reassurance for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getReassuranceKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE, coverKey));
  }
```
</details>

### getReassuranceRateKey

Hash key of the reassurance rate for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getReassuranceRateKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceRateKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, coverKey));
  }
```
</details>

### getReassuranceWeightKey

Hash key of the reassurance weight for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getReassuranceWeightKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceWeightKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, coverKey));
  }
```
</details>

### isCoverNormalInternal

Indicates whether the specified cover and all associated products are "normal".

```solidity
function isCoverNormalInternal(IStore s, bytes32 coverKey) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 

**Returns**

Returns false if any associated product isn't normal.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isCoverNormalInternal(IStore s, bytes32 coverKey) external view returns (bool) {
    uint256 incidentDate;

    bool supportsProducts = supportsProductsInternal(s, coverKey);

    if (supportsProducts == false) {
      incidentDate = getActiveIncidentDateInternal(s, coverKey, ProtoUtilV1.PRODUCT_KEY_INTENTIONALLY_EMPTY);
      return getProductStatusOfInternal(s, coverKey, ProtoUtilV1.PRODUCT_KEY_INTENTIONALLY_EMPTY, incidentDate) == ProductStatus.Normal;
    }

    bytes32[] memory products = _getProducts(s, coverKey);

    for (uint256 i = 0; i < products.length; i++) {
      incidentDate = getActiveIncidentDateInternal(s, coverKey, products[i]);
      bool isNormal = getProductStatusOfInternal(s, coverKey, products[i], incidentDate) == ProductStatus.Normal;

      if (!isNormal) {
        return false;
      }
    }

    return true;
  }
```
</details>

### getProductStatusInternal

Gets product status of the given cover product.
 0 - normal
 1 - stopped, can not purchase covers or add liquidity
 2 - reporting, incident happened
 3 - reporting, false reporting
 4 - claimable, claims accepted for payout
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getProductStatusInternal(IStore s, bytes32 coverKey, bytes32 productKey) public view
returns(enum CoverUtilV1.ProductStatus)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProductStatusInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view returns (ProductStatus) {
    uint256 incidentDate = getActiveIncidentDateInternal(s, coverKey, productKey);
    return getProductStatusOfInternal(s, coverKey, productKey, incidentDate);
  }
```
</details>

### getProductStatusOfInternal

Returns current status a given cover product as `ProductStatus`.
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getProductStatusOfInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
returns(enum CoverUtilV1.ProductStatus)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProductStatusOfInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (ProductStatus) {
    uint256 value = s.getUintByKey(getProductStatusOfKey(coverKey, productKey, incidentDate));
    return ProductStatus(value);
  }
```
</details>

### getProductStatusOfKey

Hash key of the product status of (the given cover, product, and incident date)
 for historical significance. This must not be reset during finalization.
 Warning: this function does not validate the input arguments.

```solidity
function getProductStatusOfKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProductStatusOfKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_STATUS, coverKey, productKey, incidentDate));
  }
```
</details>

### getCoverLiquidityStakeKey

Hash key of the stakes (collectively added by liquidity providers) of the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getCoverLiquidityStakeKey(bytes32 coverKey) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityStakeKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey));
  }
```
</details>

### getLastDepositHeightKey

Hash key of the last stablecoin deposit of the given cover.
 There must be a couple of block heights as an offset
 before withdrawal can be performed (even during a withdrawal window).
 Warning: this function does not validate the cover key supplied.

```solidity
function getLastDepositHeightKey(bytes32 coverKey) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLastDepositHeightKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_DEPOSIT_HEIGHTS, coverKey));
  }
```
</details>

### getCoverLiquidityStakeIndividualKey

Hash key of the individual stake (added by an LP) for the given cover and account.
 Warning: this function does not validate the input arguments.

```solidity
function getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| account | address | Enter the account to obtain the hash key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey, account));
  }
```
</details>

### getBlacklistKey

Hash key of the blacklisted accounts for the given cover.
 Blacklisted accounts are forbidden to receive claims payout.
 Warning: this function does not validate the input arguments.

```solidity
function getBlacklistKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter the trigger incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBlacklistKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CLAIM_BLACKLIST, coverKey, productKey, incidentDate));
  }
```
</details>

### getTotalLiquidityUnderProtection

Returns the total liquidity commited/under active protection.
 If the cover is a diversified pool, returns sum total of all products' commitments.
 Simply put, commitments are the "totalSupply" of cxTokens that haven't yet expired.
 Note that cxTokens can be precise to 18 decimal places.
 If the protocol's stablecoin has a different precision,
 you must tell this function explicitly when you call it.

```solidity
function getTotalLiquidityUnderProtection(IStore s, bytes32 coverKey, uint256 precision) external view
returns(total uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| precision | uint256 | Specify the protocol stablecoin precision. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getTotalLiquidityUnderProtection(
    IStore s,
    bytes32 coverKey,
    uint256 precision
  ) external view returns (uint256 total) {
    bool supportsProducts = supportsProductsInternal(s, coverKey);

    if (supportsProducts == false) {
      return getActiveLiquidityUnderProtection(s, coverKey, ProtoUtilV1.PRODUCT_KEY_INTENTIONALLY_EMPTY, precision);
    }

    bytes32[] memory products = _getProducts(s, coverKey);

    for (uint256 i = 0; i < products.length; i++) {
      total += getActiveLiquidityUnderProtection(s, coverKey, products[i], precision);
    }
  }
```
</details>

### _getProducts

```solidity
function _getProducts(IStore s, bytes32 coverKey) private view
returns(products bytes32[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getProducts(IStore s, bytes32 coverKey) private view returns (bytes32[] memory products) {
    return s.getBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey);
  }
```
</details>

### getActiveLiquidityUnderProtection

Returns the total liquidity commited/under active protection.
 If the cover is a diversified pool, you must a provide product key.
 Simply put, commitments are the "totalSupply" of cxTokens that haven't yet expired.
 Note that cxTokens are precise to 18 decimal places.
 If the protocol's stablecoin has a different precision,
 you must tell this function explicitly when you call it.

```solidity
function getActiveLiquidityUnderProtection(IStore s, bytes32 coverKey, bytes32 productKey, uint256 adjustPrecision) public view
returns(total uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| adjustPrecision | uint256 | Specify the protocol stablecoin precision. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getActiveLiquidityUnderProtection(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 adjustPrecision
  ) public view returns (uint256 total) {
    (uint256 current, uint256 expiryDate) = _getCurrentCommitment(s, coverKey, productKey);
    uint256 future = _getFutureCommitments(s, coverKey, productKey, expiryDate);

    total = current + future;

    // @caution:
    // Adjusting precision results in truncation and data loss.
    //
    // Can also open a can of worms if the protocol stablecoin
    // address needs to be updated in the future.
    total = (total * adjustPrecision) / ProtoUtilV1.CXTOKEN_PRECISION;
  }
```
</details>

### _getCurrentCommitment

Gets current commitment of a given cover product.
 <br /> <br />
 If there is no incident, should return zero.

```solidity
function _getCurrentCommitment(IStore s, bytes32 coverKey, bytes32 productKey) private view
returns(amount uint256, expiryDate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 

**Returns**

amount The current commitment amount.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCurrentCommitment(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) private view returns (uint256 amount, uint256 expiryDate) {
    uint256 incidentDateIfAny = getActiveIncidentDateInternal(s, coverKey, productKey);

    // There isn't any incident for this cover
    // and therefore no need to pay
    if (incidentDateIfAny == 0) {
      return (0, 0);
    }

    expiryDate = _getMonthEndDate(incidentDateIfAny);
    ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, coverKey, productKey, expiryDate));

    if (address(cxToken) != address(0)) {
      amount = cxToken.totalSupply();
    }
  }
```
</details>

### _getFutureCommitments

Gets future commitment of a given cover product.

```solidity
function _getFutureCommitments(IStore s, bytes32 coverKey, bytes32 productKey, uint256 excludedExpiryDate) private view
returns(sum uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| excludedExpiryDate | uint256 | Enter expiry date (from current commitment) to exclude | 

**Returns**

sum The total commitment amount.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getFutureCommitments(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 excludedExpiryDate
  ) private view returns (uint256 sum) {
    uint256 maxMonthsToProtect = 3;

    for (uint256 i = 0; i < maxMonthsToProtect; i++) {
      uint256 expiryDate = _getNextMonthEndDate(block.timestamp, i); // solhint-disable-line

      if (expiryDate == excludedExpiryDate || expiryDate <= block.timestamp) {
        // solhint-disable-previous-line
        continue;
      }

      ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, coverKey, productKey, expiryDate));

      if (address(cxToken) != address(0)) {
        sum += cxToken.totalSupply();
      }
    }
  }
```
</details>

### getStake

Returns the total amount staken to this cover (outside of governance).

```solidity
function getStake(IStore s, bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStake(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, coverKey);
  }
```
</details>

### setStatusInternal

Sets the current status of a given cover
 0 - normal
 1 - stopped, can not purchase covers or add liquidity
 2 - reporting, incident happened
 3 - reporting, false reporting
 4 - claimable, claims accepted for payout

```solidity
function setStatusInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, enum CoverUtilV1.ProductStatus status) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 
| status | enum CoverUtilV1.ProductStatus |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setStatusInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    ProductStatus status
  ) external {
    s.setUintByKey(getProductStatusOfKey(coverKey, productKey, incidentDate), uint256(status));
  }
```
</details>

### getExpiryDateInternal

Gets the expiry date based on cover duration

```solidity
function getExpiryDateInternal(uint256 today, uint256 coverDuration) external pure
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
function getExpiryDateInternal(uint256 today, uint256 coverDuration) external pure returns (uint256) {
    // Get the day of the month
    (, , uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(today);

    // Cover duration of 1 month means current month
    // unless today is the 25th calendar day or later
    uint256 monthToAdd = coverDuration - 1;

    if (day >= 25) {
      // Add one month
      monthToAdd += 1;
    }

    return _getNextMonthEndDate(today, monthToAdd);
  }
```
</details>

### _getNextMonthEndDate

```solidity
function _getNextMonthEndDate(uint256 date, uint256 monthsToAdd) private pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| date | uint256 |  | 
| monthsToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getNextMonthEndDate(uint256 date, uint256 monthsToAdd) private pure returns (uint256) {
    uint256 futureDate = BokkyPooBahsDateTimeLibrary.addMonths(date, monthsToAdd);
    return _getMonthEndDate(futureDate);
  }
```
</details>

### _getMonthEndDate

```solidity
function _getMonthEndDate(uint256 date) private pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| date | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getMonthEndDate(uint256 date) private pure returns (uint256) {
    // Get the year and month from the date
    (uint256 year, uint256 month, ) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);

    // Count the total number of days of that month and year
    uint256 daysInMonth = BokkyPooBahsDateTimeLibrary._getDaysInMonth(year, month);

    // Get the month end date
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, daysInMonth, 23, 59, 59);
  }
```
</details>

### getCxTokenByExpiryDateInternal

Returns the given cover product's cxToken by its expiry date (if available).
 Warning: this function does not validate the input arguments.

```solidity
function getCxTokenByExpiryDateInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 expiryDate) public view
returns(cxToken address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| expiryDate | uint256 | Enter cxToken's expiry date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenByExpiryDateInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiryDate
  ) public view returns (address cxToken) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, coverKey, productKey, expiryDate));
    cxToken = s.getAddress(k);
  }
```
</details>

### checkIfProductRequiresWhitelist

```solidity
function checkIfProductRequiresWhitelist(IStore s, bytes32 coverKey, bytes32 productKey) external view
returns(bool)
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
function checkIfProductRequiresWhitelist(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, productKey);
  }
```
</details>

### checkIfRequiresWhitelist

```solidity
function checkIfRequiresWhitelist(IStore s, bytes32 coverKey) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function checkIfRequiresWhitelist(IStore s, bytes32 coverKey) external view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey);
  }
```
</details>

### supportsProductsInternal

```solidity
function supportsProductsInternal(IStore s, bytes32 coverKey) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function supportsProductsInternal(IStore s, bytes32 coverKey) public view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_SUPPORTS_PRODUCTS, coverKey);
  }
```
</details>

### isValidProductInternal

```solidity
function isValidProductInternal(IStore s, bytes32 coverKey, bytes32 productKey) external view
returns(bool)
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
function isValidProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey);
  }
```
</details>

### isActiveProductInternal

```solidity
function isActiveProductInternal(IStore s, bytes32 coverKey, bytes32 productKey) external view
returns(bool)
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
function isActiveProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey) == 1;
  }
```
</details>

### disablePolicyInternal

```solidity
function disablePolicyInternal(IStore s, bytes32 coverKey, bytes32 productKey, bool status) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| status | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disablePolicyInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    bool status
  ) external {
    bytes32 key = getPolicyDisabledKey(coverKey, productKey);
    s.setBoolByKey(key, status);
  }
```
</details>

### isPolicyDisabledInternal

```solidity
function isPolicyDisabledInternal(IStore s, bytes32 coverKey, bytes32 productKey) external view
returns(bool)
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
function isPolicyDisabledInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    bytes32 key = getPolicyDisabledKey(coverKey, productKey);
    return s.getBoolByKey(key);
  }
```
</details>

### getPolicyDisabledKey

Hash key of the "disabled policy flag" for the given cover product.
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getPolicyDisabledKey(bytes32 coverKey, bytes32 productKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyDisabledKey(bytes32 coverKey, bytes32 productKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_POLICY_DISABLED, coverKey, productKey));
  }
```
</details>

### getActiveIncidentDateInternal

Gets the latest and "active" incident date of a cover product.
 Note that after "resolve" is invoked, incident date is reset.
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getActiveIncidentDateInternal(IStore s, bytes32 coverKey, bytes32 productKey) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getActiveIncidentDateInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, productKey);
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
