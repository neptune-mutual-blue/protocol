// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";
import "../interfaces/ICover.sol";
import "../interfaces/IPolicy.sol";
import "../interfaces/IBondPool.sol";
import "../interfaces/ICoverStake.sol";
import "../interfaces/ICxTokenFactory.sol";
import "../interfaces/ICoverReassurance.sol";
import "../interfaces/IGovernance.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IVaultFactory.sol";

library RegistryLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  function getGovernanceContract(IStore s) external view returns (IGovernance) {
    return IGovernance(s.getContractInternal(ProtoUtilV1.CNS_GOVERNANCE, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));
  }

  function getResolutionContract(IStore s) external view returns (IGovernance) {
    return IGovernance(s.getContractInternal(ProtoUtilV1.CNS_GOVERNANCE_RESOLUTION, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));
  }

  function getStakingContract(IStore s) external view returns (ICoverStake) {
    return ICoverStake(s.getContractInternal(ProtoUtilV1.CNS_COVER_STAKE, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));
  }

  function getCxTokenFactory(IStore s) external view returns (ICxTokenFactory) {
    return ICxTokenFactory(s.getContractInternal(ProtoUtilV1.CNS_COVER_CXTOKEN_FACTORY, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));
  }

  function getPolicyContract(IStore s) external view returns (IPolicy) {
    return IPolicy(s.getContractInternal(ProtoUtilV1.CNS_COVER_POLICY, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));
  }

  function getReassuranceContract(IStore s) external view returns (ICoverReassurance) {
    return ICoverReassurance(s.getContractInternal(ProtoUtilV1.CNS_COVER_REASSURANCE, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY));
  }

  function getBondPoolContract(IStore s) external view returns (IBondPool) {
    return IBondPool(getBondPoolAddress(s));
  }

  function getProtocolContract(IStore s, bytes32 cns) public view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_CONTRACTS, cns);
  }

  function getProtocolContract(
    IStore s,
    bytes32 cns,
    bytes32 key
  ) public view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_CONTRACTS, cns, key);
  }

  function getCoverContract(IStore s) external view returns (ICover) {
    address vault = getProtocolContract(s, ProtoUtilV1.CNS_COVER);
    return ICover(vault);
  }

  function getVault(IStore s, bytes32 coverKey) external view returns (IVault) {
    return IVault(getVaultAddress(s, coverKey));
  }

  function getVaultAddress(IStore s, bytes32 coverKey) public view returns (address) {
    address vault = getProtocolContract(s, ProtoUtilV1.CNS_COVER_VAULT, coverKey);
    return vault;
  }

  function getVaultDelegate(IStore s) external view returns (address) {
    address vaultImplementation = getProtocolContract(s, ProtoUtilV1.CNS_COVER_VAULT_DELEGATE);
    return vaultImplementation;
  }

  function getStakingPoolAddress(IStore s) external view returns (address) {
    address pool = getProtocolContract(s, ProtoUtilV1.CNS_STAKING_POOL);
    return pool;
  }

  function getBondPoolAddress(IStore s) public view returns (address) {
    address pool = getProtocolContract(s, ProtoUtilV1.CNS_BOND_POOL);
    return pool;
  }

  function getVaultFactoryContract(IStore s) external view returns (IVaultFactory) {
    address factory = s.getContractInternal(ProtoUtilV1.CNS_COVER_VAULT_FACTORY, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY);
    return IVaultFactory(factory);
  }
}
