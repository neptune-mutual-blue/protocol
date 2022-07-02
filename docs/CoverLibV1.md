# CoverLibV1.sol

View Source: [contracts/libraries/CoverLibV1.sol](../contracts/libraries/CoverLibV1.sol)

**CoverLibV1**

**Events**

```js
event CoverUserWhitelistUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed account, bool  status);
```

## Functions

- [initializeCoverInternal(IStore s, address stablecoin, bytes32 friendlyName)](#initializecoverinternal)
- [addCoverInternal(IStore s, bytes32 coverKey, bool supportsProducts, bytes32 info, bool requiresWhitelist, uint256[] values)](#addcoverinternal)
- [_addCover(IStore s, bytes32 coverKey, bool supportsProducts, bytes32 info, bool requiresWhitelist, uint256[] values, uint256 fee)](#_addcover)
- [addProductInternal(IStore s, bytes32 coverKey, bytes32 productKey, bytes32 info, bool requiresWhitelist, uint256[] values)](#addproductinternal)
- [updateProductInternal(IStore s, bytes32 coverKey, bytes32 productKey, bytes32 info, uint256[] values)](#updateproductinternal)
- [deployVaultInternal(IStore s, bytes32 coverKey, string tokenName, string tokenSymbol)](#deployvaultinternal)
- [_validateAndGetFee(IStore s, bytes32 coverKey, bytes32 info, uint256 stakeWithFee)](#_validateandgetfee)
- [updateCoverInternal(IStore s, bytes32 coverKey, bytes32 info)](#updatecoverinternal)
- [updateCoverCreatorWhitelistInternal(IStore s, address account, bool status)](#updatecovercreatorwhitelistinternal)
- [_updateCoverUserWhitelistInternal(IStore s, bytes32 coverKey, bytes32 productKey, address account, bool status)](#_updatecoveruserwhitelistinternal)
- [updateCoverUsersWhitelistInternal(IStore s, bytes32 coverKey, bytes32 productKey, address[] accounts, bool[] statuses)](#updatecoveruserswhitelistinternal)
- [setCoverCreationFeeInternal(IStore s, uint256 value)](#setcovercreationfeeinternal)
- [setMinCoverCreationStakeInternal(IStore s, uint256 value)](#setmincovercreationstakeinternal)
- [setMinStakeToAddLiquidityInternal(IStore s, uint256 value)](#setminstaketoaddliquidityinternal)

### initializeCoverInternal

```solidity
function initializeCoverInternal(IStore s, address stablecoin, bytes32 friendlyName) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | tablecoin Provide the address of the token this cover will be quoted against. | 
| stablecoin | address | Provide the address of the token this cover will be quoted against. | 
| friendlyName | bytes32 | Enter a description or ENS name of your liquidity token. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initializeCoverInternal(
    IStore s,
    address stablecoin,
    bytes32 friendlyName
  ) external {
    s.setAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN, stablecoin);
    s.setBytes32ByKey(ProtoUtilV1.NS_COVER_STABLECOIN_NAME, friendlyName);

    s.updateStateAndLiquidity(0);
  }
```
</details>

### addCoverInternal

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
function addCoverInternal(IStore s, bytes32 coverKey, bool supportsProducts, bytes32 info, bool requiresWhitelist, uint256[] values) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide store instance | 
| coverKey | bytes32 | Enter a unique key for this cover | 
| supportsProducts | bool |  | 
| info | bytes32 | IPFS info of the cover contract | 
| requiresWhitelist | bool |  | 
| values | uint256[] | [0] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCoverInternal(
    IStore s,
    bytes32 coverKey,
    bool supportsProducts,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external {
    // First validate the information entered
    (uint256 fee, ) = _validateAndGetFee(s, coverKey, info, values[0]);

    // Set the basic cover info
    _addCover(s, coverKey, supportsProducts, info, requiresWhitelist, values, fee);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(coverKey, msg.sender, values[0], fee);

    // Add cover reassurance
    if (values[1] > 0) {
      s.getReassuranceContract().addReassurance(coverKey, msg.sender, values[1]);
    }
  }
```
</details>

### _addCover

```solidity
function _addCover(IStore s, bytes32 coverKey, bool supportsProducts, bytes32 info, bool requiresWhitelist, uint256[] values, uint256 fee) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| supportsProducts | bool |  | 
| info | bytes32 |  | 
| requiresWhitelist | bool |  | 
| values | uint256[] |  | 
| fee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addCover(
    IStore s,
    bytes32 coverKey,
    bool supportsProducts,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] calldata values,
    uint256 fee
  ) private {
    require(coverKey > 0, "Invalid cover key");
    require(info > 0, "Invalid info");
    require(values[2] > 0, "Invalid min reporting stake");
    require(values[3] > 0, "Invalid reporting period");
    require(values[4] > 0, "Invalid cooldown period");
    require(values[5] > 0, "Invalid claim period");
    require(values[6] > 0, "Invalid floor rate");
    require(values[7] > 0, "Invalid ceiling rate");
    require(values[8] > 0, "Invalid reassurance rate");
    require(values[9] > 0 && values[9] < 25, "Invalid leverage");

    if (supportsProducts == false) {
      // Standalone pools do not support any leverage
      require(values[9] == 1, "Invalid leverage");
    }

    s.setBoolByKeys(ProtoUtilV1.NS_COVER, coverKey, true);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_SUPPORTS_PRODUCTS, coverKey, supportsProducts);
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, coverKey, msg.sender);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, coverKey, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_FEE_EARNING, coverKey, fee);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, coverKey, block.timestamp); // solhint-disable-line

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey, values[2]);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, coverKey, values[3]);
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey, values[4]);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey, values[5]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, coverKey, values[6]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, coverKey, values[7]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, coverKey, values[8]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LEVERAGE_FACTOR, coverKey, values[9]);
  }
```
</details>

### addProductInternal

```solidity
function addProductInternal(IStore s, bytes32 coverKey, bytes32 productKey, bytes32 info, bool requiresWhitelist, uint256[] values) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| info | bytes32 |  | 
| requiresWhitelist | bool |  | 
| values | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] calldata values
  ) external {
    s.mustBeValidCoverKey(coverKey);
    s.mustSupportProducts(coverKey);

    require(productKey > 0, "Invalid product key");
    require(info > 0, "Invalid info");

    // Product Status
    // 0 --> Deleted
    // 1 --> Active
    // 2 --> Retired
    require(values[0] == 1, "Status must be active");
    require(values[1] > 0 && values[1] <= 10_000, "Invalid efficiency");

    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey) == false, "Already exists");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, true);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, info);
    s.setBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, productKey, requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, values[0]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, coverKey, productKey, values[1]);
  }
```
</details>

### updateProductInternal

```solidity
function updateProductInternal(IStore s, bytes32 coverKey, bytes32 productKey, bytes32 info, uint256[] values) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| info | bytes32 |  | 
| values | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    uint256[] calldata values
  ) external {
    require(values[0] <= 2, "Invalid product status");
    require(values[1] > 0 && values[1] <= 10_000, "Invalid efficiency");

    s.mustBeValidCoverKey(coverKey);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, values[0]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, coverKey, productKey, values[1]);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, info);
  }
```
</details>

### deployVaultInternal

```solidity
function deployVaultInternal(IStore s, bytes32 coverKey, string tokenName, string tokenSymbol) external nonpayable
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| tokenName | string |  | 
| tokenSymbol | string |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deployVaultInternal(
    IStore s,
    bytes32 coverKey,
    string calldata tokenName,
    string calldata tokenSymbol
  ) external returns (address) {
    address vault = s.getProtocolContract(ProtoUtilV1.CNS_COVER_VAULT, coverKey);
    require(vault == address(0), "Vault already deployed");

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(coverKey, tokenName, tokenSymbol);

    s.getProtocol().addContractWithKey(ProtoUtilV1.CNS_COVER_VAULT, coverKey, address(deployed));
    return deployed;
  }
```
</details>

### _validateAndGetFee

Validation checks before adding a new cover

```solidity
function _validateAndGetFee(IStore s, bytes32 coverKey, bytes32 info, uint256 stakeWithFee) private view
returns(fee uint256, minCoverCreationStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| info | bytes32 |  | 
| stakeWithFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validateAndGetFee(
    IStore s,
    bytes32 coverKey,
    bytes32 info,
    uint256 stakeWithFee
  ) private view returns (uint256 fee, uint256 minCoverCreationStake) {
    require(info > 0, "Invalid info");
    (fee, minCoverCreationStake, ) = s.getCoverCreationFeeInfo();

    uint256 minStake = fee + minCoverCreationStake;

    require(stakeWithFee > minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey) == false, "Already exists");
  }
```
</details>

### updateCoverInternal

```solidity
function updateCoverInternal(IStore s, bytes32 coverKey, bytes32 info) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| info | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 info
  ) external {
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
  }
```
</details>

### updateCoverCreatorWhitelistInternal

```solidity
function updateCoverCreatorWhitelistInternal(IStore s, address account, bool status) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| status | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverCreatorWhitelistInternal(
    IStore s,
    address account,
    bool status
  ) external {
    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, account, status);
  }
```
</details>

### _updateCoverUserWhitelistInternal

```solidity
function _updateCoverUserWhitelistInternal(IStore s, bytes32 coverKey, bytes32 productKey, address account, bool status) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| account | address |  | 
| status | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _updateCoverUserWhitelistInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address account,
    bool status
  ) private {
    s.setAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, productKey, account, status);
    emit CoverUserWhitelistUpdated(coverKey, productKey, account, status);
  }
```
</details>

### updateCoverUsersWhitelistInternal

```solidity
function updateCoverUsersWhitelistInternal(IStore s, bytes32 coverKey, bytes32 productKey, address[] accounts, bool[] statuses) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| accounts | address[] |  | 
| statuses | bool[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverUsersWhitelistInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external {
    require(accounts.length == statuses.length, "Inconsistent array sizes");

    for (uint256 i = 0; i < accounts.length; i++) {
      _updateCoverUserWhitelistInternal(s, coverKey, productKey, accounts[i], statuses[i]);
    }
  }
```
</details>

### setCoverCreationFeeInternal

```solidity
function setCoverCreationFeeInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setCoverCreationFeeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    previous = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, value);

    s.updateStateAndLiquidity(0);
  }
```
</details>

### setMinCoverCreationStakeInternal

```solidity
function setMinCoverCreationStakeInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinCoverCreationStakeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinCoverCreationStake();
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }
```
</details>

### setMinStakeToAddLiquidityInternal

```solidity
function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinStakeToAddLiquidity();
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
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
