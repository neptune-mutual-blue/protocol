// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./AccessControlLibV1.sol";
import "./CoverUtilV1.sol";
import "./RegistryLibV1.sol";
import "./StoreKeyUtil.sol";
import "./NTransferUtilV2.sol";
import "./RoutineInvokerLibV1.sol";

library CoverLibV1 {
  using CoverUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using AccessControlLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  function getCoverInfo(IStore s, bytes32 key)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    info = s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key);
    owner = s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);

    values = new uint256[](5);

    values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key);
    values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
    values[2] = s.getCoverPoolLiquidity(key);
    values[3] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    values[4] = s.getCoverLiquidityCommitted(key);
  }

  function initializeCoverInternal(
    IStore s,
    address liquidityToken,
    bytes32 liquidityName
  ) external {
    s.setAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN, liquidityToken);
    s.setBytes32ByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_NAME, liquidityName);

    s.updateStateAndLiquidity(0);
  }

  /**
   * @dev Adds a new coverage pool or cover contract.
   * To add a new cover, you need to pay cover creation fee
   * and stake minimum amount of NPM in the Vault. <br /> <br />
   *
   * Through the governance portal, projects will be able redeem
   * the full cover fee at a later date. <br /> <br />
   *
   * **Apply for Fee Redemption** <br />
   * https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
   *
   * As the cover creator, you will earn a portion of all cover fees
   * generated in this pool. <br /> <br />
   *
   * Read the documentation to learn more about the fees: <br />
   * https://docs.neptunemutual.com/covers/contract-creators
   *
   * @param s Provide store instance
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param reassuranceToken **Optional.** Token added as an reassurance of this cover. <br /><br />
   *
   * Reassurance tokens can be added by a project to demonstrate coverage support
   * for their own project. This helps bring the cover fee down and enhances
   * liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded
   * as a support to the liquidity providers when a cover incident occurs.
   * @param values[0] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * @param values[1] reportingPeriod The period during when reporting happens.
   * @param values[2] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * @param values[3] initialReassuranceAmount **Optional.** Enter the initial amount of
   * reassurance tokens you'd like to add to this pool.
   * @param values[4] initialLiquidity **Optional.** Enter the initial stablecoin liquidity for this cover.
   */
  function addCoverInternal(
    IStore s,
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    uint256[] memory values
  ) external {
    // First validate the information entered
    (uint256 fee, , uint256 minStakeToAddLiquidity) = _validateAndGetFee(s, key, info, values[2], values[4]);

    // Set the basic cover info
    _addCover(s, key, info, reassuranceToken, values, fee);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(key, msg.sender, values[2], fee);

    // Add cover reassurance
    if (values[3] > 0) {
      s.getReassuranceContract().addReassurance(key, msg.sender, values[3]);
    }

    // Add initial liquidity
    if (values[4] > 0) {
      IVault vault = s.getVault(key);

      s.getVault(key).addLiquidityInternalOnly(key, msg.sender, values[4], minStakeToAddLiquidity);

      // Transfer liquidity only after minting the pods
      // @suppress-malicious-erc20 This ERC-20 is a well-known address. Can only be set internally.
      IERC20(s.getStablecoin()).ensureTransferFrom(msg.sender, address(vault), values[4]);
    }

    s.updateStateAndLiquidity(key);
  }

  function _addCover(
    IStore s,
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    uint256[] memory values,
    uint256 fee
  ) private {
    // Add a new cover
    s.setBoolByKeys(ProtoUtilV1.NS_COVER, key, true);

    // Set cover owner
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key, msg.sender);

    // Set cover info
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, key, values[1]);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, key, values[0]);

    // Set reassurance token
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key, reassuranceToken);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key, fee);

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(s, key);

    s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.CNS_COVER_VAULT, key, deployed);
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, deployed, true);
  }

  /**
   * @dev Validation checks before adding a new cover
   */
  function _validateAndGetFee(
    IStore s,
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee,
    uint256 initialLiquidity
  )
    private
    view
    returns (
      uint256 fee,
      uint256 minCoverCreationStake,
      uint256 minStakeToAddLiquidity
    )
  {
    require(info > 0, "Invalid info");
    (fee, minCoverCreationStake, minStakeToAddLiquidity) = s.getCoverFee();

    uint256 minStake = fee + minCoverCreationStake;

    if (initialLiquidity > 0) {
      minStake += minStakeToAddLiquidity;
    }

    require(stakeWithFee > minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key) == false, "Already exists");
  }

  function updateCoverInternal(
    IStore s,
    bytes32 key,
    bytes32 info
  ) external {
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
  }

  function stopCoverInternal(IStore s, bytes32 key) external {
    s.setStatus(key, CoverUtilV1.CoverStatus.Stopped);
  }

  function updateWhitelistInternal(
    IStore s,
    address account,
    bool status
  ) external {
    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account, status);
  }

  function setCoverFeesInternal(IStore s, uint256 value) external returns (uint256 previous) {
    previous = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, value);

    s.updateStateAndLiquidity(0);
  }

  function setMinCoverCreationStakeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinCoverCreationStake();
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }

  function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinStakeToAddLiquidity();
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }

  function increaseProvisionInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  ) external returns (uint256 provision) {
    provision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    s.addUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.npmToken().ensureTransferFrom(msg.sender, address(this), amount);

    s.updateStateAndLiquidity(key);
  }

  function decreaseProvisionInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  ) external returns (uint256 provision) {
    provision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    require(provision >= amount, "Exceeds Balance"); // Exceeds balance
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.npmToken().ensureTransfer(msg.sender, amount);

    s.updateStateAndLiquidity(key);
  }
}
