# cxToken (cxToken.sol)

View Source: [contracts/core/cxToken/cxToken.sol](../contracts/core/cxToken/cxToken.sol)

**↗ Extends: [ICxToken](ICxToken.md), [Recoverable](Recoverable.md), [ERC20](ERC20.md)**

**cxToken**

cxTokens are minted when someone purchases a cover.
 <br /> <br />
 The cxTokens can be exchanged for a USD stablecoin at a 1:1 exchange rate
 after a cover incident is successfully resolved (minus platform fees).
  <br /> <br />
 **Restrictions:**
 - cxTokens cannot be transferred from one person to another.
 - Only claims can be submitted with cxTokens
 - There is a lag period before your cxTokens starts its coverage.
 cxTokens start coverage the next day (or longer) at the UTC EOD timestamp and remain valid until the expiration date.
 - The lag configuration can be found in [ProtoUtilV1.NS_COVERAGE_LAG](ProtoUtilV1.md)
 and [PolicyAdmin.getCoverageLag](PolicyAdmin.md#getcoveragelag) function.

## Contract Members
**Constants & Variables**

```js
bytes32 public COVER_KEY;
bytes32 public PRODUCT_KEY;
uint256 public createdOn;
uint256 public expiresOn;
mapping(address => mapping(uint256 => uint256)) public coverageStartsFrom;

```

## Functions

- [constructor(IStore store, bytes32 coverKey, bytes32 productKey, string tokenName, uint256 expiry)](#)
- [getCoverageStartsFrom(address account, uint256 date)](#getcoveragestartsfrom)
- [_getExcludedCoverageOf(address account)](#_getexcludedcoverageof)
- [getClaimablePolicyOf(address account)](#getclaimablepolicyof)
- [mint(bytes32 coverKey, bytes32 productKey, address to, uint256 amount)](#mint)
- [_getEOD(uint256 date)](#_geteod)
- [burn(uint256 amount)](#burn)
- [_beforeTokenTransfer(address from, address to, uint256 )](#_beforetokentransfer)

### 

Constructs this contract.

```solidity
function (IStore store, bytes32 coverKey, bytes32 productKey, string tokenName, uint256 expiry) public nonpayable ERC20 Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 
| coverKey | bytes32 | Enter the cover key | 
| productKey | bytes32 | Enter the product key | 
| tokenName | string | Enter token name for this ERC-20 contract. The token symbol will be `cxUSD`. | 
| expiry | uint256 | Provide the cover expiry timestamp | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
    IStore store,
    bytes32 coverKey,
    bytes32 productKey,
    string memory tokenName,
    uint256 expiry
  ) ERC20(tokenName, "cxUSD") Recoverable(store) {
    COVER_KEY = coverKey;
    PRODUCT_KEY = productKey;
    expiresOn = expiry;
  }
```
</details>

### getCoverageStartsFrom

Returns the value of the `coverageStartsFrom` mapping.
 Warning: this function does not validate the input arguments.

```solidity
function getCoverageStartsFrom(address account, uint256 date) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Enter an account to get the `coverageStartsFrom` value. | 
| date | uint256 | Enter a date. Ensure that you supply a UTC EOD value. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverageStartsFrom(address account, uint256 date) external view override returns (uint256) {
    return coverageStartsFrom[account][date];
  }
```
</details>

### _getExcludedCoverageOf

Gets sum of the lagged and, therefore, excluded policy of a given account.
 <br /><br />
 Only policies purchased within 24-48 hours (or longer depending on this cover's configuration) are valid.
 Given the present codebase, the loop that follows may appear pointless and invalid.
 <br /><br />
 Since the protocol is upgradable but not cxTokens,
 erroneous code could be introduced in the future,
 which is why we go all the way until the resolution deadline.

```solidity
function _getExcludedCoverageOf(address account) private view
returns(exclusion uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Enter an account. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getExcludedCoverageOf(address account) private view returns (uint256 exclusion) {
    uint256 incidentDate = s.getActiveIncidentDateInternal(COVER_KEY, PRODUCT_KEY);

    uint256 resolutionEOD = _getEOD(s.getResolutionTimestampInternal(COVER_KEY, PRODUCT_KEY));

    for (uint256 i = 0; i < 14; i++) {
      uint256 date = _getEOD(incidentDate + (i * 1 days));

      if (date > resolutionEOD) {
        break;
      }

      exclusion += coverageStartsFrom[account][date];
    }
  }
```
</details>

### getClaimablePolicyOf

Gets the claimable policy of an account.
 Warning: this function does not validate the input arguments.

```solidity
function getClaimablePolicyOf(address account) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Enter an account. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimablePolicyOf(address account) external view override returns (uint256) {
    uint256 exclusion = _getExcludedCoverageOf(account);
    uint256 balance = super.balanceOf(account);

    if (exclusion > balance) {
      return 0;
    }

    return balance - exclusion;
  }
```
</details>

### mint

Mints cxTokens when a policy is purchased.
 This feature can only be accessed by the latest policy smart contract.

```solidity
function mint(bytes32 coverKey, bytes32 productKey, address to, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key for which the cxTokens are being minted | 
| productKey | bytes32 |  | 
| to | address | Enter the address where the minted token will be sent | 
| amount | uint256 | Specify the amount of cxTokens to mint | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mint(
    bytes32 coverKey,
    bytes32 productKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    require(amount > 0, "Please specify amount");
    require(coverKey == COVER_KEY, "Invalid cover");
    require(productKey == PRODUCT_KEY, "Invalid product");

    s.mustNotBePaused();
    s.senderMustBePolicyContract();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    uint256 effectiveFrom = _getEOD(block.timestamp + s.getCoverageLagInternal(coverKey)); // solhint-disable-line
    coverageStartsFrom[to][effectiveFrom] += amount;

    super._mint(to, amount);
  }
```
</details>

### _getEOD

Gets the EOD (End of Day) time

```solidity
function _getEOD(uint256 date) private pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| date | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getEOD(uint256 date) private pure returns (uint256) {
    (uint256 year, uint256 month, uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, day, 23, 59, 59);
  }
```
</details>

### burn

Burns the tokens held by the sender.

```solidity
function burn(uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Specify the amount of tokens to burn | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function burn(uint256 amount) external override nonReentrant {
    require(amount > 0, "Please specify amount");

    s.mustNotBePaused();
    super._burn(msg.sender, amount);
  }
```
</details>

### _beforeTokenTransfer

Overrides Openzeppelin ERC-20 contract's `_beforeTokenTransfer` hook.
 This is called during `transfer`, `transferFrom`, `mint`, and `burn` function invocation.
 <br /><br/>
 **cxToken Restrictions:**
 - An expired cxToken can't be transferred.
 - cxTokens can only be transferred to the claims processor contract.

```solidity
function _beforeTokenTransfer(address from, address to, uint256 ) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| from | address | The account sending the cxTokens | 
| to | address | The account receiving the cxTokens | 
|  | uint256 | from The account sending the cxTokens | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _beforeTokenTransfer(
    address from,
    address to,
    uint256
  ) internal view override {
    // solhint-disable-next-line
    if (block.timestamp > expiresOn) {
      require(to == address(0), "Expired cxToken");
    }

    // cxTokens can only be transferred to the claims processor contract
    if (from != address(0) && to != address(0)) {
      s.mustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY, to);
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
