// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

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
  uint256 public immutable NPM_DEPOSIT_THRESHOLD;
  uint256 public immutable DEPOSIT_THRESHOLD;
  uint256 public constant DAI_PRECISION = 10**DAI_DECIMALS;

  constructor() {
    _store = new Store();
    _deployTokens();

    DEPOSIT_THRESHOLD = ProtoUtilV1.MAX_LIQUIDITY * (10**DAI_DECIMALS);
    NPM_DEPOSIT_THRESHOLD = ProtoUtilV1.MAX_NPM_STAKE * 1 ether;
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
  receive() external payable {
    this;
  }

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

    IProtocol.InitializeArgs memory args;

    args.burner = address(1); // burner
    args.uniswapV2RouterLike = address(router);
    args.uniswapV2FactoryLike = address(factory);
    args.npm = address(_npm);
    args.treasury = address(2); // treasury
    args.priceOracle = address(oracle);

    args.coverCreationFee = 500 ether;
    args.minCoverCreationStake = 4500 ether;
    args.firstReportingStake = 5000 ether;
    args.claimPeriod = 7 days;
    args.reportingBurnRate = 4000; // 40%
    args.governanceReporterCommission = 1000; // 10%
    args.claimPlatformFee = 650; // 6.5%
    args.claimReporterCommission = 500; // 5%
    args.flashLoanFee = 50; // 0.5%
    args.flashLoanFeeProtocol = 250; // 2.5%
    args.resolutionCoolDownPeriod = 1 days;
    args.stateUpdateInterval = 10 minutes;
    args.maxLendingRatio = 1000; // 10%

    _protocol.initialize(args);

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
    _policy = new Policy(_store);

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
    ICover.AddCoverArgs memory args;

    args.coverKey = _COVER_KEY;
    args.info = "ipfs://?";
    args.tokenName = "POD";
    args.tokenSymbol = "POD";
    args.supportsProducts = false;
    args.requiresWhitelist = false;
    args.stakeWithFee = 10_000 ether;
    args.initialReassuranceAmount = 1_000_000 * DAI_PRECISION;
    args.minStakeToReport = 20_000 ether;
    args.reportingPeriod = 7 days;
    args.cooldownPeriod = 1 days;
    args.claimPeriod = 7 days;
    args.floor = 800;
    args.ceiling = 3200;
    args.reassuranceRate = 5000;
    args.leverageFactor = 1;

    _cover.initialize(address(_dai), "DAI Token");

    _cover.updateCoverCreatorWhitelist(address(this), true);
    _npm.mint(args.stakeWithFee);
    _npm.approve(address(_coverStake), args.stakeWithFee);

    _dai.mint(args.initialReassuranceAmount);
    _dai.approve(address(_cover), args.initialReassuranceAmount);

    _vault = Vault(_cover.addCover(args));
  }
}
