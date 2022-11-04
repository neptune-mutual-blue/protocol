# Cover Contract (Cover.sol)

View Source: [contracts/core/lifecycle/Cover.sol](../contracts/core/lifecycle/Cover.sol)

**↗ Extends: [CoverBase](CoverBase.md)**

**Cover**

The cover contract enables you to manage onchain covers.

## Functions

- [constructor(IStore store)](#)
- [addCover(struct ICover.AddCoverArgs args)](#addcover)
- [addCovers(struct ICover.AddCoverArgs[] args)](#addcovers)
- [updateCover(bytes32 coverKey, string info)](#updatecover)
- [addProduct(struct ICover.AddProductArgs args)](#addproduct)
- [addProducts(struct ICover.AddProductArgs[] args)](#addproducts)
- [updateProduct(struct ICover.UpdateProductArgs args)](#updateproduct)
- [disablePolicy(bytes32 coverKey, bytes32 productKey, bool status, string reason)](#disablepolicy)
- [updateCoverCreatorWhitelist(address[] accounts, bool[] statuses)](#updatecovercreatorwhitelist)
- [updateCoverUsersWhitelist(bytes32 coverKey, bytes32 productKey, address[] accounts, bool[] statuses)](#updatecoveruserswhitelist)
- [checkIfWhitelistedCoverCreator(address account)](#checkifwhitelistedcovercreator)
- [checkIfWhitelistedUser(bytes32 coverKey, bytes32 productKey, address account)](#checkifwhitelisteduser)

### 

Constructs this contract

```solidity
function (IStore store) public nonpayable CoverBase 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Enter the store | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) CoverBase(store) {}
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
 Read the documentation to learn more about the fees: <br />
 https://docs.neptunemutual.com/covers/contract-creators

```solidity
function addCover(struct ICover.AddCoverArgs args) public nonpayable nonReentrant 
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddCoverArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCover(AddCoverArgs calldata args) public override nonReentrant returns (address) {
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();

    require(args.stakeWithFee >= s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE), "Your stake is too low");

    s.addCoverInternal(args);

    emit CoverCreated(args.coverKey, args.info, args.tokenName, args.tokenSymbol, args.supportsProducts, args.requiresWhitelist);

    return s.deployVaultInternal(args.coverKey, args.tokenName, args.tokenSymbol);
  }
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
function addCovers(AddCoverArgs[] calldata args) external override returns (address[] memory vaults) {
    vaults = new address[](args.length + 1);

    for (uint256 i = 0; i < args.length; i++) {
      vaults[i] = addCover(args[i]);
    }
  }
```
</details>

### updateCover

Updates the cover contract.
 This feature is accessible only to the cover manager during withdrawal period.

```solidity
function updateCover(bytes32 coverKey, string info) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| info | string | IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCover(bytes32 coverKey, string calldata info) external override nonReentrant {
    s.mustNotBePaused();
    s.mustEnsureAllProductsAreNormal(coverKey);
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeDuringWithdrawalPeriod(coverKey);

    require(keccak256(bytes(s.getStringByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey))) != keccak256(bytes(info)), "Duplicate content");

    s.updateCoverInternal(coverKey, info);
    emit CoverUpdated(coverKey, info);
  }
```
</details>

### addProduct

Adds a product under a diversified cover pool

```solidity
function addProduct(struct ICover.AddProductArgs args) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.AddProductArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addProduct(AddProductArgs calldata args) public override nonReentrant {
    // @suppress-zero-value-check The uint values are validated in the function `addProductInternal`
    s.mustNotBePaused();
    s.senderMustBeWhitelistedCoverCreator();
    s.senderMustBeCoverOwnerOrAdmin(args.coverKey);

    s.addProductInternal(args);
    emit ProductCreated(args.coverKey, args.productKey, args.info);
  }
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
function addProducts(AddProductArgs[] calldata args) external override {
    for (uint256 i = 0; i < args.length; i++) {
      addProduct(args[i]);
    }
  }
```
</details>

### updateProduct

Updates a cover product.
 This feature is accessible only to the cover manager during withdrawal period.

```solidity
function updateProduct(struct ICover.UpdateProductArgs args) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct ICover.UpdateProductArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateProduct(UpdateProductArgs calldata args) external override nonReentrant {
    // @suppress-zero-value-check The uint values are validated in the function `updateProductInternal`
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(args.coverKey, args.productKey);
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeDuringWithdrawalPeriod(args.coverKey);

    s.updateProductInternal(args);
    emit ProductUpdated(args.coverKey, args.productKey, args.info);
  }
```
</details>

### disablePolicy

Allows disabling and enabling the purchase of policy for a product or cover.
 This function enables governance admin to disable or enable the purchase of policy for a product or cover.
 A cover contract when stopped restricts new policy purchases
 and frees up liquidity as policies expires.
 1. The policy purchases can be disabled and later enabled after current policies expire and liquidity is withdrawn.
 2. The policy purchases can be disabled temporarily to allow liquidity providers a chance to exit.

```solidity
function disablePolicy(bytes32 coverKey, bytes32 productKey, bool status, string reason) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key you want to disable policy purchases | 
| productKey | bytes32 | Enter the product key you want to disable policy purchases | 
| status | bool | Set this to true if you disable or false to enable policy purchases | 
| reason | string | Provide a reason to disable the policy purchases | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disablePolicy(
    bytes32 coverKey,
    bytes32 productKey,
    bool status,
    string calldata reason
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    require(status != s.isPolicyDisabledInternal(coverKey, productKey), status ? "Already disabled" : "Already enabled");

    s.disablePolicyInternal(coverKey, productKey, status);

    emit ProductStateUpdated(coverKey, productKey, msg.sender, status, reason);
  }
```
</details>

### updateCoverCreatorWhitelist

Adds or removes an account to the cover creator whitelist.
 For the first version of the protocol, a cover creator has to be whitelisted
 before they can call the `addCover` function.

```solidity
function updateCoverCreatorWhitelist(address[] accounts, bool[] statuses) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| accounts | address[] | Enter list of address of cover creators | 
| statuses | bool[] | Set this to true if you want to add to or false to remove from the whitelist | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverCreatorWhitelist(address[] calldata accounts, bool[] calldata statuses) external override nonReentrant {
    require(accounts.length > 0, "Please specify an account");
    require(accounts.length == statuses.length, "Invalid args");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    for (uint256 i = 0; i < accounts.length; i++) {
      s.updateCoverCreatorWhitelistInternal(accounts[i], statuses[i]);
      emit CoverCreatorWhitelistUpdated(accounts[i], statuses[i]);
    }
  }
```
</details>

### updateCoverUsersWhitelist

Adds or removes an account from the cover user whitelist.
 Whitelisting is an optional feature cover creators can enable.
 When a cover requires whitelist, you must add accounts
 to the cover user whitelist before they are able to purchase policies.

```solidity
function updateCoverUsersWhitelist(bytes32 coverKey, bytes32 productKey, address[] accounts, bool[] statuses) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 
| productKey | bytes32 | Enter product key | 
| accounts | address[] | Enter a list of accounts you would like to update the whitelist statuses of. | 
| statuses | bool[] | Enter respective statuses of the specified whitelisted accounts. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverUsersWhitelist(
    bytes32 coverKey,
    bytes32 productKey,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.senderMustBeCoverOwnerOrAdmin(coverKey);

    s.updateCoverUsersWhitelistInternal(coverKey, productKey, accounts, statuses);
  }
```
</details>

### checkIfWhitelistedCoverCreator

Signifies if the given account is a whitelisted cover creator

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
function checkIfWhitelistedCoverCreator(address account) external view override returns (bool) {
    return s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, account);
  }
```
</details>

### checkIfWhitelistedUser

Signifies if the given account is a whitelisted user

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
  ) external view override returns (bool) {
    return s.getAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, productKey, account);
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
* [FakeCompoundStablecoinDelegator](FakeCompoundStablecoinDelegator.md)
* [FakePriceOracle](FakePriceOracle.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [FaultyAaveLendingPool](FaultyAaveLendingPool.md)
* [FaultyCompoundStablecoinDelegator](FaultyCompoundStablecoinDelegator.md)
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
