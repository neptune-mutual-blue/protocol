// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/IMember.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title NEP Cover Provision
 * @dev Through governance, NEP tokens can be allocated as provision or `Reward Pool Support`
 * for any given cover. This not only fosters community participation but also incentivizes
 * the liquidity providers or acts as a defense/support during cover incidents.
 *
 * Along with the NEP provisions, the liquidity providers also have `[Assurance Token Support](CoverAssurance.md)`
 * for the rainy day.
 */
contract CoverProvision is IMember, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;

  event ProvisionIncreased(bytes32 key, uint256 previous, uint256 current);
  event ProvisionDecreased(bytes32 key, uint256 previous, uint256 current);

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {
    this;
  }

  /**
   * @dev Increases NEP provision for the given cover key.
   * This feature is accessible only to the contract owner (governance).
   * @param key Provide the cover key you wish to increase the provision of
   * @param amount Specify the amount of NEP tokens you would like to add
   */
  function increaseProvision(bytes32 key, uint256 amount) external onlyOwner nonReentrant {
    _mustBeUnpaused(); // Ensures the contract isn't paused
    s.mustBeValidCover(key); // Ensures the key is valid cover

    uint256 privision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    s.addUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), amount);

    emit ProvisionIncreased(key, privision, privision + amount);
  }

  /**
   * @dev Decreases NEP provision for the given cover key
   * This feature is accessible only to the contract owner (governance).
   * @param key Provide the cover key you wish to decrease the provision from
   * @param amount Specify the amount of NEP tokens you would like to decrease
   */
  function decreaseProvision(bytes32 key, uint256 amount) external onlyOwner nonReentrant {
    _mustBeUnpaused(); // Ensures the contract isn't paused
    s.mustBeValidCover(key); // Ensures the key is valid cover

    uint256 privision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    require(privision >= amount, "Exceeds Balance"); // Exceeds balance
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.nepToken().ensureTransfer(super.owner(), amount);

    emit ProvisionDecreased(key, privision, privision - amount);
  }

  /**
   * @dev Gets the NEP provision amount for the given cover key
   * @param key Enter the cover key to get the provision
   */
  function getProvision(bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);
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
    return ProtoUtilV1.CNAME_COVER_PROVISION;
  }
}
