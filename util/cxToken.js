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
      CoverUtilV1: libraries.coverUtilV1.address,
      GovernanceUtilV1: libraries.governanceUtilV1.address,
      PolicyHelperV1: libraries.policyHelperV1.address,
      ProtoUtilV1: libraries.protoUtilV1.address,
      ValidationLibV1: libraries.validationLibV1.address

    }
  })

  return cxToken.attach(at)
}

module.exports = { atAddress }
