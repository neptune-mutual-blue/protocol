const key = require('./key')

const getStoreAddressCustom = async (store, namespace, coverKey) => store.getAddress(key.getCoverContractKey(namespace, coverKey))
const getReassuranceVaultAddress = async (store) => store.getAddress(key.PROTOCOL.CNS.REASSURANCE_VAULT)
const getVaultAddress = async (store, coverKey) => store.getAddress(key.encodeKeys(['bytes32', 'bytes32', 'bytes32'], [key.PROTOCOL.NS.CONTRACTS, key.PROTOCOL.CNS.COVER_VAULT, coverKey]))

module.exports = {
  getStoreAddressCustom,
  getReassuranceVaultAddress,
  getVaultAddress
}
