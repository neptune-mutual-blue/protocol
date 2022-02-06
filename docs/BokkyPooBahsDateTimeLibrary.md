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

```solidity
function _daysFromDate(uint256 year, uint256 month, uint256 day) internal pure
returns(_days uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _daysFromDate(
    uint256 year,
    uint256 month,
    uint256 day
  ) internal pure returns (uint256 _days) {
    require(year >= 1970);
    int256 _year = int256(year);
    int256 _month = int256(month);
    int256 _day = int256(day);

    int256 __days = _day -
      32075 +
      (1461 * (_year + 4800 + (_month - 14) / 12)) /
      4 +
      (367 * (_month - 2 - ((_month - 14) / 12) * 12)) /
      12 -
      (3 * ((_year + 4900 + (_month - 14) / 12) / 100)) /
      4 -
      OFFSET19700101;

    _days = uint256(__days);
  }
```
</details>

### _daysToDate

```solidity
function _daysToDate(uint256 _days) internal pure
returns(year uint256, month uint256, day uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _days | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _daysToDate(uint256 _days)
    internal
    pure
    returns (
      uint256 year,
      uint256 month,
      uint256 day
    )
  {
    int256 __days = int256(_days);

    int256 L = __days + 68569 + OFFSET19700101;
    int256 N = (4 * L) / 146097;
    L = L - (146097 * N + 3) / 4;
    int256 _year = (4000 * (L + 1)) / 1461001;
    L = L - (1461 * _year) / 4 + 31;
    int256 _month = (80 * L) / 2447;
    int256 _day = L - (2447 * _month) / 80;
    L = _month / 11;
    _month = _month + 2 - 12 * L;
    _year = 100 * (N - 49) + _year + L;

    year = uint256(_year);
    month = uint256(_month);
    day = uint256(_day);
  }
```
</details>

### timestampFromDate

```solidity
function timestampFromDate(uint256 year, uint256 month, uint256 day) internal pure
returns(timestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function timestampFromDate(
    uint256 year,
    uint256 month,
    uint256 day
  ) internal pure returns (uint256 timestamp) {
    timestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY;
  }
```
</details>

### timestampFromDateTime

```solidity
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

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function timestampFromDateTime(
    uint256 year,
    uint256 month,
    uint256 day,
    uint256 hour,
    uint256 minute,
    uint256 second
  ) internal pure returns (uint256 timestamp) {
    timestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + hour * SECONDS_PER_HOUR + minute * SECONDS_PER_MINUTE + second;
  }
```
</details>

### timestampToDate

```solidity
function timestampToDate(uint256 timestamp) internal pure
returns(year uint256, month uint256, day uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function timestampToDate(uint256 timestamp)
    internal
    pure
    returns (
      uint256 year,
      uint256 month,
      uint256 day
    )
  {
    (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }
```
</details>

### timestampToDateTime

```solidity
function timestampToDateTime(uint256 timestamp) internal pure
returns(year uint256, month uint256, day uint256, hour uint256, minute uint256, second uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function timestampToDateTime(uint256 timestamp)
    internal
    pure
    returns (
      uint256 year,
      uint256 month,
      uint256 day,
      uint256 hour,
      uint256 minute,
      uint256 second
    )
  {
    (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    uint256 secs = timestamp % SECONDS_PER_DAY;
    hour = secs / SECONDS_PER_HOUR;
    secs = secs % SECONDS_PER_HOUR;
    minute = secs / SECONDS_PER_MINUTE;
    second = secs % SECONDS_PER_MINUTE;
  }
```
</details>

### isValidDate

```solidity
function isValidDate(uint256 year, uint256 month, uint256 day) internal pure
returns(valid bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 
| day | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isValidDate(
    uint256 year,
    uint256 month,
    uint256 day
  ) internal pure returns (bool valid) {
    if (year >= 1970 && month > 0 && month <= 12) {
      uint256 daysInMonth = _getDaysInMonth(year, month);
      if (day > 0 && day <= daysInMonth) {
        valid = true;
      }
    }
  }
```
</details>

### isValidDateTime

```solidity
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

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isValidDateTime(
    uint256 year,
    uint256 month,
    uint256 day,
    uint256 hour,
    uint256 minute,
    uint256 second
  ) internal pure returns (bool valid) {
    if (isValidDate(year, month, day)) {
      if (hour < 24 && minute < 60 && second < 60) {
        valid = true;
      }
    }
  }
```
</details>

### isLeapYear

```solidity
function isLeapYear(uint256 timestamp) internal pure
returns(leapYear bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isLeapYear(uint256 timestamp) internal pure returns (bool leapYear) {
    (uint256 year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
    leapYear = _isLeapYear(year);
  }
```
</details>

### _isLeapYear

```solidity
function _isLeapYear(uint256 year) internal pure
returns(leapYear bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _isLeapYear(uint256 year) internal pure returns (bool leapYear) {
    leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }
```
</details>

### isWeekDay

```solidity
function isWeekDay(uint256 timestamp) internal pure
returns(weekDay bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isWeekDay(uint256 timestamp) internal pure returns (bool weekDay) {
    weekDay = getDayOfWeek(timestamp) <= DOW_FRI;
  }
```
</details>

### isWeekEnd

```solidity
function isWeekEnd(uint256 timestamp) internal pure
returns(weekEnd bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isWeekEnd(uint256 timestamp) internal pure returns (bool weekEnd) {
    weekEnd = getDayOfWeek(timestamp) >= DOW_SAT;
  }
```
</details>

### getDaysInMonth

```solidity
function getDaysInMonth(uint256 timestamp) internal pure
returns(daysInMonth uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDaysInMonth(uint256 timestamp) internal pure returns (uint256 daysInMonth) {
    (uint256 year, uint256 month, ) = _daysToDate(timestamp / SECONDS_PER_DAY);
    daysInMonth = _getDaysInMonth(year, month);
  }
```
</details>

### _getDaysInMonth

```solidity
function _getDaysInMonth(uint256 year, uint256 month) internal pure
returns(daysInMonth uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| year | uint256 |  | 
| month | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getDaysInMonth(uint256 year, uint256 month) internal pure returns (uint256 daysInMonth) {
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      daysInMonth = 31;
    } else if (month != 2) {
      daysInMonth = 30;
    } else {
      daysInMonth = _isLeapYear(year) ? 29 : 28;
    }
  }
```
</details>

### getDayOfWeek

```solidity
function getDayOfWeek(uint256 timestamp) internal pure
returns(dayOfWeek uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDayOfWeek(uint256 timestamp) internal pure returns (uint256 dayOfWeek) {
    uint256 _days = timestamp / SECONDS_PER_DAY;
    dayOfWeek = ((_days + 3) % 7) + 1;
  }
```
</details>

### getYear

```solidity
function getYear(uint256 timestamp) internal pure
returns(year uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getYear(uint256 timestamp) internal pure returns (uint256 year) {
    (year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }
```
</details>

### getMonth

```solidity
function getMonth(uint256 timestamp) internal pure
returns(month uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMonth(uint256 timestamp) internal pure returns (uint256 month) {
    (, month, ) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }
```
</details>

### getDay

```solidity
function getDay(uint256 timestamp) internal pure
returns(day uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDay(uint256 timestamp) internal pure returns (uint256 day) {
    (, , day) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }
```
</details>

### getHour

```solidity
function getHour(uint256 timestamp) internal pure
returns(hour uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getHour(uint256 timestamp) internal pure returns (uint256 hour) {
    uint256 secs = timestamp % SECONDS_PER_DAY;
    hour = secs / SECONDS_PER_HOUR;
  }
```
</details>

### getMinute

```solidity
function getMinute(uint256 timestamp) internal pure
returns(minute uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinute(uint256 timestamp) internal pure returns (uint256 minute) {
    uint256 secs = timestamp % SECONDS_PER_HOUR;
    minute = secs / SECONDS_PER_MINUTE;
  }
```
</details>

### getSecond

```solidity
function getSecond(uint256 timestamp) internal pure
returns(second uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSecond(uint256 timestamp) internal pure returns (uint256 second) {
    second = timestamp % SECONDS_PER_MINUTE;
  }
```
</details>

### addYears

```solidity
function addYears(uint256 timestamp, uint256 _years) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _years | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addYears(uint256 timestamp, uint256 _years) internal pure returns (uint256 newTimestamp) {
    (uint256 year, uint256 month, uint256 day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    year += _years;
    uint256 daysInMonth = _getDaysInMonth(year, month);
    if (day > daysInMonth) {
      day = daysInMonth;
    }
    newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + (timestamp % SECONDS_PER_DAY);
    require(newTimestamp >= timestamp);
  }
```
</details>

### addMonths

```solidity
function addMonths(uint256 timestamp, uint256 _months) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _months | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMonths(uint256 timestamp, uint256 _months) internal pure returns (uint256 newTimestamp) {
    (uint256 year, uint256 month, uint256 day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    month += _months;
    year += (month - 1) / 12;
    month = ((month - 1) % 12) + 1;
    uint256 daysInMonth = _getDaysInMonth(year, month);
    if (day > daysInMonth) {
      day = daysInMonth;
    }
    newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + (timestamp % SECONDS_PER_DAY);
    require(newTimestamp >= timestamp);
  }
```
</details>

### addDays

```solidity
function addDays(uint256 timestamp, uint256 _days) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _days | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addDays(uint256 timestamp, uint256 _days) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp + _days * SECONDS_PER_DAY;
    require(newTimestamp >= timestamp);
  }
```
</details>

### addHours

```solidity
function addHours(uint256 timestamp, uint256 _hours) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _hours | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addHours(uint256 timestamp, uint256 _hours) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp + _hours * SECONDS_PER_HOUR;
    require(newTimestamp >= timestamp);
  }
```
</details>

### addMinutes

```solidity
function addMinutes(uint256 timestamp, uint256 _minutes) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _minutes | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMinutes(uint256 timestamp, uint256 _minutes) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp + _minutes * SECONDS_PER_MINUTE;
    require(newTimestamp >= timestamp);
  }
```
</details>

### addSeconds

```solidity
function addSeconds(uint256 timestamp, uint256 _seconds) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _seconds | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addSeconds(uint256 timestamp, uint256 _seconds) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp + _seconds;
    require(newTimestamp >= timestamp);
  }
```
</details>

### subYears

```solidity
function subYears(uint256 timestamp, uint256 _years) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _years | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subYears(uint256 timestamp, uint256 _years) internal pure returns (uint256 newTimestamp) {
    (uint256 year, uint256 month, uint256 day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    year -= _years;
    uint256 daysInMonth = _getDaysInMonth(year, month);
    if (day > daysInMonth) {
      day = daysInMonth;
    }
    newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + (timestamp % SECONDS_PER_DAY);
    require(newTimestamp <= timestamp);
  }
```
</details>

### subMonths

```solidity
function subMonths(uint256 timestamp, uint256 _months) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _months | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subMonths(uint256 timestamp, uint256 _months) internal pure returns (uint256 newTimestamp) {
    (uint256 year, uint256 month, uint256 day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    uint256 yearMonth = year * 12 + (month - 1) - _months;
    year = yearMonth / 12;
    month = (yearMonth % 12) + 1;
    uint256 daysInMonth = _getDaysInMonth(year, month);
    if (day > daysInMonth) {
      day = daysInMonth;
    }
    newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + (timestamp % SECONDS_PER_DAY);
    require(newTimestamp <= timestamp);
  }
```
</details>

### subDays

```solidity
function subDays(uint256 timestamp, uint256 _days) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _days | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subDays(uint256 timestamp, uint256 _days) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp - _days * SECONDS_PER_DAY;
    require(newTimestamp <= timestamp);
  }
```
</details>

### subHours

```solidity
function subHours(uint256 timestamp, uint256 _hours) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _hours | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subHours(uint256 timestamp, uint256 _hours) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp - _hours * SECONDS_PER_HOUR;
    require(newTimestamp <= timestamp);
  }
```
</details>

### subMinutes

```solidity
function subMinutes(uint256 timestamp, uint256 _minutes) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _minutes | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subMinutes(uint256 timestamp, uint256 _minutes) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp - _minutes * SECONDS_PER_MINUTE;
    require(newTimestamp <= timestamp);
  }
```
</details>

### subSeconds

```solidity
function subSeconds(uint256 timestamp, uint256 _seconds) internal pure
returns(newTimestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timestamp | uint256 |  | 
| _seconds | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subSeconds(uint256 timestamp, uint256 _seconds) internal pure returns (uint256 newTimestamp) {
    newTimestamp = timestamp - _seconds;
    require(newTimestamp <= timestamp);
  }
```
</details>

### diffYears

```solidity
function diffYears(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_years uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function diffYears(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 _years) {
    require(fromTimestamp <= toTimestamp);
    (uint256 fromYear, , ) = _daysToDate(fromTimestamp / SECONDS_PER_DAY);
    (uint256 toYear, , ) = _daysToDate(toTimestamp / SECONDS_PER_DAY);
    _years = toYear - fromYear;
  }
```
</details>

### diffMonths

```solidity
function diffMonths(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_months uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function diffMonths(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 _months) {
    require(fromTimestamp <= toTimestamp);
    (uint256 fromYear, uint256 fromMonth, ) = _daysToDate(fromTimestamp / SECONDS_PER_DAY);
    (uint256 toYear, uint256 toMonth, ) = _daysToDate(toTimestamp / SECONDS_PER_DAY);
    _months = toYear * 12 + toMonth - fromYear * 12 - fromMonth;
  }
```
</details>

### diffDays

```solidity
function diffDays(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_days uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function diffDays(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 _days) {
    require(fromTimestamp <= toTimestamp);
    _days = (toTimestamp - fromTimestamp) / SECONDS_PER_DAY;
  }
```
</details>

### diffHours

```solidity
function diffHours(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_hours uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function diffHours(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 _hours) {
    require(fromTimestamp <= toTimestamp);
    _hours = (toTimestamp - fromTimestamp) / SECONDS_PER_HOUR;
  }
```
</details>

### diffMinutes

```solidity
function diffMinutes(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_minutes uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function diffMinutes(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 _minutes) {
    require(fromTimestamp <= toTimestamp);
    _minutes = (toTimestamp - fromTimestamp) / SECONDS_PER_MINUTE;
  }
```
</details>

### diffSeconds

```solidity
function diffSeconds(uint256 fromTimestamp, uint256 toTimestamp) internal pure
returns(_seconds uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| fromTimestamp | uint256 |  | 
| toTimestamp | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function diffSeconds(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 _seconds) {
    require(fromTimestamp <= toTimestamp);
    _seconds = toTimestamp - fromTimestamp;
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
