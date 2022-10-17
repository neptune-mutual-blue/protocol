# With Flash Loan Delegate Contract (VaultDelegateWithFlashLoan.sol)

View Source: [contracts/core/delegates/VaultDelegateWithFlashLoan.sol](../contracts/core/delegates/VaultDelegateWithFlashLoan.sol)

**↗ Extends: [VaultDelegateBase](VaultDelegateBase.md)**
**↘ Derived Contracts: [VaultDelegate](VaultDelegate.md)**

**VaultDelegateWithFlashLoan**

This contract implements [EIP-3156 Flash Loan](https://eips.ethereum.org/EIPS/eip-3156).

## Functions

- [getFlashFee(address , bytes32 coverKey, address token, uint256 amount)](#getflashfee)
- [getMaxFlashLoan(address , bytes32 coverKey, address token)](#getmaxflashloan)
- [preFlashLoan(address , bytes32 coverKey, IERC3156FlashBorrower , address token, uint256 amount, bytes )](#preflashloan)
- [postFlashLoan(address , bytes32 coverKey, IERC3156FlashBorrower , address , uint256 , bytes )](#postflashloan)

### getFlashFee

The fee to be charged for a given loan.
 Warning: this function does not validate the cover key supplied.

```solidity
function getFlashFee(address , bytes32 coverKey, address token, uint256 amount) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address | token The loan currency. | 
| coverKey | bytes32 |  | 
| token | address | The loan currency. | 
| amount | uint256 | The amount of tokens lent. | 

**Returns**

The amount of `token` to be charged for the loan, on top of the returned principal.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFlashFee(
    address, /*caller*/
    bytes32 coverKey,
    address token,
    uint256 amount
  ) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getFlashFeeInternal(coverKey, token, amount);
  }
```
</details>

### getMaxFlashLoan

The amount of currency available to be lent.
 Warning: this function does not validate the cover key supplied.

```solidity
function getMaxFlashLoan(address , bytes32 coverKey, address token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address | token The loan currency. | 
| coverKey | bytes32 |  | 
| token | address | The loan currency. | 

**Returns**

The amount of `token` that can be borrowed.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMaxFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    address token
  ) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getMaxFlashLoanInternal(coverKey, token);
  }
```
</details>

### preFlashLoan

This hook runs before `flashLoan` implementation on vault(s)

```solidity
function preFlashLoan(address , bytes32 coverKey, IERC3156FlashBorrower , address token, uint256 amount, bytes ) external nonpayable
returns(stablecoin contract IERC20, fee uint256, protocolFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address | coverKey Enter the cover key | 
| coverKey | bytes32 | Enter the cover key | 
|  | IERC3156FlashBorrower | coverKey Enter the cover key | 
| token | address | Enter the token you want to borrow | 
| amount | uint256 | Enter the flash loan amount to receive | 
|  | bytes | coverKey Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    IERC3156FlashBorrower, /*receiver*/
    address token,
    uint256 amount,
    bytes calldata /*data*/
  )
    external
    override
    returns (
      IERC20 stablecoin,
      uint256 fee,
      uint256 protocolFee
    )
  {
    s.mustNotBePaused();
    s.mustEnsureAllProductsAreNormal(coverKey);
    s.senderMustBeVaultContract(coverKey);

    stablecoin = IERC20(s.getStablecoin());

    // require(address(stablecoin) == token, "Unknown token"); <-- already checked in `getFlashFeesInternal`
    // require(amount > 0, "Loan too small"); <-- already checked in `getFlashFeesInternal`

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, true);

    (fee, protocolFee) = s.getFlashFeesInternal(coverKey, token, amount);

    require(fee > 0, "Loan too small");
    require(protocolFee > 0, "Loan too small");
  }
```
</details>

### postFlashLoan

This hook runs after `flashLoan` implementation on vault(s)

```solidity
function postFlashLoan(address , bytes32 coverKey, IERC3156FlashBorrower , address , uint256 , bytes ) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address | coverKey Enter the cover key | 
| coverKey | bytes32 | Enter the cover key | 
|  | IERC3156FlashBorrower | coverKey Enter the cover key | 
|  | address | coverKey Enter the cover key | 
|  | uint256 | coverKey Enter the cover key | 
|  | bytes | coverKey Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    IERC3156FlashBorrower, /*receiver*/
    address, /*token*/
    uint256, /*amount*/
    bytes calldata /*data*/
  ) external override {
    // @suppress-zero-value-check The `amount` value isn't used and therefore not checked
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, false);
    s.updateStateAndLiquidity(coverKey);
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
