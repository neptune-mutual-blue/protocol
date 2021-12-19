// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";

import "../interfaces/IPolicy.sol";
import "../interfaces/ICoverStake.sol";
import "../interfaces/IPriceDiscovery.sol";
import "../interfaces/ICTokenFactory.sol";
import "../interfaces/ICoverAssurance.sol";
import "../interfaces/IGovernance.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IVaultFactory.sol";

library RegistryLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  function getPriceDiscoveryContract(IStore s) public view returns (IPriceDiscovery) {
    return IPriceDiscovery(s.getContract(ProtoUtilV1.NS_PRICE_DISCOVERY));
  }

  function getGovernanceContract(IStore s) public view returns (IGovernance) {
    return IGovernance(s.getContract(ProtoUtilV1.NS_GOVERNANCE));
  }

  function getStakingContract(IStore s) public view returns (ICoverStake) {
    return ICoverStake(s.getContract(ProtoUtilV1.NS_COVER_STAKE));
  }

  function getCTokenFactory(IStore s) public view returns (ICTokenFactory) {
    return ICTokenFactory(s.getContract(ProtoUtilV1.NS_COVER_CTOKEN_FACTORY));
  }

  function getPolicyContract(IStore s) public view returns (IPolicy) {
    return IPolicy(s.getContract(ProtoUtilV1.NS_COVER_POLICY));
  }

  function getAssuranceContract(IStore s) public view returns (ICoverAssurance) {
    return ICoverAssurance(s.getContract(ProtoUtilV1.NS_COVER_ASSURANCE));
  }

  function getVault(IStore s, bytes32 key) public view returns (IVault) {
    address vault = s.getAddressByKeys(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.NS_COVER_VAULT, key);
    return IVault(vault);
  }

  function getVaultFactoryContract(IStore s) public view returns (IVaultFactory) {
    address factory = s.getContract(ProtoUtilV1.NS_COVER_VAULT_FACTORY);
    return IVaultFactory(factory);
  }
}
