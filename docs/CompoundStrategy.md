# CompoundStrategy.sol

View Source: [contracts/core/liquidity/strategies/CompoundStrategy.sol](../contracts/core/liquidity/strategies/CompoundStrategy.sol)

**↗ Extends: [ILendingStrategy](ILendingStrategy.md), [Recoverable](Recoverable.md)**

**CompoundStrategy**

## Contract Members
**Constants & Variables**

```js
//private members
bytes32 private constant _KEY;

//public members
bytes32 public constant NS_DEPOSITS;
bytes32 public constant NS_WITHDRAWALS;
address public depositCertificate;
contract ICompoundERC20DelegatorLike public delegator;
mapping(uint256 => bool) public supportedChains;

```

## Functions

- [constructor(IStore _s, ICompoundERC20DelegatorLike _delegator, address _cDai)](#)
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
function (IStore _s, ICompoundERC20DelegatorLike _delegator, address _cDai) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _s | IStore |  | 
| _delegator | ICompoundERC20DelegatorLike |  | 
| _cDai | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
    IStore _s,
    ICompoundERC20DelegatorLike _delegator,
    address _cDai
  ) Recoverable(_s) {
    depositCertificate = _cDai;
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
    return IERC20(s.getStablecoin());
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

```solidity
function getInfo(bytes32 coverKey) external view
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfo(bytes32 coverKey) external view override returns (uint256[] memory values) {
    values = new uint256[](2);

    values[0] = s.getUintByKey(_getDepositsKey(coverKey));
    values[1] = s.getUintByKey(_getWithdrawalsKey(coverKey));
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
      asset.ensureTransfer(s.getTreasury(), amount);

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
returns(cDaiMinted uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deposit(bytes32 coverKey, uint256 amount) external override nonReentrant returns (uint256 cDaiMinted) {
    s.mustNotBePaused();
    s.callerMustBeProtocolMember();

    IVault vault = s.getVault(coverKey);

    if (amount == 0) {
      return 0;
    }

    IERC20 stablecoin = getDepositAsset();
    IERC20 cDai = getDepositCertificate();

    require(stablecoin.balanceOf(address(vault)) >= amount, "Balance insufficient");

    // This strategy should never have token balances
    _drain(cDai);
    _drain(stablecoin);

    // Transfer DAI to this contract; then approve and send it to delegator to mint cDAI
    vault.transferToStrategy(stablecoin, coverKey, getName(), amount);
    stablecoin.ensureApproval(address(delegator), amount);

    uint256 result = delegator.mint(amount);

    require(result == 0, "Compound delegator mint failed");

    // Check how many cDAI we received
    cDaiMinted = _getCertificateBalance();

    require(cDaiMinted > 0, "Minting cDai failed");

    // Immediately send cDai to the original vault stablecoin came from
    cDai.ensureApproval(address(vault), cDaiMinted);
    vault.receiveFromStrategy(cDai, coverKey, getName(), cDaiMinted);

    s.addUintByKey(_getDepositsKey(coverKey), amount);

    // console.log("Compound deposit: [%s] --> %s", uint256(coverKey), amount);

    emit Deposited(coverKey, address(vault), amount);
  }
```
</details>

### withdraw

Redeems cDai from Compound to receive stablecoin
 Ensure that you `approve` cDai before you call this function

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
    s.callerMustBeProtocolMember();
    IVault vault = s.getVault(coverKey);

    IERC20 stablecoin = getDepositAsset();
    IERC20 cDai = getDepositCertificate();

    // This strategy should never have token balances
    _drain(cDai);
    _drain(stablecoin);

    uint256 cDaiBalance = cDai.balanceOf(address(vault));

    if (cDaiBalance == 0) {
      return 0;
    }

    // Transfer cDai to this contract; then approve and send it to delegator to redeem DAI
    vault.transferToStrategy(cDai, coverKey, getName(), cDaiBalance);
    cDai.ensureApproval(address(delegator), cDaiBalance);
    uint256 result = delegator.redeem(cDaiBalance);

    require(result == 0, "Compound delegator redeem failed");

    // Check how many DAI we received
    stablecoinWithdrawn = stablecoin.balanceOf(address(this));

    // Immediately send DAI to the vault cDAI came from
    stablecoin.ensureApproval(address(vault), stablecoinWithdrawn);
    vault.receiveFromStrategy(stablecoin, coverKey, getName(), stablecoinWithdrawn);

    s.addUintByKey(_getWithdrawalsKey(coverKey), stablecoinWithdrawn);

    // console.log("Compound withdrawal: [%s] --> %s", uint256(coverKey), stablecoinWithdrawn);

    emit Withdrawn(coverKey, address(vault), stablecoinWithdrawn);
  }
```
</details>

### _getDepositsKey

```solidity
function _getDepositsKey(bytes32 coverKey) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getDepositsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_DEPOSITS));
  }
```
</details>

### _getWithdrawalsKey

```solidity
function _getWithdrawalsKey(bytes32 coverKey) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

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
    return ProtoUtilV1.CNAME_STRATEGY_COMPOUND;
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
