## Neptune Mutual Cover

![Protocol](./files/protocol.png)

Anyone who has NPM tokens can create a cover contract. To avoid spam, questionable, and confusing cover contracts, a creator has to burn 1000 NPM tokens. Additionally, the contract creator also needs to stake 4000 NPM tokens or more. The higher the sake, the more visibility the contract gets if there are multiple cover contracts with the same name or similar terms.

[Read More](https://docs.neptunemutual.com/sdk/quickstart)

[comment]: #solidoc Start
# Cover Contract (Cover.sol)

View Source: [contracts/core/lifecycle/Cover.sol](/contracts/core/lifecycle/Cover.sol)

**↗ Extends: [CoverBase](docs/CoverBase.md)**

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

* [AaveStrategy](docs/AaveStrategy.md)
* [AccessControl](docs/AccessControl.md)
* [AccessControlLibV1](docs/AccessControlLibV1.md)
* [Address](docs/Address.md)
* [BaseLibV1](docs/BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](docs/BokkyPooBahsDateTimeLibrary.md)
* [BondPool](docs/BondPool.md)
* [BondPoolBase](docs/BondPoolBase.md)
* [BondPoolLibV1](docs/BondPoolLibV1.md)
* [CompoundStrategy](docs/CompoundStrategy.md)
* [Context](docs/Context.md)
* [Cover](docs/Cover.md)
* [CoverBase](docs/CoverBase.md)
* [CoverLibV1](docs/CoverLibV1.md)
* [CoverReassurance](docs/CoverReassurance.md)
* [CoverStake](docs/CoverStake.md)
* [CoverUtilV1](docs/CoverUtilV1.md)
* [cxToken](docs/cxToken.md)
* [cxTokenFactory](docs/cxTokenFactory.md)
* [cxTokenFactoryLibV1](docs/cxTokenFactoryLibV1.md)
* [Delayable](docs/Delayable.md)
* [Destroyable](docs/Destroyable.md)
* [ERC165](docs/ERC165.md)
* [ERC20](docs/ERC20.md)
* [FakeAaveLendingPool](docs/FakeAaveLendingPool.md)
* [FakeCompoundStablecoinDelegator](docs/FakeCompoundStablecoinDelegator.md)
* [FakePriceOracle](docs/FakePriceOracle.md)
* [FakeRecoverable](docs/FakeRecoverable.md)
* [FakeStore](docs/FakeStore.md)
* [FakeToken](docs/FakeToken.md)
* [FakeUniswapPair](docs/FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](docs/FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](docs/FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](docs/FakeUniswapV2RouterLike.md)
* [FaultyAaveLendingPool](docs/FaultyAaveLendingPool.md)
* [FaultyCompoundStablecoinDelegator](docs/FaultyCompoundStablecoinDelegator.md)
* [Finalization](docs/Finalization.md)
* [ForceEther](docs/ForceEther.md)
* [Governance](docs/Governance.md)
* [GovernanceUtilV1](docs/GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](docs/IAaveV2LendingPoolLike.md)
* [IAccessControl](docs/IAccessControl.md)
* [IBondPool](docs/IBondPool.md)
* [IClaimsProcessor](docs/IClaimsProcessor.md)
* [ICompoundERC20DelegatorLike](docs/ICompoundERC20DelegatorLike.md)
* [ICover](docs/ICover.md)
* [ICoverReassurance](docs/ICoverReassurance.md)
* [ICoverStake](docs/ICoverStake.md)
* [ICxToken](docs/ICxToken.md)
* [ICxTokenFactory](docs/ICxTokenFactory.md)
* [IERC165](docs/IERC165.md)
* [IERC20](docs/IERC20.md)
* [IERC20Detailed](docs/IERC20Detailed.md)
* [IERC20Metadata](docs/IERC20Metadata.md)
* [IERC3156FlashBorrower](docs/IERC3156FlashBorrower.md)
* [IERC3156FlashLender](docs/IERC3156FlashLender.md)
* [IFinalization](docs/IFinalization.md)
* [IGovernance](docs/IGovernance.md)
* [ILendingStrategy](docs/ILendingStrategy.md)
* [ILiquidityEngine](docs/ILiquidityEngine.md)
* [IMember](docs/IMember.md)
* [INeptuneRouterV1](docs/INeptuneRouterV1.md)
* [InvalidStrategy](docs/InvalidStrategy.md)
* [IPausable](docs/IPausable.md)
* [IPolicy](docs/IPolicy.md)
* [IPolicyAdmin](docs/IPolicyAdmin.md)
* [IPriceOracle](docs/IPriceOracle.md)
* [IProtocol](docs/IProtocol.md)
* [IRecoverable](docs/IRecoverable.md)
* [IReporter](docs/IReporter.md)
* [IResolution](docs/IResolution.md)
* [IResolvable](docs/IResolvable.md)
* [IStakingPools](docs/IStakingPools.md)
* [IStore](docs/IStore.md)
* [IStoreLike](docs/IStoreLike.md)
* [IUniswapV2FactoryLike](docs/IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](docs/IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](docs/IUniswapV2RouterLike.md)
* [IUnstakable](docs/IUnstakable.md)
* [IVault](docs/IVault.md)
* [IVaultDelegate](docs/IVaultDelegate.md)
* [IVaultFactory](docs/IVaultFactory.md)
* [IWitness](docs/IWitness.md)
* [LiquidityEngine](docs/LiquidityEngine.md)
* [MaliciousToken](docs/MaliciousToken.md)
* [MockAccessControlUser](docs/MockAccessControlUser.md)
* [MockCoverUtilUser](docs/MockCoverUtilUser.md)
* [MockCxToken](docs/MockCxToken.md)
* [MockCxTokenPolicy](docs/MockCxTokenPolicy.md)
* [MockCxTokenStore](docs/MockCxTokenStore.md)
* [MockFlashBorrower](docs/MockFlashBorrower.md)
* [MockLiquidityEngineUser](docs/MockLiquidityEngineUser.md)
* [MockProcessorStore](docs/MockProcessorStore.md)
* [MockProcessorStoreLib](docs/MockProcessorStoreLib.md)
* [MockProtocol](docs/MockProtocol.md)
* [MockRegistryClient](docs/MockRegistryClient.md)
* [MockStore](docs/MockStore.md)
* [MockStoreKeyUtilUser](docs/MockStoreKeyUtilUser.md)
* [MockValidationLibUser](docs/MockValidationLibUser.md)
* [MockVault](docs/MockVault.md)
* [MockVaultLibUser](docs/MockVaultLibUser.md)
* [NeptuneRouterV1](docs/NeptuneRouterV1.md)
* [NPM](docs/NPM.md)
* [NpmDistributor](docs/NpmDistributor.md)
* [NTransferUtilV2](docs/NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](docs/NTransferUtilV2Intermediate.md)
* [Ownable](docs/Ownable.md)
* [Pausable](docs/Pausable.md)
* [Policy](docs/Policy.md)
* [PolicyAdmin](docs/PolicyAdmin.md)
* [PolicyHelperV1](docs/PolicyHelperV1.md)
* [PoorMansERC20](docs/PoorMansERC20.md)
* [POT](docs/POT.md)
* [PriceLibV1](docs/PriceLibV1.md)
* [Processor](docs/Processor.md)
* [ProtoBase](docs/ProtoBase.md)
* [Protocol](docs/Protocol.md)
* [ProtoUtilV1](docs/ProtoUtilV1.md)
* [Recoverable](docs/Recoverable.md)
* [ReentrancyGuard](docs/ReentrancyGuard.md)
* [RegistryLibV1](docs/RegistryLibV1.md)
* [Reporter](docs/Reporter.md)
* [Resolution](docs/Resolution.md)
* [Resolvable](docs/Resolvable.md)
* [RoutineInvokerLibV1](docs/RoutineInvokerLibV1.md)
* [SafeERC20](docs/SafeERC20.md)
* [StakingPoolBase](docs/StakingPoolBase.md)
* [StakingPoolCoreLibV1](docs/StakingPoolCoreLibV1.md)
* [StakingPoolInfo](docs/StakingPoolInfo.md)
* [StakingPoolLibV1](docs/StakingPoolLibV1.md)
* [StakingPoolReward](docs/StakingPoolReward.md)
* [StakingPools](docs/StakingPools.md)
* [Store](docs/Store.md)
* [StoreBase](docs/StoreBase.md)
* [StoreKeyUtil](docs/StoreKeyUtil.md)
* [StrategyLibV1](docs/StrategyLibV1.md)
* [Strings](docs/Strings.md)
* [TimelockController](docs/TimelockController.md)
* [Unstakable](docs/Unstakable.md)
* [ValidationLibV1](docs/ValidationLibV1.md)
* [Vault](docs/Vault.md)
* [VaultBase](docs/VaultBase.md)
* [VaultDelegate](docs/VaultDelegate.md)
* [VaultDelegateBase](docs/VaultDelegateBase.md)
* [VaultDelegateWithFlashLoan](docs/VaultDelegateWithFlashLoan.md)
* [VaultFactory](docs/VaultFactory.md)
* [VaultFactoryLibV1](docs/VaultFactoryLibV1.md)
* [VaultLibV1](docs/VaultLibV1.md)
* [VaultLiquidity](docs/VaultLiquidity.md)
* [VaultStrategy](docs/VaultStrategy.md)
* [WithFlashLoan](docs/WithFlashLoan.md)
* [WithPausability](docs/WithPausability.md)
* [WithRecovery](docs/WithRecovery.md)
* [Witness](docs/Witness.md)

[comment]: #solidoc End
