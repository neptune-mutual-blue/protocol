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
- [increaseStake(bytes32 coverKey, address account, uint256 amount, uint256 fee)](#increasestake)
- [decreaseStake(bytes32 coverKey, uint256 amount)](#decreasestake)
- [stakeOf(bytes32 coverKey, address account)](#stakeof)
- [_getDrawingPower(bytes32 coverKey, address account)](#_getdrawingpower)
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
function increaseStake(bytes32 coverKey, address account, uint256 amount, uint256 fee) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Enter the account from where the NPM tokens will be transferred | 
| amount | uint256 | Enter the amount of stake | 
| fee | uint256 | Enter the fee amount. Note: do not enter the fee if you are directly calling this function. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function increaseStake(
    bytes32 coverKey,
    address account,
    uint256 amount,
    uint256 fee
  ) external override nonReentrant {
    // @suppress-acl Can only be accessed by the latest cover contract
    s.mustNotBePaused();
    s.mustBeValidCoverKey(coverKey);
    s.senderMustBeCoverContract();

    require(amount >= fee, "Invalid fee");

    s.npmToken().ensureTransferFrom(account, address(this), amount);

    if (fee > 0) {
      s.npmToken().ensureTransfer(s.getBurnAddress(), fee);
      emit FeeBurned(coverKey, fee);
    }

    // @suppress-subtraction Checked usage. Fee is always less than amount
    // if we reach this far.
    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE, coverKey, amount - fee);
    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, coverKey, account, amount - fee);

    emit StakeAdded(coverKey, account, amount - fee);
  }
```
</details>

### decreaseStake

Decreases the stake from the given cover pool.
 A cover creator can withdraw their full stake after 365 days

```solidity
function decreaseStake(bytes32 coverKey, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of stake to decrease | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decreaseStake(bytes32 coverKey, uint256 amount) external override nonReentrant {
    // @suppress-acl Marking this function as publicly accessible
    s.mustNotBePaused();
    s.mustBeValidCoverKey(coverKey);
    s.mustHaveNormalCoverStatus(coverKey);

    uint256 drawingPower = _getDrawingPower(coverKey, msg.sender);
    require(amount > 0, "Please specify amount");
    require(drawingPower >= amount, "Exceeds your drawing power");

    // @suppress-subtraction
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE, coverKey, amount);
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, coverKey, msg.sender, amount);

    s.npmToken().ensureTransfer(msg.sender, amount);

    s.updateStateAndLiquidity(coverKey);

    emit StakeRemoved(coverKey, msg.sender, amount);
  }
```
</details>

### stakeOf

Gets the stake of an account for the given cover key

```solidity
function stakeOf(bytes32 coverKey, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the stake of | 

**Returns**

Returns the total stake of the specified account on the given cover key

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function stakeOf(bytes32 coverKey, address account) public view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, coverKey, account);
  }
```
</details>

### _getDrawingPower

Gets the drawing power of (the stake amount that can be withdrawn from)
 an account.

```solidity
function _getDrawingPower(bytes32 coverKey, address account) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the drawing power of | 

**Returns**

Returns the drawing power of the specified account on the given cover key

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getDrawingPower(bytes32 coverKey, address account) private view returns (uint256) {
    uint256 createdAt = s.getCoverCreationDate(coverKey);
    uint256 yourStake = stakeOf(coverKey, account);
    bool isOwner = account == s.getCoverOwner(coverKey);

    uint256 minStakeRequired = block.timestamp > createdAt + 365 days ? 0 : s.getMinCoverCreationStake(); // solhint-disable-line

    return isOwner ? yourStake - minStakeRequired : yourStake;
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
* [IPriceDiscovery](IPriceDiscovery.md)
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
* [NPMDistributor](NPMDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
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
