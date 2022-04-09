// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../libraries/RegistryLibV1.sol";

contract MockRegistryClient {
  using RegistryLibV1 for IStore;
  IStore public s;

  constructor(IStore store) {
    s = store;
  }

  function getGovernanceContract() external view returns (IGovernance) {
    return s.getGovernanceContract();
  }

  function getPolicyContract() external view returns (IPolicy) {
    return s.getPolicyContract();
  }

  function getBondPoolContract() external view returns (IBondPool) {
    return s.getBondPoolContract();
  }
}
