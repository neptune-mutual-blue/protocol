# CoverUtilV1.sol

View Source: [contracts/libraries/CoverUtilV1.sol](../contracts/libraries/CoverUtilV1.sol)

**CoverUtilV1**

**Enums**
### CoverStatus

```js
enum CoverStatus {
 Normal,
 Stopped,
 IncidentHappened,
 FalseReporting,
 Claimable
}
```

## Functions

- [getCoverOwner(IStore s, bytes32 key)](#getcoverowner)
- [_getCoverOwner(IStore s, bytes32 key)](#_getcoverowner)
- [getCoverFee(IStore s)](#getcoverfee)
- [getMinCoverCreationStake(IStore s)](#getmincovercreationstake)
- [getMinStakeToAddLiquidity(IStore s)](#getminstaketoaddliquidity)
- [getMinLiquidityPeriod(IStore s)](#getminliquidityperiod)
- [getClaimPeriod(IStore s)](#getclaimperiod)
- [getCoverPoolSummaryInternal(IStore s, bytes32 key)](#getcoverpoolsummaryinternal)
- [getCoverStatus(IStore s, bytes32 key)](#getcoverstatus)
- [getStatus(IStore s, bytes32 key)](#getstatus)
- [getCoverPoolLiquidity(IStore s, bytes32 key)](#getcoverpoolliquidity)
- [getCoverLiquidityKey(bytes32 coverKey)](#getcoverliquiditykey)
- [getCoverLiquidityAddedKey(bytes32 coverKey, address account)](#getcoverliquidityaddedkey)
- [getCoverLiquidityReleaseDateKey(bytes32 coverKey, address account)](#getcoverliquidityreleasedatekey)
- [getCoverLiquidityStakeKey(bytes32 coverKey)](#getcoverliquiditystakekey)
- [getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account)](#getcoverliquiditystakeindividualkey)
- [getCoverTotalLentKey(bytes32 coverKey)](#getcovertotallentkey)
- [getCommitmentKey(bytes32 coverKey, uint256 expiryDate)](#getcommitmentkey)
- [getCoverLiquidityCommitted(IStore s, bytes32 key)](#getcoverliquiditycommitted)
- [getCoverLiquidityCommitmentInfo(IStore s, bytes32 key)](#getcoverliquiditycommitmentinfo)
- [getCommitmentsUnderReporting(IStore s, bytes32 key)](#getcommitmentsunderreporting)
- [getCurrentCommitments(IStore s, bytes32 key)](#getcurrentcommitments)
- [getStake(IStore s, bytes32 key)](#getstake)
- [setStatus(IStore s, bytes32 key, enum CoverUtilV1.CoverStatus status)](#setstatus)
- [getReassuranceAmountInternal(IStore s, bytes32 key)](#getreassuranceamountinternal)
- [getExpiryDateInternal(uint256 today, uint256 coverDuration)](#getexpirydateinternal)
- [_getNextMonthEndDate(uint256 date, uint256 monthsToAdd)](#_getnextmonthenddate)
- [_getMonthEndDate(uint256 date)](#_getmonthenddate)
- [getActiveIncidentDateInternal(IStore s, bytes32 key)](#getactiveincidentdateinternal)
- [getCxTokenByExpiryDateInternal(IStore s, bytes32 key, uint256 expiryDate)](#getcxtokenbyexpirydateinternal)

### getCoverOwner

```solidity
function getCoverOwner(IStore s, bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverOwner(IStore s, bytes32 key) external view returns (address) {
    return _getCoverOwner(s, key);
  }
```
</details>

### _getCoverOwner

```solidity
function _getCoverOwner(IStore s, bytes32 key) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCoverOwner(IStore s, bytes32 key) private view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);
  }
```
</details>

### getCoverFee

```solidity
function getCoverFee(IStore s) external view
returns(fee uint256, minCoverCreationStake uint256, minStakeToAddLiquidity uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverFee(IStore s)
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

```solidity
function getMinCoverCreationStake(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

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

### getMinStakeToAddLiquidity

```solidity
function getMinStakeToAddLiquidity(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

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

### getMinLiquidityPeriod

```solidity
function getMinLiquidityPeriod(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinLiquidityPeriod(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_PERIOD);
  }
```
</details>

### getClaimPeriod

```solidity
function getClaimPeriod(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimPeriod(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);
  }
```
</details>

### getCoverPoolSummaryInternal

Returns the values of the given cover key

```solidity
function getCoverPoolSummaryInternal(IStore s, bytes32 key) external view
returns(_values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverPoolSummaryInternal(IStore s, bytes32 key) external view returns (uint256[] memory _values) {
    IPriceDiscovery discovery = s.getPriceDiscoveryContract();

    _values = new uint256[](7);

    _values[0] = getCoverPoolLiquidity(s, key);
    _values[1] = getCoverLiquidityCommitted(s, key);
    _values[2] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);
    _values[3] = discovery.getTokenPriceInStableCoin(address(s.npmToken()), 1 ether);
    _values[4] = s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, key);
    _values[5] = discovery.getTokenPriceInStableCoin(address(s.getAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key)), 1 ether);
    _values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key);
  }
```
</details>

### getCoverStatus

Gets the current status of a given cover
 0 - normal
 1 - stopped, can not purchase covers or add liquidity
 2 - reporting, incident happened
 3 - reporting, false reporting
 4 - claimable, claims accepted for payout

```solidity
function getCoverStatus(IStore s, bytes32 key) external view
returns(enum CoverUtilV1.CoverStatus)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverStatus(IStore s, bytes32 key) external view returns (CoverStatus) {
    return CoverStatus(getStatus(s, key));
  }
```
</details>

### getStatus

```solidity
function getStatus(IStore s, bytes32 key) public view
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
function getStatus(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key);
  }
```
</details>

### getCoverPoolLiquidity

```solidity
function getCoverPoolLiquidity(IStore s, bytes32 key) public view
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
function getCoverPoolLiquidity(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKey(getCoverLiquidityKey(key));
  }
```
</details>

### getCoverLiquidityKey

```solidity
function getCoverLiquidityKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey));
  }
```
</details>

### getCoverLiquidityAddedKey

```solidity
function getCoverLiquidityAddedKey(bytes32 coverKey, address account) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityAddedKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_ADDED, coverKey, account));
  }
```
</details>

### getCoverLiquidityReleaseDateKey

```solidity
function getCoverLiquidityReleaseDateKey(bytes32 coverKey, address account) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityReleaseDateKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, account));
  }
```
</details>

### getCoverLiquidityStakeKey

```solidity
function getCoverLiquidityStakeKey(bytes32 coverKey) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityStakeKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey));
  }
```
</details>

### getCoverLiquidityStakeIndividualKey

```solidity
function getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey, account));
  }
```
</details>

### getCoverTotalLentKey

```solidity
function getCoverTotalLentKey(bytes32 coverKey) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverTotalLentKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_STABLECOIN_LENT_TOTAL, coverKey));
  }
```
</details>

### getCommitmentKey

```solidity
function getCommitmentKey(bytes32 coverKey, uint256 expiryDate) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| expiryDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCommitmentKey(bytes32 coverKey, uint256 expiryDate) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_COMMITTED, coverKey, expiryDate));
  }
```
</details>

### getCoverLiquidityCommitted

```solidity
function getCoverLiquidityCommitted(IStore s, bytes32 key) public view
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
function getCoverLiquidityCommitted(IStore s, bytes32 key) public view returns (uint256) {
    (uint256 reporting, uint256 active) = getCoverLiquidityCommitmentInfo(s, key);
    return reporting + active;
  }
```
</details>

### getCoverLiquidityCommitmentInfo

```solidity
function getCoverLiquidityCommitmentInfo(IStore s, bytes32 key) public view
returns(reporting uint256, active uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverLiquidityCommitmentInfo(IStore s, bytes32 key) public view returns (uint256 reporting, uint256 active) {
    reporting = getCommitmentsUnderReporting(s, key);
    active = getCurrentCommitments(s, key);
  }
```
</details>

### getCommitmentsUnderReporting

```solidity
function getCommitmentsUnderReporting(IStore s, bytes32 key) public view
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
function getCommitmentsUnderReporting(IStore s, bytes32 key) public view returns (uint256) {
    uint256 incidentDateIfAny = getActiveIncidentDateInternal(s, key);

    // There isn't any incident for this cover
    // and therefore no need to pay
    if (incidentDateIfAny == 0) {
      return 0;
    }

    uint256 expiryDate = _getMonthEndDate(incidentDateIfAny);
    ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, key, expiryDate));

    if (address(cxToken) != address(0)) {
      return cxToken.totalSupply();
    }

    return 0;
  }
```
</details>

### getCurrentCommitments

```solidity
function getCurrentCommitments(IStore s, bytes32 key) public view
returns(sum uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCurrentCommitments(IStore s, bytes32 key) public view returns (uint256 sum) {
    uint256 maxMonthsToProtect = 3;

    for (uint256 i = 0; i < maxMonthsToProtect; i++) {
      uint256 expiryDate = _getNextMonthEndDate(block.timestamp, i); // solhint-disable-line
      ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, key, expiryDate));

      if (address(cxToken) != address(0)) {
        sum += cxToken.totalSupply();
      }
    }
  }
```
</details>

### getStake

```solidity
function getStake(IStore s, bytes32 key) external view
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
function getStake(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
  }
```
</details>

### setStatus

Sets the current status of a given cover
 0 - normal
 1 - stopped, can not purchase covers or add liquidity
 2 - reporting, incident happened
 3 - reporting, false reporting
 4 - claimable, claims accepted for payout

```solidity
function setStatus(IStore s, bytes32 key, enum CoverUtilV1.CoverStatus status) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| status | enum CoverUtilV1.CoverStatus |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setStatus(
    IStore s,
    bytes32 key,
    CoverStatus status
  ) external {
    s.setUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key, uint256(status));
  }
```
</details>

### getReassuranceAmountInternal

Gets the reassurance amount of the specified cover contract

```solidity
function getReassuranceAmountInternal(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceAmountInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, key);
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

### getActiveIncidentDateInternal

```solidity
function getActiveIncidentDateInternal(IStore s, bytes32 key) public view
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
function getActiveIncidentDateInternal(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, key);
  }
```
</details>

### getCxTokenByExpiryDateInternal

```solidity
function getCxTokenByExpiryDateInternal(IStore s, bytes32 key, uint256 expiryDate) public view
returns(cxToken address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| expiryDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenByExpiryDateInternal(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) public view returns (address cxToken) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate));
    cxToken = s.getAddress(k);
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
