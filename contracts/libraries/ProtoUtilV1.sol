// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "../interfaces/IProtocol.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./StoreKeyUtil.sol";

library ProtoUtilV1 {
  using StoreKeyUtil for IStore;

  bytes32 public constant NS_CORE = "proto:core";
  bytes32 public constant NS_ASSURANCE_VAULT = "proto:core:assurance:vault";

  /// @dev The address where burn tokens are sent or collected.
  /// This behavior (collection) is required if the instance of
  /// the Neptune Mutual protocol is deployed on a sidechain
  /// or a layer-2 blockchain.
  /// &nbsp;\n
  /// The collected NPM tokens are will be periodically bridged back to Ethereum
  /// and then burned.
  bytes32 public constant NS_BURNER = "proto:core:burner";

  /// @dev Namespace for all protocol members.
  bytes32 public constant NS_MEMBERS = "proto:members";

  /// @dev Namespace for protocol contract members.
  bytes32 public constant NS_CONTRACTS = "proto:contracts";

  /// @dev Key prefix for creating a new cover product on chain
  bytes32 public constant NS_COVER = "proto:cover";

  /// @dev Governance contract address
  bytes32 public constant NS_GOVERNANCE = "proto:gov";

  /// @dev Governance:Resolution contract address
  bytes32 public constant NS_RESOLUTION = "proto:gov:resolution";

  /// @dev The timestamp when a tokenholder withdraws their reporting stake
  bytes32 public constant NS_UNSTAKEN = "proto:gov:unstaken";

  /// @dev The timestamp when a tokenholder withdraws their reporting stake
  bytes32 public constant NS_UNSTAKE_TS = "proto:gov:unstake:ts";

  /// @dev The reward received by the winning camp
  bytes32 public constant NS_UNSTAKE_REWARD = "proto:gov:unstake:reward";

  /// @dev The stakes burned during incident resolution
  bytes32 public constant NS_UNSTAKE_BURNED = "proto:gov:unstake:burned";

  /// @dev The stakes burned during incident resolution
  bytes32 public constant NS_UNSTAKE_REPORTER_FEE = "proto:gov:unstake:rep:fee";

  /// @dev Claims processor contract address
  bytes32 public constant NS_CLAIMS_PROCESSOR = "proto:claims:processor";

  bytes32 public constant NS_COVER_ASSURANCE = "proto:cover:assurance";
  bytes32 public constant NS_COVER_ASSURANCE_TOKEN = "proto:cover:assurance:token";
  bytes32 public constant NS_COVER_ASSURANCE_WEIGHT = "proto:cover:assurance:weight";
  bytes32 public constant NS_COVER_CLAIMABLE = "proto:cover:claimable";
  bytes32 public constant NS_COVER_FEE = "proto:cover:fee";
  bytes32 public constant NS_COVER_INFO = "proto:cover:info";
  bytes32 public constant NS_COVER_LIQUIDITY = "proto:cover:liquidity";
  bytes32 public constant NS_COVER_LIQUIDITY_COMMITTED = "proto:cover:liquidity:committed";
  bytes32 public constant NS_COVER_LIQUIDITY_NAME = "proto:cover:liquidityName";
  bytes32 public constant NS_COVER_LIQUIDITY_TOKEN = "proto:cover:liquidityToken";
  bytes32 public constant NS_COVER_LIQUIDITY_RELEASE_DATE = "proto:cover:liquidity:release";
  bytes32 public constant NS_COVER_OWNER = "proto:cover:owner";
  bytes32 public constant NS_COVER_POLICY = "proto:cover:policy";
  bytes32 public constant NS_COVER_POLICY_ADMIN = "proto:cover:policy:admin";
  bytes32 public constant NS_COVER_POLICY_MANAGER = "proto:cover:policy:manager";
  bytes32 public constant NS_COVER_POLICY_RATE_FLOOR = "proto:cover:policy:rate:floor";
  bytes32 public constant NS_COVER_POLICY_RATE_CEILING = "proto:cover:policy:rate:ceiling";
  bytes32 public constant NS_COVER_PROVISION = "proto:cover:provision";
  bytes32 public constant NS_COVER_STAKE = "proto:cover:stake";
  bytes32 public constant NS_COVER_STAKE_OWNED = "proto:cover:stake:owned";
  bytes32 public constant NS_COVER_STATUS = "proto:cover:status";
  bytes32 public constant NS_COVER_VAULT = "proto:cover:vault";
  bytes32 public constant NS_COVER_VAULT_FACTORY = "proto:cover:vault:factory";
  bytes32 public constant NS_COVER_CXTOKEN = "proto:cover:cxtoken";
  bytes32 public constant NS_COVER_CXTOKEN_FACTORY = "proto:cover:cxtoken:factory";
  bytes32 public constant NS_COVER_WHITELIST = "proto:cover:whitelist";
  bytes32 public constant NS_TREASURY = "proto:core:treasury";
  bytes32 public constant NS_PRICE_DISCOVERY = "proto:core:price:discovery";

  /// @dev An approximate date and time when trigger event or cover incident occured
  bytes32 public constant NS_REPORTING_INCIDENT_DATE = "proto:reporting:incident:date";

  /// @dev A period (in solidity timestamp) configurable by cover creators during
  /// when NPM tokenholders can vote on incident reporting proposals
  bytes32 public constant NS_REPORTING_PERIOD = "proto:reporting:period";

  /// @dev Resolution timestamp = timestamp of first reporting + reporting period
  bytes32 public constant NS_RESOLUTION_TS = "proto:reporting:resolution:ts";

  /// @dev A 24-hour delay after a governance agent "resolves" an actively reported cover.
  bytes32 public constant NS_CLAIM_BEGIN_TS = "proto:claim:begin:ts";

  /// @dev Claim expiry date = Claim begin date + claim duration
  bytes32 public constant NS_CLAIM_EXPIRY_TS = "proto:claim:expiry:ts";

  /// @dev Used as key element in a couple of places:
  /// 1. For uint256 --> Sum total of NPM witnesses who saw incident to have happened
  /// 2. For address --> The address of the first reporter
  bytes32 public constant NS_REPORTING_WITNESS_YES = "proto:reporting:witness:yes";

  /// @dev Used as key element in a couple of places:
  /// 1. For uint256 --> Sum total of NPM witnesses who disagreed with and disputed an incident reporting
  /// 2. For address --> The address of the first disputing reporter (disputer / candidate reporter)
  bytes32 public constant NS_REPORTING_WITNESS_NO = "proto:reporting:witness:no";

  /// @dev Stakes guaranteed by an individual witness supporting the "incident happened" camp
  bytes32 public constant NS_REPORTING_STAKE_OWNED_YES = "proto:reporting:stake:owned:yes";

  /// @dev Stakes guaranteed by an individual witness supporting the "false reporting" camp
  bytes32 public constant NS_REPORTING_STAKE_OWNED_NO = "proto:reporting:stake:owned:no";

  /// @dev The address of NPM token available in this blockchain
  bytes32 public constant NS_SETUP_NPM = "proto:setup:npm";

  /// @dev The percentage rate (x 1 ether) of amount of reporting/unstake reward to burn.
  /// Note that the reward comes from the losing camp after resolution is achieved.
  bytes32 public constant NS_REPORTING_BURN_RATE = "proto:reporting:burn:rate";

  /// @dev The percentage rate (x 1 ether) of amount of reporting/unstake
  /// reward to provide to the final reporter.
  bytes32 public constant NS_REPORTER_COMMISSION = "proto:reporter:commission";

  bytes32 public constant NS_SETUP_COVER_FEE = "proto:setup:cover:fee";
  bytes32 public constant NS_SETUP_MIN_STAKE = "proto:setup:min:stake";
  bytes32 public constant NS_SETUP_FIRST_REPORTING_STAKE = "proto:setup:1st:reporting:stake";
  bytes32 public constant NS_SETUP_MIN_LIQ_PERIOD = "proto:setup:min:liq:period";
  bytes32 public constant NS_SETUP_CLAIM_PERIOD = "proto:setup:claim:period";
  bytes32 public constant NS_SETUP_UNISWAP_V2_ROUTER = "proto:uniswap:v2:router";

  bytes32 public constant CNAME_PROTOCOL = "Protocol";
  bytes32 public constant CNAME_TREASURY = "Treasury";
  bytes32 public constant CNAME_POLICY = "Policy";
  bytes32 public constant CNAME_POLICY_ADMIN = "PolicyAdmin";
  bytes32 public constant CNAME_POLICY_MANAGER = "PolicyManager";
  bytes32 public constant CNAME_CLAIMS_PROCESSOR = "ClaimsProcessor";
  bytes32 public constant CNAME_PRICE_DISCOVERY = "PriceDiscovery";
  bytes32 public constant CNAME_COVER = "Cover";
  bytes32 public constant CNAME_GOVERNANCE = "Governance";
  bytes32 public constant CNAME_RESOLUTION = "Resolution";
  bytes32 public constant CNAME_VAULT_FACTORY = "VaultFactory";
  bytes32 public constant CNAME_CXTOKEN_FACTORY = "cxTokenFactory";
  bytes32 public constant CNAME_COVER_PROVISION = "CoverProvison";
  bytes32 public constant CNAME_COVER_STAKE = "CoverStake";
  bytes32 public constant CNAME_COVER_ASSURANCE = "CoverAssurance";
  bytes32 public constant CNAME_LIQUIDITY_VAULT = "Vault";

  function getProtocol(IStore s) external view returns (IProtocol) {
    return IProtocol(getProtocolAddress(s));
  }

  function getProtocolAddress(IStore s) public view returns (address) {
    return s.getAddressByKey(NS_CORE);
  }

  function getContract(IStore s, bytes32 name) external view returns (address) {
    return _getContract(s, name);
  }

  function isProtocolMember(IStore s, address contractAddress) external view returns (bool) {
    return _isProtocolMember(s, contractAddress);
  }

  /**
   * @dev Reverts if the caller is one of the protocol members.
   */
  function mustBeProtocolMember(IStore s, address contractAddress) external view {
    bool isMember = _isProtocolMember(s, contractAddress);
    require(isMember, "Not a protocol member");
  }

  /**
   * @dev Ensures that the sender matches with the exact contract having the specified name.
   * @param name Enter the name of the contract
   * @param sender Enter the `msg.sender` value
   */
  function mustBeExactContract(
    IStore s,
    bytes32 name,
    address sender
  ) public view {
    address contractAddress = _getContract(s, name);
    require(sender == contractAddress, "Access denied");
  }

  /**
   * @dev Ensures that the sender matches with the exact contract having the specified name.
   * @param name Enter the name of the contract
   */
  function callerMustBeExactContract(IStore s, bytes32 name) external view {
    return mustBeExactContract(s, name, msg.sender);
  }

  function npmToken(IStore s) external view returns (IERC20) {
    address npm = s.getAddressByKey(NS_SETUP_NPM);
    return IERC20(npm);
  }

  function getUniswapV2Router(IStore s) external view returns (address) {
    return s.getAddressByKey(NS_SETUP_UNISWAP_V2_ROUTER);
  }

  function getTreasury(IStore s) external view returns (address) {
    return s.getAddressByKey(NS_TREASURY);
  }

  function getAssuranceVault(IStore s) external view returns (address) {
    return s.getAddressByKey(NS_ASSURANCE_VAULT);
  }

  function getLiquidityToken(IStore s) public view returns (address) {
    return s.getAddressByKey(NS_COVER_LIQUIDITY_TOKEN);
  }

  function getBurnAddress(IStore s) external view returns (address) {
    return s.getAddressByKey(NS_BURNER);
  }

  function toKeccak256(bytes memory value) external pure returns (bytes32) {
    return keccak256(value);
  }

  function _isProtocolMember(IStore s, address contractAddress) private view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, contractAddress);
  }

  function _getContract(IStore s, bytes32 name) private view returns (address) {
    return s.getAddressByKeys(NS_CONTRACTS, name);
  }

  function addContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) external {
    _addContract(s, namespace, contractAddress);
  }

  function _addContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) private {
    s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, contractAddress);
    _addMember(s, contractAddress);
  }

  function deleteContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) external {
    _deleteContract(s, namespace, contractAddress);
  }

  function _deleteContract(
    IStore s,
    bytes32 namespace,
    address contractAddress
  ) private {
    s.deleteAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace);
    _removeMember(s, contractAddress);
  }

  function upgradeContract(
    IStore s,
    bytes32 namespace,
    address previous,
    address current
  ) external {
    bool isMember = _isProtocolMember(s, previous);
    require(isMember, "Not a protocol member");

    _deleteContract(s, namespace, previous);
    _addContract(s, namespace, current);
  }

  function addMember(IStore s, address member) external {
    _addMember(s, member);
  }

  function removeMember(IStore s, address member) external {
    _removeMember(s, member);
  }

  function _addMember(IStore s, address member) private {
    require(s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, member) == false, "Already exists");
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, member, true);
  }

  function _removeMember(IStore s, address member) private {
    s.deleteBoolByKeys(ProtoUtilV1.NS_MEMBERS, member);
  }
}
