/**
 * Gets cxToken from an address
 * @param {string} at Address where your cxToken is deployed
 * @param {Libraries} libraries The deployed libraries
 */
const atAddress = async (at, libraries) => {
  const cxToken = await ethers.getContractFactory('cxToken', {
    libraries: {
      AccessControlLibV1: libraries.accessControlLibV1.address,
      BaseLibV1: libraries.baseLibV1.address,
      ValidationLibV1: libraries.validationLib.address
    }
  })

  return cxToken.attach(at)
}

module.exports = { atAddress }
