// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../interfaces/IProtocol.sol";
import "../libraries/ProtoUtilV1.sol";
import "../libraries/StoreKeyUtil.sol";
import "./Recoverable.sol";

contract Protocol is IProtocol, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  function initialize(
    address nep,
    address treasury,
    address assuranceVault
  ) external {
    _mustBeOwnerOrProtoOwner();

    require(s.getAddressByKey(ProtoUtilV1.NS_SETUP_NEP) == address(0), "Already initialized");
    require(nep != address(0), "Invalid NEP");
    require(treasury != address(0), "Invalid Treasury");
    require(assuranceVault != address(0), "Invalid Vault");

    s.setAddressByKey(ProtoUtilV1.NS_CORE, address(this));
    s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);
    s.setAddressByKey(ProtoUtilV1.NS_SETUP_NEP, nep);
    s.setAddressByKey(ProtoUtilV1.NS_BURNER, 0x0000000000000000000000000000000000000001);
    s.setAddressByKey(ProtoUtilV1.NS_TREASURY, treasury);
    s.setAddressByKey(ProtoUtilV1.NS_ASSURANCE_VAULT, assuranceVault);
  }

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external override onlyOwner {
    _mustBeUnpaused();

    s.upgradeContract(namespace, previous, current);
    emit ContractUpgraded(namespace, previous, current);
  }

  function addContract(bytes32 namespace, address contractAddress) external override onlyOwner {
    _mustBeUnpaused();

    s.addContract(namespace, contractAddress);
    emit ContractAdded(namespace, contractAddress);
  }

  function removeMember(address member) external override onlyOwner {
    _mustBeUnpaused();

    s.removeMember(member);
    emit MemberRemoved(member);
  }

  function addMember(address member) external override onlyOwner {
    _mustBeUnpaused();

    s.addMember(member);
    emit MemberAdded(member);
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
    return "Neptune Mutual Protocol";
  }
}
