# cToken Factory Contract (cTokenFactory.sol)

View Source: [contracts/core/cToken/cTokenFactory.sol](../contracts/core/cToken/cTokenFactory.sol)

**↗ Extends: [ICTokenFactory](ICTokenFactory.md)**

**cTokenFactory**

As and when required by the protocol,
 the cTokenFactory contract creates new instances of
 cTokens on demand.

## Functions

- [deploy(IStore s, bytes32 key, uint256 expiryDate)](#deploy)
- [version()](#version)
- [getName()](#getname)
- [_getByteCode(IStore s, bytes32 key, uint256 expiryDate)](#_getbytecode)

### deploy

Deploys a new instance of cTokens

```solidity
function deploy(IStore s, bytes32 key, uint256 expiryDate) external nonpayable
returns(deployed address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide the store contract instance | 
| key | bytes32 | Enter the cover key related to this cToken instance | 
| expiryDate | uint256 | Specify the expiry date of this cToken instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deploy(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) external override returns (address deployed) {
    s.mustBeExactContract(ProtoUtilV1.NS_COVER_POLICY, msg.sender); // Ensure the caller is the latest policy contract

    (bytes memory bytecode, bytes32 salt) = _getByteCode(s, key, expiryDate);

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
    emit CTokenDeployed(key, deployed, expiryDate);
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
    return ProtoUtilV1.CNAME_CTOKEN_FACTORY;
  }
```
</details>

### _getByteCode

Gets the bytecode of the `cToken` contract

```solidity
function _getByteCode(IStore s, bytes32 key, uint256 expiryDate) private pure
returns(bytecode bytes, salt bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide the store instance | 
| key | bytes32 | Provide the cover key | 
| expiryDate | uint256 | Specify the expiry date of this cToken instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getByteCode(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) private pure returns (bytes memory bytecode, bytes32 salt) {
    salt = abi.encodePacked(ProtoUtilV1.NS_COVER_CTOKEN, key, expiryDate).toKeccak256();
    bytecode = abi.encodePacked(type(cToken).creationCode, abi.encode(s, key, expiryDate));
  }
```
</details>

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
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
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
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
