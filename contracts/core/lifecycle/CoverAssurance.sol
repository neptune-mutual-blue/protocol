// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICoverAssurance.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title Cover Assurance
 * @dev Assurance tokens can be added by a covered project to demonstrate coverage support
 * for their project. This helps bring the cover fee down and enhances
 * liquidity provider confidence. Along with the NPM tokens, the assurance tokens are rewarded
 * as a support to the liquidity providers when a cover incident occurs.
 *
 * Without negatively affecting the price much,
 * the protocol will gradually convert the assurance tokens
 * to stablecoin liquidity.
 */
contract CoverAssurance is ICoverAssurance, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  /**
   * @dev Adds assurance to the specified cover contract
   * @param key Enter the cover key
   * @param amount Enter the amount you would like to supply
   */
  function addAssurance(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCoverKey(key);

    require(amount > 0, "Provide valid amount");

    IERC20 assuranceToken = IERC20(s.getAddressByKeys(ProtoUtilV1.NS_COVER_ASSURANCE_TOKEN, key));
    address vault = s.getAssuranceVault();

    s.addUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE, key, amount);

    assuranceToken.ensureTransferFrom(account, vault, amount);

    emit AssuranceAdded(key, amount);
  }

  function setWeight(bytes32 key, uint256 weight) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.mustBeValidCoverKey(key);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE_WEIGHT, key, weight);
  }

  /**
   * @dev Gets the assurance amount of the specified cover contract
   * @param key Enter the cover key
   */
  function getAssurance(bytes32 key) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_ASSURANCE, key);
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_COVER_ASSURANCE;
  }
}
