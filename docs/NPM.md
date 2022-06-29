# NPM.sol

View Source: [contracts/core/token/NPM.sol](../contracts/core/token/NPM.sol)

**↗ Extends: [WithPausability](WithPausability.md), [WithRecovery](WithRecovery.md), [ERC20](ERC20.md)**

**NPM**

## Contract Members
**Constants & Variables**

```js
uint256 private constant _CAP;
uint256 private _issued;

```

**Events**

```js
event Minted(bytes32 indexed key, address indexed account, uint256  amount);
```

## Functions

- [constructor(address timelockOrOwner)](#)
- [_beforeTokenTransfer(address , address , uint256 )](#_beforetokentransfer)
- [issue(bytes32 key, address mintTo, uint256 amount)](#issue)
- [issueMany(bytes32 key, address[] receivers, uint256[] amounts)](#issuemany)
- [transferMany(address[] receivers, uint256[] amounts)](#transfermany)
- [_issue(bytes32 key, address mintTo, uint256 amount)](#_issue)
- [_sumOf(uint256[] amounts)](#_sumof)

### 

```solidity
function (address timelockOrOwner) public nonpayable Ownable Pausable ERC20 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| timelockOrOwner | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(address timelockOrOwner) Ownable() Pausable() ERC20("Neptune Mutual Token", "NPM") {
    super._transferOwnership(timelockOrOwner);
  }
```
</details>

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address , address , uint256 ) internal view whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address |  | 
|  | address |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _beforeTokenTransfer(
    address,
    address,
    uint256
  ) internal view override whenNotPaused {
    // solhint-disable-previous-line
  }
```
</details>

### issue

```solidity
function issue(bytes32 key, address mintTo, uint256 amount) external nonpayable onlyOwner whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| mintTo | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function issue(
    bytes32 key,
    address mintTo,
    uint256 amount
  ) external onlyOwner whenNotPaused {
    _issue(key, mintTo, amount);
    _issued += amount;
    require(_issued <= _CAP, "Cap exceeded");
  }
```
</details>

### issueMany

```solidity
function issueMany(bytes32 key, address[] receivers, uint256[] amounts) external nonpayable onlyOwner whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| receivers | address[] |  | 
| amounts | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function issueMany(
    bytes32 key,
    address[] calldata receivers,
    uint256[] calldata amounts
  ) external onlyOwner whenNotPaused {
    require(receivers.length > 0, "No receiver");
    require(receivers.length == amounts.length, "Invalid args");

    _issued += _sumOf(amounts);
    require(_issued <= _CAP, "Cap exceeded");

    for (uint256 i = 0; i < receivers.length; i++) {
      _issue(key, receivers[i], amounts[i]);
    }
  }
```
</details>

### transferMany

```solidity
function transferMany(address[] receivers, uint256[] amounts) external nonpayable onlyOwner whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| receivers | address[] |  | 
| amounts | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferMany(address[] calldata receivers, uint256[] calldata amounts) external onlyOwner whenNotPaused {
    require(receivers.length > 0, "No receiver");
    require(receivers.length == amounts.length, "Invalid args");

    for (uint256 i = 0; i < receivers.length; i++) {
      super.transfer(receivers[i], amounts[i]);
    }
  }
```
</details>

### _issue

```solidity
function _issue(bytes32 key, address mintTo, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| mintTo | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _issue(
    bytes32 key,
    address mintTo,
    uint256 amount
  ) private {
    require(amount > 0, "Invalid amount");
    super._mint(mintTo, amount);
    emit Minted(key, mintTo, amount);
  }
```
</details>

### _sumOf

```solidity
function _sumOf(uint256[] amounts) private pure
returns(total uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amounts | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _sumOf(uint256[] calldata amounts) private pure returns (uint256 total) {
    for (uint256 i = 0; i < amounts.length; i++) {
      total += amounts[i];
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
