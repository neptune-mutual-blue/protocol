// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IVault.sol";
import "../../interfaces/ICTokenFactory.sol";
import "../../libraries/cTokenFactoryLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../Recoverable.sol";

/**
 * @title cToken Factory Contract
 * @dev As and when required by the protocol,
 * the cTokenFactory contract creates new instances of
 * cTokens on demand.
 */
// solhint-disable-next-line
contract cTokenFactory is ICTokenFactory, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {
    this;
  }

  /**
   * @dev Deploys a new instance of cTokens
   * @param s Provide the store contract instance
   * @param key Enter the cover key related to this cToken instance
   * @param expiryDate Specify the expiry date of this cToken instance
   */
  function deploy(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) external override returns (address deployed) {
    s.mustNotBePaused();
    s.mustBeValidCoverKey(key);
    s.callerMustBePolicyContract();

    (bytes memory bytecode, bytes32 salt) = cTokenFactoryLibV1.getByteCode(s, key, expiryDate);

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
        revert(0, 0)
      }
    }

    s.setAddress(salt, deployed);
    emit CTokenDeployed(key, deployed, expiryDate);
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
    return ProtoUtilV1.CNAME_CTOKEN_FACTORY;
  }
}
