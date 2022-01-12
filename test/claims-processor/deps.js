const composer = require('../../util/composer')
const cache = null

/**
 * Deploys all libraries
 * @return {Promise<{dependencies: Object, all: Libraries}>}
 */
const deployDependencies = async () => {
  const libs = await composer.libs.deployAll(cache)

  return {
    dependencies: {
      BaseLibV1: libs.baseLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      RegistryLibV1: libs.registryLib.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLib.address,
      AccessControlLibV1: libs.accessControlLibV1.address,
      GovernanceUtilV1: libs.governanceLib.address,
      ProtoUtilV1: libs.protoUtilV1.address
    },
    all: libs
  }
}

module.exports = { deployDependencies }
