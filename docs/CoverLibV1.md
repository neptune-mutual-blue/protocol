# CoverLibV1.sol

View Source: [contracts/libraries/CoverLibV1.sol](../contracts/libraries/CoverLibV1.sol)

**CoverLibV1**

**Events**

```js
event CoverUserWhitelistUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed account, bool  status);
```

## Functions

- [initializeCoverInternal(IStore s, address stablecoin, bytes32 friendlyName)](#initializecoverinternal)
- [addCoverInternal(IStore s, struct ICover.AddCoverArgs args)](#addcoverinternal)
- [_addCover(IStore s, struct ICover.AddCoverArgs args, uint256 fee)](#_addcover)
- [addProductInternal(IStore s, struct ICover.AddProductArgs args)](#addproductinternal)
- [updateProductInternal(IStore s, struct ICover.UpdateProductArgs args)](#updateproductinternal)
- [deployVaultInternal(IStore s, bytes32 coverKey, string tokenName, string tokenSymbol)](#deployvaultinternal)
- [_getFee(IStore s, bytes32 coverKey, uint256 stakeWithFee)](#_getfee)
- [updateCoverInternal(IStore s, bytes32 coverKey, string info)](#updatecoverinternal)
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

    s.updateStateAndLiquidityInternal(0);
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
function addCoverInternal(IStore s, struct ICover.AddCoverArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide store instance | 
| args | struct ICover.AddCoverArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCoverInternal(IStore s, ICover.AddCoverArgs calldata args) external {
    // Get the fee info required to create this cover
    (uint256 fee, ) = _getFee(s, args.coverKey, args.stakeWithFee);

    // Set the basic cover info
    _addCover(s, args, fee);

    IERC20 npm = s.getNpmTokenInstanceInternal();
    ICoverStake stakingContract = s.getStakingContract();

    npm.ensureTransferFrom(msg.sender, address(this), args.stakeWithFee);

    npm.ensureApproval(address(stakingContract), args.stakeWithFee);

    // Stake the supplied NPM tokens and burn the fees
    stakingContract.increaseStake(args.coverKey, msg.sender, args.stakeWithFee, fee);

    // Add cover reassurance
    if (args.initialReassuranceAmount > 0) {
      IERC20 stablecoin = IERC20(s.getStablecoinAddressInternal());
      ICoverReassurance reassurance = s.getReassuranceContract();

      stablecoin.ensureTransferFrom(msg.sender, address(this), args.initialReassuranceAmount);
      stablecoin.ensureApproval(address(reassurance), args.initialReassuranceAmount);

      reassurance.addReassurance(args.coverKey, msg.sender, args.initialReassuranceAmount);
    }
  }
```
</details>

### _addCover

Adds a new cover

```solidity
function _addCover(IStore s, struct ICover.AddCoverArgs args, uint256 fee) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| args | struct ICover.AddCoverArgs |  | 
| fee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addCover(
    IStore s,
    ICover.AddCoverArgs calldata args,
    uint256 fee
  ) private {
    require(args.coverKey > 0, "Invalid cover key");
    require(bytes(args.info).length > 0, "Invalid info");
    require(args.minStakeToReport > 0, "Invalid min reporting stake");
    require(args.reportingPeriod > 0, "Invalid reporting period");
    require(args.cooldownPeriod > 0, "Invalid cooldown period");
    require(args.claimPeriod > 0, "Invalid claim period");
    require(args.floor > 0, "Invalid floor rate");
    require(args.ceiling > args.floor, "Invalid ceiling rate");
    require(args.reassuranceRate > 0, "Invalid reassurance rate");
    require(args.leverageFactor > 0 && args.leverageFactor < 25, "Invalid leverage");
    require(args.reportingPeriod >= s.getCoverageLagInternal(args.coverKey), "Invalid reporting period");

    if (args.supportsProducts == false) {
      // Standalone pools do not support any leverage
      require(args.leverageFactor == 1, "Invalid leverage");
    }

    s.setBoolByKeys(ProtoUtilV1.NS_COVER, args.coverKey, true);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_SUPPORTS_PRODUCTS, args.coverKey, args.supportsProducts);
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, args.coverKey, msg.sender);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_INFO, args.coverKey, args.info);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, args.coverKey, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_FEE_EARNING, args.coverKey, fee);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, args.coverKey, block.timestamp); // solhint-disable-line

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, args.coverKey, args.requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, args.coverKey, args.minStakeToReport);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, args.coverKey, args.reportingPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, args.coverKey, args.cooldownPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, args.coverKey, args.claimPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, args.coverKey, args.floor);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, args.coverKey, args.ceiling);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, args.coverKey, args.reassuranceRate);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LEVERAGE_FACTOR, args.coverKey, args.leverageFactor);
  }
```
</details>

### addProductInternal

Adds a product under a diversified cover pool

```solidity
function addProductInternal(IStore s, struct ICover.AddProductArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| args | struct ICover.AddProductArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addProductInternal(IStore s, ICover.AddProductArgs calldata args) external {
    s.mustBeValidCoverKey(args.coverKey);
    s.mustSupportProducts(args.coverKey);

    require(args.productKey > 0, "Invalid product key");
    require(bytes(args.info).length > 0, "Invalid info");

    // Product Status
    // 0 --> Deleted
    // 1 --> Active
    // 2 --> Retired
    require(args.productStatus == 1, "Status must be active");
    require(args.efficiency > 0 && args.efficiency <= 10_000, "Invalid efficiency");

    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey) == false, "Already exists");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, true);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.info);
    s.setBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, args.coverKey, args.productKey, args.requiresWhitelist);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.productStatus);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, args.coverKey, args.productKey, args.efficiency);
  }
```
</details>

### updateProductInternal

Updates a cover product.

```solidity
function updateProductInternal(IStore s, struct ICover.UpdateProductArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| args | struct ICover.UpdateProductArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateProductInternal(IStore s, ICover.UpdateProductArgs calldata args) external {
    require(args.productStatus <= 2, "Invalid product status");
    require(args.efficiency > 0 && args.efficiency <= 10_000, "Invalid efficiency");

    s.mustBeValidCoverKey(args.coverKey);
    s.mustBeSupportedProductOrEmpty(args.coverKey, args.productKey);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.productStatus);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, args.coverKey, args.productKey, args.efficiency);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_PRODUCT, args.coverKey, args.productKey, args.info);
  }
```
</details>

### deployVaultInternal

Deploys vault contract for the given cover key.
 The vault contract is also an ERC-20-compatible contract.
 Reverts if the vault was previously deployed.

```solidity
function deployVaultInternal(IStore s, bytes32 coverKey, string tokenName, string tokenSymbol) external nonpayable
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| tokenName | string | Enter a name for the ERC-20 token | 
| tokenSymbol | string | Enter a symbol for the ERC-20 token | 

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

    s.getProtocolInternal().addContractWithKey(ProtoUtilV1.CNS_COVER_VAULT, coverKey, deployed);
    return deployed;
  }
```
</details>

### _getFee

Gets the fee to create cover and minimum stake required

```solidity
function _getFee(IStore s, bytes32 coverKey, uint256 stakeWithFee) private view
returns(fee uint256, minCoverCreationStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| stakeWithFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getFee(
    IStore s,
    bytes32 coverKey,
    uint256 stakeWithFee
  ) private view returns (uint256 fee, uint256 minCoverCreationStake) {
    (fee, minCoverCreationStake, ) = s.getCoverCreationFeeInfoInternal();

    uint256 minStake = fee + minCoverCreationStake;

    require(stakeWithFee > minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey) == false, "Already exists");
  }
```
</details>

### updateCoverInternal

Updates the cover info.

```solidity
function updateCoverInternal(IStore s, bytes32 coverKey, string info) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter the cover key | 
| info | string | IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverInternal(
    IStore s,
    bytes32 coverKey,
    string calldata info
  ) external {
    s.setStringByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
  }
```
</details>

### updateCoverCreatorWhitelistInternal

Adds or removes an account to the cover creator whitelist.
 For the first version of the protocol, a cover creator has to be whitelisted
 before they can call the `addCover` function.

```solidity
function updateCoverCreatorWhitelistInternal(IStore s, address account, bool status) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| account | address | Enter the address of the cover creator | 
| status | bool | Set this to true if you want to add to or false to remove from the whitelist | 

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

Adds or removes an account from the cover users whitelist

```solidity
function _updateCoverUserWhitelistInternal(IStore s, bytes32 coverKey, bytes32 productKey, address account, bool status) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| account | address | Enter the account you would like to add or remove fom the whitelist | 
| status | bool | Enter `true` to add or `false` to remove the specified account from the whitelist | 

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

Adds or removes an account from the cover user whitelist.
 Whitelisting is an optional feature cover creators can enable.
 When a cover requires whitelist, you must add accounts
 to the cover user whitelist before they are able to purchase policies.

```solidity
function updateCoverUsersWhitelistInternal(IStore s, bytes32 coverKey, bytes32 productKey, address[] accounts, bool[] statuses) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| accounts | address[] | Enter a list of accounts you would like to update the whitelist statuses of. | 
| statuses | bool[] | Enter respective statuses of the specified whitelisted accounts. | 

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

Sets cover creation fee in NPM token units

```solidity
function setCoverCreationFeeInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| value | uint256 | Enter the amount of NPM tokens to be charged as the cover creation fee. | 

**Returns**

previous Returns the previous cover creation fee.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setCoverCreationFeeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    previous = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, value);

    s.updateStateAndLiquidityInternal(0);
  }
```
</details>

### setMinCoverCreationStakeInternal

Sets the minimum amount of NPM stake required to create a new cover

```solidity
function setMinCoverCreationStakeInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| value | uint256 | Enter the amount of NPM tokens to be staked when creating a new cover. | 

**Returns**

previous Returns the previous minimum cover creation stake.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinCoverCreationStakeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinCoverCreationStakeInternal();
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, value);

    s.updateStateAndLiquidityInternal(0);
  }
```
</details>

### setMinStakeToAddLiquidityInternal

Sets the minimum amount of NPM stake required to add liquidity

```solidity
function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| value | uint256 | Enter the amount of NPM tokens to be staked when adding liquidity. | 

**Returns**

previous Returns the previous minimum stake to add liquidity.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinStakeToAddLiquidityInternal();
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, value);

    s.updateStateAndLiquidityInternal(0);
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
