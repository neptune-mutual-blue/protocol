# ProtoUtilV1.sol

View Source: [contracts/libraries/ProtoUtilV1.sol](../contracts/libraries/ProtoUtilV1.sol)

**ProtoUtilV1**

## Contract Members
**Constants & Variables**

```js
bytes32 public constant KP_ASSURANCE_VAULT;
bytes32 public constant KP_BURNER;
bytes32 public constant KP_CONTRACTS;
bytes32 public constant KP_CORE;
bytes32 public constant KP_COVER;
bytes32 public constant KP_COVER_ASSURANCE;
bytes32 public constant KP_COVER_ASSURANCE_TOKEN;
bytes32 public constant KP_COVER_CLAIMABLE;
bytes32 public constant KP_COVER_FEE;
bytes32 public constant KP_COVER_INFO;
bytes32 public constant KP_COVER_LIQUIDITY;
bytes32 public constant KP_COVER_LIQUIDITY_NAME;
bytes32 public constant KP_COVER_LIQUIDITY_TOKEN;
bytes32 public constant KP_COVER_LIQUIDITY_RELEASE_DATE;
bytes32 public constant KP_COVER_OWNER;
bytes32 public constant KP_COVER_PROVISION;
bytes32 public constant KP_COVER_STAKE;
bytes32 public constant KP_COVER_STAKE_OWNED;
bytes32 public constant KP_COVER_STATUS;
bytes32 public constant KP_COVER_VAULT;
bytes32 public constant KP_NEP;
bytes32 public constant KP_TREASURY;
bytes32 public constant CONTRACTS_PROTOCOL;
bytes32 public constant CONTRACTS_TREASURY;
bytes32 public constant CONTRACTS_POLICY;
bytes32 public constant CONTRACTS_COVER;
bytes32 public constant CONTRACTS_VAULT_FACTORY;
bytes32 public constant CONTRACTS_COVER_PROVISION;
bytes32 public constant CONTRACTS_COVER_STAKE;
bytes32 public constant CONTRACTS_LIQUIDITY_VAULT;

```

## Functions

- [getProtocol(IStore s)](#getprotocol)
- [getCoverFee(IStore s)](#getcoverfee)
- [getContract(IStore s, bytes32 name)](#getcontract)
- [isProtocolMember(IStore s, address contractAddress)](#isprotocolmember)
- [ensureProtocolMember(IStore s, address contractAddress)](#ensureprotocolmember)
- [ensureMemberWithName(IStore s, bytes32 name)](#ensurememberwithname)
- [nepToken(IStore s)](#neptoken)
- [getTreasury(IStore s)](#gettreasury)
- [getAssuranceVault(IStore s)](#getassurancevault)
- [getLiquidityToken(IStore s)](#getliquiditytoken)
- [getBurnAddress(IStore s)](#getburnaddress)
- [toKeccak256(bytes value)](#tokeccak256)
- [_getContract(IStore s, bytes32 name)](#_getcontract)
- [_getProtocol(IStore s)](#_getprotocol)

### getProtocol

```js
function getProtocol(IStore s) external view
returns(contract IProtocol)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getCoverFee

```js
function getCoverFee(IStore s) external view
returns(fee uint256, minStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getContract

```js
function getContract(IStore s, bytes32 name) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

### isProtocolMember

```js
function isProtocolMember(IStore s, address contractAddress) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| contractAddress | address |  | 

### ensureProtocolMember

```js
function ensureProtocolMember(IStore s, address contractAddress) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| contractAddress | address |  | 

### ensureMemberWithName

```js
function ensureMemberWithName(IStore s, bytes32 name) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

### nepToken

```js
function nepToken(IStore s) external view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getTreasury

```js
function getTreasury(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getAssuranceVault

```js
function getAssuranceVault(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getLiquidityToken

```js
function getLiquidityToken(IStore s) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getBurnAddress

```js
function getBurnAddress(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### toKeccak256

```js
function toKeccak256(bytes value) external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | bytes |  | 

### _getContract

```js
function _getContract(IStore s, bytes32 name) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 

### _getProtocol

```js
function _getProtocol(IStore s) private view
returns(contract IProtocol)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

## Contracts

* [Address](Address.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ERC20](ERC20.md)
* [Factory](Factory.md)
* [Governance](Governance.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverStake](ICoverStake.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
