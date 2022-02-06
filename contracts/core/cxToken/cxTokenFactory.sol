// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/IVault.sol";
import "../../interfaces/ICxTokenFactory.sol";
import "../../libraries/cxTokenFactoryLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../Recoverable.sol";

/**
 * @title cxToken Factory Contract
 * @dev As and when required by the protocol,
 * the cxTokenFactory contract creates new instances of
 * cxTokens on demand.
 */
// slither-disable-next-line naming-convention
contract cxTokenFactory is ICxTokenFactory, Recoverable {
  // solhint-disable-previous-line
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;

  function _getTokenName(bytes32 key) private pure returns (string memory) {
    return string(abi.encodePacked(string(abi.encodePacked(key)), "-cxtoken"));
  }

  function _getTokenSymbol() private view returns (string memory) {
    string memory suffix = ERC20(s.getStablecoin()).symbol();
    return string(abi.encodePacked("cx", suffix));
  }

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Deploys a new instance of cxTokens
   * @param s Provide the store contract instance
   * @param key Enter the cover key related to this cxToken instance
   * @param expiryDate Specify the expiry date of this cxToken instance
   */
  function deploy(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) external override nonReentrant returns (address deployed) {
    // @suppress-acl Can only be called by the latest policy contract
    s.mustNotBePaused();
    s.mustBeValidCoverKey(key);
    s.callerMustBePolicyContract();

    (bytes memory bytecode, bytes32 salt) = cxTokenFactoryLibV1.getByteCode(s, key, expiryDate, _getTokenName(key), _getTokenSymbol());

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

    // salt = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate));
    s.setAddress(salt, deployed);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, deployed, true);
    // @todo: drop this if not used elsewhere
    s.setAddressArrayByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, key, deployed);

    emit CxTokenDeployed(key, deployed, expiryDate);
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
