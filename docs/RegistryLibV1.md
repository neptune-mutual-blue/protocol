# RegistryLibV1.sol

View Source: [\contracts\libraries\RegistryLibV1.sol](..\contracts\libraries\RegistryLibV1.sol)

**RegistryLibV1**

## Functions

- [getGovernanceContract(IStore s)](#getgovernancecontract)
- [getResolutionContract(IStore s)](#getresolutioncontract)
- [getStakingContract(IStore s)](#getstakingcontract)
- [getCxTokenFactory(IStore s)](#getcxtokenfactory)
- [getPolicyContract(IStore s)](#getpolicycontract)
- [getReassuranceContract(IStore s)](#getreassurancecontract)
- [getBondPoolContract(IStore s)](#getbondpoolcontract)
- [getProtocolContract(IStore s, bytes32 cns)](#getprotocolcontract)
- [getProtocolContract(IStore s, bytes32 cns, bytes32 key)](#getprotocolcontract)
- [getCoverContract(IStore s)](#getcovercontract)
- [getVault(IStore s, bytes32 coverKey)](#getvault)
- [getVaultAddress(IStore s, bytes32 coverKey)](#getvaultaddress)
- [getVaultDelegate(IStore s)](#getvaultdelegate)
- [getStakingPoolAddress(IStore s)](#getstakingpooladdress)
- [getBondPoolAddress(IStore s)](#getbondpooladdress)
- [getVaultFactoryContract(IStore s)](#getvaultfactorycontract)

### getGovernanceContract

```solidity
function getGovernanceContract(IStore s) external view
returns(contract IGovernance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getGovernanceContract(IStore s) external view returns (IGovernance) {

    return IGovernance(s.getContract(ProtoUtilV1.CNS_GOVERNANCE, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));

  }
```
</details>

### getResolutionContract

```solidity
function getResolutionContract(IStore s) external view
returns(contract IGovernance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionContract(IStore s) external view returns (IGovernance) {

    return IGovernance(s.getContract(ProtoUtilV1.CNS_GOVERNANCE_RESOLUTION, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));

  }
```
</details>

### getStakingContract

```solidity
function getStakingContract(IStore s) external view
returns(contract ICoverStake)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakingContract(IStore s) external view returns (ICoverStake) {

    return ICoverStake(s.getContract(ProtoUtilV1.CNS_COVER_STAKE, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));

  }
```
</details>

### getCxTokenFactory

```solidity
function getCxTokenFactory(IStore s) external view
returns(contract ICxTokenFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenFactory(IStore s) external view returns (ICxTokenFactory) {

    return ICxTokenFactory(s.getContract(ProtoUtilV1.CNS_COVER_CXTOKEN_FACTORY, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));

  }
```
</details>

### getPolicyContract

```solidity
function getPolicyContract(IStore s) external view
returns(contract IPolicy)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyContract(IStore s) external view returns (IPolicy) {

    return IPolicy(s.getContract(ProtoUtilV1.CNS_COVER_POLICY, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));

  }
```
</details>

### getReassuranceContract

```solidity
function getReassuranceContract(IStore s) external view
returns(contract ICoverReassurance)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReassuranceContract(IStore s) external view returns (ICoverReassurance) {

    return ICoverReassurance(s.getContract(ProtoUtilV1.CNS_COVER_REASSURANCE, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));

  }
```
</details>

### getBondPoolContract

```solidity
function getBondPoolContract(IStore s) external view
returns(contract IBondPool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBondPoolContract(IStore s) external view returns (IBondPool) {

    return IBondPool(getBondPoolAddress(s));

  }
```
</details>

### getProtocolContract

```solidity
function getProtocolContract(IStore s, bytes32 cns) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| cns | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProtocolContract(IStore s, bytes32 cns) public view returns (address) {

    return s.getAddressByKeys(ProtoUtilV1.NS_CONTRACTS, cns);

  }
```
</details>

### getProtocolContract

```solidity
function getProtocolContract(IStore s, bytes32 cns, bytes32 key) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| cns | bytes32 |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProtocolContract(

    IStore s,

    bytes32 cns,

    bytes32 key

  ) public view returns (address) {

    return s.getAddressByKeys(ProtoUtilV1.NS_CONTRACTS, cns, key);

  }
```
</details>

### getCoverContract

```solidity
function getCoverContract(IStore s) external view
returns(contract ICover)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverContract(IStore s) external view returns (ICover) {

    address vault = getProtocolContract(s, ProtoUtilV1.CNS_COVER);

    return ICover(vault);

  }
```
</details>

### getVault

```solidity
function getVault(IStore s, bytes32 coverKey) external view
returns(contract IVault)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVault(IStore s, bytes32 coverKey) external view returns (IVault) {

    return IVault(getVaultAddress(s, coverKey));

  }
```
</details>

### getVaultAddress

```solidity
function getVaultAddress(IStore s, bytes32 coverKey) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVaultAddress(IStore s, bytes32 coverKey) public view returns (address) {

    address vault = getProtocolContract(s, ProtoUtilV1.CNS_COVER_VAULT, coverKey);

    return vault;

  }
```
</details>

### getVaultDelegate

```solidity
function getVaultDelegate(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVaultDelegate(IStore s) external view returns (address) {

    address vaultImplementation = getProtocolContract(s, ProtoUtilV1.CNS_COVER_VAULT_DELEGATE);

    return vaultImplementation;

  }
```
</details>

### getStakingPoolAddress

```solidity
function getStakingPoolAddress(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStakingPoolAddress(IStore s) external view returns (address) {

    address pool = getProtocolContract(s, ProtoUtilV1.CNS_STAKING_POOL);

    return pool;

  }
```
</details>

### getBondPoolAddress

```solidity
function getBondPoolAddress(IStore s) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBondPoolAddress(IStore s) public view returns (address) {

    address pool = getProtocolContract(s, ProtoUtilV1.CNS_BOND_POOL);

    return pool;

  }
```
</details>

### getVaultFactoryContract

```solidity
function getVaultFactoryContract(IStore s) external view
returns(contract IVaultFactory)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVaultFactoryContract(IStore s) external view returns (IVaultFactory) {

    address factory = s.getContract(ProtoUtilV1.CNS_COVER_VAULT_FACTORY, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY);

    return IVaultFactory(factory);

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
