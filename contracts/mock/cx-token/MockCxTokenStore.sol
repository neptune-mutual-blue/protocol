// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../base/MockStore.sol";
import "../base/MockProtocol.sol";
import "../../libraries/ProtoUtilV1.sol";

contract MockCxTokenStore is MockStore {
  function initialize() public returns (address) {
    MockProtocol protocol = new MockProtocol();
    this.setAddress(ProtoUtilV1.CNS_CORE, address(protocol));

    return address(protocol);
  }

  function registerPolicyContract(address policy) public {
    super.setAddress(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.CNS_COVER_POLICY, policy);
  }
}
