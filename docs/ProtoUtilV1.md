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
bytes32 public constant NS_CLAIMS_PROCESSOR;
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
bytes32 public constant NS_REPORTING_INCIDENT_DATE;
bytes32 public constant NS_RESOLUTION_TS;
bytes32 public constant NS_CLAIM_EXPIRY_TS;
bytes32 public constant NS_REPORTING_WITNESS_YES;
bytes32 public constant NS_REPORTING_WITNESS_NO;
bytes32 public constant NS_REPORTING_STAKE_OWNED_YES;
bytes32 public constant NS_REPORTING_STAKE_OWNED_NO;
bytes32 public constant NS_SETUP_NPM;
bytes32 public constant NS_SETUP_COVER_FEE;
bytes32 public constant NS_SETUP_MIN_STAKE;
bytes32 public constant NS_SETUP_REPORTING_STAKE;
bytes32 public constant NS_SETUP_MIN_LIQ_PERIOD;
bytes32 public constant NS_SETUP_CLAIM_PERIOD;
bytes32 public constant NS_SETUP_UNISWAP_V2_ROUTER;
bytes32 public constant CNAME_PROTOCOL;
bytes32 public constant CNAME_TREASURY;
bytes32 public constant CNAME_POLICY;
bytes32 public constant CNAME_POLICY_ADMIN;
bytes32 public constant CNAME_POLICY_MANAGER;
bytes32 public constant CNAME_CLAIMS_PROCESSOR;
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
- [getProtocolAddress(IStore s)](#getprotocoladdress)
- [getCoverFee(IStore s)](#getcoverfee)
- [getMinCoverStake(IStore s)](#getmincoverstake)
- [getMinLiquidityPeriod(IStore s)](#getminliquidityperiod)
- [getContract(IStore s, bytes32 name)](#getcontract)
- [isProtocolMember(IStore s, address contractAddress)](#isprotocolmember)
- [mustBeProtocolMember(IStore s, address contractAddress)](#mustbeprotocolmember)
- [mustBeExactContract(IStore s, bytes32 name, address sender)](#mustbeexactcontract)
- [callerMustBeExactContract(IStore s, bytes32 name)](#callermustbeexactcontract)
- [npmToken(IStore s)](#npmtoken)
- [getUniswapV2Router(IStore s)](#getuniswapv2router)
- [getTreasury(IStore s)](#gettreasury)
- [getAssuranceVault(IStore s)](#getassurancevault)
- [getLiquidityToken(IStore s)](#getliquiditytoken)
- [getBurnAddress(IStore s)](#getburnaddress)
- [toKeccak256(bytes value)](#tokeccak256)
- [_isProtocolMember(IStore s, address contractAddress)](#_isprotocolmember)
- [_getContract(IStore s, bytes32 name)](#_getcontract)
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

```js
function getProtocol(IStore s) external view
returns(contract IProtocol)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getProtocolAddress

```js
function getProtocolAddress(IStore s) public view
returns(address)
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

### getMinCoverStake

```js
function getMinCoverStake(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getMinLiquidityPeriod

```js
function getMinLiquidityPeriod(IStore s) external view
returns(uint256)
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

### mustBeProtocolMember

Reverts if the caller is one of the protocol members.

```js
function mustBeProtocolMember(IStore s, address contractAddress) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| contractAddress | address |  | 

### mustBeExactContract

Ensures that the sender matches with the exact contract having the specified name.

```js
function mustBeExactContract(IStore s, bytes32 name, address sender) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender Enter the `msg.sender` value | 
| name | bytes32 | Enter the name of the contract | 
| sender | address | Enter the `msg.sender` value | 

### callerMustBeExactContract

Ensures that the sender matches with the exact contract having the specified name.

```js
function callerMustBeExactContract(IStore s, bytes32 name) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 | Enter the name of the contract | 

### npmToken

```js
function npmToken(IStore s) external view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### getUniswapV2Router

```js
function getUniswapV2Router(IStore s) external view
returns(address)
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

### _isProtocolMember

```js
function _isProtocolMember(IStore s, address contractAddress) private view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| contractAddress | address |  | 

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

### addContract

```js
function addContract(IStore s, bytes32 namespace, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### _addContract

```js
function _addContract(IStore s, bytes32 namespace, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### deleteContract

```js
function deleteContract(IStore s, bytes32 namespace, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### _deleteContract

```js
function _deleteContract(IStore s, bytes32 namespace, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| contractAddress | address |  | 

### upgradeContract

```js
function upgradeContract(IStore s, bytes32 namespace, address previous, address current) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

### addMember

```js
function addMember(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

### removeMember

```js
function removeMember(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

### _addMember

```js
function _addMember(IStore s, address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

### _removeMember

```js
function _removeMember(IStore s, address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

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
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
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
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
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
