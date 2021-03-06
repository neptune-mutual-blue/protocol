// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../base/MockStore.sol";
import "../base/MockProtocol.sol";
import "./MockVault.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../fakes/FakePriceOracle.sol";

library MockProcessorStoreLib {
  function initialize(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken,
    uint256 incidentDate
  ) external returns (address[] memory values) {
    MockProtocol protocol = new MockProtocol();
    MockVault vault = new MockVault();
    FakePriceOracle oracle = new FakePriceOracle();

    s.setAddress(ProtoUtilV1.CNS_CORE, address(protocol));
    s.setAddress(ProtoUtilV1.CNS_COVER_STABLECOIN, cxToken);
    s.setAddress(ProtoUtilV1.CNS_NPM_PRICE_ORACLE, address(oracle));

    s.setBool(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken);
    s.setBool(ProtoUtilV1.NS_MEMBERS, cxToken);
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, productKey)), incidentDate);

    s.setBool(ProtoUtilV1.NS_MEMBERS, address(vault));
    s.setAddress(ProtoUtilV1.NS_CONTRACTS, "cns:cover:vault", coverKey, address(vault));

    setProductStatus(s, coverKey, productKey, incidentDate, 4);
    setClaimBeginTimestamp(s, coverKey, productKey, block.timestamp - 100 days); // solhint-disable-line
    setClaimExpiryTimestamp(s, coverKey, productKey, block.timestamp + 100 days); // solhint-disable-line

    values = new address[](2);

    values[0] = address(protocol);
    values[1] = address(vault);
  }

  function disassociateCxToken(MockStore s, address cxToken) external {
    s.unsetBool(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken);
  }

  function setProductStatus(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 value
  ) public {
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_STATUS, coverKey, productKey, incidentDate)), value);
  }

  function setClaimBeginTimestamp(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) public {
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_CLAIM_BEGIN_TS, coverKey, productKey)), value);
  }

  function setClaimExpiryTimestamp(
    MockStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) public {
    s.setUint(keccak256(abi.encodePacked(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey)), value);
  }
}

contract MockProcessorStore is MockStore {
  function initialize(
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken,
    uint256 incidentDate
  ) external returns (address[] memory values) {
    return MockProcessorStoreLib.initialize(this, coverKey, productKey, cxToken, incidentDate);
  }

  function disassociateCxToken(address cxToken) external {
    MockProcessorStoreLib.disassociateCxToken(this, cxToken);
  }

  function setProductStatus(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 value
  ) external {
    MockProcessorStoreLib.setProductStatus(this, coverKey, productKey, incidentDate, value);
  }

  function setClaimBeginTimestamp(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) external {
    MockProcessorStoreLib.setClaimBeginTimestamp(this, coverKey, productKey, value);
  }

  function setClaimExpiryTimestamp(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 value
  ) external {
    MockProcessorStoreLib.setClaimExpiryTimestamp(this, coverKey, productKey, value);
  }
}
