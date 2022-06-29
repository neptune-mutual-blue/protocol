# StoreKeyUtil.sol

View Source: [contracts/libraries/StoreKeyUtil.sol](../contracts/libraries/StoreKeyUtil.sol)

**StoreKeyUtil**

## Functions

- [setUintByKey(IStore s, bytes32 key, uint256 value)](#setuintbykey)
- [setUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value)](#setuintbykeys)
- [setUintByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 value)](#setuintbykeys)
- [setUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value)](#setuintbykeys)
- [addUintByKey(IStore s, bytes32 key, uint256 value)](#adduintbykey)
- [addUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value)](#adduintbykeys)
- [addUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value)](#adduintbykeys)
- [subtractUintByKey(IStore s, bytes32 key, uint256 value)](#subtractuintbykey)
- [subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value)](#subtractuintbykeys)
- [subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value)](#subtractuintbykeys)
- [setStringByKey(IStore s, bytes32 key, string value)](#setstringbykey)
- [setStringByKeys(IStore s, bytes32 key1, bytes32 key2, string value)](#setstringbykeys)
- [setBytes32ByKey(IStore s, bytes32 key, bytes32 value)](#setbytes32bykey)
- [setBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value)](#setbytes32bykeys)
- [setBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value)](#setbytes32bykeys)
- [setBoolByKey(IStore s, bytes32 key, bool value)](#setboolbykey)
- [setBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bool value)](#setboolbykeys)
- [setBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bool value)](#setboolbykeys)
- [setBoolByKeys(IStore s, bytes32 key, address account, bool value)](#setboolbykeys)
- [setAddressByKey(IStore s, bytes32 key, address value)](#setaddressbykey)
- [setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, address value)](#setaddressbykeys)
- [setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value)](#setaddressbykeys)
- [setAddressArrayByKey(IStore s, bytes32 key, address value)](#setaddressarraybykey)
- [setAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, address value)](#setaddressarraybykeys)
- [setAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value)](#setaddressarraybykeys)
- [setAddressBooleanByKey(IStore s, bytes32 key, address account, bool value)](#setaddressbooleanbykey)
- [setAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, address account, bool value)](#setaddressbooleanbykeys)
- [setAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address account, bool value)](#setaddressbooleanbykeys)
- [deleteUintByKey(IStore s, bytes32 key)](#deleteuintbykey)
- [deleteUintByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteuintbykeys)
- [deleteUintByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#deleteuintbykeys)
- [deleteBytes32ByKey(IStore s, bytes32 key)](#deletebytes32bykey)
- [deleteBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2)](#deletebytes32bykeys)
- [deleteBoolByKey(IStore s, bytes32 key)](#deleteboolbykey)
- [deleteBoolByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteboolbykeys)
- [deleteBoolByKeys(IStore s, bytes32 key, address account)](#deleteboolbykeys)
- [deleteAddressByKey(IStore s, bytes32 key)](#deleteaddressbykey)
- [deleteAddressByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteaddressbykeys)
- [deleteAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#deleteaddressbykeys)
- [deleteAddressArrayByKey(IStore s, bytes32 key, address value)](#deleteaddressarraybykey)
- [deleteAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, address value)](#deleteaddressarraybykeys)
- [deleteAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value)](#deleteaddressarraybykeys)
- [deleteAddressArrayByIndexByKey(IStore s, bytes32 key, uint256 index)](#deleteaddressarraybyindexbykey)
- [deleteAddressArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index)](#deleteaddressarraybyindexbykeys)
- [deleteAddressArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#deleteaddressarraybyindexbykeys)
- [getUintByKey(IStore s, bytes32 key)](#getuintbykey)
- [getUintByKeys(IStore s, bytes32 key1, bytes32 key2)](#getuintbykeys)
- [getUintByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#getuintbykeys)
- [getUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account)](#getuintbykeys)
- [getStringByKey(IStore s, bytes32 key)](#getstringbykey)
- [getStringByKeys(IStore s, bytes32 key1, bytes32 key2)](#getstringbykeys)
- [getBytes32ByKey(IStore s, bytes32 key)](#getbytes32bykey)
- [getBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2)](#getbytes32bykeys)
- [getBoolByKey(IStore s, bytes32 key)](#getboolbykey)
- [getBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#getboolbykeys)
- [getBoolByKeys(IStore s, bytes32 key1, bytes32 key2)](#getboolbykeys)
- [getBoolByKeys(IStore s, bytes32 key, address account)](#getboolbykeys)
- [getAddressByKey(IStore s, bytes32 key)](#getaddressbykey)
- [getAddressByKeys(IStore s, bytes32 key1, bytes32 key2)](#getaddressbykeys)
- [getAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#getaddressbykeys)
- [getAddressBooleanByKey(IStore s, bytes32 key, address account)](#getaddressbooleanbykey)
- [getAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, address account)](#getaddressbooleanbykeys)
- [getAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address account)](#getaddressbooleanbykeys)
- [countAddressArrayByKey(IStore s, bytes32 key)](#countaddressarraybykey)
- [countAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2)](#countaddressarraybykeys)
- [countAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#countaddressarraybykeys)
- [getAddressArrayByKey(IStore s, bytes32 key)](#getaddressarraybykey)
- [getAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2)](#getaddressarraybykeys)
- [getAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#getaddressarraybykeys)
- [getAddressArrayItemPositionByKey(IStore s, bytes32 key, address addressToFind)](#getaddressarrayitempositionbykey)
- [getAddressArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, address addressToFind)](#getaddressarrayitempositionbykeys)
- [getAddressArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address addressToFind)](#getaddressarrayitempositionbykeys)
- [getAddressArrayItemByIndexByKey(IStore s, bytes32 key, uint256 index)](#getaddressarrayitembyindexbykey)
- [getAddressArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index)](#getaddressarrayitembyindexbykeys)
- [getAddressArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#getaddressarrayitembyindexbykeys)
- [_getKey(bytes32 key1, bytes32 key2)](#_getkey)
- [_getKey(bytes32 key1, bytes32 key2, bytes32 key3)](#_getkey)
- [_getKey(bytes32 key, address account)](#_getkey)
- [_getKey(bytes32 key1, bytes32 key2, address account)](#_getkey)
- [setBytes32ArrayByKey(IStore s, bytes32 key, bytes32 value)](#setbytes32arraybykey)
- [setBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value)](#setbytes32arraybykeys)
- [setBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value)](#setbytes32arraybykeys)
- [deleteBytes32ArrayByKey(IStore s, bytes32 key, bytes32 value)](#deletebytes32arraybykey)
- [deleteBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value)](#deletebytes32arraybykeys)
- [deleteBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value)](#deletebytes32arraybykeys)
- [deleteBytes32ArrayByIndexByKey(IStore s, bytes32 key, uint256 index)](#deletebytes32arraybyindexbykey)
- [deleteBytes32ArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index)](#deletebytes32arraybyindexbykeys)
- [deleteBytes32ArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#deletebytes32arraybyindexbykeys)
- [countBytes32ArrayByKey(IStore s, bytes32 key)](#countbytes32arraybykey)
- [countBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2)](#countbytes32arraybykeys)
- [countBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#countbytes32arraybykeys)
- [getBytes32ArrayByKey(IStore s, bytes32 key)](#getbytes32arraybykey)
- [getBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2)](#getbytes32arraybykeys)
- [getBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#getbytes32arraybykeys)
- [getBytes32ArrayItemPositionByKey(IStore s, bytes32 key, bytes32 bytes32ToFind)](#getbytes32arrayitempositionbykey)
- [getBytes32ArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 bytes32ToFind)](#getbytes32arrayitempositionbykeys)
- [getBytes32ArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 bytes32ToFind)](#getbytes32arrayitempositionbykeys)
- [getBytes32ArrayItemByIndexByKey(IStore s, bytes32 key, uint256 index)](#getbytes32arrayitembyindexbykey)
- [getBytes32ArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index)](#getbytes32arrayitembyindexbykeys)
- [getBytes32ArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#getbytes32arrayitembyindexbykeys)

### setUintByKey

```solidity
function setUintByKey(IStore s, bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUintByKey(
    IStore s,
    bytes32 key,
    uint256 value
  ) external {
    require(key > 0, "Invalid key");
    return s.setUint(key, value);
  }
```
</details>

### setUintByKeys

```solidity
function setUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    uint256 value
  ) external {
    return s.setUint(_getKey(key1, key2), value);
  }
```
</details>

### setUintByKeys

```solidity
function setUintByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 value
  ) external {
    return s.setUint(_getKey(key1, key2, key3), value);
  }
```
</details>

### setUintByKeys

```solidity
function setUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address account,
    uint256 value
  ) external {
    return s.setUint(_getKey(key1, key2, account), value);
  }
```
</details>

### addUintByKey

```solidity
function addUintByKey(IStore s, bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addUintByKey(
    IStore s,
    bytes32 key,
    uint256 value
  ) external {
    require(key > 0, "Invalid key");
    return s.addUint(key, value);
  }
```
</details>

### addUintByKeys

```solidity
function addUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    uint256 value
  ) external {
    return s.addUint(_getKey(key1, key2), value);
  }
```
</details>

### addUintByKeys

```solidity
function addUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address account,
    uint256 value
  ) external {
    return s.addUint(_getKey(key1, key2, account), value);
  }
```
</details>

### subtractUintByKey

```solidity
function subtractUintByKey(IStore s, bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subtractUintByKey(
    IStore s,
    bytes32 key,
    uint256 value
  ) external {
    require(key > 0, "Invalid key");
    return s.subtractUint(key, value);
  }
```
</details>

### subtractUintByKeys

```solidity
function subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subtractUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    uint256 value
  ) external {
    return s.subtractUint(_getKey(key1, key2), value);
  }
```
</details>

### subtractUintByKeys

```solidity
function subtractUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subtractUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address account,
    uint256 value
  ) external {
    return s.subtractUint(_getKey(key1, key2, account), value);
  }
```
</details>

### setStringByKey

```solidity
function setStringByKey(IStore s, bytes32 key, string value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | string |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setStringByKey(
    IStore s,
    bytes32 key,
    string calldata value
  ) external {
    require(key > 0, "Invalid key");
    s.setString(key, value);
  }
```
</details>

### setStringByKeys

```solidity
function setStringByKeys(IStore s, bytes32 key1, bytes32 key2, string value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | string |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setStringByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    string calldata value
  ) external {
    return s.setString(_getKey(key1, key2), value);
  }
```
</details>

### setBytes32ByKey

```solidity
function setBytes32ByKey(IStore s, bytes32 key, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ByKey(
    IStore s,
    bytes32 key,
    bytes32 value
  ) external {
    require(key > 0, "Invalid key");
    s.setBytes32(key, value);
  }
```
</details>

### setBytes32ByKeys

```solidity
function setBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 value
  ) external {
    return s.setBytes32(_getKey(key1, key2), value);
  }
```
</details>

### setBytes32ByKeys

```solidity
function setBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bytes32 value
  ) external {
    return s.setBytes32(_getKey(key1, key2, key3), value);
  }
```
</details>

### setBoolByKey

```solidity
function setBoolByKey(IStore s, bytes32 key, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBoolByKey(
    IStore s,
    bytes32 key,
    bool value
  ) external {
    require(key > 0, "Invalid key");
    return s.setBool(key, value);
  }
```
</details>

### setBoolByKeys

```solidity
function setBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBoolByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bool value
  ) external {
    return s.setBool(_getKey(key1, key2), value);
  }
```
</details>

### setBoolByKeys

```solidity
function setBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBoolByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bool value
  ) external {
    return s.setBool(_getKey(key1, key2, key3), value);
  }
```
</details>

### setBoolByKeys

```solidity
function setBoolByKeys(IStore s, bytes32 key, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBoolByKeys(
    IStore s,
    bytes32 key,
    address account,
    bool value
  ) external {
    return s.setBool(_getKey(key, account), value);
  }
```
</details>

### setAddressByKey

```solidity
function setAddressByKey(IStore s, bytes32 key, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressByKey(
    IStore s,
    bytes32 key,
    address value
  ) external {
    require(key > 0, "Invalid key");
    return s.setAddress(key, value);
  }
```
</details>

### setAddressByKeys

```solidity
function setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    return s.setAddress(_getKey(key1, key2), value);
  }
```
</details>

### setAddressByKeys

```solidity
function setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    return s.setAddress(_getKey(key1, key2, key3), value);
  }
```
</details>

### setAddressArrayByKey

```solidity
function setAddressArrayByKey(IStore s, bytes32 key, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressArrayByKey(
    IStore s,
    bytes32 key,
    address value
  ) external {
    require(key > 0, "Invalid key");
    return s.setAddressArrayItem(key, value);
  }
```
</details>

### setAddressArrayByKeys

```solidity
function setAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    return s.setAddressArrayItem(_getKey(key1, key2), value);
  }
```
</details>

### setAddressArrayByKeys

```solidity
function setAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    return s.setAddressArrayItem(_getKey(key1, key2, key3), value);
  }
```
</details>

### setAddressBooleanByKey

```solidity
function setAddressBooleanByKey(IStore s, bytes32 key, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressBooleanByKey(
    IStore s,
    bytes32 key,
    address account,
    bool value
  ) external {
    require(key > 0, "Invalid key");
    return s.setAddressBoolean(key, account, value);
  }
```
</details>

### setAddressBooleanByKeys

```solidity
function setAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressBooleanByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address account,
    bool value
  ) external {
    return s.setAddressBoolean(_getKey(key1, key2), account, value);
  }
```
</details>

### setAddressBooleanByKeys

```solidity
function setAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressBooleanByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address account,
    bool value
  ) external {
    return s.setAddressBoolean(_getKey(key1, key2, key3), account, value);
  }
```
</details>

### deleteUintByKey

```solidity
function deleteUintByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteUintByKey(IStore s, bytes32 key) external {
    require(key > 0, "Invalid key");
    return s.deleteUint(key);
  }
```
</details>

### deleteUintByKeys

```solidity
function deleteUintByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external {
    return s.deleteUint(_getKey(key1, key2));
  }
```
</details>

### deleteUintByKeys

```solidity
function deleteUintByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external {
    return s.deleteUint(_getKey(key1, key2, key3));
  }
```
</details>

### deleteBytes32ByKey

```solidity
function deleteBytes32ByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ByKey(IStore s, bytes32 key) external {
    require(key > 0, "Invalid key");
    s.deleteBytes32(key);
  }
```
</details>

### deleteBytes32ByKeys

```solidity
function deleteBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external {
    return s.deleteBytes32(_getKey(key1, key2));
  }
```
</details>

### deleteBoolByKey

```solidity
function deleteBoolByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBoolByKey(IStore s, bytes32 key) external {
    require(key > 0, "Invalid key");
    return s.deleteBool(key);
  }
```
</details>

### deleteBoolByKeys

```solidity
function deleteBoolByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBoolByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external {
    return s.deleteBool(_getKey(key1, key2));
  }
```
</details>

### deleteBoolByKeys

```solidity
function deleteBoolByKeys(IStore s, bytes32 key, address account) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBoolByKeys(
    IStore s,
    bytes32 key,
    address account
  ) external {
    return s.deleteBool(_getKey(key, account));
  }
```
</details>

### deleteAddressByKey

```solidity
function deleteAddressByKey(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressByKey(IStore s, bytes32 key) external {
    require(key > 0, "Invalid key");
    return s.deleteAddress(key);
  }
```
</details>

### deleteAddressByKeys

```solidity
function deleteAddressByKeys(IStore s, bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external {
    return s.deleteAddress(_getKey(key1, key2));
  }
```
</details>

### deleteAddressByKeys

```solidity
function deleteAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external {
    return s.deleteAddress(_getKey(key1, key2, key3));
  }
```
</details>

### deleteAddressArrayByKey

```solidity
function deleteAddressArrayByKey(IStore s, bytes32 key, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByKey(
    IStore s,
    bytes32 key,
    address value
  ) external {
    require(key > 0, "Invalid key");
    return s.deleteAddressArrayItem(key, value);
  }
```
</details>

### deleteAddressArrayByKeys

```solidity
function deleteAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    return s.deleteAddressArrayItem(_getKey(key1, key2), value);
  }
```
</details>

### deleteAddressArrayByKeys

```solidity
function deleteAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    return s.deleteAddressArrayItem(_getKey(key1, key2, key3), value);
  }
```
</details>

### deleteAddressArrayByIndexByKey

```solidity
function deleteAddressArrayByIndexByKey(IStore s, bytes32 key, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByIndexByKey(
    IStore s,
    bytes32 key,
    uint256 index
  ) external {
    require(key > 0, "Invalid key");
    return s.deleteAddressArrayItemByIndex(key, index);
  }
```
</details>

### deleteAddressArrayByIndexByKeys

```solidity
function deleteAddressArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external {
    return s.deleteAddressArrayItemByIndex(_getKey(key1, key2), index);
  }
```
</details>

### deleteAddressArrayByIndexByKeys

```solidity
function deleteAddressArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external {
    return s.deleteAddressArrayItemByIndex(_getKey(key1, key2, key3), index);
  }
```
</details>

### getUintByKey

```solidity
function getUintByKey(IStore s, bytes32 key) external view
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
function getUintByKey(IStore s, bytes32 key) external view returns (uint256) {
    require(key > 0, "Invalid key");
    return s.getUint(key);
  }
```
</details>

### getUintByKeys

```solidity
function getUintByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (uint256) {
    return s.getUint(_getKey(key1, key2));
  }
```
</details>

### getUintByKeys

```solidity
function getUintByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (uint256) {
    return s.getUint(_getKey(key1, key2, key3));
  }
```
</details>

### getUintByKeys

```solidity
function getUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUintByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address account
  ) external view returns (uint256) {
    return s.getUint(_getKey(key1, key2, account));
  }
```
</details>

### getStringByKey

```solidity
function getStringByKey(IStore s, bytes32 key) external view
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStringByKey(IStore s, bytes32 key) external view returns (string memory) {
    require(key > 0, "Invalid key");
    return s.getString(key);
  }
```
</details>

### getStringByKeys

```solidity
function getStringByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStringByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (string memory) {
    return s.getString(_getKey(key1, key2));
  }
```
</details>

### getBytes32ByKey

```solidity
function getBytes32ByKey(IStore s, bytes32 key) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ByKey(IStore s, bytes32 key) external view returns (bytes32) {
    require(key > 0, "Invalid key");
    return s.getBytes32(key);
  }
```
</details>

### getBytes32ByKeys

```solidity
function getBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (bytes32) {
    return s.getBytes32(_getKey(key1, key2));
  }
```
</details>

### getBoolByKey

```solidity
function getBoolByKey(IStore s, bytes32 key) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBoolByKey(IStore s, bytes32 key) external view returns (bool) {
    require(key > 0, "Invalid key");
    return s.getBool(key);
  }
```
</details>

### getBoolByKeys

```solidity
function getBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBoolByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (bool) {
    return s.getBool(_getKey(key1, key2, key3));
  }
```
</details>

### getBoolByKeys

```solidity
function getBoolByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBoolByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (bool) {
    return s.getBool(_getKey(key1, key2));
  }
```
</details>

### getBoolByKeys

```solidity
function getBoolByKeys(IStore s, bytes32 key, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBoolByKeys(
    IStore s,
    bytes32 key,
    address account
  ) external view returns (bool) {
    return s.getBool(_getKey(key, account));
  }
```
</details>

### getAddressByKey

```solidity
function getAddressByKey(IStore s, bytes32 key) external view
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
function getAddressByKey(IStore s, bytes32 key) external view returns (address) {
    require(key > 0, "Invalid key");
    return s.getAddress(key);
  }
```
</details>

### getAddressByKeys

```solidity
function getAddressByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (address) {
    return s.getAddress(_getKey(key1, key2));
  }
```
</details>

### getAddressByKeys

```solidity
function getAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (address) {
    return s.getAddress(_getKey(key1, key2, key3));
  }
```
</details>

### getAddressBooleanByKey

```solidity
function getAddressBooleanByKey(IStore s, bytes32 key, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressBooleanByKey(
    IStore s,
    bytes32 key,
    address account
  ) external view returns (bool) {
    require(key > 0, "Invalid key");
    return s.getAddressBoolean(key, account);
  }
```
</details>

### getAddressBooleanByKeys

```solidity
function getAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressBooleanByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address account
  ) external view returns (bool) {
    return s.getAddressBoolean(_getKey(key1, key2), account);
  }
```
</details>

### getAddressBooleanByKeys

```solidity
function getAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressBooleanByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address account
  ) external view returns (bool) {
    return s.getAddressBoolean(_getKey(key1, key2, key3), account);
  }
```
</details>

### countAddressArrayByKey

```solidity
function countAddressArrayByKey(IStore s, bytes32 key) external view
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
function countAddressArrayByKey(IStore s, bytes32 key) external view returns (uint256) {
    require(key > 0, "Invalid key");
    return s.countAddressArrayItems(key);
  }
```
</details>

### countAddressArrayByKeys

```solidity
function countAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (uint256) {
    return s.countAddressArrayItems(_getKey(key1, key2));
  }
```
</details>

### countAddressArrayByKeys

```solidity
function countAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (uint256) {
    return s.countAddressArrayItems(_getKey(key1, key2, key3));
  }
```
</details>

### getAddressArrayByKey

```solidity
function getAddressArrayByKey(IStore s, bytes32 key) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayByKey(IStore s, bytes32 key) external view returns (address[] memory) {
    require(key > 0, "Invalid key");
    return s.getAddressArray(key);
  }
```
</details>

### getAddressArrayByKeys

```solidity
function getAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (address[] memory) {
    return s.getAddressArray(_getKey(key1, key2));
  }
```
</details>

### getAddressArrayByKeys

```solidity
function getAddressArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (address[] memory) {
    return s.getAddressArray(_getKey(key1, key2, key3));
  }
```
</details>

### getAddressArrayItemPositionByKey

```solidity
function getAddressArrayItemPositionByKey(IStore s, bytes32 key, address addressToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| addressToFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemPositionByKey(
    IStore s,
    bytes32 key,
    address addressToFind
  ) external view returns (uint256) {
    require(key > 0, "Invalid key");
    return s.getAddressArrayItemPosition(key, addressToFind);
  }
```
</details>

### getAddressArrayItemPositionByKeys

```solidity
function getAddressArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, address addressToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| addressToFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemPositionByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    address addressToFind
  ) external view returns (uint256) {
    return s.getAddressArrayItemPosition(_getKey(key1, key2), addressToFind);
  }
```
</details>

### getAddressArrayItemPositionByKeys

```solidity
function getAddressArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address addressToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| addressToFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemPositionByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address addressToFind
  ) external view returns (uint256) {
    return s.getAddressArrayItemPosition(_getKey(key1, key2, key3), addressToFind);
  }
```
</details>

### getAddressArrayItemByIndexByKey

```solidity
function getAddressArrayItemByIndexByKey(IStore s, bytes32 key, uint256 index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemByIndexByKey(
    IStore s,
    bytes32 key,
    uint256 index
  ) external view returns (address) {
    require(key > 0, "Invalid key");
    return s.getAddressArrayItemByIndex(key, index);
  }
```
</details>

### getAddressArrayItemByIndexByKeys

```solidity
function getAddressArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external view returns (address) {
    return s.getAddressArrayItemByIndex(_getKey(key1, key2), index);
  }
```
</details>

### getAddressArrayItemByIndexByKeys

```solidity
function getAddressArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external view returns (address) {
    return s.getAddressArrayItemByIndex(_getKey(key1, key2, key3), index);
  }
```
</details>

### _getKey

```solidity
function _getKey(bytes32 key1, bytes32 key2) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getKey(bytes32 key1, bytes32 key2) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(key1, key2));
  }
```
</details>

### _getKey

```solidity
function _getKey(bytes32 key1, bytes32 key2, bytes32 key3) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getKey(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(key1, key2, key3));
  }
```
</details>

### _getKey

```solidity
function _getKey(bytes32 key, address account) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getKey(bytes32 key, address account) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(key, account));
  }
```
</details>

### _getKey

```solidity
function _getKey(bytes32 key1, bytes32 key2, address account) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getKey(
    bytes32 key1,
    bytes32 key2,
    address account
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(key1, key2, account));
  }
```
</details>

### setBytes32ArrayByKey

```solidity
function setBytes32ArrayByKey(IStore s, bytes32 key, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ArrayByKey(
    IStore s,
    bytes32 key,
    bytes32 value
  ) external {
    require(key > 0, "Invalid key");
    return s.setBytes32ArrayItem(key, value);
  }
```
</details>

### setBytes32ArrayByKeys

```solidity
function setBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 value
  ) external {
    return s.setBytes32ArrayItem(_getKey(key1, key2), value);
  }
```
</details>

### setBytes32ArrayByKeys

```solidity
function setBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bytes32 value
  ) external {
    return s.setBytes32ArrayItem(_getKey(key1, key2, key3), value);
  }
```
</details>

### deleteBytes32ArrayByKey

```solidity
function deleteBytes32ArrayByKey(IStore s, bytes32 key, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByKey(
    IStore s,
    bytes32 key,
    bytes32 value
  ) external {
    require(key > 0, "Invalid key");
    return s.deleteBytes32ArrayItem(key, value);
  }
```
</details>

### deleteBytes32ArrayByKeys

```solidity
function deleteBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 value
  ) external {
    return s.deleteBytes32ArrayItem(_getKey(key1, key2), value);
  }
```
</details>

### deleteBytes32ArrayByKeys

```solidity
function deleteBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bytes32 value
  ) external {
    return s.deleteBytes32ArrayItem(_getKey(key1, key2, key3), value);
  }
```
</details>

### deleteBytes32ArrayByIndexByKey

```solidity
function deleteBytes32ArrayByIndexByKey(IStore s, bytes32 key, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByIndexByKey(
    IStore s,
    bytes32 key,
    uint256 index
  ) external {
    require(key > 0, "Invalid key");
    return s.deleteBytes32ArrayItemByIndex(key, index);
  }
```
</details>

### deleteBytes32ArrayByIndexByKeys

```solidity
function deleteBytes32ArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external {
    return s.deleteBytes32ArrayItemByIndex(_getKey(key1, key2), index);
  }
```
</details>

### deleteBytes32ArrayByIndexByKeys

```solidity
function deleteBytes32ArrayByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external {
    return s.deleteBytes32ArrayItemByIndex(_getKey(key1, key2, key3), index);
  }
```
</details>

### countBytes32ArrayByKey

```solidity
function countBytes32ArrayByKey(IStore s, bytes32 key) external view
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
function countBytes32ArrayByKey(IStore s, bytes32 key) external view returns (uint256) {
    require(key > 0, "Invalid key");
    return s.countBytes32ArrayItems(key);
  }
```
</details>

### countBytes32ArrayByKeys

```solidity
function countBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (uint256) {
    return s.countBytes32ArrayItems(_getKey(key1, key2));
  }
```
</details>

### countBytes32ArrayByKeys

```solidity
function countBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (uint256) {
    return s.countBytes32ArrayItems(_getKey(key1, key2, key3));
  }
```
</details>

### getBytes32ArrayByKey

```solidity
function getBytes32ArrayByKey(IStore s, bytes32 key) external view
returns(bytes32[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayByKey(IStore s, bytes32 key) external view returns (bytes32[] memory) {
    require(key > 0, "Invalid key");
    return s.getBytes32Array(key);
  }
```
</details>

### getBytes32ArrayByKeys

```solidity
function getBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2) external view
returns(bytes32[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2
  ) external view returns (bytes32[] memory) {
    return s.getBytes32Array(_getKey(key1, key2));
  }
```
</details>

### getBytes32ArrayByKeys

```solidity
function getBytes32ArrayByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(bytes32[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (bytes32[] memory) {
    return s.getBytes32Array(_getKey(key1, key2, key3));
  }
```
</details>

### getBytes32ArrayItemPositionByKey

```solidity
function getBytes32ArrayItemPositionByKey(IStore s, bytes32 key, bytes32 bytes32ToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| bytes32ToFind | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemPositionByKey(
    IStore s,
    bytes32 key,
    bytes32 bytes32ToFind
  ) external view returns (uint256) {
    require(key > 0, "Invalid key");
    return s.getBytes32ArrayItemPosition(key, bytes32ToFind);
  }
```
</details>

### getBytes32ArrayItemPositionByKeys

```solidity
function getBytes32ArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 bytes32ToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| bytes32ToFind | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemPositionByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 bytes32ToFind
  ) external view returns (uint256) {
    return s.getBytes32ArrayItemPosition(_getKey(key1, key2), bytes32ToFind);
  }
```
</details>

### getBytes32ArrayItemPositionByKeys

```solidity
function getBytes32ArrayItemPositionByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, bytes32 bytes32ToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| bytes32ToFind | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemPositionByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bytes32 bytes32ToFind
  ) external view returns (uint256) {
    return s.getBytes32ArrayItemPosition(_getKey(key1, key2, key3), bytes32ToFind);
  }
```
</details>

### getBytes32ArrayItemByIndexByKey

```solidity
function getBytes32ArrayItemByIndexByKey(IStore s, bytes32 key, uint256 index) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemByIndexByKey(
    IStore s,
    bytes32 key,
    uint256 index
  ) external view returns (bytes32) {
    require(key > 0, "Invalid key");
    return s.getBytes32ArrayItemByIndex(key, index);
  }
```
</details>

### getBytes32ArrayItemByIndexByKeys

```solidity
function getBytes32ArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 index) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external view returns (bytes32) {
    return s.getBytes32ArrayItemByIndex(_getKey(key1, key2), index);
  }
```
</details>

### getBytes32ArrayItemByIndexByKeys

```solidity
function getBytes32ArrayItemByIndexByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemByIndexByKeys(
    IStore s,
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external view returns (bytes32) {
    return s.getBytes32ArrayItemByIndex(_getKey(key1, key2, key3), index);
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
* [console](console.md)
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
