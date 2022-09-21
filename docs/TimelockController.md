# TimelockController.sol

View Source: [openzeppelin-solidity\contracts\governance\TimelockController.sol](..\openzeppelin-solidity\contracts\governance\TimelockController.sol)

**↗ Extends: [AccessControl](AccessControl.md)**
**↘ Derived Contracts: [Delayable](Delayable.md)**

**TimelockController**

Contract module which acts as a timelocked controller. When set as the
 owner of an `Ownable` smart contract, it enforces a timelock on all
 `onlyOwner` maintenance operations. This gives time for users of the
 controlled contract to exit before a potentially dangerous maintenance
 operation is applied.
 By default, this contract is self administered, meaning administration tasks
 have to go through the timelock process. The proposer (resp executor) role
 is in charge of proposing (resp executing) operations. A common use case is
 to position this {TimelockController} as the owner of a smart contract, with
 a multisig or a DAO as the sole proposer.
 _Available since v3.3._

## Contract Members
**Constants & Variables**

```js
//public members
bytes32 public constant TIMELOCK_ADMIN_ROLE;
bytes32 public constant PROPOSER_ROLE;
bytes32 public constant EXECUTOR_ROLE;

//internal members
uint256 internal constant _DONE_TIMESTAMP;

//private members
mapping(bytes32 => uint256) private _timestamps;
uint256 private _minDelay;

```

**Events**

```js
event CallScheduled(bytes32 indexed id, uint256 indexed index, address  target, uint256  value, bytes  data, bytes32  predecessor, uint256  delay);
event CallExecuted(bytes32 indexed id, uint256 indexed index, address  target, uint256  value, bytes  data);
event Cancelled(bytes32 indexed id);
event MinDelayChange(uint256  oldDuration, uint256  newDuration);
```

## Modifiers

- [onlyRoleOrOpenRole](#onlyroleoropenrole)

### onlyRoleOrOpenRole

Modifier to make a function callable only by a certain role. In
 addition to checking the sender's role, `address(0)` 's role is also
 considered. Granting a role to `address(0)` is equivalent to enabling
 this role for everyone.

```js
modifier onlyRoleOrOpenRole(bytes32 role) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 

## Functions

- [constructor(uint256 minDelay, address[] proposers, address[] executors)](#)
- [constructor()](#)
- [isOperation(bytes32 id)](#isoperation)
- [isOperationPending(bytes32 id)](#isoperationpending)
- [isOperationReady(bytes32 id)](#isoperationready)
- [isOperationDone(bytes32 id)](#isoperationdone)
- [getTimestamp(bytes32 id)](#gettimestamp)
- [getMinDelay()](#getmindelay)
- [hashOperation(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt)](#hashoperation)
- [hashOperationBatch(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt)](#hashoperationbatch)
- [schedule(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt, uint256 delay)](#schedule)
- [scheduleBatch(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt, uint256 delay)](#schedulebatch)
- [_schedule(bytes32 id, uint256 delay)](#_schedule)
- [cancel(bytes32 id)](#cancel)
- [execute(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt)](#execute)
- [executeBatch(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt)](#executebatch)
- [_beforeCall(bytes32 id, bytes32 predecessor)](#_beforecall)
- [_afterCall(bytes32 id)](#_aftercall)
- [_call(bytes32 id, uint256 index, address target, uint256 value, bytes data)](#_call)
- [updateDelay(uint256 newDelay)](#updatedelay)

### 

Initializes the contract with a given `minDelay`.

```solidity
function (uint256 minDelay, address[] proposers, address[] executors) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| minDelay | uint256 |  | 
| proposers | address[] |  | 
| executors | address[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) {
        _setRoleAdmin(TIMELOCK_ADMIN_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(PROPOSER_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(EXECUTOR_ROLE, TIMELOCK_ADMIN_ROLE);

        // deployer + self administration
        _setupRole(TIMELOCK_ADMIN_ROLE, _msgSender());
        _setupRole(TIMELOCK_ADMIN_ROLE, address(this));

        // register proposers
        for (uint256 i = 0; i < proposers.length; ++i) {
            _setupRole(PROPOSER_ROLE, proposers[i]);
        }

        // register executors
        for (uint256 i = 0; i < executors.length; ++i) {
            _setupRole(EXECUTOR_ROLE, executors[i]);
        }

        _minDelay = minDelay;
        emit MinDelayChange(0, minDelay);
    }
```
</details>

### 

Contract might receive/hold ETH as part of the maintenance process.

```solidity
function () external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
receive() external payable {}
```
</details>

### isOperation

Returns whether an id correspond to a registered operation. This
 includes both Pending, Ready and Done operations.

```solidity
function isOperation(bytes32 id) public view
returns(pending bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isOperation(bytes32 id) public view virtual returns (bool pending) {
        return getTimestamp(id) > 0;
    }
```
</details>

### isOperationPending

Returns whether an operation is pending or not.

```solidity
function isOperationPending(bytes32 id) public view
returns(pending bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isOperationPending(bytes32 id) public view virtual returns (bool pending) {
        return getTimestamp(id) > _DONE_TIMESTAMP;
    }
```
</details>

### isOperationReady

Returns whether an operation is ready or not.

```solidity
function isOperationReady(bytes32 id) public view
returns(ready bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isOperationReady(bytes32 id) public view virtual returns (bool ready) {
        uint256 timestamp = getTimestamp(id);
        return timestamp > _DONE_TIMESTAMP && timestamp <= block.timestamp;
    }
```
</details>

### isOperationDone

Returns whether an operation is done or not.

```solidity
function isOperationDone(bytes32 id) public view
returns(done bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isOperationDone(bytes32 id) public view virtual returns (bool done) {
        return getTimestamp(id) == _DONE_TIMESTAMP;
    }
```
</details>

### getTimestamp

Returns the timestamp at with an operation becomes ready (0 for
 unset operations, 1 for done operations).

```solidity
function getTimestamp(bytes32 id) public view
returns(timestamp uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getTimestamp(bytes32 id) public view virtual returns (uint256 timestamp) {
        return _timestamps[id];
    }
```
</details>

### getMinDelay

Returns the minimum delay for an operation to become valid.
 This value can be changed by executing an operation that calls `updateDelay`.

```solidity
function getMinDelay() public view
returns(duration uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinDelay() public view virtual returns (uint256 duration) {
        return _minDelay;
    }
```
</details>

### hashOperation

Returns the identifier of an operation containing a single
 transaction.

```solidity
function hashOperation(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt) public pure
returns(hash bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| target | address |  | 
| value | uint256 |  | 
| data | bytes |  | 
| predecessor | bytes32 |  | 
| salt | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function hashOperation(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 predecessor,
        bytes32 salt
    ) public pure virtual returns (bytes32 hash) {
        return keccak256(abi.encode(target, value, data, predecessor, salt));
    }
```
</details>

### hashOperationBatch

Returns the identifier of an operation containing a batch of
 transactions.

```solidity
function hashOperationBatch(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt) public pure
returns(hash bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| targets | address[] |  | 
| values | uint256[] |  | 
| datas | bytes[] |  | 
| predecessor | bytes32 |  | 
| salt | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function hashOperationBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas,
        bytes32 predecessor,
        bytes32 salt
    ) public pure virtual returns (bytes32 hash) {
        return keccak256(abi.encode(targets, values, datas, predecessor, salt));
    }
```
</details>

### schedule

Schedule an operation containing a single transaction.
 Emits a {CallScheduled} event.
 Requirements:
 - the caller must have the 'proposer' role.

```solidity
function schedule(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt, uint256 delay) public nonpayable onlyRole 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| target | address |  | 
| value | uint256 |  | 
| data | bytes |  | 
| predecessor | bytes32 |  | 
| salt | bytes32 |  | 
| delay | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function schedule(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 predecessor,
        bytes32 salt,
        uint256 delay
    ) public virtual onlyRole(PROPOSER_ROLE) {
        bytes32 id = hashOperation(target, value, data, predecessor, salt);
        _schedule(id, delay);
        emit CallScheduled(id, 0, target, value, data, predecessor, delay);
    }
```
</details>

### scheduleBatch

Schedule an operation containing a batch of transactions.
 Emits one {CallScheduled} event per transaction in the batch.
 Requirements:
 - the caller must have the 'proposer' role.

```solidity
function scheduleBatch(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt, uint256 delay) public nonpayable onlyRole 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| targets | address[] |  | 
| values | uint256[] |  | 
| datas | bytes[] |  | 
| predecessor | bytes32 |  | 
| salt | bytes32 |  | 
| delay | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function scheduleBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas,
        bytes32 predecessor,
        bytes32 salt,
        uint256 delay
    ) public virtual onlyRole(PROPOSER_ROLE) {
        require(targets.length == values.length, "TimelockController: length mismatch");
        require(targets.length == datas.length, "TimelockController: length mismatch");

        bytes32 id = hashOperationBatch(targets, values, datas, predecessor, salt);
        _schedule(id, delay);
        for (uint256 i = 0; i < targets.length; ++i) {
            emit CallScheduled(id, i, targets[i], values[i], datas[i], predecessor, delay);
        }
    }
```
</details>

### _schedule

Schedule an operation that is to becomes valid after a given delay.

```solidity
function _schedule(bytes32 id, uint256 delay) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 
| delay | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _schedule(bytes32 id, uint256 delay) private {
        require(!isOperation(id), "TimelockController: operation already scheduled");
        require(delay >= getMinDelay(), "TimelockController: insufficient delay");
        _timestamps[id] = block.timestamp + delay;
    }
```
</details>

### cancel

Cancel an operation.
 Requirements:
 - the caller must have the 'proposer' role.

```solidity
function cancel(bytes32 id) public nonpayable onlyRole 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function cancel(bytes32 id) public virtual onlyRole(PROPOSER_ROLE) {
        require(isOperationPending(id), "TimelockController: operation cannot be cancelled");
        delete _timestamps[id];

        emit Cancelled(id);
    }
```
</details>

### execute

Execute an (ready) operation containing a single transaction.
 Emits a {CallExecuted} event.
 Requirements:
 - the caller must have the 'executor' role.

```solidity
function execute(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt) public payable onlyRoleOrOpenRole 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| target | address |  | 
| value | uint256 |  | 
| data | bytes |  | 
| predecessor | bytes32 |  | 
| salt | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function execute(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 predecessor,
        bytes32 salt
    ) public payable virtual onlyRoleOrOpenRole(EXECUTOR_ROLE) {
        bytes32 id = hashOperation(target, value, data, predecessor, salt);
        _beforeCall(id, predecessor);
        _call(id, 0, target, value, data);
        _afterCall(id);
    }
```
</details>

### executeBatch

Execute an (ready) operation containing a batch of transactions.
 Emits one {CallExecuted} event per transaction in the batch.
 Requirements:
 - the caller must have the 'executor' role.

```solidity
function executeBatch(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt) public payable onlyRoleOrOpenRole 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| targets | address[] |  | 
| values | uint256[] |  | 
| datas | bytes[] |  | 
| predecessor | bytes32 |  | 
| salt | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas,
        bytes32 predecessor,
        bytes32 salt
    ) public payable virtual onlyRoleOrOpenRole(EXECUTOR_ROLE) {
        require(targets.length == values.length, "TimelockController: length mismatch");
        require(targets.length == datas.length, "TimelockController: length mismatch");

        bytes32 id = hashOperationBatch(targets, values, datas, predecessor, salt);
        _beforeCall(id, predecessor);
        for (uint256 i = 0; i < targets.length; ++i) {
            _call(id, i, targets[i], values[i], datas[i]);
        }
        _afterCall(id);
    }
```
</details>

### _beforeCall

Checks before execution of an operation's calls.

```solidity
function _beforeCall(bytes32 id, bytes32 predecessor) private view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 
| predecessor | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _beforeCall(bytes32 id, bytes32 predecessor) private view {
        require(isOperationReady(id), "TimelockController: operation is not ready");
        require(predecessor == bytes32(0) || isOperationDone(predecessor), "TimelockController: missing dependency");
    }
```
</details>

### _afterCall

Checks after execution of an operation's calls.

```solidity
function _afterCall(bytes32 id) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _afterCall(bytes32 id) private {
        require(isOperationReady(id), "TimelockController: operation is not ready");
        _timestamps[id] = _DONE_TIMESTAMP;
    }
```
</details>

### _call

Execute an operation's call.
 Emits a {CallExecuted} event.

```solidity
function _call(bytes32 id, uint256 index, address target, uint256 value, bytes data) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | bytes32 |  | 
| index | uint256 |  | 
| target | address |  | 
| value | uint256 |  | 
| data | bytes |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _call(
        bytes32 id,
        uint256 index,
        address target,
        uint256 value,
        bytes calldata data
    ) private {
        (bool success, ) = target.call{value: value}(data);
        require(success, "TimelockController: underlying transaction reverted");

        emit CallExecuted(id, index, target, value, data);
    }
```
</details>

### updateDelay

Changes the minimum timelock duration for future operations.
 Emits a {MinDelayChange} event.
 Requirements:
 - the caller must be the timelock itself. This can only be achieved by scheduling and later executing
 an operation where the timelock is the target and the data is the ABI-encoded call to this function.

```solidity
function updateDelay(uint256 newDelay) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newDelay | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateDelay(uint256 newDelay) external virtual {
        require(msg.sender == address(this), "TimelockController: caller must be timelock");
        emit MinDelayChange(_minDelay, newDelay);
        _minDelay = newDelay;
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
