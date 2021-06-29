// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./CoverBase.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/IVault.sol";
import "../liquidity/Vault.sol";

/**
 * @title Cover Contract
 * @dev The cover contract facilitates you create and update covers
 */
contract Cover is CoverBase {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Constructs this contract
   * @param store Enter the store
   * @param liquidityToken Enter the stable liquidity token to use when creating covers
   * @param liquidityName Provide a name of the `liquidityToken`. Example: `wxDai`, `USD Coin`, or `Binance Pegged USD`.
   */
  constructor(
    IStore store,
    address liquidityToken,
    bytes32 liquidityName
  ) CoverBase(store, liquidityToken, liquidityName) {
    this;
  }

  /**
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover owner or protocol owner (governance).
   *
   * @param key Enter the cover key
   * @param info Enter a new IPFS URL to update
   */
  function updateCover(bytes32 key, bytes32 info) external nonReentrant {
    _mustBeUnpaused(); // Ensures the contract isn't paused
    s.mustBeValidCover(key); // Ensures the key is valid cover
    s.mustBeCoverOwner(key, super._msgSender(), owner()); // Ensures the sender is either the owner or cover owner

    require(s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key) != info, "Duplicate content");

    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    emit CoverUpdated(key, info);
  }

  /**
   * @dev Adds a new coverage pool or cover contract.
   * To add a new cover, you need to pay cover creation fee
   * and stake minimum amount of NEP in the Vault. <br /> <br />
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
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param assuranceToken **Optional.** Token added as an assurance of this cover. <br /><br />
   *
   * Assurance tokens can be added by a project to demonstrate coverage support
   * for their own project. This helps bring the cover fee down and enhances
   * liquidity provider confidence. Along with the NEP tokens, the assurance tokens are rewarded
   * as a support to the liquidity providers when a cover incident occurs.
   * @param initialAssuranceAmount **Optional.** Enter the initial amount of
   * assurance tokens you'd like to add to this pool.
   * @param stakeWithFee Enter the total NEP amount (stake + fee) to transfer to this contract.
   * @param initialLiquidity **Optional.** Enter the initial stablecoin liquidity for this cover.
   */
  function addCover(
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee,
    address assuranceToken,
    uint256 initialAssuranceAmount,
    uint256 initialLiquidity
  ) external nonReentrant {
    _mustBeUnpaused(); // Ensures the contract isn't paused

    // First validate the information entered
    uint256 fee = _validateAndGetFee(key, info, stakeWithFee);

    // Set the basic cover info
    _addCover(key, info, fee, assuranceToken);

    // Stake the supplied NEP tokens and burn the fees
    s.getStakingContract().increaseStake(key, super._msgSender(), stakeWithFee, fee);

    // Add cover assurance
    if (initialAssuranceAmount > 0) {
      s.getAssuranceContract().addAssurance(key, super._msgSender(), initialAssuranceAmount);
    }

    // Add initial liquidity
    if (initialLiquidity > 0) {
      IVault vault = s.getVault(key);

      s.getVault(key).addLiquidityInternal(key, super._msgSender(), initialLiquidity);

      // Transfer liquidity only after minting the pods
      IERC20(s.getLiquidityToken()).ensureTransferFrom(super._msgSender(), address(vault), initialLiquidity);
    }

    emit CoverCreated(key, info, stakeWithFee, initialLiquidity);
  }

  /**
   * Adds a new cover contract
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param fee Fee paid to create this cover
   * @param assuranceToken **Optional.** Token added as an assurance of this cover.
   */
  function _addCover(
    bytes32 key,
    bytes32 info,
    uint256 fee,
    address assuranceToken
  ) private {
    // Add a new cover
    s.setBoolByKeys(ProtoUtilV1.NS_COVER, key, true);

    // Set cover owner
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key, super._msgSender());

    // Set cover info
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);

    // Set assurance token
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_ASSURANCE_TOKEN, key, assuranceToken);

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_FEE, key, fee);

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(s, key);
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_VAULT, key, deployed);
  }

  /**
   * @dev Validation checks before adding a new cover
   * @return Returns fee required to create a new cover
   */
  function _validateAndGetFee(
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee
  ) private view returns (uint256) {
    require(info > 0, "Invalid info");
    (uint256 fee, uint256 minStake) = s.getCoverFee();

    require(stakeWithFee > fee + minStake, "NEP Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key) == false, "Already exists");

    return fee;
  }
}
