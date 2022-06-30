// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../base/MockStore.sol";
import "../base/MockProtocol.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../fakes/FakePriceOracle.sol";

contract MockCxTokenStore is MockStore {
  function initialize() external returns (address) {
    MockProtocol protocol = new MockProtocol();
    FakePriceOracle oracle = new FakePriceOracle();

    this.setAddress(ProtoUtilV1.CNS_CORE, address(protocol));
    this.setAddress(ProtoUtilV1.CNS_NPM_PRICE_ORACLE, address(oracle));

    return address(protocol);
  }

  function registerPolicyContract(address policy) external {
    super.setAddress(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.CNS_COVER_POLICY, policy);
  }
}
