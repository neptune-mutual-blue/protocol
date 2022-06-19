// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../contracts/core/lifecycle/Cover.sol";
import "../contracts/core/lifecycle/CoverStake.sol";
import "../contracts/core/lifecycle/CoverReassurance.sol";
import "../contracts/core/cxToken/cxTokenFactory.sol";
import "../contracts/core/liquidity/VaultFactory.sol";
import "../contracts/core/liquidity/Vault.sol";
import "../contracts/core/delegates/VaultDelegate.sol";
import "../contracts/core/governance/Governance.sol";
import "../contracts/core/governance/resolution/Resolution.sol";
import "../contracts/core/policy/Policy.sol";
import "../contracts/core/store/Store.sol";
import "../contracts/core/Protocol.sol";
import "../contracts/fakes/FakeToken.sol";
import "../contracts/fakes/FakeUniswapV2RouterLike.sol";
import "../contracts/fakes/FakeUniswapV2PairLike.sol";
import "../contracts/fakes/FakeUniswapV2FactoryLike.sol";
import "../contracts/fakes/FakePriceOracle.sol";

contract BaseSpec is Test {
  Store internal _store;
  FakeToken internal _npm;
  FakeToken internal _dai;

  uint8 public constant DAI_DECIMALS = 6;
  uint256 public constant DAI_PRECISION = 10**DAI_DECIMALS;

  constructor() {
    _store = new Store();
    _deployTokens();
  }

  function _deployTokens() internal {
    _npm = new FakeToken("Neptune Mutual Token", "NPM", 0, 18);
    _dai = new FakeToken("Dai", "DAI", 0, DAI_DECIMALS);
  }
}

contract ProtocolSpec is BaseSpec {
  using StoreKeyUtil for Store;

  Cover internal _cover;
  CoverStake internal _coverStake;
  CoverReassurance internal _coverReassurance;
  Governance internal _governance;
  Resolution internal _resolution;
  Policy internal _policy;
  Protocol internal _protocol;

  constructor() {
    _initializeProtocol();
  }

  // Needed so the test contract itself can receive ether
  // when withdrawing
  receive() external payable {}

  function _deployProtocol() internal {
    _protocol = new Protocol(_store);
    // Update the protocol to become a member
    _store.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, address(_protocol), true);
  }

  function _initializeProtocol() internal {
    _deployProtocol();

    FakeUniswapV2PairLike pair = new FakeUniswapV2PairLike(address(_npm), address(_dai));
    FakeUniswapV2RouterLike router = new FakeUniswapV2RouterLike();
    FakeUniswapV2FactoryLike factory = new FakeUniswapV2FactoryLike(address(pair));
    FakePriceOracle oracle = new FakePriceOracle();

    address[] memory addresses = new address[](6);

    addresses[0] = address(1); // burner
    addresses[1] = address(router);
    addresses[2] = address(factory);
    addresses[3] = address(_npm);
    addresses[4] = address(2); // treasury
    addresses[5] = address(oracle);

    uint256[] memory values = new uint256[](13);

    values[0] = 500 ether; // cover creation fee
    values[1] = 4500 ether; // creation creation stake
    values[2] = 5000 ether; // first reporting stake
    values[3] = 7 days; // claim period
    values[4] = 4000; // invalid camp's stake burn rate
    values[5] = 1000; // reporter's commission on claimed stakes (by valid camp witnesses)
    values[6] = 650; // platform's claim fee
    values[7] = 500; // reporter's commission on platform's fee, not total claim fee
    values[8] = 50; // flash loan fee
    values[9] = 250; // platform flash loan fee
    values[10] = 1 days; // cooldown period
    values[11] = 10 minutes; // liquidity update interval
    values[12] = 1000; // maximum percent that can be lent from a cover liquidity pool

    _protocol.initialize(addresses, values);

    _protocol.grantRole(AccessControlLibV1.NS_ROLES_UPGRADE_AGENT, address(_protocol));
    _protocol.grantRole(AccessControlLibV1.NS_ROLES_UPGRADE_AGENT, address(this));
    _protocol.grantRole(AccessControlLibV1.NS_ROLES_COVER_MANAGER, address(this));
    _protocol.grantRole(AccessControlLibV1.NS_ROLES_LIQUIDITY_MANAGER, address(this));
    _protocol.grantRole(AccessControlLibV1.NS_ROLES_GOVERNANCE_ADMIN, address(this));
    _protocol.grantRole(AccessControlLibV1.NS_ROLES_GOVERNANCE_AGENT, address(this));
    _protocol.grantRole(AccessControlLibV1.NS_ROLES_PAUSE_AGENT, address(this));
    _protocol.grantRole(AccessControlLibV1.NS_ROLES_UNPAUSE_AGENT, address(this));

    _deployMembers();
  }

  function _deployMembers() internal {
    _cover = new Cover(_store);

    _coverStake = new CoverStake(_store);
    _coverReassurance = new CoverReassurance(_store);
    _governance = new Governance(_store);
    _resolution = new Resolution(_store);
    _policy = new Policy(_store, 0);

    VaultFactory vaultFactory = new VaultFactory(_store);
    VaultDelegate vd = new VaultDelegate(_store);
    cxTokenFactory ctf = new cxTokenFactory(_store);

    _protocol.grantRole(AccessControlLibV1.NS_ROLES_UPGRADE_AGENT, address(_cover));

    _protocol.addContract(ProtoUtilV1.CNS_COVER, address(_cover));
    _protocol.addContract(ProtoUtilV1.CNS_COVER_STAKE, address(_coverStake));
    _protocol.addContract(ProtoUtilV1.CNS_COVER_REASSURANCE, address(_coverReassurance));
    _protocol.addContract(ProtoUtilV1.CNS_COVER_VAULT_FACTORY, address(vaultFactory));
    _protocol.addContract(ProtoUtilV1.CNS_COVER_VAULT_DELEGATE, address(vd));
    _protocol.addContract(ProtoUtilV1.CNS_COVER_CXTOKEN_FACTORY, address(ctf));
    _protocol.addContract(ProtoUtilV1.CNS_GOVERNANCE, address(_governance));
    _protocol.addContract(ProtoUtilV1.CNS_GOVERNANCE_RESOLUTION, address(_resolution));
    _protocol.addContract(ProtoUtilV1.CNS_COVER_POLICY, address(_policy));
  }
}

contract CoverSpec is ProtocolSpec {
  Vault internal _vault;
  bytes32 internal constant _COVER_KEY = "foo-bar";

  constructor() {
    _initializeCover();
  }

  function _initializeCover() internal {
    uint256[] memory values = new uint256[](10);
    values[0] = 10_000 ether; // stake with fees
    values[1] = 1_000_000 * DAI_PRECISION; // reassurance amount to add now
    values[2] = 20_000 ether; // minimum stake required to report
    values[3] = 7 days; // reporting period
    values[4] = 1 days; // cooldown period
    values[5] = 7 days; // claim period
    values[6] = 800; // floor
    values[7] = 3200; // ceiling
    values[8] = 5000; // reassurance rate
    values[9] = 1; // leverage factor

    _cover.initialize(address(_dai), "DAI Token");

    _cover.updateCoverCreatorWhitelist(address(this), true);
    _npm.mint(values[0]);
    _npm.approve(address(_coverStake), values[0]);

    _dai.mint(values[1]);
    _dai.approve(address(_coverReassurance), values[1]);

    _vault = Vault(_cover.addCover(_COVER_KEY, "ipfs://?", "POD", "POD", false, false, values));
  }
}
