# ProtoUtilV1.sol

View Source: [contracts/libraries/ProtoUtilV1.sol](../contracts/libraries/ProtoUtilV1.sol)

**ProtoUtilV1**

## Contract Members
**Constants & Variables**

```js
bytes32 public constant NS_ASSURANCE_VAULT;
bytes32 public constant NS_BURNER;
bytes32 public constant NS_CONTRACTS;
bytes32 public constant NS_MEMBERS;
bytes32 public constant NS_CORE;
bytes32 public constant NS_COVER;
bytes32 public constant NS_GOVERNANCE;
bytes32 public constant NS_COVER_ASSURANCE;
bytes32 public constant NS_COVER_ASSURANCE_TOKEN;
bytes32 public constant NS_COVER_ASSURANCE_WEIGHT;
bytes32 public constant NS_COVER_CLAIMABLE;
bytes32 public constant NS_COVER_FEE;
bytes32 public constant NS_COVER_INFO;
bytes32 public constant NS_COVER_LIQUIDITY;
bytes32 public constant NS_COVER_LIQUIDITY_COMMITTED;
bytes32 public constant NS_COVER_LIQUIDITY_NAME;
bytes32 public constant NS_COVER_LIQUIDITY_TOKEN;
bytes32 public constant NS_COVER_LIQUIDITY_RELEASE_DATE;
bytes32 public constant NS_COVER_OWNER;
bytes32 public constant NS_COVER_POLICY;
bytes32 public constant NS_COVER_POLICY_ADMIN;
bytes32 public constant NS_COVER_POLICY_MANAGER;
bytes32 public constant NS_COVER_POLICY_RATE_FLOOR;
bytes32 public constant NS_COVER_POLICY_RATE_CEILING;
bytes32 public constant NS_COVER_PROVISION;
bytes32 public constant NS_COVER_STAKE;
bytes32 public constant NS_COVER_STAKE_OWNED;
bytes32 public constant NS_COVER_STATUS;
bytes32 public constant NS_COVER_VAULT;
bytes32 public constant NS_COVER_VAULT_FACTORY;
bytes32 public constant NS_COVER_CTOKEN;
bytes32 public constant NS_COVER_CTOKEN_FACTORY;
bytes32 public constant NS_TREASURY;
bytes32 public constant NS_PRICE_DISCOVERY;
bytes32 public constant NS_REPORTING_PERIOD;
bytes32 public constant NS_CLAIM_PERIOD;
bytes32 public constant NS_REPORTING_INCIDENT_DATE;
bytes32 public constant NS_RESOLUTION_TS;
bytes32 public constant NS_CLAIM_EXPIRY_TS;
bytes32 public constant NS_REPORTING_WITNESS_YES;
bytes32 public constant NS_REPORTING_WITNESS_NO;
bytes32 public constant NS_REPORTING_STAKE_OWNED_YES;
bytes32 public constant NS_REPORTING_STAKE_OWNED_NO;
bytes32 public constant NS_SETUP_NEP;
bytes32 public constant NS_SETUP_COVER_FEE;
bytes32 public constant NS_SETUP_MIN_STAKE;
bytes32 public constant NS_SETUP_REPORTING_STAKE;
bytes32 public constant NS_SETUP_MIN_LIQ_PERIOD;
bytes32 public constant CNAME_PROTOCOL;
bytes32 public constant CNAME_TREASURY;
bytes32 public constant CNAME_POLICY;
bytes32 public constant CNAME_POLICY_ADMIN;
bytes32 public constant CNAME_POLICY_MANAGER;
bytes32 public constant CNAME_PRICE_DISCOVERY;
bytes32 public constant CNAME_COVER;
bytes32 public constant CNAME_GOVERNANCE;
bytes32 public constant CNAME_VAULT_FACTORY;
bytes32 public constant CNAME_CTOKEN_FACTORY;
bytes32 public constant CNAME_COVER_PROVISION;
bytes32 public constant CNAME_COVER_STAKE;
bytes32 public constant CNAME_COVER_ASSURANCE;
bytes32 public constant CNAME_LIQUIDITY_VAULT;

```

## Functions

- [getProtocol(IStore s)](#getprotocol)
- [getCoverFee(IStore s)](#getcoverfee)
- [getMinCoverStake(IStore s)](#getmincoverstake)
- [getMinLiquidityPeriod(IStore s)](#getminliquidityperiod)
- [getContract(IStore s, bytes32 name)](#getcontract)
- [isProtocolMember(IStore s, address contractAddress)](#isprotocolmember)
- [mustBeProtocolMember(IStore s, address contractAddress)](#mustbeprotocolmember)
- [mustBeExactContract(IStore s, bytes32 name, address sender)](#mustbeexactcontract)
- [nepToken(IStore s)](#neptoken)
- [getTreasury(IStore s)](#gettreasury)
- [getAssuranceVault(IStore s)](#getassurancevault)
- [getLiquidityToken(IStore s)](#getliquiditytoken)
- [getBurnAddress(IStore s)](#getburnaddress)
- [toKeccak256(bytes value)](#tokeccak256)
- [_isProtocolMember(IStore s, address contractAddress)](#_isprotocolmember)
- [_getContract(IStore s, bytes32 name)](#_getcontract)
- [_getProtocol(IStore s)](#_getprotocol)
- [addContract(IStore s, bytes32 namespace, address contractAddress)](#addcontract)
- [_addContract(IStore s, bytes32 namespace, address contractAddress)](#_addcontract)
- [deleteContract(IStore s, bytes32 namespace, address contractAddress)](#deletecontract)
- [_deleteContract(IStore s, bytes32 namespace, address contractAddress)](#_deletecontract)
- [upgradeContract(IStore s, bytes32 namespace, address previous, address current)](#upgradecontract)
- [addMember(IStore s, address member)](#addmember)
- [removeMember(IStore s, address member)](#removemember)
- [_addMember(IStore s, address member)](#_addmember)
- [_removeMember(IStore s, address member)](#_removemember)

### getProtocol

```solidity
function getProtocol(IStore s) external view
returns(contract IProtocol)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProtocol(IStore s) external view returns (IProtocol) {
    return _getProtocol(s);
  }
```
</details>

### getCoverFee

```solidity
function getCoverFee(IStore s) external view
returns(fee uint256, minStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverFee(IStore s) external view returns (uint256 fee, uint256 minStake) {
    fee = s.getUintByKey(NS_SETUP_COVER_FEE);
    minStake = s.getUintByKey(NS_SETUP_MIN_STAKE);
  }
```
</details>

### getMinCoverStake

```solidity
function getMinCoverStake(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinCoverStake(IStore s) external view returns (uint256) {
    return s.getUintByKey(NS_SETUP_MIN_STAKE);
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
    return s.getUintByKey(NS_SETUP_MIN_LIQ_PERIOD);
  }
```
</details>

### getContract

```solidity
function getContract(IStore s, bytes32 name) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getContract(IStore s, bytes32 name) external view returns (address) {
    return _getContract(s, name);
  }
```
</details>

### isProtocolMember

```solidity
function isProtocolMember(IStore s, address contractAddress) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isProtocolMember(IStore s, address contractAddress) external view returns (bool) {
    return _isProtocolMember(s, contractAddress);
  }
```
</details>

### mustBeProtocolMember

Reverts if the caller is one of the protocol members.

```solidity
function mustBeProtocolMember(IStore s, address contractAddress) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeProtocolMember(IStore s, address contractAddress) external view {
    bool isMember = _isProtocolMember(s, contractAddress);
    require(isMember, "Not a protocol member");
  }
```
</details>

### mustBeExactContract

Ensures that the sender matches with the exact contract having the specified name.

```solidity
function mustBeExactContract(IStore s, bytes32 name, address sender) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender Enter the `msg.sender` value | 
| name | bytes32 | Enter the name of the contract | 
| sender | address | Enter the `msg.sender` value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeExactContract(
    IStore s,
    bytes32 name,
    address sender
  ) external view {
    address contractAddress = _getContract(s, name);
    require(sender == contractAddress, "Access denied");
  }
```
</details>

### nepToken

```solidity
function nepToken(IStore s) external view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function nepToken(IStore s) external view returns (IERC20) {
    address nep = s.getAddressByKey(NS_SETUP_NEP);
    return IERC20(nep);
  }
```
</details>

### getTreasury

```solidity
function getTreasury(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getTreasury(IStore s) external view returns (address) {
    return s.getAddressByKey(NS_TREASURY);
  }
```
</details>

### getAssuranceVault

```solidity
function getAssuranceVault(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAssuranceVault(IStore s) external view returns (address) {
    return s.getAddressByKey(NS_ASSURANCE_VAULT);
  }
```
</details>

### getLiquidityToken

```solidity
function getLiquidityToken(IStore s) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityToken(IStore s) public view returns (address) {
    return s.getAddressByKey(NS_COVER_LIQUIDITY_TOKEN);
  }
```
</details>

### getBurnAddress

```solidity
function getBurnAddress(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBurnAddress(IStore s) external view returns (address) {
    return s.getAddressByKey(NS_BURNER);
  }
```
</details>

### toKeccak256

```solidity
function toKeccak256(bytes value) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | bytes |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function toKeccak256(bytes memory value) external pure returns (bytes32) {
    return keccak256(value);
  }
```
</details>

### _isProtocolMember

```solidity
function _isProtocolMember(IStore s, address contractAddress) private view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _isProtocolMember(IStore s, address contractAddress) private view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, contractAddress);
  }
```
</details>

### _getContract

```solidity
function _getContract(IStore s, bytes32 name) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getContract(IStore s, bytes32 name) private view returns (address) {
    return s.getAddressByKeys(NS_CONTRACTS, name);
  }
```
</details>

### _getProtocol

```solidity
function _getProtocol(IStore s) private view
returns(contract IProtocol)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getProtocol(IStore s) private view returns (IProtocol) {
    address protocol = s.getAddressByKey(NS_CORE);
    return IProtocol(protocol);
  }
```
</details>

### addContract

```solidity
function addContract(IStore s, bytes32 namespace, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) external {
    _addContract(s, namespace, contractAddress);
  }
```
</details>

### _addContract

```solidity
function _addContract(IStore s, bytes32 namespace, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) private {
    s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, contractAddress);
    _addMember(s, contractAddress);
  }
```
</details>

### deleteContract

```solidity
function deleteContract(IStore s, bytes32 namespace, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deleteContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) external {
    _deleteContract(s, namespace, contractAddress);
  }
```
</details>

### _deleteContract

```solidity
function _deleteContract(IStore s, bytes32 namespace, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _deleteContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) private {
    s.deleteAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace);
    _removeMember(s, contractAddress);
  }
```
</details>

### upgradeContract

```solidity
function upgradeContract(IStore s, bytes32 namespace, address previous, address current) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgradeContract(
    IStore s,
    bytes32 namespace,
    address previous,
    address current
  ) external {
    bool isMember = _isProtocolMember(s, previous);
    require(isMember, "Not a protocol member");

    _deleteContract(s, namespace, previous);
    _addContract(s, namespace, current);
  }
```
</details>

### addMember

```solidity
function addMember(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMember(IStore s, address member) external {
    _addMember(s, member);
  }
```
</details>

### removeMember

```solidity
function removeMember(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeMember(IStore s, address member) external {
    _removeMember(s, member);
  }
```
</details>

### _addMember

```solidity
function _addMember(IStore s, address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addMember(IStore s, address member) private {
    require(s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, member) == false, "Already exists");
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, member, true);
  }
```
</details>

### _removeMember

```solidity
function _removeMember(IStore s, address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _removeMember(IStore s, address member) private {
    s.deleteBoolByKeys(ProtoUtilV1.NS_MEMBERS, member);
  }
```
</details>

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
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
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
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
