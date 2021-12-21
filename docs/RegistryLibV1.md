# RegistryLibV1.sol

View Source: [contracts/libraries/RegistryLibV1.sol](../contracts/libraries/RegistryLibV1.sol)

**RegistryLibV1**

## Functions

- [getPriceDiscoveryContract(IStore s)](#getpricediscoverycontract)
- [getGovernanceContract(IStore s)](#getgovernancecontract)
- [getResolutionContract(IStore s)](#getresolutioncontract)
- [getStakingContract(IStore s)](#getstakingcontract)
- [getCxTokenFactory(IStore s)](#getcxtokenfactory)
- [getPolicyContract(IStore s)](#getpolicycontract)
- [getReassuranceContract(IStore s)](#getreassurancecontract)
- [getVault(IStore s, bytes32 key)](#getvault)
- [getVaultFactoryContract(IStore s)](#getvaultfactorycontract)

### getPriceDiscoveryContract

```solidity
function getPriceDiscoveryContract(IStore s) public view
returns(contract IPriceDiscovery)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPriceDiscoveryContract(IStore s) public view returns (IPriceDiscovery) {
    return IPriceDiscovery(s.getContract(ProtoUtilV1.NS_PRICE_DISCOVERY));
  }
```
</details>

### getGovernanceContract

```solidity
function getGovernanceContract(IStore s) public view
returns(contract IGovernance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getGovernanceContract(IStore s) public view returns (IGovernance) {
    return IGovernance(s.getContract(ProtoUtilV1.NS_GOVERNANCE));
  }
```
</details>

### getResolutionContract

```solidity
function getResolutionContract(IStore s) public view
returns(contract IGovernance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionContract(IStore s) public view returns (IGovernance) {
    return IGovernance(s.getContract(ProtoUtilV1.NS_RESOLUTION));
  }
```
</details>

### getStakingContract

```solidity
function getStakingContract(IStore s) public view
returns(contract ICoverStake)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakingContract(IStore s) public view returns (ICoverStake) {
    return ICoverStake(s.getContract(ProtoUtilV1.NS_COVER_STAKE));
  }
```
</details>

### getCxTokenFactory

```solidity
function getCxTokenFactory(IStore s) public view
returns(contract ICxTokenFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenFactory(IStore s) public view returns (ICxTokenFactory) {
    return ICxTokenFactory(s.getContract(ProtoUtilV1.NS_COVER_CXTOKEN_FACTORY));
  }
```
</details>

### getPolicyContract

```solidity
function getPolicyContract(IStore s) public view
returns(contract IPolicy)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyContract(IStore s) public view returns (IPolicy) {
    return IPolicy(s.getContract(ProtoUtilV1.NS_COVER_POLICY));
  }
```
</details>

### getReassuranceContract

```solidity
function getReassuranceContract(IStore s) public view
returns(contract ICoverReassurance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceContract(IStore s) public view returns (ICoverReassurance) {
    return ICoverReassurance(s.getContract(ProtoUtilV1.NS_COVER_REASSURANCE));
  }
```
</details>

### getVault

```solidity
function getVault(IStore s, bytes32 key) public view
returns(contract IVault)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVault(IStore s, bytes32 key) public view returns (IVault) {
    address vault = s.getAddressByKeys(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.NS_COVER_VAULT, key);
    return IVault(vault);
  }
```
</details>

### getVaultFactoryContract

```solidity
function getVaultFactoryContract(IStore s) public view
returns(contract IVaultFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVaultFactoryContract(IStore s) public view returns (IVaultFactory) {
    address factory = s.getContract(ProtoUtilV1.NS_COVER_VAULT_FACTORY);
    return IVaultFactory(factory);
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
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
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
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
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
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
* [SafeMath](SafeMath.md)
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
* [Witness](Witness.md)
