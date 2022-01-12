// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../base/MockStore.sol";
import "../base/MockProtocol.sol";
import "./MockVault.sol";
import "../../libraries/ProtoUtilV1.sol";

contract MockProcessorStore is MockStore {
  function initialize(bytes32 key, address cxToken) public returns (address[] memory values) {
    MockProtocol protocol = new MockProtocol();
    MockVault vault = new MockVault();

    this.setAddress(ProtoUtilV1.CNS_CORE, address(protocol));

    super.setBool(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken);
    super.setBool(ProtoUtilV1.NS_MEMBERS, cxToken);
    super.setUint(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, key, 1234);

    super.setBool(ProtoUtilV1.NS_MEMBERS, address(vault));
    super.setAddress(ProtoUtilV1.NS_CONTRACTS, "cns:cover:vault", key, address(vault));

    setCoverStatus(key, 4);
    setClaimBeginTimestamp(key, block.timestamp - 100 days); // solhint-disable-line
    setClaimExpiryTimestamp(key, block.timestamp + 100 days); // solhint-disable-line

    values = new address[](2);

    values[0] = address(protocol);
    values[1] = address(vault);
  }

  function disassociateCxToken(address cxToken) public {
    super.unsetBool(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken);
  }

  function setCoverStatus(bytes32 key, uint256 value) public {
    super.setUint(ProtoUtilV1.NS_COVER_STATUS, key, value);
  }

  function setClaimBeginTimestamp(bytes32 key, uint256 value) public {
    super.setUint(ProtoUtilV1.NS_CLAIM_BEGIN_TS, key, value);
  }

  function setClaimExpiryTimestamp(bytes32 key, uint256 value) public {
    super.setUint(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, value);
  }
}
