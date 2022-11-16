# Proof of Authority Tokens (POTs) (POT.sol)

View Source: [contracts/core/token/POT.sol](../contracts/core/token/POT.sol)

**↗ Extends: [NPM](NPM.md)**

**POT**

POTs can't be used outside of the protocol
 for example in DEXes. Once NPM token is launched, it will replace POTs.
 For now, Neptune Mutual team and a few others will have access to POTs.
 POTs aren't conventional ERC-20 tokens; they can't be transferred freely;
 they don't have any value, and therefore must not be purchased or sold.
 Again, POTs are distributed to individuals and companies
 who particpate in our governance and dispute management portals.

## Contract Members
**Constants & Variables**

```js
contract IStore public s;
mapping(address => bool) public whitelist;
bytes32 public constant NS_MEMBERS;

```

**Events**

```js
event WhitelistUpdated(address indexed updatedBy, address[]  accounts, bool[]  statuses);
```

## Functions

- [constructor(address timelockOrOwner, IStore store)](#)
- [_throwIfNotProtocolMember(address account)](#_throwifnotprotocolmember)
- [updateWhitelist(address[] accounts, bool[] statuses)](#updatewhitelist)
- [_beforeTokenTransfer(address from, address to, uint256 )](#_beforetokentransfer)

### 

```solidity
function (address timelockOrOwner, IStore store) public nonpayable NPM 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timelockOrOwner | address |  | 
| store | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(address timelockOrOwner, IStore store) NPM(timelockOrOwner, "Neptune Mutual POT", "POT") {
    // require(timelockOrOwner != address(0), "Invalid owner"); // Already checked in `NPM`
    require(address(store) != address(0), "Invalid store");

    s = store;
    whitelist[address(this)] = true;
    whitelist[timelockOrOwner] = true;
  }
```
</details>

### _throwIfNotProtocolMember

```solidity
function _throwIfNotProtocolMember(address account) private view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _throwIfNotProtocolMember(address account) private view {
    bytes32 key = keccak256(abi.encodePacked(NS_MEMBERS, account));
    bool isMember = s.getBool(key);

    // POTs can only be used within the Neptune Mutual protocol
    require(isMember == true, "Access denied");
  }
```
</details>

### updateWhitelist

Updates whitelisted addresses.
 Provide a list of accounts and list of statuses to add or remove from the whitelist.

```solidity
function updateWhitelist(address[] accounts, bool[] statuses) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| accounts | address[] |  | 
| statuses | bool[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateWhitelist(address[] calldata accounts, bool[] memory statuses) external onlyOwner {
    require(accounts.length > 0, "No account");
    require(accounts.length == statuses.length, "Invalid args");

    for (uint256 i = 0; i < accounts.length; i++) {
      whitelist[accounts[i]] = statuses[i];
    }

    emit WhitelistUpdated(msg.sender, accounts, statuses);
  }
```
</details>

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 ) internal view whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| from | address |  | 
| to | address |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _beforeTokenTransfer(
    address from,
    address to,
    uint256
  ) internal view override whenNotPaused {
    // Token mints
    if (from == address(0)) {
      // aren't restricted
      return;
    }

    // Someone not whitelisted
    // ............................ can still transfer to a whitelisted address
    if (whitelist[from] == false && whitelist[to] == false) {
      // and to the Neptune Mutual Protocol contracts but nowhere else
      _throwIfNotProtocolMember(to);
    }
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
