const { attach } = require('./attach')

/**
 * Attaches protocol instance to a given address
 * @param {string} address
 * @param {Libraries} libraries
 * @returns {ethers.Contract}
 */
const attacher = async (address, libraries) => {
  return attach('MockProtocol', address, {
    AccessControlLibV1: libraries.accessControlLibV1.address,
    BaseLibV1: libraries.baseLibV1.address,
    ProtoUtilV1: libraries.protoUtilV1.address,
    StoreKeyUtil: libraries.storeKeyUtil.address,
    ValidationLibV1: libraries.validationLibV1.address
  })
}

module.exports = { attach: attacher }
