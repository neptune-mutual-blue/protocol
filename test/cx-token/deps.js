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
      ValidationLibV1: all.validationLib.address,
      BaseLibV1: all.baseLibV1.address
    },
    all
  }
}

module.exports = { deployDependencies }
