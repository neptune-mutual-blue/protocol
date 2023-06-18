const hre = require('hardhat')
const pop = require('../diversified/popular-defi-apps-bnb')
const ethereum = require('../../config/deployments/ethereum.json')
const ipfs = require('../../../util/ipfs')
const { getNetworkInfo } = require('../../../util/network')
const { weiAsToken } = require('../../../util/helper')
const { helper } = require('../../../util')

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

const getContracts = async () => {
  const signer = await getSigner(process.env.COVER_CREATOR)
  const network = await getNetworkInfo()
  const { deployedTokens } = network
  const { deployments } = ethereum[DEPLOYMENT_ID]

  const cover = await getContractInstance(signer, deployments, 'Cover')

  const npm = await attach(signer, deployedTokens.NPM, 'POT', {})

  return { cover, npm }
}

const getSigner = async (impersonate) => {
  const network = await getNetworkInfo()

  if (network.mainnet && network.chainId !== 31337) {
    const [owner] = await ethers.getSigners()
    return owner
  }

  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [impersonate]
  })

  return ethers.provider.getSigner(impersonate)
}

const approve = async (contracts, cover) => {
  try {
    const signer = await getSigner(process.env.COVER_CREATOR)
    console.info('Approving the cover contract to spend %s tokens', weiAsToken(cover.stakeWithFee, 'NPM'))
    const allowance = await contracts.npm.allowance(signer.address || signer._address, contracts.cover.address)

    if (allowance.gte(cover.stakeWithFee)) {
      console.log('Approval not required')
      return
    }

    const tx = await contracts.npm.approve(contracts.cover.address, helper.ether(10_000_000))
    console.log('Approval: %s/tx/%s', hre.network.config.explorer, tx.hash)
  } catch (error) {
    console.error('Error approving Signer\'s NPM tokens to the cover address')
    throw error
  }
}

const deploy = async () => {
  const balances = []
  const { cover, products } = pop

  const contracts = await getContracts()

  const signer = await getSigner(process.env.COVER_CREATOR)
  balances.push(await ethers.provider.getBalance(signer.address || signer._address))

  console.log('\n')
  console.log('Signer [%s]: %s/address/%s', weiAsToken(balances[0], 'ETH'), hre.network.config.explorer, signer.address ?? signer._address)

  console.log('-'.repeat(128))

  await approve(contracts, cover)

  console.log('-'.repeat(128))

  const info = await ipfs.write(cover)

  console.info('Adding a new cover %s', cover.coverName)
  let tx = await contracts.cover.addCover({ info, ...cover })
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

  balances.push(await ethers.provider.getBalance(signer.address || signer._address))
  const [previous, current] = balances

  console.info('Balance: %s. Gas cost: %s', weiAsToken(current, 'ETH'), weiAsToken(previous.sub(current), 'ETH'))
}

module.exports = { deploy }
