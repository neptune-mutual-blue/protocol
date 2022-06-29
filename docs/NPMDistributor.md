# Neptune Mutual Distributor contract (NpmDistributor.sol)

View Source: [contracts/examples/NpmDistributor.sol](../contracts/examples/NpmDistributor.sol)

**↗ Extends: [ReentrancyGuard](ReentrancyGuard.md)**

**NpmDistributor**

The distributor contract enables resellers to interact with
 the Neptune Mutual protocol and offer policies to their users.
 This contract demonstrates how a distributor may charge an extra fee
 and deposit the proceeds in their own treasury account.

## Contract Members
**Constants & Variables**

```js
bytes32 public constant NS_CONTRACTS;
bytes32 public constant CNS_CLAIM_PROCESSOR;
bytes32 public constant CNS_COVER_VAULT;
bytes32 public constant CNS_COVER_POLICY;
bytes32 public constant CNS_COVER_STABLECOIN;
bytes32 public constant CNS_NPM_INSTANCE;
uint256 public constant MULTIPLIER;
uint256 public feePercentage;
address public treasury;
contract IStoreLike public store;

```

**Events**

```js
event PolicySold(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed cxToken, address  account, uint256  duration, uint256  protection, bytes32  referralCode, uint256  fee, uint256  premium);
event LiquidityAdded(bytes32 indexed coverKey, address indexed account, bytes32 indexed referralCode, uint256  amount, uint256  npmStake);
event LiquidityRemoved(bytes32 indexed coverKey, address indexed account, uint256  amount, uint256  npmStake, bool  exit);
event Drained(IERC20 indexed token, address indexed to, uint256  amount);
```

## Functions

- [constructor(IStoreLike _store, address _treasury, uint256 _feePercentage)](#)
- [getStablecoin()](#getstablecoin)
- [getNpm()](#getnpm)
- [getPolicyContract()](#getpolicycontract)
- [getVaultContract(bytes32 coverKey)](#getvaultcontract)
- [getClaimsProcessorContract()](#getclaimsprocessorcontract)
- [getPremium(bytes32 coverKey, bytes32 productKey, uint256 duration, uint256 protection)](#getpremium)
- [purchasePolicy(bytes32 coverKey, bytes32 productKey, uint256 duration, uint256 protection, bytes32 referralCode)](#purchasepolicy)
- [addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bytes32 referralCode)](#addliquidity)
- [removeLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit)](#removeliquidity)
- [_drain(IERC20 token)](#_drain)
- [getAddress(bytes32 k)](#getaddress)

### 

Constructs this contract

```solidity
function (IStoreLike _store, address _treasury, uint256 _feePercentage) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _store | IStoreLike | Enter the address of NPM protocol store | 
| _treasury | address | Enter your treasury wallet address | 
| _feePercentage | uint256 | Enter distributor fee percentage | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
    IStoreLike _store,
    address _treasury,
    uint256 _feePercentage
  ) {
    require(address(_store) != address(0), "Invalid store");
    require(_treasury != address(0), "Invalid treasury");
    require(_feePercentage > 0 && _feePercentage < MULTIPLIER, "Invalid fee percentage");

    store = _store;
    treasury = _treasury;
    feePercentage = _feePercentage;
  }
```
</details>

### getStablecoin

Returns the stablecoin used by the protocol in this blockchain.

```solidity
function getStablecoin() public view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoin() public view returns (IERC20) {
    return IERC20(store.getAddress(CNS_COVER_STABLECOIN));
  }
```
</details>

### getNpm

Returns NPM token instance in this blockchain.

```solidity
function getNpm() public view
returns(contract IERC20)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNpm() public view returns (IERC20) {
    return IERC20(store.getAddress(CNS_NPM_INSTANCE));
  }
```
</details>

### getPolicyContract

Returns the protocol policy contract instance.

```solidity
function getPolicyContract() public view
returns(contract IPolicy)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPolicyContract() public view returns (IPolicy) {
    return IPolicy(store.getAddress(keccak256(abi.encodePacked(NS_CONTRACTS, CNS_COVER_POLICY))));
  }
```
</details>

### getVaultContract

Returns the vault contract instance by the given key.

```solidity
function getVaultContract(bytes32 coverKey) public view
returns(contract IVault)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getVaultContract(bytes32 coverKey) public view returns (IVault) {
    return IVault(store.getAddress(keccak256(abi.encodePacked(NS_CONTRACTS, CNS_COVER_VAULT, coverKey))));
  }
```
</details>

### getClaimsProcessorContract

Returns the protocol claims processor contract instance.

```solidity
function getClaimsProcessorContract() external view
returns(contract IClaimsProcessor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimsProcessorContract() external view returns (IClaimsProcessor) {
    return IClaimsProcessor(store.getAddress(keccak256(abi.encodePacked(NS_CONTRACTS, CNS_CLAIM_PROCESSOR))));
  }
```
</details>

### getPremium

Calculates the premium required to purchase policy.

```solidity
function getPremium(bytes32 coverKey, bytes32 productKey, uint256 duration, uint256 protection) public view
returns(premium uint256, fee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key for which you want to buy policy. | 
| productKey | bytes32 |  | 
| duration | uint256 | Enter the period of the protection in months. | 
| protection | uint256 | Enter the stablecoin dollar amount you want to protect. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPremium(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 duration,
    uint256 protection
  ) public view returns (uint256 premium, uint256 fee) {
    IPolicy policy = getPolicyContract();
    require(address(policy) != address(0), "Fatal: Policy missing");

    (premium, , , , , ) = policy.getCoverFeeInfo(coverKey, productKey, duration, protection);

    // Add your fee in addition to the protocol premium
    fee = (premium * feePercentage) / MULTIPLIER;
  }
```
</details>

### purchasePolicy

Purchases a new policy on behalf of your users.
 Prior to using this method, you must first call the "getPremium" function
 and approve the policy fees that this contract would spend.
 In the event that this function succeeds, the recipient's wallet will be
 credited with "cxToken". Take note that the "claimPolicy" method may be
 used in the future to reclaim cxTokens and receive payouts
 after the resolution of an incident.

```solidity
function purchasePolicy(bytes32 coverKey, bytes32 productKey, uint256 duration, uint256 protection, bytes32 referralCode) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key for which you want to buy policy. | 
| productKey | bytes32 |  | 
| duration | uint256 | Enter the period of the protection in months. | 
| protection | uint256 | Enter the stablecoin dollar amount you want to protect. | 
| referralCode | bytes32 | Provide a referral code if applicable. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchasePolicy(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 duration,
    uint256 protection,
    bytes32 referralCode
  ) external nonReentrant {
    require(coverKey > 0, "Invalid key");
    require(duration > 0 && duration < 4, "Invalid duration");
    require(protection > 0, "Invalid protection amount");

    IPolicy policy = getPolicyContract();
    require(address(policy) != address(0), "Fatal: Policy missing");

    IERC20 dai = getStablecoin();
    require(address(dai) != address(0), "Fatal: DAI missing");

    // Get fee info
    (uint256 premium, uint256 fee) = getPremium(coverKey, productKey, duration, protection);

    // Transfer DAI to this contract
    dai.safeTransferFrom(msg.sender, address(this), premium + fee);

    // Approve protocol to pull the protocol fee
    dai.safeIncreaseAllowance(address(policy), premium);

    // Purchase protection for this user
    (address cxTokenAt, ) = policy.purchaseCover(msg.sender, coverKey, productKey, duration, protection, referralCode);

    // Send your fee (+ any remaining DAI balance) to your treasury address
    dai.safeTransfer(treasury, dai.balanceOf(address(this)));

    emit PolicySold(coverKey, productKey, cxTokenAt, msg.sender, duration, protection, referralCode, fee, premium);
  }
```
</details>

### addLiquidity

```solidity
function addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bytes32 referralCode) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| npmStake | uint256 |  | 
| referralCode | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bytes32 referralCode
  ) external nonReentrant {
    require(coverKey > 0, "Invalid key");
    require(amount > 0, "Invalid amount");

    IVault nDai = getVaultContract(coverKey);
    IERC20 dai = getStablecoin();
    IERC20 npm = getNpm();

    require(address(nDai) != address(0), "Fatal: Vault missing");
    require(address(dai) != address(0), "Fatal: DAI missing");
    require(address(npm) != address(0), "Fatal: NPM missing");

    // Before moving forward, first drain all balances of this contract
    _drain(nDai);
    _drain(dai);
    _drain(npm);

    // Transfer DAI from sender's wallet here
    dai.safeTransferFrom(msg.sender, address(this), amount);

    // Approve the Vault (or nDai) contract to spend DAI
    dai.safeIncreaseAllowance(address(nDai), amount);

    if (npmStake > 0) {
      // Transfer NPM from the sender's wallet here
      npm.safeTransferFrom(msg.sender, address(this), npmStake);

      // Approve the Vault (or nDai) contract to spend NPM
      npm.safeIncreaseAllowance(address(nDai), npmStake);
    }

    nDai.addLiquidity(coverKey, amount, npmStake, referralCode);

    nDai.safeTransfer(msg.sender, nDai.balanceOf(address(this)));

    emit LiquidityAdded(coverKey, msg.sender, referralCode, amount, npmStake);
  }
```
</details>

### removeLiquidity

```solidity
function removeLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| npmStake | uint256 |  | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bool exit
  ) external nonReentrant {
    require(coverKey > 0, "Invalid key");
    require(amount > 0, "Invalid amount");

    IVault nDai = getVaultContract(coverKey);
    IERC20 dai = getStablecoin();
    IERC20 npm = getNpm();

    require(address(nDai) != address(0), "Fatal: Vault missing");
    require(address(dai) != address(0), "Fatal: DAI missing");
    require(address(npm) != address(0), "Fatal: NPM missing");

    // Before moving forward, first drain all balances of this contract
    _drain(nDai);
    _drain(dai);
    _drain(npm);

    // Transfer nDai from sender's wallet here
    nDai.safeTransferFrom(msg.sender, address(this), amount);

    // Approve the Vault (or nDai) contract to spend nDai
    nDai.safeIncreaseAllowance(address(nDai), amount);

    nDai.removeLiquidity(coverKey, amount, npmStake, exit);

    dai.safeTransfer(msg.sender, nDai.balanceOf(address(this)));

    emit LiquidityRemoved(coverKey, msg.sender, amount, npmStake, exit);
  }
```
</details>

### _drain

Drains a given token to the treasury address

```solidity
function _drain(IERC20 token) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _drain(IERC20 token) private {
    uint256 balance = token.balanceOf(address(this));

    if (balance > 0) {
      token.safeTransfer(treasury, balance);
      emit Drained(token, treasury, balance);
    }
  }
```
</details>

### getAddress

```solidity
function getAddress(bytes32 k) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| k | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddress(bytes32 k) external view returns (address);
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
