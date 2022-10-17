# ICover.sol

View Source: [contracts/interfaces/ICover.sol](../contracts/interfaces/ICover.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [CoverBase](CoverBase.md)**

**ICover**

## Structs
### AddCoverArgs

```js
struct AddCoverArgs {
 bytes32 coverKey,
 string info,
 string tokenName,
 string tokenSymbol,
 bool supportsProducts,
 bool requiresWhitelist,
 uint256 stakeWithFee,
 uint256 initialReassuranceAmount,
 uint256 minStakeToReport,
 uint256 reportingPeriod,
 uint256 cooldownPeriod,
 uint256 claimPeriod,
 uint256 floor,
 uint256 ceiling,
 uint256 reassuranceRate,
 uint256 leverageFactor
}
```

### AddProductArgs

```js
struct AddProductArgs {
 bytes32 coverKey,
 bytes32 productKey,
 string info,
 bool requiresWhitelist,
 uint256 productStatus,
 uint256 efficiency
}
```

### UpdateProductArgs

```js
struct UpdateProductArgs {
 bytes32 coverKey,
 bytes32 productKey,
 string info,
 uint256 productStatus,
 uint256 efficiency
}
```

**Events**

```js
event CoverCreated(bytes32 indexed coverKey, string  info, string  tokenName, string  tokenSymbol, bool indexed supportsProducts, bool indexed requiresWhitelist);
event ProductCreated(bytes32 indexed coverKey, bytes32  productKey, string  info);
event CoverUpdated(bytes32 indexed coverKey, string  info);
event ProductUpdated(bytes32 indexed coverKey, bytes32  productKey, string  info);
event ProductStateUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed updatedBy, bool  status, string  reason);
event VaultDeployed(bytes32 indexed coverKey, address  vault);
event CoverCreatorWhitelistUpdated(address  account, bool  status);
event CoverUserWhitelistUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed account, bool  status);
event CoverCreationFeeSet(uint256  previous, uint256  current);
event MinCoverCreationStakeSet(uint256  previous, uint256  current);
event MinStakeToAddLiquiditySet(uint256  previous, uint256  current);
event CoverInitialized(address indexed stablecoin, bytes32  withName);
```

## Functions

- [initialize(address stablecoin, bytes32 friendlyName)](#initialize)
- [addCover(struct ICover.AddCoverArgs args)](#addcover)
- [addCovers(struct ICover.AddCoverArgs[] args)](#addcovers)
- [addProduct(struct ICover.AddProductArgs args)](#addproduct)
- [addProducts(struct ICover.AddProductArgs[] args)](#addproducts)
- [updateProduct(struct ICover.UpdateProductArgs args)](#updateproduct)
- [updateCover(bytes32 coverKey, string info)](#updatecover)
- [updateCoverCreatorWhitelist(address[] account, bool[] whitelisted)](#updatecovercreatorwhitelist)
- [updateCoverUsersWhitelist(bytes32 coverKey, bytes32 productKey, address[] accounts, bool[] statuses)](#updatecoveruserswhitelist)
- [disablePolicy(bytes32 coverKey, bytes32 productKey, bool status, string reason)](#disablepolicy)
- [checkIfWhitelistedCoverCreator(address account)](#checkifwhitelistedcovercreator)
- [checkIfWhitelistedUser(bytes32 coverKey, bytes32 productKey, address account)](#checkifwhitelisteduser)
- [setCoverCreationFee(uint256 value)](#setcovercreationfee)
- [setMinCoverCreationStake(uint256 value)](#setmincovercreationstake)
- [setMinStakeToAddLiquidity(uint256 value)](#setminstaketoaddliquidity)

### initialize

Initializes this contract

```solidity
function initialize(address stablecoin, bytes32 friendlyName) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| stablecoin | address | Provide the address of the token this cover will be quoted against. | 
| friendlyName | bytes32 | Enter a description or ENS name of your liquidity token. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initialize(address stablecoin, bytes32 friendlyName) external;
```
</details>

### addCover

Adds a new coverage pool or cover contract.
 To add a new cover, you need to pay cover creation fee
 and stake minimum amount of NPM in the Vault. <br /> <br />
 Through the governance portal, projects will be able redeem
 the full cover fee at a later date. <br /> <br />
 **Apply for Fee Redemption** <br />
 https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
 As the cover creator, you will earn a portion of all cover fees
 generated in this pool. <br /> <br />
 Read the documentation to learn more about the fees: <br />
 https://docs.neptunemutual.com/covers/contract-creators

```solidity
function addCover(struct ICover.AddCoverArgs args) external nonpayable
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddCoverArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCover(AddCoverArgs calldata args) external returns (address);
```
</details>

### addCovers

```solidity
function addCovers(struct ICover.AddCoverArgs[] args) external nonpayable
returns(vaults address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddCoverArgs[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCovers(AddCoverArgs[] calldata args) external returns (address[] memory vaults);
```
</details>

### addProduct

```solidity
function addProduct(struct ICover.AddProductArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddProductArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addProduct(AddProductArgs calldata args) external;
```
</details>

### addProducts

```solidity
function addProducts(struct ICover.AddProductArgs[] args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddProductArgs[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addProducts(AddProductArgs[] calldata args) external;
```
</details>

### updateProduct

```solidity
function updateProduct(struct ICover.UpdateProductArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.UpdateProductArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateProduct(UpdateProductArgs calldata args) external;
```
</details>

### updateCover

Updates the cover contract.
 This feature is accessible only to the cover owner or protocol owner (governance).

```solidity
function updateCover(bytes32 coverKey, string info) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| info | string | Enter a new IPFS hash to update | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCover(bytes32 coverKey, string calldata info) external;
```
</details>

### updateCoverCreatorWhitelist

```solidity
function updateCoverCreatorWhitelist(address[] account, bool[] whitelisted) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address[] |  | 
| whitelisted | bool[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverCreatorWhitelist(address[] calldata account, bool[] calldata whitelisted) external;
```
</details>

### updateCoverUsersWhitelist

```solidity
function updateCoverUsersWhitelist(bytes32 coverKey, bytes32 productKey, address[] accounts, bool[] statuses) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| accounts | address[] |  | 
| statuses | bool[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverUsersWhitelist(
    bytes32 coverKey,
    bytes32 productKey,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external;
```
</details>

### disablePolicy

```solidity
function disablePolicy(bytes32 coverKey, bytes32 productKey, bool status, string reason) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| status | bool |  | 
| reason | string |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disablePolicy(
    bytes32 coverKey,
    bytes32 productKey,
    bool status,
    string calldata reason
  ) external;
```
</details>

### checkIfWhitelistedCoverCreator

```solidity
function checkIfWhitelistedCoverCreator(address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function checkIfWhitelistedCoverCreator(address account) external view returns (bool);
```
</details>

### checkIfWhitelistedUser

```solidity
function checkIfWhitelistedUser(bytes32 coverKey, bytes32 productKey, address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function checkIfWhitelistedUser(
    bytes32 coverKey,
    bytes32 productKey,
    address account
  ) external view returns (bool);
```
</details>

### setCoverCreationFee

```solidity
function setCoverCreationFee(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setCoverCreationFee(uint256 value) external;
```
</details>

### setMinCoverCreationStake

```solidity
function setMinCoverCreationStake(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinCoverCreationStake(uint256 value) external;
```
</details>

### setMinStakeToAddLiquidity

```solidity
function setMinStakeToAddLiquidity(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinStakeToAddLiquidity(uint256 value) external;
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
* [INeptuneRouterV1](INeptuneRouterV1.md)
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
* [NeptuneRouterV1](NeptuneRouterV1.md)
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
