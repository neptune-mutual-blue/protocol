# With Flash Loan Contract (WithFlashLoan.sol)

View Source: [contracts/core/liquidity/WithFlashLoan.sol](../contracts/core/liquidity/WithFlashLoan.sol)

**↗ Extends: [VaultBase](VaultBase.md), [IERC3156FlashLender](IERC3156FlashLender.md)**
**↘ Derived Contracts: [Vault](Vault.md)**

**WithFlashLoan**

WithFlashLoan contract implements `EIP-3156 Flash Loan`.
 Using flash loans, you can borrow up to the total available amount of
 the stablecoin liquidity available in this cover liquidity pool.
 You need to return back the borrowed amount + fee in the same transaction.
 The function `flashFee` enables you to check, in advance, fee that
 you need to pay to take out the loan.

## Functions

- [flashFee(address token, uint256 amount)](#flashfee)
- [maxFlashLoan(address token)](#maxflashloan)
- [flashLoan(IERC3156FlashBorrower receiver, address token, uint256 amount, bytes data)](#flashloan)

### flashFee

The fee to be charged for a given loan.

```solidity
function flashFee(address token, uint256 amount) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address | The loan currency. | 
| amount | uint256 | The amount of tokens lent. | 

**Returns**

The amount of `token` to be charged for the loan, on top of the returned principal.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function flashFee(address token, uint256 amount) external view override returns (uint256) {
    (uint256 fee, ) = s.getFlashFeeInternal(token, amount);
    return fee;
  }
```
</details>

### maxFlashLoan

The amount of currency available to be lent.

```solidity
function maxFlashLoan(address token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address | The loan currency. | 

**Returns**

The amount of `token` that can be borrowed.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function maxFlashLoan(address token) external view override returns (uint256) {
    return s.getMaxFlashLoanInternal(token);
  }
```
</details>

### flashLoan

Initiate a flash loan.

```solidity
function flashLoan(IERC3156FlashBorrower receiver, address token, uint256 amount, bytes data) external nonpayable nonReentrant 
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| receiver | IERC3156FlashBorrower | The receiver of the tokens in the loan, and the receiver of the callback. | 
| token | address | The loan currency. | 
| amount | uint256 | The amount of tokens lent. | 
| data | bytes | Arbitrary data structure, intended to contain user-defined parameters. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function flashLoan(
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  ) external override nonReentrant returns (bool) {
    // @suppress-address-trust-issue The instance of `token` can be trusted because we're ensuring it matches with the protocol stablecoin address.
    IERC20 stablecoin = IERC20(s.getStablecoin());
    (uint256 fee, uint256 protocolFee) = s.getFlashFeeInternal(token, amount);
    uint256 previousBalance = stablecoin.balanceOf(address(this));

    s.mustNotBePaused();

    require(address(stablecoin) == token, "Unknown token");
    require(amount > 0, "Loan too small");
    require(fee > 0, "Fee too little");
    require(previousBalance >= amount, "Balance insufficient");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, key, true);

    stablecoin.ensureTransfer(address(receiver), amount);
    require(receiver.onFlashLoan(msg.sender, token, amount, fee, data) == keccak256("ERC3156FlashBorrower.onFlashLoan"), "IERC3156: Callback failed");
    stablecoin.ensureTransferFrom(address(receiver), address(this), amount + fee);
    stablecoin.ensureTransfer(s.getTreasury(), protocolFee);

    uint256 finalBalance = stablecoin.balanceOf(address(this));
    require(finalBalance >= previousBalance + fee, "Access is denied");

    emit FlashLoanBorrowed(address(this), address(receiver), token, amount, fee);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, key, false);

    s.updateStateAndLiquidity(key);

    return true;
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
* [PolicyManager](PolicyManager.md)
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
