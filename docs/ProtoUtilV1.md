# ProtoUtilV1.sol

View Source: [contracts/libraries/ProtoUtilV1.sol](../contracts/libraries/ProtoUtilV1.sol)

**ProtoUtilV1**

## Contract Members
**Constants & Variables**

```js
uint256 public constant MAX_POLICY_DURATION;
bytes32 public constant KEY_INTENTIONALLY_EMPTY;
bytes32 public constant PRODUCT_KEY_INTENTIONALLY_EMPTY;
uint256 public constant MULTIPLIER;
uint256 public constant MAX_LIQUIDITY;
uint256 public constant MAX_PROPOSAL_AMOUNT;
uint256 public constant MAX_NPM_STAKE;
uint256 public constant NPM_PRECISION;
uint256 public constant CXTOKEN_PRECISION;
uint256 public constant POD_PRECISION;
bytes32 public constant CNS_CORE;
bytes32 public constant CNS_NPM;
bytes32 public constant CNS_COVER;
bytes32 public constant CNS_UNISWAP_V2_ROUTER;
bytes32 public constant CNS_UNISWAP_V2_FACTORY;
bytes32 public constant CNS_PRICE_DISCOVERY;
bytes32 public constant CNS_TREASURY;
bytes32 public constant CNS_NPM_PRICE_ORACLE;
bytes32 public constant CNS_COVER_REASSURANCE;
bytes32 public constant CNS_POOL_BOND;
bytes32 public constant CNS_COVER_POLICY;
bytes32 public constant CNS_COVER_POLICY_MANAGER;
bytes32 public constant CNS_COVER_POLICY_ADMIN;
bytes32 public constant CNS_COVER_STAKE;
bytes32 public constant CNS_COVER_VAULT;
bytes32 public constant CNS_COVER_VAULT_DELEGATE;
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
bytes32 public constant NS_COVER_PRODUCT;
bytes32 public constant NS_COVER_PRODUCT_EFFICIENCY;
bytes32 public constant NS_COVER_CREATION_DATE;
bytes32 public constant NS_COVER_CREATION_FEE;
bytes32 public constant NS_COVER_CREATION_MIN_STAKE;
bytes32 public constant NS_COVER_REASSURANCE;
bytes32 public constant NS_COVER_REASSURANCE_PAYOUT;
bytes32 public constant NS_COVER_REASSURANCE_WEIGHT;
bytes32 public constant NS_COVER_REASSURANCE_RATE;
bytes32 public constant NS_COVER_LEVERAGE_FACTOR;
bytes32 public constant NS_COVER_CREATION_FEE_EARNING;
bytes32 public constant NS_COVER_INFO;
bytes32 public constant NS_COVER_OWNER;
bytes32 public constant NS_COVER_SUPPORTS_PRODUCTS;
bytes32 public constant NS_VAULT_STRATEGY_OUT;
bytes32 public constant NS_VAULT_LENDING_INCOMES;
bytes32 public constant NS_VAULT_LENDING_LOSSES;
bytes32 public constant NS_VAULT_DEPOSIT_HEIGHTS;
bytes32 public constant NS_COVER_LIQUIDITY_LENDING_PERIOD;
bytes32 public constant NS_COVER_LIQUIDITY_MAX_LENDING_RATIO;
bytes32 public constant NS_COVER_LIQUIDITY_WITHDRAWAL_WINDOW;
bytes32 public constant NS_COVER_LIQUIDITY_MIN_STAKE;
bytes32 public constant NS_COVER_LIQUIDITY_STAKE;
bytes32 public constant NS_COVER_LIQUIDITY_COMMITTED;
bytes32 public constant NS_COVER_STABLECOIN_NAME;
bytes32 public constant NS_COVER_REQUIRES_WHITELIST;
bytes32 public constant NS_COVER_HAS_FLASH_LOAN;
bytes32 public constant NS_COVER_LIQUIDITY_FLASH_LOAN_FEE;
bytes32 public constant NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL;
bytes32 public constant NS_COVERAGE_LAG;
bytes32 public constant NS_COVER_POLICY_RATE_FLOOR;
bytes32 public constant NS_COVER_POLICY_RATE_CEILING;
bytes32 public constant NS_POLICY_DISABLED;
bytes32 public constant NS_COVER_STAKE;
bytes32 public constant NS_COVER_STAKE_OWNED;
bytes32 public constant NS_COVER_STATUS;
bytes32 public constant NS_COVER_CXTOKEN;
bytes32 public constant NS_VAULT_TOKEN_NAME;
bytes32 public constant NS_VAULT_TOKEN_SYMBOL;
bytes32 public constant NS_COVER_CREATOR_WHITELIST;
bytes32 public constant NS_COVER_USER_WHITELIST;
bytes32 public constant NS_COVER_CLAIM_BLACKLIST;
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
bytes32 public constant NS_GOVERNANCE_REPORTING_HAS_A_DISPUTE;
bytes32 public constant NS_GOVERNANCE_REPORTING_WITNESS_NO;
bytes32 public constant NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES;
bytes32 public constant NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO;
bytes32 public constant NS_GOVERNANCE_REPORTING_BURN_RATE;
bytes32 public constant NS_GOVERNANCE_REPORTER_COMMISSION;
bytes32 public constant NS_CLAIM_PERIOD;
bytes32 public constant NS_CLAIM_PAYOUTS;
bytes32 public constant NS_CLAIM_BEGIN_TS;
bytes32 public constant NS_CLAIM_EXPIRY_TS;
bytes32 public constant NS_RESOLUTION_DEADLINE;
bytes32 public constant NS_RESOLUTION_COOL_DOWN_PERIOD;
bytes32 public constant NS_COVER_PLATFORM_FEE;
bytes32 public constant NS_CLAIM_REPORTER_COMMISSION;
bytes32 public constant NS_LAST_LIQUIDITY_STATE_UPDATE;
bytes32 public constant NS_LIQUIDITY_STATE_UPDATE_INTERVAL;
bytes32 public constant NS_LENDING_STRATEGY_ACTIVE;
bytes32 public constant NS_LENDING_STRATEGY_DISABLED;
bytes32 public constant NS_LENDING_STRATEGY_WITHDRAWAL_START;
bytes32 public constant NS_ACCRUAL_INVOCATION;
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
bytes32 public constant CNAME_COVER;
bytes32 public constant CNAME_GOVERNANCE;
bytes32 public constant CNAME_RESOLUTION;
bytes32 public constant CNAME_VAULT_FACTORY;
bytes32 public constant CNAME_CXTOKEN_FACTORY;
bytes32 public constant CNAME_COVER_STAKE;
bytes32 public constant CNAME_COVER_REASSURANCE;
bytes32 public constant CNAME_LIQUIDITY_VAULT;
bytes32 public constant CNAME_VAULT_DELEGATE;
bytes32 public constant CNAME_LIQUIDITY_ENGINE;
bytes32 public constant CNAME_STRATEGY_AAVE;
bytes32 public constant CNAME_STRATEGY_COMPOUND;

```

## Functions

- [getProtocol(IStore s)](#getprotocol)
- [getProtocolAddress(IStore s)](#getprotocoladdress)
- [getContract(IStore s, bytes32 name, bytes32 key)](#getcontract)
- [isProtocolMember(IStore s, address contractAddress)](#isprotocolmember)
- [mustBeProtocolMember(IStore s, address contractAddress)](#mustbeprotocolmember)
- [mustBeExactContract(IStore s, bytes32 name, bytes32 key, address sender)](#mustbeexactcontract)
- [senderMustBeExactContract(IStore s, bytes32 name)](#sendermustbeexactcontract)
- [callerMustBeExactContract(IStore s, bytes32 name, address caller)](#callermustbeexactcontract)
- [npmToken(IStore s)](#npmtoken)
- [getNpmTokenAddress(IStore s)](#getnpmtokenaddress)
- [getUniswapV2Router(IStore s)](#getuniswapv2router)
- [getUniswapV2Factory(IStore s)](#getuniswapv2factory)
- [getNpmPriceOracle(IStore s)](#getnpmpriceoracle)
- [getTreasury(IStore s)](#gettreasury)
- [getStablecoin(IStore s)](#getstablecoin)
- [getStablecoinPrecision(IStore s)](#getstablecoinprecision)
- [getBurnAddress(IStore s)](#getburnaddress)

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
function getContract(IStore s, bytes32 name, bytes32 key) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getContract(
    IStore s,
    bytes32 name,
    bytes32 key
  ) public view returns (address) {
    if (key > 0) {
      return s.getAddressByKeys(NS_CONTRACTS, name, key);
    }

    return s.getAddressByKeys(NS_CONTRACTS, name);
  }
```
</details>

### isProtocolMember

```solidity
function isProtocolMember(IStore s, address contractAddress) public view
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
function isProtocolMember(IStore s, address contractAddress) public view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, contractAddress);
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
    bool isMember = isProtocolMember(s, contractAddress);
    require(isMember, "Not a protocol member");
  }
```
</details>

### mustBeExactContract

Ensures that the sender matches with the exact contract having the specified name.

```solidity
function mustBeExactContract(IStore s, bytes32 name, bytes32 key, address sender) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender Enter the `msg.sender` value | 
| name | bytes32 | Enter the name of the contract | 
| key | bytes32 |  | 
| sender | address | Enter the `msg.sender` value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeExactContract(
    IStore s,
    bytes32 name,
    bytes32 key,
    address sender
  ) public view {
    address contractAddress = getContract(s, name, key);
    require(sender == contractAddress, "Access denied");
  }
```
</details>

### senderMustBeExactContract

Ensures that the sender matches with the exact contract having the specified name.

```solidity
function senderMustBeExactContract(IStore s, bytes32 name) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 | Enter the name of the contract | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeExactContract(IStore s, bytes32 name) external view {
    return callerMustBeExactContract(s, name, msg.sender);
  }
```
</details>

### callerMustBeExactContract

Ensures that the sender matches with the exact contract having the specified name.

```solidity
function callerMustBeExactContract(IStore s, bytes32 name, address caller) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| name | bytes32 | Enter the name of the contract | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeExactContract(
    IStore s,
    bytes32 name,
    address caller
  ) public view {
    return mustBeExactContract(s, name, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY, caller);
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

### getNpmPriceOracle

```solidity
function getNpmPriceOracle(IStore s) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNpmPriceOracle(IStore s) external view returns (address) {
    return s.getAddressByKey(CNS_NPM_PRICE_ORACLE);
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

### getStablecoin

```solidity
function getStablecoin(IStore s) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoin(IStore s) public view returns (address) {
    return s.getAddressByKey(CNS_COVER_STABLECOIN);
  }
```
</details>

### getStablecoinPrecision

```solidity
function getStablecoinPrecision(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoinPrecision(IStore s) external view returns (uint256) {
    return 10**IERC20Detailed(getStablecoin(s)).decimals();
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
