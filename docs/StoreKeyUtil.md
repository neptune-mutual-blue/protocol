# StoreKeyUtil.sol

View Source: [contracts/libraries/StoreKeyUtil.sol](../contracts/libraries/StoreKeyUtil.sol)

**StoreKeyUtil**

## Functions

- [setUintByKey(IStore s, bytes32 key, uint256 value)](#setuintbykey)
- [setUintByKeys(IStore s, bytes32 key1, bytes32 key2, uint256 value)](#setuintbykeys)
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
- [setBoolByKey(IStore s, bytes32 key, bool value)](#setboolbykey)
- [setBoolByKeys(IStore s, bytes32 key1, bytes32 key2, bool value)](#setboolbykeys)
- [setBoolByKeys(IStore s, bytes32 key, address account, bool value)](#setboolbykeys)
- [setAddressByKey(IStore s, bytes32 key, address value)](#setaddressbykey)
- [setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, address value)](#setaddressbykeys)
- [setAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address value)](#setaddressbykeys)
- [setAddressBooleanByKey(IStore s, bytes32 key, address account, bool value)](#setaddressbooleanbykey)
- [setAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, address account, bool value)](#setaddressbooleanbykeys)
- [setAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address account, bool value)](#setaddressbooleanbykeys)
- [deleteUintByKey(IStore s, bytes32 key)](#deleteuintbykey)
- [deleteUintByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteuintbykeys)
- [deleteBytes32ByKey(IStore s, bytes32 key)](#deletebytes32bykey)
- [deleteBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2)](#deletebytes32bykeys)
- [deleteBoolByKey(IStore s, bytes32 key)](#deleteboolbykey)
- [deleteBoolByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteboolbykeys)
- [deleteBoolByKeys(IStore s, bytes32 key, address account)](#deleteboolbykeys)
- [deleteAddressByKey(IStore s, bytes32 key)](#deleteaddressbykey)
- [deleteAddressByKeys(IStore s, bytes32 key1, bytes32 key2)](#deleteaddressbykeys)
- [getUintByKey(IStore s, bytes32 key)](#getuintbykey)
- [getUintByKeys(IStore s, bytes32 key1, bytes32 key2)](#getuintbykeys)
- [getUintByKeys(IStore s, bytes32 key1, bytes32 key2, address account)](#getuintbykeys)
- [getStringByKey(IStore s, bytes32 key)](#getstringbykey)
- [getStringByKeys(IStore s, bytes32 key1, bytes32 key2)](#getstringbykeys)
- [getBytes32ByKey(IStore s, bytes32 key)](#getbytes32bykey)
- [getBytes32ByKeys(IStore s, bytes32 key1, bytes32 key2)](#getbytes32bykeys)
- [getBoolByKey(IStore s, bytes32 key)](#getboolbykey)
- [getBoolByKeys(IStore s, bytes32 key1, bytes32 key2)](#getboolbykeys)
- [getBoolByKeys(IStore s, bytes32 key, address account)](#getboolbykeys)
- [getAddressByKey(IStore s, bytes32 key)](#getaddressbykey)
- [getAddressByKeys(IStore s, bytes32 key1, bytes32 key2)](#getaddressbykeys)
- [getAddressByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3)](#getaddressbykeys)
- [getAddressBooleanByKey(IStore s, bytes32 key, address account)](#getaddressbooleanbykey)
- [getAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, address account)](#getaddressbooleanbykeys)
- [getAddressBooleanByKeys(IStore s, bytes32 key1, bytes32 key2, bytes32 key3, address account)](#getaddressbooleanbykeys)

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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.setUint(keccak256(abi.encodePacked(key1, key2)), value);
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
    require(key1 > 0 && key2 > 0 && account != address(0), "Invalid key(s)");
    return s.setUint(keccak256(abi.encodePacked(key1, key2, account)), value);
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.addUint(keccak256(abi.encodePacked(key1, key2)), value);
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
    require(key1 > 0 && key2 > 0 && account != address(0), "Invalid key(s)");
    return s.addUint(keccak256(abi.encodePacked(key1, key2, account)), value);
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.subtractUint(keccak256(abi.encodePacked(key1, key2)), value);
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
    require(key1 > 0 && key2 > 0 && account != address(0), "Invalid key(s)");
    return s.subtractUint(keccak256(abi.encodePacked(key1, key2, account)), value);
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
    string memory value
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
    string memory value
  ) external {
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.setString(keccak256(abi.encodePacked(key1, key2)), value);
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.setBytes32(keccak256(abi.encodePacked(key1, key2)), value);
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.setBool(keccak256(abi.encodePacked(key1, key2)), value);
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
    require(key > 0 && account != address(0), "Invalid key(s)");
    return s.setBool(keccak256(abi.encodePacked(key, account)), value);
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.setAddress(keccak256(abi.encodePacked(key1, key2)), value);
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
    require(key1 > 0 && key2 > 0 && key3 > 0, "Invalid key(s)");
    return s.setAddress(keccak256(abi.encodePacked(key1, key2, key3)), value);
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.setAddressBoolean(keccak256(abi.encodePacked(key1, key2)), account, value);
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
    require(key1 > 0 && key2 > 0 && key3 > 0, "Invalid key(s)");
    return s.setAddressBoolean(keccak256(abi.encodePacked(key1, key2, key3)), account, value);
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.deleteUint(keccak256(abi.encodePacked(key1, key2)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.deleteBytes32(keccak256(abi.encodePacked(key1, key2)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.deleteBool(keccak256(abi.encodePacked(key1, key2)));
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
    require(key > 0 && account != address(0), "Invalid key(s)");
    return s.deleteBool(keccak256(abi.encodePacked(key, account)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.deleteAddress(keccak256(abi.encodePacked(key1, key2)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.getUint(keccak256(abi.encodePacked(key1, key2)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.getUint(keccak256(abi.encodePacked(key1, key2, account)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.getString(keccak256(abi.encodePacked(key1, key2)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.getBytes32(keccak256(abi.encodePacked(key1, key2)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.getBool(keccak256(abi.encodePacked(key1, key2)));
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
    require(key > 0 && account != address(0), "Invalid key(s)");
    return s.getBool(keccak256(abi.encodePacked(key, account)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.getAddress(keccak256(abi.encodePacked(key1, key2)));
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
    require(key1 > 0 && key2 > 0 && key3 > 0, "Invalid key(s)");
    return s.getAddress(keccak256(abi.encodePacked(key1, key2, key3)));
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
    require(key1 > 0 && key2 > 0, "Invalid key(s)");
    return s.getAddressBoolean(keccak256(abi.encodePacked(key1, key2)), account);
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
    require(key1 > 0 && key2 > 0 && key3 > 0, "Invalid key(s)");
    return s.getAddressBoolean(keccak256(abi.encodePacked(key1, key2, key3)), account);
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
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
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
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
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProtocol](MockProtocol.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [PriceDiscovery](PriceDiscovery.md)
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
* [SafeERC20](SafeERC20.md)
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
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
