# Store.sol

View Source: [\contracts\core\store\Store.sol](..\contracts\core\store\Store.sol)

**↗ Extends: [StoreBase](StoreBase.md)**

**Store**

## Functions

- [setAddress(bytes32 k, address v)](#setaddress)
- [setAddressBoolean(bytes32 k, address a, bool v)](#setaddressboolean)
- [setUint(bytes32 k, uint256 v)](#setuint)
- [addUint(bytes32 k, uint256 v)](#adduint)
- [subtractUint(bytes32 k, uint256 v)](#subtractuint)
- [setUints(bytes32 k, uint256[] v)](#setuints)
- [setString(bytes32 k, string v)](#setstring)
- [setBytes(bytes32 k, bytes v)](#setbytes)
- [setBool(bytes32 k, bool v)](#setbool)
- [setInt(bytes32 k, int256 v)](#setint)
- [setBytes32(bytes32 k, bytes32 v)](#setbytes32)
- [setAddressArrayItem(bytes32 k, address v)](#setaddressarrayitem)
- [setBytes32ArrayItem(bytes32 k, bytes32 v)](#setbytes32arrayitem)
- [deleteAddress(bytes32 k)](#deleteaddress)
- [deleteUint(bytes32 k)](#deleteuint)
- [deleteUints(bytes32 k)](#deleteuints)
- [deleteString(bytes32 k)](#deletestring)
- [deleteBytes(bytes32 k)](#deletebytes)
- [deleteBool(bytes32 k)](#deletebool)
- [deleteInt(bytes32 k)](#deleteint)
- [deleteBytes32(bytes32 k)](#deletebytes32)
- [deleteAddressArrayItem(bytes32 k, address v)](#deleteaddressarrayitem)
- [deleteBytes32ArrayItem(bytes32 k, bytes32 v)](#deletebytes32arrayitem)
- [deleteAddressArrayItemByIndex(bytes32 k, uint256 i)](#deleteaddressarrayitembyindex)
- [deleteBytes32ArrayItemByIndex(bytes32 k, uint256 i)](#deletebytes32arrayitembyindex)
- [getAddressValues(bytes32[] keys)](#getaddressvalues)
- [getAddress(bytes32 k)](#getaddress)
- [getAddressBoolean(bytes32 k, address a)](#getaddressboolean)
- [getUintValues(bytes32[] keys)](#getuintvalues)
- [getUint(bytes32 k)](#getuint)
- [getUints(bytes32 k)](#getuints)
- [getString(bytes32 k)](#getstring)
- [getBytes(bytes32 k)](#getbytes)
- [getBool(bytes32 k)](#getbool)
- [getInt(bytes32 k)](#getint)
- [getBytes32(bytes32 k)](#getbytes32)
- [getAddressArray(bytes32 k)](#getaddressarray)
- [getBytes32Array(bytes32 k)](#getbytes32array)
- [getAddressArrayItemPosition(bytes32 k, address toFind)](#getaddressarrayitemposition)
- [getBytes32ArrayItemPosition(bytes32 k, bytes32 toFind)](#getbytes32arrayitemposition)
- [getAddressArrayItemByIndex(bytes32 k, uint256 i)](#getaddressarrayitembyindex)
- [getBytes32ArrayItemByIndex(bytes32 k, uint256 i)](#getbytes32arrayitembyindex)
- [countAddressArrayItems(bytes32 k)](#countaddressarrayitems)
- [countBytes32ArrayItems(bytes32 k)](#countbytes32arrayitems)

### setAddress

```solidity
function setAddress(bytes32 k, address v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddress(bytes32 k, address v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    addressStorage[k] = v;

  }
```
</details>

### setAddressBoolean

```solidity
function setAddressBoolean(bytes32 k, address a, bool v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| a | address |  | 
| v | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressBoolean(

    bytes32 k,

    address a,

    bool v

  ) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    addressBooleanStorage[k][a] = v;

  }
```
</details>

### setUint

```solidity
function setUint(bytes32 k, uint256 v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUint(bytes32 k, uint256 v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    uintStorage[k] = v;

  }
```
</details>

### addUint

```solidity
function addUint(bytes32 k, uint256 v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addUint(bytes32 k, uint256 v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    uint256 existing = uintStorage[k];

    uintStorage[k] = existing + v;

  }
```
</details>

### subtractUint

```solidity
function subtractUint(bytes32 k, uint256 v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subtractUint(bytes32 k, uint256 v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    uint256 existing = uintStorage[k];

    uintStorage[k] = existing - v;

  }
```
</details>

### setUints

```solidity
function setUints(bytes32 k, uint256[] v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUints(bytes32 k, uint256[] calldata v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    uintsStorage[k] = v;

  }
```
</details>

### setString

```solidity
function setString(bytes32 k, string v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | string |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setString(bytes32 k, string calldata v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    stringStorage[k] = v;

  }
```
</details>

### setBytes

```solidity
function setBytes(bytes32 k, bytes v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | bytes |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes(bytes32 k, bytes calldata v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    bytesStorage[k] = v;

  }
```
</details>

### setBool

```solidity
function setBool(bytes32 k, bool v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBool(bytes32 k, bool v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    if (v) {

      boolStorage[k] = v;

      return;

    }

    delete boolStorage[k];

  }
```
</details>

### setInt

```solidity
function setInt(bytes32 k, int256 v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | int256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setInt(bytes32 k, int256 v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    intStorage[k] = v;

  }
```
</details>

### setBytes32

```solidity
function setBytes32(bytes32 k, bytes32 v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32(bytes32 k, bytes32 v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    bytes32Storage[k] = v;

  }
```
</details>

### setAddressArrayItem

```solidity
function setAddressArrayItem(bytes32 k, address v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressArrayItem(bytes32 k, address v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    if (addressArrayPositionMap[k][v] == 0) {

      addressArrayStorage[k].push(v);

      addressArrayPositionMap[k][v] = addressArrayStorage[k].length;

    }

  }
```
</details>

### setBytes32ArrayItem

```solidity
function setBytes32ArrayItem(bytes32 k, bytes32 v) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ArrayItem(bytes32 k, bytes32 v) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    if (bytes32ArrayPositionMap[k][v] == 0) {

      bytes32ArrayStorage[k].push(v);

      bytes32ArrayPositionMap[k][v] = bytes32ArrayStorage[k].length;

    }

  }
```
</details>

### deleteAddress

```solidity
function deleteAddress(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddress(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete addressStorage[k];

  }
```
</details>

### deleteUint

```solidity
function deleteUint(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteUint(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete uintStorage[k];

  }
```
</details>

### deleteUints

```solidity
function deleteUints(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteUints(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete uintsStorage[k];

  }
```
</details>

### deleteString

```solidity
function deleteString(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteString(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete stringStorage[k];

  }
```
</details>

### deleteBytes

```solidity
function deleteBytes(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete bytesStorage[k];

  }
```
</details>

### deleteBool

```solidity
function deleteBool(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBool(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete boolStorage[k];

  }
```
</details>

### deleteInt

```solidity
function deleteInt(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteInt(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete intStorage[k];

  }
```
</details>

### deleteBytes32

```solidity
function deleteBytes32(bytes32 k) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32(bytes32 k) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    delete bytes32Storage[k];

  }
```
</details>

### deleteAddressArrayItem

```solidity
function deleteAddressArrayItem(bytes32 k, address v) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayItem(bytes32 k, address v) public override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    require(addressArrayPositionMap[k][v] > 0, "Not found");

    uint256 i = addressArrayPositionMap[k][v] - 1;

    uint256 count = addressArrayStorage[k].length;

    if (i + 1 != count) {

      addressArrayStorage[k][i] = addressArrayStorage[k][count - 1];

      address theThenLastAddress = addressArrayStorage[k][i];

      addressArrayPositionMap[k][theThenLastAddress] = i + 1;

    }

    addressArrayStorage[k].pop();

    delete addressArrayPositionMap[k][v];

  }
```
</details>

### deleteBytes32ArrayItem

```solidity
function deleteBytes32ArrayItem(bytes32 k, bytes32 v) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| v | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayItem(bytes32 k, bytes32 v) public override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    require(bytes32ArrayPositionMap[k][v] > 0, "Not found");

    uint256 i = bytes32ArrayPositionMap[k][v] - 1;

    uint256 count = bytes32ArrayStorage[k].length;

    if (i + 1 != count) {

      bytes32ArrayStorage[k][i] = bytes32ArrayStorage[k][count - 1];

      bytes32 theThenLastBytes32 = bytes32ArrayStorage[k][i];

      bytes32ArrayPositionMap[k][theThenLastBytes32] = i + 1;

    }

    bytes32ArrayStorage[k].pop();

    delete bytes32ArrayPositionMap[k][v];

  }
```
</details>

### deleteAddressArrayItemByIndex

```solidity
function deleteAddressArrayItemByIndex(bytes32 k, uint256 i) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| i | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayItemByIndex(bytes32 k, uint256 i) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    require(i < addressArrayStorage[k].length, "Invalid index");

    address v = addressArrayStorage[k][i];

    deleteAddressArrayItem(k, v);

  }
```
</details>

### deleteBytes32ArrayItemByIndex

```solidity
function deleteBytes32ArrayItemByIndex(bytes32 k, uint256 i) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| i | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayItemByIndex(bytes32 k, uint256 i) external override {

    _throwIfPaused();

    _throwIfSenderNotProtocolMember();

    require(i < bytes32ArrayStorage[k].length, "Invalid index");

    bytes32 v = bytes32ArrayStorage[k][i];

    deleteBytes32ArrayItem(k, v);

  }
```
</details>

### getAddressValues

```solidity
function getAddressValues(bytes32[] keys) external view
returns(values address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| keys | bytes32[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressValues(bytes32[] calldata keys) external view override returns (address[] memory values) {

    values = new address[](keys.length);

    for (uint256 i = 0; i < keys.length; i++) {

      values[i] = addressStorage[keys[i]];

    }

  }
```
</details>

### getAddress

```solidity
function getAddress(bytes32 k) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddress(bytes32 k) external view override returns (address) {

    return addressStorage[k];

  }
```
</details>

### getAddressBoolean

```solidity
function getAddressBoolean(bytes32 k, address a) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| a | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressBoolean(bytes32 k, address a) external view override returns (bool) {

    return addressBooleanStorage[k][a];

  }
```
</details>

### getUintValues

```solidity
function getUintValues(bytes32[] keys) external view
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| keys | bytes32[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUintValues(bytes32[] calldata keys) external view override returns (uint256[] memory values) {

    values = new uint256[](keys.length);

    for (uint256 i = 0; i < keys.length; i++) {

      values[i] = uintStorage[keys[i]];

    }

  }
```
</details>

### getUint

```solidity
function getUint(bytes32 k) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUint(bytes32 k) external view override returns (uint256) {

    return uintStorage[k];

  }
```
</details>

### getUints

```solidity
function getUints(bytes32 k) external view
returns(uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUints(bytes32 k) external view override returns (uint256[] memory) {

    return uintsStorage[k];

  }
```
</details>

### getString

```solidity
function getString(bytes32 k) external view
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getString(bytes32 k) external view override returns (string memory) {

    return stringStorage[k];

  }
```
</details>

### getBytes

```solidity
function getBytes(bytes32 k) external view
returns(bytes)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes(bytes32 k) external view override returns (bytes memory) {

    return bytesStorage[k];

  }
```
</details>

### getBool

```solidity
function getBool(bytes32 k) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBool(bytes32 k) external view override returns (bool) {

    return boolStorage[k];

  }
```
</details>

### getInt

```solidity
function getInt(bytes32 k) external view
returns(int256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInt(bytes32 k) external view override returns (int256) {

    return intStorage[k];

  }
```
</details>

### getBytes32

```solidity
function getBytes32(bytes32 k) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32(bytes32 k) external view override returns (bytes32) {

    return bytes32Storage[k];

  }
```
</details>

### getAddressArray

```solidity
function getAddressArray(bytes32 k) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArray(bytes32 k) external view override returns (address[] memory) {

    return addressArrayStorage[k];

  }
```
</details>

### getBytes32Array

```solidity
function getBytes32Array(bytes32 k) external view
returns(bytes32[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32Array(bytes32 k) external view override returns (bytes32[] memory) {

    return bytes32ArrayStorage[k];

  }
```
</details>

### getAddressArrayItemPosition

```solidity
function getAddressArrayItemPosition(bytes32 k, address toFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| toFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemPosition(bytes32 k, address toFind) external view override returns (uint256) {

    return addressArrayPositionMap[k][toFind];

  }
```
</details>

### getBytes32ArrayItemPosition

```solidity
function getBytes32ArrayItemPosition(bytes32 k, bytes32 toFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| toFind | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemPosition(bytes32 k, bytes32 toFind) external view override returns (uint256) {

    return bytes32ArrayPositionMap[k][toFind];

  }
```
</details>

### getAddressArrayItemByIndex

```solidity
function getAddressArrayItemByIndex(bytes32 k, uint256 i) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| i | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemByIndex(bytes32 k, uint256 i) external view override returns (address) {

    require(addressArrayStorage[k].length > i, "Invalid index");

    return addressArrayStorage[k][i];

  }
```
</details>

### getBytes32ArrayItemByIndex

```solidity
function getBytes32ArrayItemByIndex(bytes32 k, uint256 i) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 
| i | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemByIndex(bytes32 k, uint256 i) external view override returns (bytes32) {

    require(bytes32ArrayStorage[k].length > i, "Invalid index");

    return bytes32ArrayStorage[k][i];

  }
```
</details>

### countAddressArrayItems

```solidity
function countAddressArrayItems(bytes32 k) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countAddressArrayItems(bytes32 k) external view override returns (uint256) {

    return addressArrayStorage[k].length;

  }
```
</details>

### countBytes32ArrayItems

```solidity
function countBytes32ArrayItems(bytes32 k) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countBytes32ArrayItems(bytes32 k) external view override returns (uint256) {

    return bytes32ArrayStorage[k].length;

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
