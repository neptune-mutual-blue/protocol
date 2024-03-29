const hre = require('hardhat')
const binance = require('../dedicated/binance')
const ethereum = require('../../config/deployments/ethereum.json')
const ipfs = require('../../../util/ipfs')
const { getNetworkInfo } = require('../../../util/network')
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
    console.info('Approving the cover contract to spend %s tokens', helper.weiAsToken(cover.stakeWithFee, 'NPM'))
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
  const balances = []
  const signer = await getSigner(process.env.COVER_CREATOR)
  const cover = binance

  const contracts = await getContracts()
  balances.push(await ethers.provider.getBalance(signer.address || signer._address))

  console.log('\n')

  console.log('Signer [%s]: %s/address/%s', helper.weiAsToken(balances[0], 'ETH'), hre.network.config.explorer, signer.address ?? signer._address)

  await approve(contracts, cover)

  const info = await ipfs.write(cover)

  const args = { info, ...cover }

  console.info('Adding a new cover %s', args.coverName)
  const tx = await contracts.cover.addCover(args)
  console.log('Created the cover %s: %s/tx/%s', cover.coverName, hre.network.config.explorer, tx.hash)

  console.log('-'.repeat(128))

  balances.push(await ethers.provider.getBalance(signer.address || signer._address))
  const [previous, current] = balances

  console.info('Balance: %s. Gas cost: %s', helper.weiAsToken(current, 'ETH'), helper.weiAsToken(previous.sub(current), 'ETH'))
}

module.exports = { deploy }
