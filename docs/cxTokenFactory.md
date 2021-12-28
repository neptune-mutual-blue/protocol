# cxToken Factory Contract (cxTokenFactory.sol)

View Source: [contracts/core/cxToken/cxTokenFactory.sol](../contracts/core/cxToken/cxTokenFactory.sol)

**↗ Extends: [ICxTokenFactory](ICxTokenFactory.md), [Recoverable](Recoverable.md)**

**cxTokenFactory**

As and when required by the protocol,
 the cxTokenFactory contract creates new instances of
 cxTokens on demand.

## Functions

- [constructor(IStore store)](#)
- [deploy(IStore s, bytes32 key, uint256 expiryDate)](#deploy)
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
constructor(IStore store) Recoverable(store) {
    this;
  }
```
</details>

### deploy

Deploys a new instance of cxTokens

```solidity
function deploy(IStore s, bytes32 key, uint256 expiryDate) external nonpayable nonReentrant 
returns(deployed address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide the store contract instance | 
| key | bytes32 | Enter the cover key related to this cxToken instance | 
| expiryDate | uint256 | Specify the expiry date of this cxToken instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deploy(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) external override nonReentrant returns (address deployed) {
    // @suppress-acl Can only be called by the latest policy contract
    s.mustNotBePaused();
    s.mustBeValidCoverKey(key);
    s.callerMustBePolicyContract();

    (bytes memory bytecode, bytes32 salt) = cxTokenFactoryLibV1.getByteCode(s, key, expiryDate);

    require(s.getAddress(salt) == address(0), "Already deployed");

    // solhint-disable-next-line
    assembly {
      deployed := create2(
        callvalue(), // wei sent with current call
        // Actual code starts after skipping the first 32 bytes
        add(bytecode, 0x20),
        mload(bytecode), // Load the size of code contained in the first 32 bytes
        salt // Salt from function arguments
      )

      if iszero(extcodesize(deployed)) {
        revert(0, 0)
      }
    }

    s.setAddress(salt, deployed);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, deployed, true);
    emit CxTokenDeployed(key, deployed, expiryDate);
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
    return ProtoUtilV1.CNAME_CXTOKEN_FACTORY;
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
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
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
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
* [SafeMath](SafeMath.md)
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
* [Witness](Witness.md)
