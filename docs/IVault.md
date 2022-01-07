# IVault.sol

View Source: [contracts/interfaces/IVault.sol](../contracts/interfaces/IVault.sol)

**↗ Extends: [IMember](IMember.md), [IERC20](IERC20.md)**
**↘ Derived Contracts: [VaultBase](VaultBase.md)**

**IVault**

**Events**

```js
event GovernanceTransfer(address indexed to, uint256  amount);
event PodsIssued(address indexed account, uint256  issued, uint256  liquidityAdded);
event PodsRedeemed(address indexed account, uint256  redeemed, uint256  liquidityReleased);
event MinLiquidityPeriodSet(uint256  previous, uint256  current);
event FlashLoanBorrowed(address indexed lender, address indexed borrower, address indexed stablecoin, uint256  amount, uint256  fee);
```

## Functions

- [addLiquidityMemberOnly(bytes32 coverKey, address account, uint256 amount)](#addliquiditymemberonly)
- [addLiquidity(bytes32 coverKey, uint256 amount)](#addliquidity)
- [removeLiquidity(bytes32 coverKey, uint256 amount)](#removeliquidity)
- [transferGovernance(bytes32 coverKey, address to, uint256 amount)](#transfergovernance)
- [setMinLiquidityPeriod(uint256 value)](#setminliquidityperiod)

### addLiquidityMemberOnly

Adds liquidity to the specified cover contract

```solidity
function addLiquidityMemberOnly(bytes32 coverKey, address account, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityMemberOnly(
    bytes32 coverKey,
    address account,
    uint256 amount
  ) external;
```
</details>

### addLiquidity

Adds liquidity to the specified cover contract

```solidity
function addLiquidity(bytes32 coverKey, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(bytes32 coverKey, uint256 amount) external;
```
</details>

### removeLiquidity

Removes liquidity from the specified cover contract

```solidity
function removeLiquidity(bytes32 coverKey, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to remove. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(bytes32 coverKey, uint256 amount) external;
```
</details>

### transferGovernance

Transfers liquidity to governance contract.

```solidity
function transferGovernance(bytes32 coverKey, address to, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| to | address | Enter the destination account | 
| amount | uint256 | Enter the amount of liquidity token to transfer. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external;
```
</details>

### setMinLiquidityPeriod

```solidity
function setMinLiquidityPeriod(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinLiquidityPeriod(uint256 value) external;
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
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
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [PriceDiscovery](PriceDiscovery.md)
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
* [SafeERC20](SafeERC20.md)
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
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
