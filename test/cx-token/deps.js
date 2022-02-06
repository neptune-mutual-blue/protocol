const composer = require('../../util/composer')
const cache = null

/**
 * Deploys all libraries
 * @return {Promise<{dependencies: Object, all: Libraries}>}
 */
const deployDependencies = async () => {
  const all = await composer.libs.deployAll(cache)

  return {
    dependencies: {
      AccessControlLibV1: all.accessControlLibV1.address,
      BaseLibV1: all.baseLibV1.address,
      ValidationLibV1: all.validationLib.address
    },
    all
  }
}

module.exports = { deployDependencies }
