# MockStoreKeyUtilUser.sol

View Source: [\contracts\mock\lib-user\MockStoreKeyUtilUser.sol](..\contracts\mock\lib-user\MockStoreKeyUtilUser.sol)

**MockStoreKeyUtilUser**

## Contract Members
**Constants & Variables**

```js
contract IStore public s;

```

## Functions

- [constructor(IStore store)](#)
- [setUintByKey(bytes32 key, uint256 value)](#setuintbykey)
- [setUintByKeys(bytes32 key1, bytes32 key2, uint256 value)](#setuintbykeys)
- [setUintByKeys(bytes32 key1, bytes32 key2, address account, uint256 value)](#setuintbykeys)
- [addUintByKey(bytes32 key, uint256 value)](#adduintbykey)
- [addUintByKeys(bytes32 key1, bytes32 key2, uint256 value)](#adduintbykeys)
- [addUintByKeys(bytes32 key1, bytes32 key2, address account, uint256 value)](#adduintbykeys)
- [subtractUintByKey(bytes32 key, uint256 value)](#subtractuintbykey)
- [subtractUintByKeys(bytes32 key1, bytes32 key2, uint256 value)](#subtractuintbykeys)
- [subtractUintByKeys(bytes32 key1, bytes32 key2, address account, uint256 value)](#subtractuintbykeys)
- [setStringByKey(bytes32 key, string value)](#setstringbykey)
- [setStringByKeys(bytes32 key1, bytes32 key2, string value)](#setstringbykeys)
- [setBytes32ByKey(bytes32 key, bytes32 value)](#setbytes32bykey)
- [setBytes32ByKeys(bytes32 key1, bytes32 key2, bytes32 value)](#setbytes32bykeys)
- [setBoolByKey(bytes32 key, bool value)](#setboolbykey)
- [setBoolByKeys(bytes32 key1, bytes32 key2, bool value)](#setboolbykeys)
- [setBoolByKeys(bytes32 key, address account, bool value)](#setboolbykeys)
- [setAddressByKey(bytes32 key, address value)](#setaddressbykey)
- [setAddressByKeys(bytes32 key1, bytes32 key2, address value)](#setaddressbykeys)
- [setAddressByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address value)](#setaddressbykeys)
- [setAddressArrayByKey(bytes32 key, address value)](#setaddressarraybykey)
- [setAddressArrayByKeys(bytes32 key1, bytes32 key2, address value)](#setaddressarraybykeys)
- [setAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address value)](#setaddressarraybykeys)
- [setAddressBooleanByKey(bytes32 key, address account, bool value)](#setaddressbooleanbykey)
- [setAddressBooleanByKeys(bytes32 key1, bytes32 key2, address account, bool value)](#setaddressbooleanbykeys)
- [setAddressBooleanByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address account, bool value)](#setaddressbooleanbykeys)
- [deleteUintByKey(bytes32 key)](#deleteuintbykey)
- [deleteUintByKeys(bytes32 key1, bytes32 key2)](#deleteuintbykeys)
- [deleteBytes32ByKey(bytes32 key)](#deletebytes32bykey)
- [deleteBytes32ByKeys(bytes32 key1, bytes32 key2)](#deletebytes32bykeys)
- [deleteBytes32ArrayByKey(bytes32 key, bytes32 value)](#deletebytes32arraybykey)
- [deleteBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 value)](#deletebytes32arraybykeys)
- [deleteBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value)](#deletebytes32arraybykeys)
- [deleteBytes32ArrayByIndexByKey(bytes32 key, uint256 index)](#deletebytes32arraybyindexbykey)
- [deleteBytes32ArrayByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index)](#deletebytes32arraybyindexbykeys)
- [deleteBytes32ArrayByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#deletebytes32arraybyindexbykeys)
- [deleteBoolByKey(bytes32 key)](#deleteboolbykey)
- [deleteBoolByKeys(bytes32 key1, bytes32 key2)](#deleteboolbykeys)
- [deleteBoolByKeys(bytes32 key, address account)](#deleteboolbykeys)
- [deleteAddressByKey(bytes32 key)](#deleteaddressbykey)
- [deleteAddressByKeys(bytes32 key1, bytes32 key2)](#deleteaddressbykeys)
- [deleteAddressByKeys(bytes32 key1, bytes32 key2, bytes32 key3)](#deleteaddressbykeys)
- [deleteAddressArrayByKey(bytes32 key, address value)](#deleteaddressarraybykey)
- [deleteAddressArrayByKeys(bytes32 key1, bytes32 key2, address value)](#deleteaddressarraybykeys)
- [deleteAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address value)](#deleteaddressarraybykeys)
- [deleteAddressArrayByIndexByKey(bytes32 key, uint256 index)](#deleteaddressarraybyindexbykey)
- [deleteAddressArrayByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index)](#deleteaddressarraybyindexbykeys)
- [deleteAddressArrayByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#deleteaddressarraybyindexbykeys)
- [getUintByKey(bytes32 key)](#getuintbykey)
- [getUintByKeys(bytes32 key1, bytes32 key2)](#getuintbykeys)
- [getUintByKeys(bytes32 key1, bytes32 key2, address account)](#getuintbykeys)
- [getStringByKey(bytes32 key)](#getstringbykey)
- [getStringByKeys(bytes32 key1, bytes32 key2)](#getstringbykeys)
- [getBytes32ByKey(bytes32 key)](#getbytes32bykey)
- [getBytes32ByKeys(bytes32 key1, bytes32 key2)](#getbytes32bykeys)
- [getBoolByKey(bytes32 key)](#getboolbykey)
- [getBoolByKeys(bytes32 key1, bytes32 key2)](#getboolbykeys)
- [getBoolByKeys(bytes32 key, address account)](#getboolbykeys)
- [getAddressByKey(bytes32 key)](#getaddressbykey)
- [getAddressByKeys(bytes32 key1, bytes32 key2)](#getaddressbykeys)
- [getAddressByKeys(bytes32 key1, bytes32 key2, bytes32 key3)](#getaddressbykeys)
- [getAddressBooleanByKey(bytes32 key, address account)](#getaddressbooleanbykey)
- [getAddressBooleanByKeys(bytes32 key1, bytes32 key2, address account)](#getaddressbooleanbykeys)
- [getAddressBooleanByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address account)](#getaddressbooleanbykeys)
- [countAddressArrayByKey(bytes32 key)](#countaddressarraybykey)
- [countAddressArrayByKeys(bytes32 key1, bytes32 key2)](#countaddressarraybykeys)
- [countAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3)](#countaddressarraybykeys)
- [getAddressArrayByKey(bytes32 key)](#getaddressarraybykey)
- [getAddressArrayByKeys(bytes32 key1, bytes32 key2)](#getaddressarraybykeys)
- [getAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3)](#getaddressarraybykeys)
- [getAddressArrayItemPositionByKey(bytes32 key, address addressToFind)](#getaddressarrayitempositionbykey)
- [getAddressArrayItemPositionByKeys(bytes32 key1, bytes32 key2, address addressToFind)](#getaddressarrayitempositionbykeys)
- [getAddressArrayItemPositionByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address addressToFind)](#getaddressarrayitempositionbykeys)
- [getAddressArrayItemByIndexByKey(bytes32 key, uint256 index)](#getaddressarrayitembyindexbykey)
- [getAddressArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index)](#getaddressarrayitembyindexbykeys)
- [getAddressArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#getaddressarrayitembyindexbykeys)
- [setBytes32ArrayByKey(bytes32 key, bytes32 value)](#setbytes32arraybykey)
- [setBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 value)](#setbytes32arraybykeys)
- [setBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value)](#setbytes32arraybykeys)
- [countBytes32ArrayByKey(bytes32 key)](#countbytes32arraybykey)
- [countBytes32ArrayByKeys(bytes32 key1, bytes32 key2)](#countbytes32arraybykeys)
- [countBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3)](#countbytes32arraybykeys)
- [getBytes32ArrayByKey(bytes32 key)](#getbytes32arraybykey)
- [getBytes32ArrayByKeys(bytes32 key1, bytes32 key2)](#getbytes32arraybykeys)
- [getBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3)](#getbytes32arraybykeys)
- [getBytes32ArrayItemPositionByKey(bytes32 key, bytes32 bytes32ToFind)](#getbytes32arrayitempositionbykey)
- [getBytes32ArrayItemPositionByKeys(bytes32 key1, bytes32 key2, bytes32 bytes32ToFind)](#getbytes32arrayitempositionbykeys)
- [getBytes32ArrayItemPositionByKeys(bytes32 key1, bytes32 key2, bytes32 key3, bytes32 bytes32ToFind)](#getbytes32arrayitempositionbykeys)
- [getBytes32ArrayItemByIndexByKey(bytes32 key, uint256 index)](#getbytes32arrayitembyindexbykey)
- [getBytes32ArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index)](#getbytes32arrayitembyindexbykeys)
- [getBytes32ArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index)](#getbytes32arrayitembyindexbykeys)

### 

```solidity
function (IStore store) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) {

    s = store;

  }
```
</details>

### setUintByKey

```solidity
function setUintByKey(bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUintByKey(bytes32 key, uint256 value) external {

    s.setUintByKey(key, value);

  }
```
</details>

### setUintByKeys

```solidity
function setUintByKeys(bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUintByKeys(

    bytes32 key1,

    bytes32 key2,

    uint256 value

  ) external {

    s.setUintByKeys(key1, key2, value);

  }
```
</details>

### setUintByKeys

```solidity
function setUintByKeys(bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setUintByKeys(

    bytes32 key1,

    bytes32 key2,

    address account,

    uint256 value

  ) external {

    s.setUintByKeys(key1, key2, account, value);

  }
```
</details>

### addUintByKey

```solidity
function addUintByKey(bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addUintByKey(bytes32 key, uint256 value) external {

    s.addUintByKey(key, value);

  }
```
</details>

### addUintByKeys

```solidity
function addUintByKeys(bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addUintByKeys(

    bytes32 key1,

    bytes32 key2,

    uint256 value

  ) external {

    s.addUintByKeys(key1, key2, value);

  }
```
</details>

### addUintByKeys

```solidity
function addUintByKeys(bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addUintByKeys(

    bytes32 key1,

    bytes32 key2,

    address account,

    uint256 value

  ) external {

    s.addUintByKeys(key1, key2, account, value);

  }
```
</details>

### subtractUintByKey

```solidity
function subtractUintByKey(bytes32 key, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subtractUintByKey(bytes32 key, uint256 value) external {

    s.subtractUintByKey(key, value);

  }
```
</details>

### subtractUintByKeys

```solidity
function subtractUintByKeys(bytes32 key1, bytes32 key2, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subtractUintByKeys(

    bytes32 key1,

    bytes32 key2,

    uint256 value

  ) external {

    s.subtractUintByKeys(key1, key2, value);

  }
```
</details>

### subtractUintByKeys

```solidity
function subtractUintByKeys(bytes32 key1, bytes32 key2, address account, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function subtractUintByKeys(

    bytes32 key1,

    bytes32 key2,

    address account,

    uint256 value

  ) external {

    s.subtractUintByKeys(key1, key2, account, value);

  }
```
</details>

### setStringByKey

```solidity
function setStringByKey(bytes32 key, string value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | string |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setStringByKey(bytes32 key, string calldata value) external {

    s.setStringByKey(key, value);

  }
```
</details>

### setStringByKeys

```solidity
function setStringByKeys(bytes32 key1, bytes32 key2, string value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | string |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setStringByKeys(

    bytes32 key1,

    bytes32 key2,

    string calldata value

  ) external {

    s.setStringByKeys(key1, key2, value);

  }
```
</details>

### setBytes32ByKey

```solidity
function setBytes32ByKey(bytes32 key, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ByKey(bytes32 key, bytes32 value) external {

    s.setBytes32ByKey(key, value);

  }
```
</details>

### setBytes32ByKeys

```solidity
function setBytes32ByKeys(bytes32 key1, bytes32 key2, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 value

  ) external {

    s.setBytes32ByKeys(key1, key2, value);

  }
```
</details>

### setBoolByKey

```solidity
function setBoolByKey(bytes32 key, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBoolByKey(bytes32 key, bool value) external {

    s.setBoolByKey(key, value);

  }
```
</details>

### setBoolByKeys

```solidity
function setBoolByKeys(bytes32 key1, bytes32 key2, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBoolByKeys(

    bytes32 key1,

    bytes32 key2,

    bool value

  ) external {

    s.setBoolByKeys(key1, key2, value);

  }
```
</details>

### setBoolByKeys

```solidity
function setBoolByKeys(bytes32 key, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBoolByKeys(

    bytes32 key,

    address account,

    bool value

  ) external {

    s.setBoolByKeys(key, account, value);

  }
```
</details>

### setAddressByKey

```solidity
function setAddressByKey(bytes32 key, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressByKey(bytes32 key, address value) external {

    s.setAddressByKey(key, value);

  }
```
</details>

### setAddressByKeys

```solidity
function setAddressByKeys(bytes32 key1, bytes32 key2, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressByKeys(

    bytes32 key1,

    bytes32 key2,

    address value

  ) external {

    s.setAddressByKeys(key1, key2, value);

  }
```
</details>

### setAddressByKeys

```solidity
function setAddressByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    address value

  ) external {

    s.setAddressByKeys(key1, key2, key3, value);

  }
```
</details>

### setAddressArrayByKey

```solidity
function setAddressArrayByKey(bytes32 key, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressArrayByKey(bytes32 key, address value) external {

    s.setAddressArrayByKey(key, value);

  }
```
</details>

### setAddressArrayByKeys

```solidity
function setAddressArrayByKeys(bytes32 key1, bytes32 key2, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    address value

  ) external {

    s.setAddressArrayByKeys(key1, key2, value);

  }
```
</details>

### setAddressArrayByKeys

```solidity
function setAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    address value

  ) external {

    s.setAddressArrayByKeys(key1, key2, key3, value);

  }
```
</details>

### setAddressBooleanByKey

```solidity
function setAddressBooleanByKey(bytes32 key, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressBooleanByKey(

    bytes32 key,

    address account,

    bool value

  ) external {

    s.setAddressBooleanByKey(key, account, value);

  }
```
</details>

### setAddressBooleanByKeys

```solidity
function setAddressBooleanByKeys(bytes32 key1, bytes32 key2, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressBooleanByKeys(

    bytes32 key1,

    bytes32 key2,

    address account,

    bool value

  ) external {

    s.setAddressBooleanByKeys(key1, key2, account, value);

  }
```
</details>

### setAddressBooleanByKeys

```solidity
function setAddressBooleanByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address account, bool value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| account | address |  | 
| value | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAddressBooleanByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    address account,

    bool value

  ) external {

    s.setAddressBooleanByKeys(key1, key2, key3, account, value);

  }
```
</details>

### deleteUintByKey

```solidity
function deleteUintByKey(bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteUintByKey(bytes32 key) external {

    s.deleteUintByKey(key);

  }
```
</details>

### deleteUintByKeys

```solidity
function deleteUintByKeys(bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteUintByKeys(bytes32 key1, bytes32 key2) external {

    s.deleteUintByKeys(key1, key2);

  }
```
</details>

### deleteBytes32ByKey

```solidity
function deleteBytes32ByKey(bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ByKey(bytes32 key) external {

    s.deleteBytes32ByKey(key);

  }
```
</details>

### deleteBytes32ByKeys

```solidity
function deleteBytes32ByKeys(bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ByKeys(bytes32 key1, bytes32 key2) external {

    s.deleteBytes32ByKeys(key1, key2);

  }
```
</details>

### deleteBytes32ArrayByKey

```solidity
function deleteBytes32ArrayByKey(bytes32 key, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByKey(bytes32 key, bytes32 value) external {

    s.deleteBytes32ArrayByKey(key, value);

  }
```
</details>

### deleteBytes32ArrayByKeys

```solidity
function deleteBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 value

  ) external {

    s.deleteBytes32ArrayByKeys(key1, key2, value);

  }
```
</details>

### deleteBytes32ArrayByKeys

```solidity
function deleteBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    bytes32 value

  ) external {

    s.deleteBytes32ArrayByKeys(key1, key2, key3, value);

  }
```
</details>

### deleteBytes32ArrayByIndexByKey

```solidity
function deleteBytes32ArrayByIndexByKey(bytes32 key, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByIndexByKey(bytes32 key, uint256 index) external {

    s.deleteBytes32ArrayByIndexByKey(key, index);

  }
```
</details>

### deleteBytes32ArrayByIndexByKeys

```solidity
function deleteBytes32ArrayByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    uint256 index

  ) external {

    s.deleteBytes32ArrayByIndexByKeys(key1, key2, index);

  }
```
</details>

### deleteBytes32ArrayByIndexByKeys

```solidity
function deleteBytes32ArrayByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBytes32ArrayByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    uint256 index

  ) external {

    s.deleteBytes32ArrayByIndexByKeys(key1, key2, key3, index);

  }
```
</details>

### deleteBoolByKey

```solidity
function deleteBoolByKey(bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBoolByKey(bytes32 key) external {

    s.deleteBoolByKey(key);

  }
```
</details>

### deleteBoolByKeys

```solidity
function deleteBoolByKeys(bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBoolByKeys(bytes32 key1, bytes32 key2) external {

    s.deleteBoolByKeys(key1, key2);

  }
```
</details>

### deleteBoolByKeys

```solidity
function deleteBoolByKeys(bytes32 key, address account) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteBoolByKeys(bytes32 key, address account) external {

    s.deleteBoolByKeys(key, account);

  }
```
</details>

### deleteAddressByKey

```solidity
function deleteAddressByKey(bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressByKey(bytes32 key) external {

    s.deleteAddressByKey(key);

  }
```
</details>

### deleteAddressByKeys

```solidity
function deleteAddressByKeys(bytes32 key1, bytes32 key2) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressByKeys(bytes32 key1, bytes32 key2) external {

    s.deleteAddressByKeys(key1, key2);

  }
```
</details>

### deleteAddressByKeys

```solidity
function deleteAddressByKeys(bytes32 key1, bytes32 key2, bytes32 key3) external nonpayable
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
function deleteAddressByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3

  ) external {

    s.deleteAddressByKeys(key1, key2, key3);

  }
```
</details>

### deleteAddressArrayByKey

```solidity
function deleteAddressArrayByKey(bytes32 key, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByKey(bytes32 key, address value) external {

    s.deleteAddressArrayByKey(key, value);

  }
```
</details>

### deleteAddressArrayByKeys

```solidity
function deleteAddressArrayByKeys(bytes32 key1, bytes32 key2, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    address value

  ) external {

    s.deleteAddressArrayByKeys(key1, key2, value);

  }
```
</details>

### deleteAddressArrayByKeys

```solidity
function deleteAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    address value

  ) external {

    s.deleteAddressArrayByKeys(key1, key2, key3, value);

  }
```
</details>

### deleteAddressArrayByIndexByKey

```solidity
function deleteAddressArrayByIndexByKey(bytes32 key, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByIndexByKey(bytes32 key, uint256 index) external {

    s.deleteAddressArrayByIndexByKey(key, index);

  }
```
</details>

### deleteAddressArrayByIndexByKeys

```solidity
function deleteAddressArrayByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    uint256 index

  ) external {

    s.deleteAddressArrayByIndexByKeys(key1, key2, index);

  }
```
</details>

### deleteAddressArrayByIndexByKeys

```solidity
function deleteAddressArrayByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteAddressArrayByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    uint256 index

  ) external {

    s.deleteAddressArrayByIndexByKeys(key1, key2, key3, index);

  }
```
</details>

### getUintByKey

```solidity
function getUintByKey(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUintByKey(bytes32 key) external view returns (uint256) {

    return s.getUintByKey(key);

  }
```
</details>

### getUintByKeys

```solidity
function getUintByKeys(bytes32 key1, bytes32 key2) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUintByKeys(bytes32 key1, bytes32 key2) external view returns (uint256) {

    return s.getUintByKeys(key1, key2);

  }
```
</details>

### getUintByKeys

```solidity
function getUintByKeys(bytes32 key1, bytes32 key2, address account) external view
returns(uint256)
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
function getUintByKeys(

    bytes32 key1,

    bytes32 key2,

    address account

  ) external view returns (uint256) {

    return s.getUintByKeys(key1, key2, account);

  }
```
</details>

### getStringByKey

```solidity
function getStringByKey(bytes32 key) external view
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStringByKey(bytes32 key) external view returns (string memory) {

    return s.getStringByKey(key);

  }
```
</details>

### getStringByKeys

```solidity
function getStringByKeys(bytes32 key1, bytes32 key2) external view
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStringByKeys(bytes32 key1, bytes32 key2) external view returns (string memory) {

    return s.getStringByKeys(key1, key2);

  }
```
</details>

### getBytes32ByKey

```solidity
function getBytes32ByKey(bytes32 key) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ByKey(bytes32 key) external view returns (bytes32) {

    return s.getBytes32ByKey(key);

  }
```
</details>

### getBytes32ByKeys

```solidity
function getBytes32ByKeys(bytes32 key1, bytes32 key2) external view
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
function getBytes32ByKeys(bytes32 key1, bytes32 key2) external view returns (bytes32) {

    return s.getBytes32ByKeys(key1, key2);

  }
```
</details>

### getBoolByKey

```solidity
function getBoolByKey(bytes32 key) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBoolByKey(bytes32 key) external view returns (bool) {

    return s.getBoolByKey(key);

  }
```
</details>

### getBoolByKeys

```solidity
function getBoolByKeys(bytes32 key1, bytes32 key2) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBoolByKeys(bytes32 key1, bytes32 key2) external view returns (bool) {

    return s.getBoolByKeys(key1, key2);

  }
```
</details>

### getBoolByKeys

```solidity
function getBoolByKeys(bytes32 key, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBoolByKeys(bytes32 key, address account) external view returns (bool) {

    return s.getBoolByKeys(key, account);

  }
```
</details>

### getAddressByKey

```solidity
function getAddressByKey(bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressByKey(bytes32 key) external view returns (address) {

    return s.getAddressByKey(key);

  }
```
</details>

### getAddressByKeys

```solidity
function getAddressByKeys(bytes32 key1, bytes32 key2) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressByKeys(bytes32 key1, bytes32 key2) external view returns (address) {

    return s.getAddressByKeys(key1, key2);

  }
```
</details>

### getAddressByKeys

```solidity
function getAddressByKeys(bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(address)
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
function getAddressByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3

  ) external view returns (address) {

    return s.getAddressByKeys(key1, key2, key3);

  }
```
</details>

### getAddressBooleanByKey

```solidity
function getAddressBooleanByKey(bytes32 key, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressBooleanByKey(bytes32 key, address account) external view returns (bool) {

    return s.getAddressBooleanByKey(key, account);

  }
```
</details>

### getAddressBooleanByKeys

```solidity
function getAddressBooleanByKeys(bytes32 key1, bytes32 key2, address account) external view
returns(bool)
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
function getAddressBooleanByKeys(

    bytes32 key1,

    bytes32 key2,

    address account

  ) external view returns (bool) {

    return s.getAddressBooleanByKeys(key1, key2, account);

  }
```
</details>

### getAddressBooleanByKeys

```solidity
function getAddressBooleanByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressBooleanByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    address account

  ) external view returns (bool) {

    return s.getAddressBooleanByKeys(key1, key2, key3, account);

  }
```
</details>

### countAddressArrayByKey

```solidity
function countAddressArrayByKey(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countAddressArrayByKey(bytes32 key) external view returns (uint256) {

    return s.countAddressArrayByKey(key);

  }
```
</details>

### countAddressArrayByKeys

```solidity
function countAddressArrayByKeys(bytes32 key1, bytes32 key2) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countAddressArrayByKeys(bytes32 key1, bytes32 key2) external view returns (uint256) {

    return s.countAddressArrayByKeys(key1, key2);

  }
```
</details>

### countAddressArrayByKeys

```solidity
function countAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(uint256)
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
function countAddressArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3

  ) external view returns (uint256) {

    return s.countAddressArrayByKeys(key1, key2, key3);

  }
```
</details>

### getAddressArrayByKey

```solidity
function getAddressArrayByKey(bytes32 key) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayByKey(bytes32 key) external view returns (address[] memory) {

    return s.getAddressArrayByKey(key);

  }
```
</details>

### getAddressArrayByKeys

```solidity
function getAddressArrayByKeys(bytes32 key1, bytes32 key2) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayByKeys(bytes32 key1, bytes32 key2) external view returns (address[] memory) {

    return s.getAddressArrayByKeys(key1, key2);

  }
```
</details>

### getAddressArrayByKeys

```solidity
function getAddressArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(address[])
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
function getAddressArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3

  ) external view returns (address[] memory) {

    return s.getAddressArrayByKeys(key1, key2, key3);

  }
```
</details>

### getAddressArrayItemPositionByKey

```solidity
function getAddressArrayItemPositionByKey(bytes32 key, address addressToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| addressToFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemPositionByKey(bytes32 key, address addressToFind) external view returns (uint256) {

    return s.getAddressArrayItemPositionByKey(key, addressToFind);

  }
```
</details>

### getAddressArrayItemPositionByKeys

```solidity
function getAddressArrayItemPositionByKeys(bytes32 key1, bytes32 key2, address addressToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| addressToFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemPositionByKeys(

    bytes32 key1,

    bytes32 key2,

    address addressToFind

  ) external view returns (uint256) {

    return s.getAddressArrayItemPositionByKeys(key1, key2, addressToFind);

  }
```
</details>

### getAddressArrayItemPositionByKeys

```solidity
function getAddressArrayItemPositionByKeys(bytes32 key1, bytes32 key2, bytes32 key3, address addressToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| addressToFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemPositionByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    address addressToFind

  ) external view returns (uint256) {

    return s.getAddressArrayItemPositionByKeys(key1, key2, key3, addressToFind);

  }
```
</details>

### getAddressArrayItemByIndexByKey

```solidity
function getAddressArrayItemByIndexByKey(bytes32 key, uint256 index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemByIndexByKey(bytes32 key, uint256 index) external view returns (address) {

    return s.getAddressArrayItemByIndexByKey(key, index);

  }
```
</details>

### getAddressArrayItemByIndexByKeys

```solidity
function getAddressArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    uint256 index

  ) external view returns (address) {

    return s.getAddressArrayItemByIndexByKeys(key1, key2, index);

  }
```
</details>

### getAddressArrayItemByIndexByKeys

```solidity
function getAddressArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddressArrayItemByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    uint256 index

  ) external view returns (address) {

    return s.getAddressArrayItemByIndexByKeys(key1, key2, key3, index);

  }
```
</details>

### setBytes32ArrayByKey

```solidity
function setBytes32ArrayByKey(bytes32 key, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ArrayByKey(bytes32 key, bytes32 value) external {

    s.setBytes32ArrayByKey(key, value);

  }
```
</details>

### setBytes32ArrayByKeys

```solidity
function setBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 value

  ) external {

    s.setBytes32ArrayByKeys(key1, key2, value);

  }
```
</details>

### setBytes32ArrayByKeys

```solidity
function setBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3, bytes32 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| value | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setBytes32ArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    bytes32 value

  ) external {

    s.setBytes32ArrayByKeys(key1, key2, key3, value);

  }
```
</details>

### countBytes32ArrayByKey

```solidity
function countBytes32ArrayByKey(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countBytes32ArrayByKey(bytes32 key) external view returns (uint256) {

    return s.countBytes32ArrayByKey(key);

  }
```
</details>

### countBytes32ArrayByKeys

```solidity
function countBytes32ArrayByKeys(bytes32 key1, bytes32 key2) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function countBytes32ArrayByKeys(bytes32 key1, bytes32 key2) external view returns (uint256) {

    return s.countBytes32ArrayByKeys(key1, key2);

  }
```
</details>

### countBytes32ArrayByKeys

```solidity
function countBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(uint256)
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
function countBytes32ArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3

  ) external view returns (uint256) {

    return s.countBytes32ArrayByKeys(key1, key2, key3);

  }
```
</details>

### getBytes32ArrayByKey

```solidity
function getBytes32ArrayByKey(bytes32 key) external view
returns(bytes32[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayByKey(bytes32 key) external view returns (bytes32[] memory) {

    return s.getBytes32ArrayByKey(key);

  }
```
</details>

### getBytes32ArrayByKeys

```solidity
function getBytes32ArrayByKeys(bytes32 key1, bytes32 key2) external view
returns(bytes32[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayByKeys(bytes32 key1, bytes32 key2) external view returns (bytes32[] memory) {

    return s.getBytes32ArrayByKeys(key1, key2);

  }
```
</details>

### getBytes32ArrayByKeys

```solidity
function getBytes32ArrayByKeys(bytes32 key1, bytes32 key2, bytes32 key3) external view
returns(bytes32[])
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
function getBytes32ArrayByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3

  ) external view returns (bytes32[] memory) {

    return s.getBytes32ArrayByKeys(key1, key2, key3);

  }
```
</details>

### getBytes32ArrayItemPositionByKey

```solidity
function getBytes32ArrayItemPositionByKey(bytes32 key, bytes32 bytes32ToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| bytes32ToFind | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemPositionByKey(bytes32 key, bytes32 bytes32ToFind) external view returns (uint256) {

    return s.getBytes32ArrayItemPositionByKey(key, bytes32ToFind);

  }
```
</details>

### getBytes32ArrayItemPositionByKeys

```solidity
function getBytes32ArrayItemPositionByKeys(bytes32 key1, bytes32 key2, bytes32 bytes32ToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| bytes32ToFind | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemPositionByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 bytes32ToFind

  ) external view returns (uint256) {

    return s.getBytes32ArrayItemPositionByKeys(key1, key2, bytes32ToFind);

  }
```
</details>

### getBytes32ArrayItemPositionByKeys

```solidity
function getBytes32ArrayItemPositionByKeys(bytes32 key1, bytes32 key2, bytes32 key3, bytes32 bytes32ToFind) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| bytes32ToFind | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemPositionByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    bytes32 bytes32ToFind

  ) external view returns (uint256) {

    return s.getBytes32ArrayItemPositionByKeys(key1, key2, key3, bytes32ToFind);

  }
```
</details>

### getBytes32ArrayItemByIndexByKey

```solidity
function getBytes32ArrayItemByIndexByKey(bytes32 key, uint256 index) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemByIndexByKey(bytes32 key, uint256 index) external view returns (bytes32) {

    return s.getBytes32ArrayItemByIndexByKey(key, index);

  }
```
</details>

### getBytes32ArrayItemByIndexByKeys

```solidity
function getBytes32ArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, uint256 index) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    uint256 index

  ) external view returns (bytes32) {

    return s.getBytes32ArrayItemByIndexByKeys(key1, key2, index);

  }
```
</details>

### getBytes32ArrayItemByIndexByKeys

```solidity
function getBytes32ArrayItemByIndexByKeys(bytes32 key1, bytes32 key2, bytes32 key3, uint256 index) external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key1 | bytes32 |  | 
| key2 | bytes32 |  | 
| key3 | bytes32 |  | 
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBytes32ArrayItemByIndexByKeys(

    bytes32 key1,

    bytes32 key2,

    bytes32 key3,

    uint256 index

  ) external view returns (bytes32) {

    return s.getBytes32ArrayItemByIndexByKeys(key1, key2, key3, index);

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
