# MockProcessorStore.sol

View Source: [contracts/mock/claims-processor/MockProcessorStore.sol](../contracts/mock/claims-processor/MockProcessorStore.sol)

**↗ Extends: [MockStore](MockStore.md)**

**MockProcessorStore**

## Functions

- [initialize(MockStore s, bytes32 coverKey, bytes32 productKey, address cxToken)](#initialize)
- [disassociateCxToken(MockStore s, address cxToken)](#disassociatecxtoken)
- [setCoverStatus(MockStore s, bytes32 coverKey, bytes32 productKey, uint256 value)](#setcoverstatus)
- [setClaimBeginTimestamp(MockStore s, bytes32 coverKey, bytes32 productKey, uint256 value)](#setclaimbegintimestamp)
- [setClaimExpiryTimestamp(MockStore s, bytes32 coverKey, bytes32 productKey, uint256 value)](#setclaimexpirytimestamp)
- [initialize(bytes32 coverKey, bytes32 productKey, address cxToken)](#initialize)
- [disassociateCxToken(address cxToken)](#disassociatecxtoken)
- [setCoverStatus(bytes32 coverKey, bytes32 productKey, uint256 value)](#setcoverstatus)
- [setClaimBeginTimestamp(bytes32 coverKey, bytes32 productKey, uint256 value)](#setclaimbegintimestamp)
- [setClaimExpiryTimestamp(bytes32 coverKey, bytes32 productKey, uint256 value)](#setclaimexpirytimestamp)

### initialize

```solidity
function initialize(MockStore s, bytes32 coverKey, bytes32 productKey, address cxToken) external nonpayable
returns(values address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | MockStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| cxToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initialize(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken
  ) external returns (address[] memory values) {
    MockProtocol protocol = new MockProtocol();
    MockVault vault = new MockVault();
    FakePriceOracle oracle = new FakePriceOracle();

    s.setAddress(ProtoUtilV1.CNS_CORE, address(protocol));
    s.setAddress(ProtoUtilV1.CNS_COVER_STABLECOIN, cxToken);
    s.setAddress(ProtoUtilV1.CNS_NPM_PRICE_ORACLE, address(oracle));

    s.setBool(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken);
    s.setBool(ProtoUtilV1.NS_MEMBERS, cxToken);
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, productKey)), 1234);

    s.setBool(ProtoUtilV1.NS_MEMBERS, address(vault));
    s.setAddress(ProtoUtilV1.NS_CONTRACTS, "cns:cover:vault", coverKey, address(vault));

    setCoverStatus(s, coverKey, productKey, 4);
    setClaimBeginTimestamp(s, coverKey, productKey, block.timestamp - 100 days); // solhint-disable-line
    setClaimExpiryTimestamp(s, coverKey, productKey, block.timestamp + 100 days); // solhint-disable-line

    values = new address[](2);

    values[0] = address(protocol);
    values[1] = address(vault);
  }
```
</details>

### disassociateCxToken

```solidity
function disassociateCxToken(MockStore s, address cxToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | MockStore |  | 
| cxToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disassociateCxToken(MockStore s, address cxToken) external {
    s.unsetBool(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken);
  }
```
</details>

### setCoverStatus

```solidity
function setCoverStatus(MockStore s, bytes32 coverKey, bytes32 productKey, uint256 value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | MockStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setCoverStatus(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) public {
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_STATUS, coverKey, productKey)), value);
  }
```
</details>

### setClaimBeginTimestamp

```solidity
function setClaimBeginTimestamp(MockStore s, bytes32 coverKey, bytes32 productKey, uint256 value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | MockStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setClaimBeginTimestamp(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) public {
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_CLAIM_BEGIN_TS, coverKey, productKey)), value);
  }
```
</details>

### setClaimExpiryTimestamp

```solidity
function setClaimExpiryTimestamp(MockStore s, bytes32 coverKey, bytes32 productKey, uint256 value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | MockStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setClaimExpiryTimestamp(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) public {
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey)), value);
  }
```
</details>

### initialize

```solidity
function initialize(bytes32 coverKey, bytes32 productKey, address cxToken) external nonpayable
returns(values address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| cxToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initialize(
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken
  ) external returns (address[] memory values) {
    return MockProcessorStoreLib.initialize(this, coverKey, productKey, cxToken);
  }
```
</details>

### disassociateCxToken

```solidity
function disassociateCxToken(address cxToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cxToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disassociateCxToken(address cxToken) external {
    MockProcessorStoreLib.disassociateCxToken(this, cxToken);
  }
```
</details>

### setCoverStatus

```solidity
function setCoverStatus(bytes32 coverKey, bytes32 productKey, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setCoverStatus(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) external {
    MockProcessorStoreLib.setCoverStatus(this, coverKey, productKey, value);
  }
```
</details>

### setClaimBeginTimestamp

```solidity
function setClaimBeginTimestamp(bytes32 coverKey, bytes32 productKey, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setClaimBeginTimestamp(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) external {
    MockProcessorStoreLib.setClaimBeginTimestamp(this, coverKey, productKey, value);
  }
```
</details>

### setClaimExpiryTimestamp

```solidity
function setClaimExpiryTimestamp(bytes32 coverKey, bytes32 productKey, uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setClaimExpiryTimestamp(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) external {
    MockProcessorStoreLib.setClaimExpiryTimestamp(this, coverKey, productKey, value);
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
* [console](console.md)
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
