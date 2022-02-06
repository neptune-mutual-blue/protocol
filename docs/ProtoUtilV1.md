# ProtoUtilV1.sol

View Source: [contracts/libraries/ProtoUtilV1.sol](../contracts/libraries/ProtoUtilV1.sol)

**ProtoUtilV1**

## Contract Members
**Constants & Variables**

```js
uint256 public constant MULTIPLIER;
bytes32 public constant CNS_CORE;
bytes32 public constant CNS_NPM;
bytes32 public constant CNS_COVER;
bytes32 public constant CNS_UNISWAP_V2_ROUTER;
bytes32 public constant CNS_UNISWAP_V2_FACTORY;
bytes32 public constant CNS_REASSURANCE_VAULT;
bytes32 public constant CNS_PRICE_DISCOVERY;
bytes32 public constant CNS_TREASURY;
bytes32 public constant CNS_COVER_REASSURANCE;
bytes32 public constant CNS_POOL_BOND;
bytes32 public constant CNS_COVER_POLICY;
bytes32 public constant CNS_COVER_POLICY_MANAGER;
bytes32 public constant CNS_COVER_POLICY_ADMIN;
bytes32 public constant CNS_COVER_STAKE;
bytes32 public constant CNS_COVER_VAULT;
bytes32 public constant CNS_COVER_STABLECOIN;
bytes32 public constant CNS_COVER_CXTOKEN_FACTORY;
bytes32 public constant CNS_COVER_VAULT_FACTORY;
bytes32 public constant CNS_BOND_POOL;
bytes32 public constant CNS_STAKING_POOL;
bytes32 public constant CNS_LIQUIDITY_ENGINE;
bytes32 public constant CNS_STRATEGY_AAVE;
bytes32 public constant CNS_STRATEGY_COMPOUND;
bytes32 public constant CNS_GOVERNANCE;
bytes32 public constant CNS_GOVERNANCE_RESOLUTION;
bytes32 public constant CNS_CLAIM_PROCESSOR;
bytes32 public constant CNS_BURNER;
bytes32 public constant NS_MEMBERS;
bytes32 public constant NS_CONTRACTS;
bytes32 public constant NS_COVER;
bytes32 public constant NS_COVER_CREATION_FEE;
bytes32 public constant NS_COVER_CREATION_MIN_STAKE;
bytes32 public constant NS_COVER_REASSURANCE;
bytes32 public constant NS_COVER_REASSURANCE_TOKEN;
bytes32 public constant NS_COVER_REASSURANCE_WEIGHT;
bytes32 public constant NS_COVER_FEE_EARNING;
bytes32 public constant NS_COVER_INFO;
bytes32 public constant NS_COVER_OWNER;
bytes32 public constant NS_VAULT_STRATEGY_OUT;
bytes32 public constant NS_COVER_LIQUIDITY;
bytes32 public constant NS_COVER_LIQUIDITY_LENDING_PERIOD;
bytes32 public constant NS_COVER_LIQUIDITY_WITHDRAWAL_WINDOW;
bytes32 public constant NS_COVER_LIQUIDITY_MIN_STAKE;
bytes32 public constant NS_COVER_LIQUIDITY_STAKE;
bytes32 public constant NS_COVER_LIQUIDITY_ADDED;
bytes32 public constant NS_COVER_LIQUIDITY_REMOVED;
bytes32 public constant NS_COVER_LIQUIDITY_MIN_PERIOD;
bytes32 public constant NS_COVER_LIQUIDITY_COMMITTED;
bytes32 public constant NS_COVER_LIQUIDITY_NAME;
bytes32 public constant NS_COVER_LIQUIDITY_RELEASE_DATE;
bytes32 public constant NS_COVER_STABLECOIN_LENT_TOTAL;
bytes32 public constant NS_COVER_HAS_FLASH_LOAN;
bytes32 public constant NS_COVER_LIQUIDITY_FLASH_LOAN_FEE;
bytes32 public constant NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL;
bytes32 public constant NS_COVER_POLICY_RATE_FLOOR;
bytes32 public constant NS_COVER_POLICY_RATE_CEILING;
bytes32 public constant NS_COVER_PROVISION;
bytes32 public constant NS_COVER_STAKE;
bytes32 public constant NS_COVER_STAKE_OWNED;
bytes32 public constant NS_COVER_STATUS;
bytes32 public constant NS_COVER_CXTOKEN;
bytes32 public constant NS_COVER_WHITELIST;
bytes32 public constant NS_GOVERNANCE_RESOLUTION_TS;
bytes32 public constant NS_GOVERNANCE_UNSTAKEN;
bytes32 public constant NS_GOVERNANCE_UNSTAKE_TS;
bytes32 public constant NS_GOVERNANCE_UNSTAKE_REWARD;
bytes32 public constant NS_GOVERNANCE_UNSTAKE_BURNED;
bytes32 public constant NS_GOVERNANCE_UNSTAKE_REPORTER_FEE;
bytes32 public constant NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE;
bytes32 public constant NS_GOVERNANCE_REPORTING_INCIDENT_DATE;
bytes32 public constant NS_GOVERNANCE_REPORTING_PERIOD;
bytes32 public constant NS_GOVERNANCE_REPORTING_WITNESS_YES;
bytes32 public constant NS_GOVERNANCE_REPORTING_WITNESS_NO;
bytes32 public constant NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES;
bytes32 public constant NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO;
bytes32 public constant NS_GOVERNANCE_REPORTING_BURN_RATE;
bytes32 public constant NS_GOVERNANCE_REPORTER_COMMISSION;
bytes32 public constant NS_CLAIM_PERIOD;
bytes32 public constant NS_CLAIM_BEGIN_TS;
bytes32 public constant NS_CLAIM_EXPIRY_TS;
bytes32 public constant NS_CLAIM_PLATFORM_FEE;
bytes32 public constant NS_CLAIM_REPORTER_COMMISSION;
bytes32 public constant NS_LP_RESERVE0;
bytes32 public constant NS_LP_RESERVE1;
bytes32 public constant NS_LP_TOTAL_SUPPLY;
bytes32 public constant NS_TOKEN_PRICE_LAST_UPDATE;
bytes32 public constant NS_LENDING_STRATEGY_ACTIVE;
bytes32 public constant NS_LENDING_STRATEGY_DISABLED;
bytes32 public constant NS_LENDING_STRATEGY_DEPOSITS;
bytes32 public constant NS_LENDING_STRATEGY_WITHDRAWAL_START;
bytes32 public constant NS_LENDING_STRATEGY_WITHDRAWAL_END;
bytes32 public constant CNAME_PROTOCOL;
bytes32 public constant CNAME_TREASURY;
bytes32 public constant CNAME_POLICY;
bytes32 public constant CNAME_POLICY_ADMIN;
bytes32 public constant CNAME_POLICY_MANAGER;
bytes32 public constant CNAME_BOND_POOL;
bytes32 public constant CNAME_STAKING_POOL;
bytes32 public constant CNAME_POD_STAKING_POOL;
bytes32 public constant CNAME_CLAIMS_PROCESSOR;
bytes32 public constant CNAME_PRICE_DISCOVERY;
bytes32 public constant CNAME_COVER;
bytes32 public constant CNAME_GOVERNANCE;
bytes32 public constant CNAME_RESOLUTION;
bytes32 public constant CNAME_VAULT_FACTORY;
bytes32 public constant CNAME_CXTOKEN_FACTORY;
bytes32 public constant CNAME_COVER_PROVISION;
bytes32 public constant CNAME_COVER_STAKE;
bytes32 public constant CNAME_COVER_REASSURANCE;
bytes32 public constant CNAME_LIQUIDITY_VAULT;
bytes32 public constant CNAME_STRATEGY_AAVE;
bytes32 public constant CNAME_STRATEGY_COMPOUND;

```

## Functions

- [getProtocol(IStore s)](#getprotocol)
- [getProtocolAddress(IStore s)](#getprotocoladdress)
- [getContract(IStore s, bytes32 name)](#getcontract)
- [isProtocolMember(IStore s, address contractAddress)](#isprotocolmember)
- [mustBeProtocolMember(IStore s, address contractAddress)](#mustbeprotocolmember)
- [mustBeExactContract(IStore s, bytes32 name, address sender)](#mustbeexactcontract)
- [callerMustBeExactContract(IStore s, bytes32 name)](#callermustbeexactcontract)
- [npmToken(IStore s)](#npmtoken)
- [getNpmTokenAddress(IStore s)](#getnpmtokenaddress)
- [getUniswapV2Router(IStore s)](#getuniswapv2router)
- [getUniswapV2Factory(IStore s)](#getuniswapv2factory)
- [getTreasury(IStore s)](#gettreasury)
- [getReassuranceVault(IStore s)](#getreassurancevault)
- [getStablecoin(IStore s)](#getstablecoin)
- [getBurnAddress(IStore s)](#getburnaddress)
- [_isProtocolMember(IStore s, address contractAddress)](#_isprotocolmember)
- [_getContract(IStore s, bytes32 name)](#_getcontract)
- [addContractInternal(IStore s, bytes32 namespace, address contractAddress)](#addcontractinternal)
- [_addContract(IStore s, bytes32 namespace, address contractAddress)](#_addcontract)
- [_deleteContract(IStore s, bytes32 namespace, address contractAddress)](#_deletecontract)
- [upgradeContractInternal(IStore s, bytes32 namespace, address previous, address current)](#upgradecontractinternal)
- [addMemberInternal(IStore s, address member)](#addmemberinternal)
- [removeMemberInternal(IStore s, address member)](#removememberinternal)
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
    return IProtocol(getProtocolAddress(s));
  }
```
</details>

### getProtocolAddress

```solidity
function getProtocolAddress(IStore s) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProtocolAddress(IStore s) public view returns (address) {
    return s.getAddressByKey(CNS_CORE);
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
function mustBeExactContract(IStore s, bytes32 name, address sender) public view
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
  ) public view {
    address contractAddress = _getContract(s, name);
    require(sender == contractAddress, "Access denied");
  }
```
</details>

### callerMustBeExactContract

Ensures that the sender matches with the exact contract having the specified name.

```solidity
function callerMustBeExactContract(IStore s, bytes32 name) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 | Enter the name of the contract | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeExactContract(IStore s, bytes32 name) external view {
    return mustBeExactContract(s, name, msg.sender);
  }
```
</details>

### npmToken

```solidity
function npmToken(IStore s) external view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function npmToken(IStore s) external view returns (IERC20) {
    return IERC20(getNpmTokenAddress(s));
  }
```
</details>

### getNpmTokenAddress

```solidity
function getNpmTokenAddress(IStore s) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNpmTokenAddress(IStore s) public view returns (address) {
    address npm = s.getAddressByKey(CNS_NPM);
    return npm;
  }
```
</details>

### getUniswapV2Router

```solidity
function getUniswapV2Router(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUniswapV2Router(IStore s) external view returns (address) {
    return s.getAddressByKey(CNS_UNISWAP_V2_ROUTER);
  }
```
</details>

### getUniswapV2Factory

```solidity
function getUniswapV2Factory(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getUniswapV2Factory(IStore s) external view returns (address) {
    return s.getAddressByKey(CNS_UNISWAP_V2_FACTORY);
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
    return s.getAddressByKey(CNS_TREASURY);
  }
```
</details>

### getReassuranceVault

```solidity
function getReassuranceVault(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceVault(IStore s) external view returns (address) {
    return s.getAddressByKey(CNS_REASSURANCE_VAULT);
  }
```
</details>

### getStablecoin

```solidity
function getStablecoin(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoin(IStore s) external view returns (address) {
    return s.getAddressByKey(CNS_COVER_STABLECOIN);
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
    return s.getAddressByKey(CNS_BURNER);
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

### addContractInternal

```solidity
function addContractInternal(IStore s, bytes32 namespace, address contractAddress) external nonpayable
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
function addContractInternal(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) external {
    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
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

### upgradeContractInternal

```solidity
function upgradeContractInternal(IStore s, bytes32 namespace, address previous, address current) external nonpayable
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
function upgradeContractInternal(
    IStore s,
    bytes32 namespace,
    address previous,
    address current
  ) external {
    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
    bool isMember = _isProtocolMember(s, previous);
    require(isMember, "Not a protocol member");

    _deleteContract(s, namespace, previous);
    _addContract(s, namespace, current);
  }
```
</details>

### addMemberInternal

```solidity
function addMemberInternal(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMemberInternal(IStore s, address member) external {
    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
    _addMember(s, member);
  }
```
</details>

### removeMemberInternal

```solidity
function removeMemberInternal(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeMemberInternal(IStore s, address member) external {
    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
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
