# Cover Stake (CoverStake.sol)

View Source: [contracts/core/lifecycle/CoverStake.sol](../contracts/core/lifecycle/CoverStake.sol)

**↗ Extends: [ICoverStake](ICoverStake.md), [Recoverable](Recoverable.md)**

**CoverStake**

When you create a new cover, you have to specify the amount of
 NPM tokens you wish to stake as a cover creator. <br /> <br />
 To demonstrate support for a cover pool, anyone can add and remove
 NPM stakes (minimum required). The higher the sake, the more visibility
 the contract gets if there are multiple cover contracts with the same name
 or similar terms. Even when there are no duplicate contract, a higher stake
 would normally imply a better cover pool commitment.

## Functions

- [constructor(IStore store)](#)
- [increaseStake(bytes32 key, address account, uint256 amount, uint256 fee)](#increasestake)
- [decreaseStake(bytes32 key, address account, uint256 amount)](#decreasestake)
- [stakeOf(bytes32 key, address account)](#stakeof)
- [_getDrawingPower(bytes32 key, address account)](#_getdrawingpower)
- [version()](#version)
- [getName()](#getname)

### 

Constructs this contract

```solidity
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {}
```
</details>

### increaseStake

Increase the stake of the given cover pool

```solidity
function increaseStake(bytes32 key, address account, uint256 amount, uint256 fee) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account from where the NPM tokens will be transferred | 
| amount | uint256 | Enter the amount of stake | 
| fee | uint256 | Enter the fee amount. Note: do not enter the fee if you are directly calling this function. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function increaseStake(
    bytes32 key,
    address account,
    uint256 amount,
    uint256 fee
  ) external override nonReentrant {
    // @suppress-acl Can only be accessed by the latest cover contract
    s.mustNotBePaused();
    s.mustBeValidCoverKey(key);
    s.callerMustBeCoverContract();

    require(amount >= fee, "Invalid fee");

    s.npmToken().ensureTransferFrom(account, address(this), amount);

    if (fee > 0) {
      s.npmToken().ensureTransferFrom(address(this), s.getBurnAddress(), fee);
      emit FeeBurned(key, fee);
    }

    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key, amount - fee);
    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, key, account, amount - fee);

    emit StakeAdded(key, amount - fee);
  }
```
</details>

### decreaseStake

Decreases the stake from the given cover pool

```solidity
function decreaseStake(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account to decrease the stake of | 
| amount | uint256 | Enter the amount of stake to decrease | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decreaseStake(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    // @todo this function is not called anywhere. Remove this.
    // @suppress-acl Can only be accessed by the latest cover contract
    s.mustNotBePaused();
    s.mustBeValidCoverKey(key);
    s.callerMustBeCoverContract();

    uint256 drawingPower = _getDrawingPower(key, account);
    require(drawingPower >= amount, "Exceeds your drawing power");

    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key, amount);
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, key, account, amount);

    s.npmToken().ensureTransfer(account, amount);

    // Remove if the strategy is being invoked on the cover contract during this transaction
    s.updateStateAndLiquidity(key);

    emit StakeRemoved(key, amount);
  }
```
</details>

### stakeOf

Gets the stake of an account for the given cover key

```solidity
function stakeOf(bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the stake of | 

**Returns**

Returns the total stake of the specified account on the given cover key

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function stakeOf(bytes32 key, address account) public view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, key, account);
  }
```
</details>

### _getDrawingPower

Gets the drawing power of (the stake amount that can be withdrawn from)
 an account.

```solidity
function _getDrawingPower(bytes32 key, address account) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the drawing power of | 

**Returns**

Returns the drawing power of the specified account on the given cover key

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getDrawingPower(bytes32 key, address account) private view returns (uint256) {
    uint256 yourStake = stakeOf(key, account);
    bool isOwner = account == s.getCoverOwner(key);

    uint256 minStake = s.getMinCoverCreationStake();

    return isOwner ? yourStake - minStake : yourStake;
  }
```
</details>

### version

Version number of this contract

```solidity
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function version() external pure override returns (bytes32) {
    return "v0.1";
  }
```
</details>

### getName

Name of this contract

```solidity
function getName() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_COVER_STAKE;
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
