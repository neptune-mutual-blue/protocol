const { deployer } = require('../../util')

const deployAll = async () => {
  const dateLib = await deployer.deploy('BokkyPooBahsDateTimeLibrary')
  const storeKeyUtil = await deployer.deploy('StoreKeyUtil')
  const transferLib = await deployer.deploy('NTransferUtilV2')

  const protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
    StoreKeyUtil: storeKeyUtil.address
  })

  const coverUtil = await deployer.deployWithLibraries('CoverUtilV1', {
    StoreKeyUtil: storeKeyUtil.address,
    ProtoUtilV1: protoUtilV1.address
  })

  return {
    storeKeyUtil,
    protoUtilV1,
    coverUtil,
    transferLib,
    dateLib
  }
}

module.exports = { deployAll }
