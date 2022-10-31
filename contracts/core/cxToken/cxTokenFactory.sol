// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../../interfaces/IVault.sol";
import "../../interfaces/ICxTokenFactory.sol";
import "../../libraries/cxTokenFactoryLibV1.sol";
import "../Recoverable.sol";

/**
 * @title cxToken Factory Contract
 *
 * @dev Deploys new instances of cxTokens on demand.
 *
 */
// slither-disable-next-line naming-convention
contract cxTokenFactory is ICxTokenFactory, Recoverable {
  // solhint-disable-previous-line
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Deploys a new instance of cxTokens
   *
   * @custom:suppress-acl Can only be called by the latest policy contract
   *
   * @param coverKey Enter the cover key related to this cxToken instance
   * @param productKey Enter the product key related to this cxToken instance
   * @param expiryDate Specify the expiry date of this cxToken instance
   *
   */
  function deploy(
    bytes32 coverKey,
    bytes32 productKey,
    string calldata tokenName,
    uint256 expiryDate
  ) external override nonReentrant returns (address deployed) {
    s.mustNotBePaused();
    s.senderMustBePolicyContract();
    s.mustBeValidCoverKey(coverKey);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    require(expiryDate > 0, "Please specify expiry date");

    (bytes memory bytecode, bytes32 salt) = cxTokenFactoryLibV1.getByteCodeInternal(s, coverKey, productKey, tokenName, expiryDate);

    require(s.getAddress(salt) == address(0), "Already deployed");

    // solhint-disable-next-line
    assembly {
      deployed := create2(
        callvalue(), // wei sent with current call
        // Actual code starts after skipping the first 32 bytes
        add(bytecode, 0x20),
        mload(bytecode), // Load the size of code contained in the first 32 bytes
        salt // Salt from function arguments
      )

      if iszero(extcodesize(deployed)) {
        // @suppress-revert This is correct usage
        revert(0, 0)
      }
    }

    s.setAddress(salt, deployed);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, deployed, true);
    s.setAddressArrayByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, coverKey, productKey, deployed);

    emit CxTokenDeployed(coverKey, productKey, deployed, expiryDate);
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
    return ProtoUtilV1.CNAME_CXTOKEN_FACTORY;
  }
}
