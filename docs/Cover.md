# Cover Contract (Cover.sol)

View Source: [contracts/core/lifecycle/Cover.sol](../contracts/core/lifecycle/Cover.sol)

**↗ Extends: [CoverBase](CoverBase.md)**

**Cover**

The cover contract facilitates you create and update covers

## Functions

- [constructor(IStore store)](#)
- [updateCover(bytes32 key, bytes32 info)](#updatecover)
- [addCover(bytes32 key, bytes32 info, address reassuranceToken, uint256[] values)](#addcover)
- [stopCover(bytes32 key, string reason)](#stopcover)
- [updateWhitelist(address account, bool status)](#updatewhitelist)
- [checkIfWhitelisted(address account)](#checkifwhitelisted)

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

### updateCover

Updates the cover contract.
 This feature is accessible only to the cover owner or protocol owner (governance).

```solidity
function updateCover(bytes32 key, bytes32 info) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| info | bytes32 | Enter a new IPFS URL to update | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCover(bytes32 key, bytes32 info) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCover(key);

    if (AccessControlLibV1.hasAccess(s, AccessControlLibV1.NS_ROLES_ADMIN, msg.sender) == false) {
      s.mustBeCoverOwner(key, msg.sender);
    }

    require(s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key) != info, "Duplicate content");

    s.updateCoverInternal(key, info);
    emit CoverUpdated(key, info);
  }
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
function addCover(bytes32 key, bytes32 info, address reassuranceToken, uint256[] values) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| reassuranceToken | address | **Optional.** Token added as an reassurance of this cover. <br /><br />  Reassurance tokens can be added by a project to demonstrate coverage support  for their own project. This helps bring the cover fee down and enhances  liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded  as a support to the liquidity providers when a cover incident occurs. | 
| values | uint256[] | [0] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCover(
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    uint256[] memory values
  ) external override nonReentrant {
    // @suppress-acl Can only be called by a whitelisted address
    // @suppress-acl Marking this as publicly accessible
    // @suppress-address-trust-issue The reassuranceToken can only be the stablecoin supported by the protocol for this version.
    s.mustNotBePaused();
    s.senderMustBeWhitelisted();

    require(values[0] >= s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE), "Min NPM stake too low");
    require(reassuranceToken == s.getStablecoin(), "Invalid reassurance token");

    s.addCoverInternal(key, info, reassuranceToken, values);
    emit CoverCreated(key, info);
  }
```
</details>

### stopCover

Enables governance admin to stop a spam cover contract

```solidity
function stopCover(bytes32 key, string reason) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key you want to stop | 
| reason | string | Provide a reason to stop this cover | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function stopCover(bytes32 key, string memory reason) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCover(key);
    AccessControlLibV1.mustBeGovernanceAdmin(s);

    s.stopCoverInternal(key);
    emit CoverStopped(key, msg.sender, reason);
  }
```
</details>

### updateWhitelist

Adds or removes an account to the whitelist.
 For the first version of the protocol, a cover creator has to be whitelisted
 before they can call the `addCover` function.

```solidity
function updateWhitelist(address account, bool status) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Enter the address of the cover creator | 
| status | bool | Set this to true if you want to add to or false to remove from the whitelist | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateWhitelist(address account, bool status) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    s.updateWhitelistInternal(account, status);
    emit WhitelistUpdated(account, status);
  }
```
</details>

### checkIfWhitelisted

Signifies if a given account is whitelisted

```solidity
function checkIfWhitelisted(address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function checkIfWhitelisted(address account) external view override returns (bool) {
    return s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account);
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
