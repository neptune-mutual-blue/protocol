// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./CoverBase.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/IVault.sol";
import "../liquidity/Vault.sol";

/**
 * @title Cover Contract
 */
contract Cover is CoverBase {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;

  constructor(
    IStore store,
    address liquidityToken,
    bytes32 liquidityName
  ) CoverBase(store, liquidityToken, liquidityName) {
    this;
  }

  /**
   * @dev Updates the cover contract
   * @param key Enter the cover key
   * @param info Enter a new IPFS URL to update
   */
  function updateCover(bytes32 key, bytes32 info) external onlyValidCover(key) onlyCoverOwner(key) nonReentrant whenNotPaused {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_INFO, key).toKeccak256();
    require(s.getBytes32(k) != info, "Duplicate content");

    s.setBytes32(k, info);
    emit CoverUpdated(key, info);
  }

  /**
   * @dev Adds a new coverage pool or cover contract.
   * To add a new cover, you need to pay cover creation fee
   * and stake minimum amount of NEP in the Vault. <br /> <br />
   *
   * Through the governance portal, projects will be able redeem
   * the full cover fee at a later date.
   *
   * As the cover creator, you will earn a portion of all cover fees
   * generated in this pool. <br /> <br />
   *
   * Read the documentation to learn more about the fees:
   * https://docs.neptunemutual.com/covers/contract-creators
   *
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param assuranceToken **Optional.** Token added as an assurance of this cover. <br />
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
  ) external nonReentrant whenNotPaused {
    // First validate the information entered
    uint256 fee = _validateAndGetFee(key, info, stakeWithFee);

    // Set the basic cover info
    _addCover(key, info, fee, assuranceToken);

    // Stake the supplied NEP tokens and burn the fees
    s.getStakingContract().increaseStake(key, super._msgSender(), stakeWithFee, fee);

    // Add cover assurance
    if (initialAssuranceAmount > 0) {
      s.getAssuranceContract().addAssurance(key, initialAssuranceAmount);
    }

    // Add initial liquidity
    if (initialLiquidity > 0) {
      s.getVault(key).addLiquidityInternal(key, super._msgSender(), initialLiquidity);
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
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER, key).toKeccak256();
    s.setBool(k, true);

    // Set cover owner
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_OWNER, key).toKeccak256();
    s.setAddress(k, super._msgSender());

    // Set cover info
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_INFO, key).toKeccak256();
    s.setBytes32(k, info);

    // Set assurance token
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_ASSURANCE_TOKEN, key).toKeccak256();
    s.setAddress(k, assuranceToken);

    // Set the fee charged during cover creation
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_FEE, key).toKeccak256();
    s.setUint(k, fee);

    // Create cover liquidity contract
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_VAULT, key).toKeccak256();
    address deployed = s.getVaultFactoryContract().deploy(s, key);
    s.setAddress(k, deployed);
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

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER, key).toKeccak256();
    require(s.getBool(k) == false, "Already exists");

    return fee;
  }
}
