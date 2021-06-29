const key = require('./key')

const getStoreAddressCustom = async (store, namespace, coverKey) => await store.getAddress(key.getCoverContractKey(namespace, coverKey))
const getVaultAddress = async (store, coverKey) => await store.getAddress(key.getCoverContractKey(key.NS.COVER_VAULT, coverKey))
const getAssuranceVaultAddress = async (store) => await store.getAddress(key.encodeKey(key.NS.ASSURANCE_VAULT))

module.exports = {
  getStoreAddressCustom,
  getAssuranceVaultAddress,
  getVaultAddress
}
