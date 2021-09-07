# BokkyPooBahsDateTimeLibrary.sol

View Source: [contracts/libraries/BokkyPooBahsDateTimeLibrary.sol](../contracts/libraries/BokkyPooBahsDateTimeLibrary.sol)

**BokkyPooBahsDateTimeLibrary**

## Contract Members
**Constants & Variables**

```js
uint256 internal constant SECONDS_PER_DAY;
uint256 internal constant SECONDS_PER_HOUR;
uint256 internal constant SECONDS_PER_MINUTE;
int256 internal constant OFFSET19700101;
uint256 internal constant DOW_MON;
uint256 internal constant DOW_TUE;
uint256 internal constant DOW_WED;
uint256 internal constant DOW_THU;
uint256 internal constant DOW_FRI;
uint256 internal constant DOW_SAT;
uint256 internal constant DOW_SUN;

```

## Functions

- [_daysFromDate(uint256 year, uint256 month, uint256 day)](#_daysfromdate)
- [_daysToDate(uint256 _days)](#_daystodate)
- [timestampFromDate(uint256 year, uint256 month, uint256 day)](#timestampfromdate)
- [timestampFromDateTime(uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second)](#timestampfromdatetime)
- [timestampToDate(uint256 timestamp)](#timestamptodate)
- [timestampToDateTime(uint256 timestamp)](#timestamptodatetime)
- [isValidDate(uint256 year, uint256 month, uint256 day)](#isvaliddate)
- [isValidDateTime(uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second)](#isvaliddatetime)
- [isLeapYear(uint256 timestamp)](#isleapyear)
- [_isLeapYear(uint256 year)](#_isleapyear)
- [isWeekDay(uint256 timestamp)](#isweekday)
- [isWeekEnd(uint256 timestamp)](#isweekend)
- [getDaysInMonth(uint256 timestamp)](#getdaysinmonth)
- [_getDaysInMonth(uint256 year, uint256 month)](#_getdaysinmonth)
- [getDayOfWeek(uint256 timestamp)](#getdayofweek)
- [getYear(uint256 timestamp)](#getyear)
- [getMonth(uint256 timestamp)](#getmonth)
- [getDay(uint256 timestamp)](#getday)
- [getHour(uint256 timestamp)](#gethour)
- [getMinute(uint256 timestamp)](#getminute)
- [getSecond(uint256 timestamp)](#getsecond)
- [addYears(uint256 timestamp, uint256 _years)](#addyears)
- [addMonths(uint256 timestamp, uint256 _months)](#addmonths)
- [addDays(uint256 timestamp, uint256 _days)](#adddays)
- [addHours(uint256 timestamp, uint256 _hours)](#addhours)
- [addMinutes(uint256 timestamp, uint256 _minutes)](#addminutes)
- [addSeconds(uint256 timestamp, uint256 _seconds)](#addseconds)
- [subYears(uint256 timestamp, uint256 _years)](#subyears)
- [subMonths(uint256 timestamp, uint256 _months)](#submonths)
- [subDays(uint256 timestamp, uint256 _days)](#subdays)
- [subHours(uint256 timestamp, uint256 _hours)](#subhours)
- [subMinutes(uint256 timestamp, uint256 _minutes)](#subminutes)
- [subSeconds(uint256 timestamp, uint256 _seconds)](#subseconds)
- [diffYears(uint256 fromTimestamp, uint256 toTimestamp)](#diffyears)
- [diffMonths(uint256 fromTimestamp, uint256 toTimestamp)](#diffmonths)
- [diffDays(uint256 fromTimestamp, uint256 toTimestamp)](#diffdays)
- [diffHours(uint256 fromTimestamp, uint256 toTimestamp)](#diffhours)
- [diffMinutes(uint256 fromTimestamp, uint256 toTimestamp)](#diffminutes)
- [diffSeconds(uint256 fromTimestamp, uint256 toTimestamp)](#diffseconds)

### _daysFromDate

```js
function _daysFromDate(uint256 year, uint256 month, uint256 day) internal pure
returns(_days uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 

### _daysToDate

```js
function _daysToDate(uint256 _days) internal pure
returns(year uint256, month uint256, day uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _days | uint256 |  | 

### timestampFromDate

```js
function timestampFromDate(uint256 year, uint256 month, uint256 day) internal pure
returns(timestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 

### timestampFromDateTime

```js
function timestampFromDateTime(uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second) internal pure
returns(timestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 
| hour | uint256 |  | 
| minute | uint256 |  | 
| second | uint256 |  | 

### timestampToDate

```js
function timestampToDate(uint256 timestamp) internal pure
returns(year uint256, month uint256, day uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### timestampToDateTime

```js
function timestampToDateTime(uint256 timestamp) internal pure
returns(year uint256, month uint256, day uint256, hour uint256, minute uint256, second uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### isValidDate

```js
function isValidDate(uint256 year, uint256 month, uint256 day) internal pure
returns(valid bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 

### isValidDateTime

```js
function isValidDateTime(uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second) internal pure
returns(valid bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 
| hour | uint256 |  | 
| minute | uint256 |  | 
| second | uint256 |  | 

### isLeapYear

```js
function isLeapYear(uint256 timestamp) internal pure
returns(leapYear bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### _isLeapYear

```js
function _isLeapYear(uint256 year) internal pure
returns(leapYear bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 

### isWeekDay

```js
function isWeekDay(uint256 timestamp) internal pure
returns(weekDay bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### isWeekEnd

```js
function isWeekEnd(uint256 timestamp) internal pure
returns(weekEnd bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### getDaysInMonth

```js
function getDaysInMonth(uint256 timestamp) internal pure
returns(daysInMonth uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### _getDaysInMonth

```js
function _getDaysInMonth(uint256 year, uint256 month) internal pure
returns(daysInMonth uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 

### getDayOfWeek

```js
function getDayOfWeek(uint256 timestamp) internal pure
returns(dayOfWeek uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### getYear

```js
function getYear(uint256 timestamp) internal pure
returns(year uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### getMonth

```js
function getMonth(uint256 timestamp) internal pure
returns(month uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### getDay

```js
function getDay(uint256 timestamp) internal pure
returns(day uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### getHour

```js
function getHour(uint256 timestamp) internal pure
returns(hour uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### getMinute

```js
function getMinute(uint256 timestamp) internal pure
returns(minute uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### getSecond

```js
function getSecond(uint256 timestamp) internal pure
returns(second uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

### addYears

```js
function addYears(uint256 timestamp, uint256 _years) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _years | uint256 |  | 

### addMonths

```js
function addMonths(uint256 timestamp, uint256 _months) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _months | uint256 |  | 

### addDays

```js
function addDays(uint256 timestamp, uint256 _days) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _days | uint256 |  | 

### addHours

```js
function addHours(uint256 timestamp, uint256 _hours) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _hours | uint256 |  | 

### addMinutes

```js
function addMinutes(uint256 timestamp, uint256 _minutes) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _minutes | uint256 |  | 

### addSeconds

```js
function addSeconds(uint256 timestamp, uint256 _seconds) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _seconds | uint256 |  | 

### subYears

```js
function subYears(uint256 timestamp, uint256 _years) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _years | uint256 |  | 

### subMonths

```js
function subMonths(uint256 timestamp, uint256 _months) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _months | uint256 |  | 

### subDays

```js
function subDays(uint256 timestamp, uint256 _days) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _days | uint256 |  | 

### subHours

```js
function subHours(uint256 timestamp, uint256 _hours) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _hours | uint256 |  | 

### subMinutes

```js
function subMinutes(uint256 timestamp, uint256 _minutes) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _minutes | uint256 |  | 

### subSeconds

```js
function subSeconds(uint256 timestamp, uint256 _seconds) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _seconds | uint256 |  | 

### diffYears

```js
function diffYears(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_years uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

### diffMonths

```js
function diffMonths(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_months uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

### diffDays

```js
function diffDays(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_days uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

### diffHours

```js
function diffHours(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_hours uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

### diffMinutes

```js
function diffMinutes(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_minutes uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

### diffSeconds

```js
function diffSeconds(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_seconds uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

## Contracts

* [Address](Address.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [cTokenFactoryLibV1](cTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [PriceDiscovery](PriceDiscovery.md)
* [Processor](Processor.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
