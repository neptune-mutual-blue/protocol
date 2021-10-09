# ICoverStake.sol

View Source: [contracts/interfaces/ICoverStake.sol](../contracts/interfaces/ICoverStake.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [CoverStake](CoverStake.md)**

**ICoverStake**

**Events**

```js
event StakeAdded(bytes32  key, uint256  amount);
event StakeRemoved(bytes32  key, uint256  amount);
event FeeBurned(bytes32  key, uint256  amount);
```

## Functions

- [increaseStake(bytes32 key, address account, uint256 amount, uint256 fee)](#increasestake)
- [decreaseStake(bytes32 key, address account, uint256 amount)](#decreasestake)
- [stakeOf(bytes32 key, address account)](#stakeof)

### increaseStake

Increase the stake of the given cover pool

```js
function increaseStake(bytes32 key, address account, uint256 amount, uint256 fee) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account from where the NPM tokens will be transferred | 
| amount | uint256 | Enter the amount of stake | 
| fee | uint256 | Enter the fee amount. Note: do not enter the fee if you are directly calling this function. | 

### decreaseStake

Decreases the stake from the given cover pool

```js
function decreaseStake(bytes32 key, address account, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account to decrease the stake of | 
| amount | uint256 | Enter the amount of stake to decrease | 

### stakeOf

Gets the stake of an account for the given cover key

```js
function stakeOf(bytes32 key, address account) external view
returns(uint256)
```

**Returns**

Returns the total stake of the specified account on the given cover key

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the stake of | 

## Contracts

* [Address](Address.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [cTokenFactoryLibV1](cTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
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
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
