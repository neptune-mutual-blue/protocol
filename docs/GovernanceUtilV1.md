# GovernanceUtilV1.sol

View Source: [contracts/libraries/GovernanceUtilV1.sol](../contracts/libraries/GovernanceUtilV1.sol)

**GovernanceUtilV1**

## Functions

- [getReportingPeriodInternal(IStore s, bytes32 coverKey)](#getreportingperiodinternal)
- [getReportingBurnRateInternal(IStore s)](#getreportingburnrateinternal)
- [getGovernanceReporterCommissionInternal(IStore s)](#getgovernancereportercommissioninternal)
- [getPlatformCoverFeeRateInternal(IStore s)](#getplatformcoverfeerateinternal)
- [getClaimReporterCommissionInternal(IStore s)](#getclaimreportercommissioninternal)
- [getMinReportingStakeInternal(IStore s, bytes32 coverKey)](#getminreportingstakeinternal)
- [getResolutionTimestampInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#getresolutiontimestampinternal)
- [getReporterInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getreporterinternal)
- [getStakesInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getstakesinternal)
- [_getReporterKey(bytes32 coverKey, bytes32 productKey)](#_getreporterkey)
- [_getIncidentOccurredStakesKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#_getincidentoccurredstakeskey)
- [_getClaimPayoutsKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#_getclaimpayoutskey)
- [_getReassurancePayoutKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#_getreassurancepayoutkey)
- [_getIndividualIncidentOccurredStakeKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account)](#_getindividualincidentoccurredstakekey)
- [_getDisputerKey(bytes32 coverKey, bytes32 productKey)](#_getdisputerkey)
- [_getFalseReportingStakesKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#_getfalsereportingstakeskey)
- [_getIndividualFalseReportingStakeKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account)](#_getindividualfalsereportingstakekey)
- [getStakesOfInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getstakesofinternal)
- [getResolutionInfoForInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getresolutioninfoforinternal)
- [getUnstakeInfoForInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getunstakeinfoforinternal)
- [getReportingUnstakenAmountInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getreportingunstakenamountinternal)
- [updateUnstakeDetailsInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 originalStake, uint256 reward, uint256 burned, uint256 reporterFee)](#updateunstakedetailsinternal)
- [_updateProductStatusBeforeResolutionInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#_updateproductstatusbeforeresolutioninternal)
- [addAttestationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate, uint256 stake)](#addattestationinternal)
- [getAttestationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getattestationinternal)
- [addRefutationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate, uint256 stake)](#addrefutationinternal)
- [getHasDisputeKeyInternal(bytes32 coverKey, bytes32 productKey)](#gethasdisputekeyinternal)
- [getHasFinalizedKeyInternal(bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#gethasfinalizedkeyinternal)
- [getRefutationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate)](#getrefutationinternal)
- [getCoolDownPeriodInternal(IStore s, bytes32 coverKey)](#getcooldownperiodinternal)
- [getResolutionDeadlineInternal(IStore s, bytes32 coverKey, bytes32 productKey)](#getresolutiondeadlineinternal)
- [addClaimPayoutsInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 claimed)](#addclaimpayoutsinternal)
- [getClaimPayoutsInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getclaimpayoutsinternal)
- [getReassurancePayoutInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getreassurancepayoutinternal)
- [addReassurancePayoutInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 capitalized)](#addreassurancepayoutinternal)
- [getReassuranceTransferrableInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#getreassurancetransferrableinternal)
- [mustNotExceedNpmThreshold(uint256 amount)](#mustnotexceednpmthreshold)

### getReportingPeriodInternal

Gets the reporting period for the given cover.
 Warning: this function does not validate the input arguments.

```solidity
function getReportingPeriodInternal(IStore s, bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReportingPeriodInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, coverKey);
  }
```
</details>

### getReportingBurnRateInternal

Gets the NPM stake burn rate (upon resolution) for the given cover.
 Warning: this function does not validate the input arguments.

```solidity
function getReportingBurnRateInternal(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReportingBurnRateInternal(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE);
  }
```
</details>

### getGovernanceReporterCommissionInternal

Gets the "valid" reporter's NPM commission rate
 (upon each unstake claim invoked by individual "valid" stakers)
 for the given cover.
 Warning: this function does not validate the input arguments.

```solidity
function getGovernanceReporterCommissionInternal(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getGovernanceReporterCommissionInternal(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION);
  }
```
</details>

### getPlatformCoverFeeRateInternal

Gets the protocol's NPM commission rate
 (upon each unstake claim invoked by individual "valid" stakers)
 for the given cover.
 Warning: this function does not validate the input arguments.

```solidity
function getPlatformCoverFeeRateInternal(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPlatformCoverFeeRateInternal(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_PLATFORM_FEE);
  }
```
</details>

### getClaimReporterCommissionInternal

Gets the "valid" reporter's stablecoin commission rate
 on protocol's earnings (upon each claim payout received by claimants)
 for the given cover.
 Warning: this function does not validate the input arguments.

```solidity
function getClaimReporterCommissionInternal(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimReporterCommissionInternal(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_REPORTER_COMMISSION);
  }
```
</details>

### getMinReportingStakeInternal

Gets the minimum units of NPM tokens required to report the supplied cover.
 Warning: this function does not validate the input arguments.

```solidity
function getMinReportingStakeInternal(IStore s, bytes32 coverKey) external view
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
function getMinReportingStakeInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 fb = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE);
    uint256 custom = s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey);

    return custom > 0 ? custom : fb;
  }
```
</details>

### getResolutionTimestampInternal

Gets a cover's resolution timestamp.
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getResolutionTimestampInternal(IStore s, bytes32 coverKey, bytes32 productKey) external view
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
function getResolutionTimestampInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey, productKey);
  }
```
</details>

### getReporterInternal

Gets the given cover incident's reporter.
 Note that this keeps changing between "first reporter"
 and "candidate reporter" until resolution is achieved.
 <br /> <br />
 [Read More](https://docs.neptunemutual.com/covers/cover-reporting)
 <br /> <br />
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getReporterInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(address)
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
function getReporterInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (address) {
    CoverUtilV1.ProductStatus status = s.getProductStatusOfInternal(coverKey, productKey, incidentDate);
    bool incidentHappened = status == CoverUtilV1.ProductStatus.IncidentHappened || status == CoverUtilV1.ProductStatus.Claimable;
    bytes32 prefix = incidentHappened ? ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES : ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO;

    return s.getAddressByKeys(prefix, coverKey, productKey);
  }
```
</details>

### getStakesInternal

Returns stakes of the given cover product's incident.
 Warning: this function does not validate the input arguments.

```solidity
function getStakesInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
returns(yes uint256, no uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakesInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));
    no = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));
  }
```
</details>

### _getReporterKey

Hash key of the reporter for the given cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getReporterKey(bytes32 coverKey, bytes32 productKey) private pure
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
function _getReporterKey(bytes32 coverKey, bytes32 productKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, productKey));
  }
```
</details>

### _getIncidentOccurredStakesKey

Hash key of the stakes added under `Incident Happened` camp for the given cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getIncidentOccurredStakesKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getIncidentOccurredStakesKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, productKey, incidentDate));
  }
```
</details>

### _getClaimPayoutsKey

Hash key of the claims payout given for the supplied cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getClaimPayoutsKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getClaimPayoutsKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_CLAIM_PAYOUTS, coverKey, productKey, incidentDate));
  }
```
</details>

### _getReassurancePayoutKey

Hash key of the reassurance payout granted for the supplied cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getReassurancePayoutKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getReassurancePayoutKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE_PAYOUT, coverKey, productKey, incidentDate));
  }
```
</details>

### _getIndividualIncidentOccurredStakeKey

Hash key of an individual's stakes added under `Incident Happened` camp for the given cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getIndividualIncidentOccurredStakeKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getIndividualIncidentOccurredStakeKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES, coverKey, productKey, incidentDate, account));
  }
```
</details>

### _getDisputerKey

Hash key of the "candidate reporter" for the supplied cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getDisputerKey(bytes32 coverKey, bytes32 productKey) private pure
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
function _getDisputerKey(bytes32 coverKey, bytes32 productKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey, productKey));
  }
```
</details>

### _getFalseReportingStakesKey

Hash key of the stakes added under `False Reporting` camp for the given cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getFalseReportingStakesKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getFalseReportingStakesKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey, productKey, incidentDate));
  }
```
</details>

### _getIndividualFalseReportingStakeKey

Hash key of an individual's stakes added under `False Reporting` camp for the given cover product.
 Warning: this function does not validate the input arguments.

```solidity
function _getIndividualFalseReportingStakeKey(bytes32 coverKey, bytes32 productKey, uint256 incidentDate, address account) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getIndividualFalseReportingStakeKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO, coverKey, productKey, incidentDate, account));
  }
```
</details>

### getStakesOfInternal

Returns stakes of the given account for a cover product's incident.
 Warning: this function does not validate the input arguments.

```solidity
function getStakesOfInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
returns(yes uint256, no uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| account | address | Specify the account to get stakes | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakesOfInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    yes = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, productKey, incidentDate, account));
    no = s.getUintByKey(_getIndividualFalseReportingStakeKey(coverKey, productKey, incidentDate, account));
  }
```
</details>

### getResolutionInfoForInternal

Returns resolution info of the given account
 for a cover product's incident.
 Warning: this function does not validate the input arguments.

```solidity
function getResolutionInfoForInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
returns(totalStakeInWinningCamp uint256, totalStakeInLosingCamp uint256, myStakeInWinningCamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| account | address | Specify the account to get stakes | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionInfoForInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  )
    public
    view
    returns (
      uint256 totalStakeInWinningCamp,
      uint256 totalStakeInLosingCamp,
      uint256 myStakeInWinningCamp
    )
  {
    (uint256 yes, uint256 no) = getStakesInternal(s, coverKey, productKey, incidentDate);
    (uint256 myYes, uint256 myNo) = getStakesOfInternal(s, account, coverKey, productKey, incidentDate);

    CoverUtilV1.ProductStatus decision = s.getProductStatusOfInternal(coverKey, productKey, incidentDate);
    bool incidentHappened = decision == CoverUtilV1.ProductStatus.IncidentHappened || decision == CoverUtilV1.ProductStatus.Claimable;

    totalStakeInWinningCamp = incidentHappened ? yes : no;
    totalStakeInLosingCamp = incidentHappened ? no : yes;
    myStakeInWinningCamp = incidentHappened ? myYes : myNo;
  }
```
</details>

### getUnstakeInfoForInternal

Returns unstake info of the given account
 for a cover product's incident.
 Warning: this function does not validate the input arguments.

```solidity
function getUnstakeInfoForInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(info struct IUnstakable.UnstakeInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| account | address | Specify the account to get stakes | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUnstakeInfoForInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (IUnstakable.UnstakeInfoType memory info) {
    (info.totalStakeInWinningCamp, info.totalStakeInLosingCamp, info.myStakeInWinningCamp) = getResolutionInfoForInternal(s, account, coverKey, productKey, incidentDate);

    info.unstaken = getReportingUnstakenAmountInternal(s, account, coverKey, productKey, incidentDate);
    require(info.myStakeInWinningCamp > 0, "Nothing to unstake");

    uint256 rewardRatio = (info.myStakeInWinningCamp * ProtoUtilV1.MULTIPLIER) / info.totalStakeInWinningCamp;

    uint256 reward = 0;

    // Incident dates are reset when a reporting is finalized.
    // This check ensures only the people who come to unstake
    // before the finalization will receive rewards
    if (s.getActiveIncidentDateInternal(coverKey, productKey) == incidentDate) {
      // slither-disable-next-line divide-before-multiply
      reward = (info.totalStakeInLosingCamp * rewardRatio) / ProtoUtilV1.MULTIPLIER;
    }

    info.toBurn = (reward * getReportingBurnRateInternal(s)) / ProtoUtilV1.MULTIPLIER;
    info.toReporter = (reward * getGovernanceReporterCommissionInternal(s)) / ProtoUtilV1.MULTIPLIER;
    info.myReward = reward - info.toBurn - info.toReporter;
  }
```
</details>

### getReportingUnstakenAmountInternal

Returns NPM already unstaken by the specified account for a cover incident.
 Warning: this function does not validate the input arguments.

```solidity
function getReportingUnstakenAmountInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| account | address | Specify the account to get stakes | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReportingUnstakenAmountInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, productKey, incidentDate, account));
    return s.getUintByKey(k);
  }
```
</details>

### updateUnstakeDetailsInternal

```solidity
function updateUnstakeDetailsInternal(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 originalStake, uint256 reward, uint256 burned, uint256 reporterFee) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 
| originalStake | uint256 |  | 
| reward | uint256 |  | 
| burned | uint256 |  | 
| reporterFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateUnstakeDetailsInternal(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 originalStake,
    uint256 reward,
    uint256 burned,
    uint256 reporterFee
  ) external {
    // Unstake timestamp of the account
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, coverKey, productKey, incidentDate, account));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // Last unstake timestamp
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, coverKey, productKey, incidentDate));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // ---------------------------------------------------------------------

    // Amount unstaken by the account
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, productKey, incidentDate, account));
    s.setUintByKey(k, originalStake);

    // Amount unstaken by everyone
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, coverKey, productKey, incidentDate));
    s.addUintByKey(k, originalStake);

    // ---------------------------------------------------------------------

    if (reward > 0) {
      // Reward received by the account
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, coverKey, productKey, incidentDate, account));
      s.setUintByKey(k, reward);

      // Total reward received
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, coverKey, productKey, incidentDate));
      s.addUintByKey(k, reward);
    }

    // ---------------------------------------------------------------------

    if (burned > 0) {
      // Total burned
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_BURNED, coverKey, productKey, incidentDate));
      s.addUintByKey(k, burned);
    }

    if (reporterFee > 0) {
      // Total fee paid to the final reporter
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REPORTER_FEE, coverKey, productKey, incidentDate));
      s.addUintByKey(k, reporterFee);
    }
  }
```
</details>

### _updateProductStatusBeforeResolutionInternal

```solidity
function _updateProductStatusBeforeResolutionInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _updateProductStatusBeforeResolutionInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private {
    require(incidentDate > 0, "Invalid incident date");

    uint256 yes = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));
    uint256 no = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));

    if (no > yes) {
      s.setStatusInternal(coverKey, productKey, incidentDate, CoverUtilV1.ProductStatus.FalseReporting);
      return;
    }

    s.setStatusInternal(coverKey, productKey, incidentDate, CoverUtilV1.ProductStatus.IncidentHappened);
  }
```
</details>

### addAttestationInternal

Adds attestation to an incident report

```solidity
function addAttestationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addAttestationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    mustNotExceedNpmThreshold(stake);

    // Add individual stake of the reporter
    s.addUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, productKey, incidentDate, who), stake);

    // All "incident happened" camp witnesses combined
    uint256 currentStake = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));

    // No has reported yet, this is the first report
    if (currentStake == 0) {
      s.setAddressByKey(_getReporterKey(coverKey, productKey), who);
    }

    s.addUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate), stake);
    _updateProductStatusBeforeResolutionInternal(s, coverKey, productKey, incidentDate);

    s.updateStateAndLiquidity(coverKey);
  }
```
</details>

### getAttestationInternal

Returns sum total of NPM staken under `Incident Happened` camp.
 Warning: this function does not validate the input arguments.

```solidity
function getAttestationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| who | address | Specify the account to get attestation info | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAttestationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualIncidentOccurredStakeKey(coverKey, productKey, incidentDate, who));
    totalStake = s.getUintByKey(_getIncidentOccurredStakesKey(coverKey, productKey, incidentDate));
  }
```
</details>

### addRefutationInternal

Adds refutation to an incident report

```solidity
function addRefutationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addRefutationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    mustNotExceedNpmThreshold(stake);

    s.addUintByKey(_getIndividualFalseReportingStakeKey(coverKey, productKey, incidentDate, who), stake);

    uint256 currentStake = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));

    if (currentStake == 0) {
      // The first reporter who disputed
      s.setAddressByKey(_getDisputerKey(coverKey, productKey), who);
      s.setBoolByKey(getHasDisputeKeyInternal(coverKey, productKey), true);
    }

    s.addUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate), stake);
    _updateProductStatusBeforeResolutionInternal(s, coverKey, productKey, incidentDate);

    s.updateStateAndLiquidity(coverKey);
  }
```
</details>

### getHasDisputeKeyInternal

Hash key of the "has dispute flag" for the specified cover product.
 Warning: this function does not validate the input arguments.

```solidity
function getHasDisputeKeyInternal(bytes32 coverKey, bytes32 productKey) public pure
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
function getHasDisputeKeyInternal(bytes32 coverKey, bytes32 productKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_HAS_A_DISPUTE, coverKey, productKey));
  }
```
</details>

### getHasFinalizedKeyInternal

Hash key of the "has finalized flag" for the specified cover product.
 Warning: this function does not validate the input arguments.

```solidity
function getHasFinalizedKeyInternal(bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public pure
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
function getHasFinalizedKeyInternal(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_FINALIZATION, coverKey, productKey, incidentDate));
  }
```
</details>

### getRefutationInternal

Returns sum total of NPM staken under `False Reporting` camp.
 Warning: this function does not validate the input arguments.

```solidity
function getRefutationInternal(IStore s, bytes32 coverKey, bytes32 productKey, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| who | address | Specify the account to get attestation info | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getRefutationInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    myStake = s.getUintByKey(_getIndividualFalseReportingStakeKey(coverKey, productKey, incidentDate, who));
    totalStake = s.getUintByKey(_getFalseReportingStakesKey(coverKey, productKey, incidentDate));
  }
```
</details>

### getCoolDownPeriodInternal

Returns cooldown period. Cooldown period is a defense
 against [collusion and last-block attacks](https://docs.neptunemutual.com/covers/cover-reporting#collusion-and-last-block-attacks).
 Warning: this function does not validate the input arguments.

```solidity
function getCoolDownPeriodInternal(IStore s, bytes32 coverKey) external view
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
function getCoolDownPeriodInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 fromKey = s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey);
    uint256 fallbackValue = s.getUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD);

    return fromKey > 0 ? fromKey : fallbackValue;
  }
```
</details>

### getResolutionDeadlineInternal

The date and time prior to which a governance administrator
 may still initiate a "emergency resolution."
 Warning: this function does not validate the cover and product key supplied.

```solidity
function getResolutionDeadlineInternal(IStore s, bytes32 coverKey, bytes32 productKey) external view
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
function getResolutionDeadlineInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, coverKey, productKey);
  }
```
</details>

### addClaimPayoutsInternal

```solidity
function addClaimPayoutsInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 claimed) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 
| claimed | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addClaimPayoutsInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 claimed
  ) external {
    s.addUintByKey(_getClaimPayoutsKey(coverKey, productKey, incidentDate), claimed);
  }
```
</details>

### getClaimPayoutsInternal

Returns the total amount of payouts awarded to claimants for this incident.
 Warning: this function does not validate the input arguments.

```solidity
function getClaimPayoutsInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimPayoutsInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    return s.getUintByKey(_getClaimPayoutsKey(coverKey, productKey, incidentDate));
  }
```
</details>

### getReassurancePayoutInternal

Returns the total amount of reassurance granted to vault for this incident.
 Warning: this function does not validate the input arguments.

```solidity
function getReassurancePayoutInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassurancePayoutInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (uint256) {
    return s.getUintByKey(_getReassurancePayoutKey(coverKey, productKey, incidentDate));
  }
```
</details>

### addReassurancePayoutInternal

```solidity
function addReassurancePayoutInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate, uint256 capitalized) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 
| capitalized | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addReassurancePayoutInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 capitalized
  ) external {
    s.addUintByKey(_getReassurancePayoutKey(coverKey, productKey, incidentDate), capitalized);
  }
```
</details>

### getReassuranceTransferrableInternal

Returns the remaining reassurance amount that can be transferred
 to the vault following the claim period but prior to finalisation.
 Warning: this function does not validate the input arguments.

```solidity
function getReassuranceTransferrableInternal(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| incidentDate | uint256 | Enter incident date | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceTransferrableInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (uint256) {
    uint256 reassuranceRate = s.getReassuranceRateInternal(coverKey);
    uint256 available = s.getReassuranceAmountInternal(coverKey);
    uint256 reassurancePaid = getReassurancePayoutInternal(s, coverKey, productKey, incidentDate);

    uint256 totalReassurance = available + reassurancePaid;

    uint256 claimsPaid = getClaimPayoutsInternal(s, coverKey, productKey, incidentDate);

    uint256 principal = claimsPaid <= totalReassurance ? claimsPaid : totalReassurance;
    uint256 transferAmount = (principal * reassuranceRate) / ProtoUtilV1.MULTIPLIER;

    return transferAmount - reassurancePaid;
  }
```
</details>

### mustNotExceedNpmThreshold

```solidity
function mustNotExceedNpmThreshold(uint256 amount) public pure
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotExceedNpmThreshold(uint256 amount) public pure {
    require(amount <= ProtoUtilV1.MAX_NPM_STAKE * 1 ether, "Please specify a smaller amount");
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
