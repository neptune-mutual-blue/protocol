# CompoundStrategy.sol

View Source: [contracts/core/liquidity/strategies/CompoundStrategy.sol](../contracts/core/liquidity/strategies/CompoundStrategy.sol)

**↗ Extends: [ILendingStrategy](ILendingStrategy.md), [Recoverable](Recoverable.md)**

**CompoundStrategy**

## Contract Members
**Constants & Variables**

```js
//private members
mapping(bytes32 => uint256) private _counters;
mapping(bytes32 => uint256) private _depositTotal;
mapping(bytes32 => uint256) private _withdrawalTotal;
bytes32 private constant _KEY;

//public members
bytes32 public constant CNAME_STRATEGY_COMPOUND;
bytes32 public constant NS_DEPOSITS;
bytes32 public constant NS_WITHDRAWALS;
address public depositCertificate;
contract ICompoundERC20DelegatorLike public delegator;

```

## Functions

- [constructor(IStore _s, ICompoundERC20DelegatorLike _delegator, address _compoundWrappedStablecoin)](#)
- [getDepositAsset()](#getdepositasset)
- [getDepositCertificate()](#getdepositcertificate)
- [getInfo(bytes32 coverKey)](#getinfo)
- [_getCertificateBalance()](#_getcertificatebalance)
- [_drain(IERC20 asset)](#_drain)
- [deposit(bytes32 coverKey, uint256 amount)](#deposit)
- [withdraw(bytes32 coverKey)](#withdraw)
- [_getDepositsKey(bytes32 coverKey)](#_getdepositskey)
- [_getWithdrawalsKey(bytes32 coverKey)](#_getwithdrawalskey)
- [getWeight()](#getweight)
- [getKey()](#getkey)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore _s, ICompoundERC20DelegatorLike _delegator, address _compoundWrappedStablecoin) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _s | IStore |  | 
| _delegator | ICompoundERC20DelegatorLike |  | 
| _compoundWrappedStablecoin | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
    IStore _s,
    ICompoundERC20DelegatorLike _delegator,
    address _compoundWrappedStablecoin
  ) Recoverable(_s) {
    depositCertificate = _compoundWrappedStablecoin;
    delegator = _delegator;
  }
```
</details>

### getDepositAsset

```solidity
function getDepositAsset() public view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDepositAsset() public view override returns (IERC20) {
    return IERC20(s.getStablecoinAddressInternal());
  }
```
</details>

### getDepositCertificate

```solidity
function getDepositCertificate() public view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDepositCertificate() public view override returns (IERC20) {
    return IERC20(depositCertificate);
  }
```
</details>

### getInfo

Gets info of this strategy by cover key
 Warning: this function does not validate the cover key supplied.

```solidity
function getInfo(bytes32 coverKey) external view
returns(info struct ILendingStrategy.LendingStrategyInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfo(bytes32 coverKey) external view override returns (LendingStrategyInfoType memory info) {
    info.deposits = s.getUintByKey(_getDepositsKey(coverKey));
    info.withdrawals = s.getUintByKey(_getWithdrawalsKey(coverKey));
  }
```
</details>

### _getCertificateBalance

```solidity
function _getCertificateBalance() private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCertificateBalance() private view returns (uint256) {
    return getDepositCertificate().balanceOf(address(this));
  }
```
</details>

### _drain

```solidity
function _drain(IERC20 asset) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _drain(IERC20 asset) private {
    uint256 amount = asset.balanceOf(address(this));

    if (amount > 0) {
      asset.ensureTransfer(s.getTreasuryAddressInternal(), amount);

      emit Drained(asset, amount);
    }
  }
```
</details>

### deposit

Deposits the tokens to Compound
 Ensure that you `approve` stablecoin before you call this function

```solidity
function deposit(bytes32 coverKey, uint256 amount) external nonpayable nonReentrant 
returns(compoundWrappedStablecoinMinted uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deposit(bytes32 coverKey, uint256 amount) external override nonReentrant returns (uint256 compoundWrappedStablecoinMinted) {
    s.mustNotBePaused();
    s.senderMustBeProtocolMember();

    IVault vault = s.getVault(coverKey);

    if (amount == 0) {
      return 0;
    }

    IERC20 stablecoin = getDepositAsset();
    IERC20 compoundWrappedStablecoin = getDepositCertificate();

    require(stablecoin.balanceOf(address(vault)) >= amount, "Balance insufficient");

    // This strategy should never have token balances
    _drain(compoundWrappedStablecoin);
    _drain(stablecoin);

    // Transfer stablecoin to this contract; then approve and send it to delegator to mint compoundWrappedStablecoin
    vault.transferToStrategy(stablecoin, coverKey, getName(), amount);
    stablecoin.ensureApproval(address(delegator), amount);

    uint256 result = delegator.mint(amount);

    require(result == 0, "Compound delegator mint failed");

    // Check how many compoundWrappedStablecoin we received
    compoundWrappedStablecoinMinted = _getCertificateBalance();

    require(compoundWrappedStablecoinMinted > 0, "Minting cUS$ failed");

    // Immediately send compoundWrappedStablecoin to the original vault stablecoin came from
    compoundWrappedStablecoin.ensureApproval(address(vault), compoundWrappedStablecoinMinted);
    vault.receiveFromStrategy(compoundWrappedStablecoin, coverKey, getName(), compoundWrappedStablecoinMinted);

    s.addUintByKey(_getDepositsKey(coverKey), amount);

    _counters[coverKey] += 1;
    _depositTotal[coverKey] += amount;

    emit LogDeposit(getName(), _counters[coverKey], amount, compoundWrappedStablecoinMinted, _depositTotal[coverKey], _withdrawalTotal[coverKey]);
    emit Deposited(coverKey, address(vault), amount, compoundWrappedStablecoinMinted);
  }
```
</details>

### withdraw

Redeems compoundWrappedStablecoin from Compound to receive stablecoin
 Ensure that you `approve` compoundWrappedStablecoin before you call this function

```solidity
function withdraw(bytes32 coverKey) external nonpayable nonReentrant 
returns(stablecoinWithdrawn uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdraw(bytes32 coverKey) external virtual override nonReentrant returns (uint256 stablecoinWithdrawn) {
    s.mustNotBePaused();
    s.senderMustBeProtocolMember();
    IVault vault = s.getVault(coverKey);

    IERC20 stablecoin = getDepositAsset();
    IERC20 compoundWrappedStablecoin = getDepositCertificate();

    // This strategy should never have token balances without any exception, especially `compoundWrappedStablecoin` and `stablecoin`
    _drain(compoundWrappedStablecoin);
    _drain(stablecoin);

    uint256 compoundWrappedStablecoinRedeemed = compoundWrappedStablecoin.balanceOf(address(vault));

    if (compoundWrappedStablecoinRedeemed == 0) {
      return 0;
    }

    // Transfer compoundWrappedStablecoin to this contract; then approve and send it to delegator to redeem stablecoin
    vault.transferToStrategy(compoundWrappedStablecoin, coverKey, getName(), compoundWrappedStablecoinRedeemed);
    compoundWrappedStablecoin.ensureApproval(address(delegator), compoundWrappedStablecoinRedeemed);
    uint256 result = delegator.redeem(compoundWrappedStablecoinRedeemed);

    require(result == 0, "Compound delegator redeem failed");

    // Check how many stablecoin we received
    stablecoinWithdrawn = stablecoin.balanceOf(address(this));

    require(stablecoinWithdrawn > 0, "Redeeming cUS$ failed");

    // Immediately send stablecoin to the vault compoundWrappedStablecoin came from
    stablecoin.ensureApproval(address(vault), stablecoinWithdrawn);
    vault.receiveFromStrategy(stablecoin, coverKey, getName(), stablecoinWithdrawn);

    s.addUintByKey(_getWithdrawalsKey(coverKey), stablecoinWithdrawn);

    _counters[coverKey] += 1;
    _withdrawalTotal[coverKey] += stablecoinWithdrawn;

    emit LogWithdrawal(getName(), _counters[coverKey], stablecoinWithdrawn, compoundWrappedStablecoinRedeemed, _depositTotal[coverKey], _withdrawalTotal[coverKey]);
    emit Withdrawn(coverKey, address(vault), stablecoinWithdrawn, compoundWrappedStablecoinRedeemed);
  }
```
</details>

### _getDepositsKey

Hash key of the Compound deposits for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function _getDepositsKey(bytes32 coverKey) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getDepositsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_DEPOSITS));
  }
```
</details>

### _getWithdrawalsKey

Hash key of the Compound withdrawal for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function _getWithdrawalsKey(bytes32 coverKey) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getWithdrawalsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_WITHDRAWALS));
  }
```
</details>

### getWeight

```solidity
function getWeight() external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getWeight() external pure override returns (uint256) {
    return 10_000; // 100%
  }
```
</details>

### getKey

```solidity
function getKey() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getKey() external pure override returns (bytes32) {
    return _KEY;
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
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() public pure override returns (bytes32) {
    return CNAME_STRATEGY_COMPOUND;
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
