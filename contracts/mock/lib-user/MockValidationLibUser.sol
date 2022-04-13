// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../libraries/ValidationLibV1.sol";

contract MockValidationLibUser {
  using ValidationLibV1 for IStore;
  IStore public s;

  constructor(IStore store) {
    s = store;
  }

  function senderMustBePolicyManagerContract() external view {
    s.senderMustBePolicyManagerContract();
  }

  function senderMustBeGovernanceContract() external view {
    s.senderMustBeGovernanceContract();
  }

  function senderMustBeClaimsProcessorContract() external view {
    s.senderMustBeClaimsProcessorContract();
  }

  function senderMustBeStrategyContract() external view {
    s.senderMustBeStrategyContract();
  }

}
