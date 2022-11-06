const hre = require('hardhat')
const prime = require('./covers/diversified/prime')
const ethereum = require('./config/deployments/ethereum.json')
const ipfs = require('../util/ipfs')
const { getNetworkInfo } = require('../util/network')
const { weiAsToken } = require('../util/helper')

const { ethers } = hre

const DEPLOYMENT_ID = 6

const attach = async (connectedTo, at, contractName, libraries) => {
  const contract = libraries ? await ethers.getContractFactory(contractName, libraries) : await ethers.getContractFactory(contractName)
  return contract.connect(connectedTo).attach(at)
}

const getContractInstance = async (connectedTo, deployments, contractName) => {
  for (const prop in deployments) {
    const candidate = deployments[prop]
    if (candidate.contractName === contractName) {
      const { data, contractName, address } = candidate
      return attach(connectedTo, address, contractName, data)
    }
  }
}

const getSigner = async (impersonate) => {
  const network = await getNetworkInfo()

  if (network.mainnet) {
    const [owner] = await ethers.getSigners()
    return owner
  }

  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [impersonate]
  })

  return ethers.provider.getSigner(impersonate)
}

const getContracts = async () => {
  const signer = await getSigner(process.env.COVER_CREATOR)
  const network = await getNetworkInfo()
  const { deployedTokens } = network
  const { deployments } = ethereum[DEPLOYMENT_ID]

  const cover = await getContractInstance(signer, deployments, 'Cover')

  const npm = await attach(signer, deployedTokens.NPM, 'POT', {})

  return { cover, npm }
}

const deploy = async () => {
  const { cover, products } = prime

  const contracts = await getContracts()

  console.log('\n')

  console.info('Approving the cover contract to spend %s tokens', weiAsToken(cover.stakeWithFee, 'NPM'))
  let tx = await contracts.npm.approve(contracts.cover.address, cover.stakeWithFee)
  console.log('Approval: %s/tx/%s', hre.network.config.explorer, tx.hash)

  console.log('-'.repeat(128))

  const info = await ipfs.write(cover)

  console.info('Adding a new cover %s', cover.coverName)
  tx = await contracts.cover.addCover({ info, ...cover })
  console.log('Created the cover %s: %s/tx/%s', cover.coverName, hre.network.config.explorer, tx.hash)

  console.log('-'.repeat(128))

  const args = await Promise.all(products.map(async (x) => {
    return {
      coverKey: x.coverKey,
      productKey: x.productKey,
      info: await ipfs.write(x),
      requiresWhitelist: x.requiresWhitelist,
      productStatus: '1',
      efficiency: x.efficiency
    }
  }))

  const productList = products.map(x => x.productName).join(', ')

  console.info('Adding products %s under the cover %s', productList, cover.coverName)
  tx = await contracts.cover.addProducts(args)
  console.log('Created products for %s: %s/tx/%s', cover.coverName, hre.network.config.explorer, tx.hash)

  console.log('-'.repeat(128))
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
