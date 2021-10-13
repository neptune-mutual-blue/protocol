// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../Recoverable.sol";
import "../../interfaces/IClaimsProcessor.sol";
import "../../interfaces/ICToken.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/RegistryLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../../libraries/StoreKeyUtil.sol";

contract Processor is IClaimsProcessor, Recoverable {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;
  using StoreKeyUtil for IStore;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  function claim(
    address cToken,
    bytes32 key,
    uint256 incidentDate,
    uint256 amount
  ) external override nonReentrant {
    validate(cToken, key, incidentDate);

    IERC20(cToken).ensureTransferFrom(msg.sender, address(this), amount);
    ICToken(cToken).burn(amount);

    IVault vault = s.getVault(key);
    vault.transferGovernance(key, msg.sender, amount);

    emit Claimed(cToken, key, msg.sender, incidentDate, amount);
  }

  function validate(
    address cToken,
    bytes32 key,
    uint256 incidentDate
  ) public view override returns (bool) {
    s.mustNotBePaused();
    s.mustBeValidClaim(key, cToken, incidentDate);

    return true;
  }

  function getClaimExpiryDate(bytes32 key) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key);
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
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_CLAIMS_PROCESSOR;
  }
}
