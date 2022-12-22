const hre = require('hardhat')
const okx = require('../dedicated/okx')
const ethereum = require('../../config/deployments/ethereum.json')
const ipfs = require('../../../util/ipfs')
const { getNetworkInfo } = require('../../../util/network')
const { weiAsToken } = require('../../../util/helper')
const ruler = () => console.log('-'.repeat(128))

const printer = []

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

  const balance = await npm.balanceOf(signer._address)
  const wei = await ethers.provider.getBalance(signer._address)

  printer.push(['Signer', signer._address])
  printer.push(['ETH Balance', weiAsToken(wei, 'ETH')])
  printer.push(['NPM Balance', weiAsToken(balance, 'NPM')])

  return { cover, npm }
}

const approve = async (contracts, cover) => {
  try {
    console.info('Approving the cover contract to spend %s tokens', weiAsToken(cover.stakeWithFee, 'NPM'))
    const tx = await contracts.npm.approve(contracts.cover.address, cover.stakeWithFee)
    console.log('Approval: %s/tx/%s', hre.network.config.explorer, tx.hash)
  } catch (error) {
    console.error('Error approving Signer\'s NPM tokens to the cover address')
    throw error
  }
}

const addCover = async (cover, contracts, info) => {
  try {
    console.info('Adding a new cover %s', cover.coverName)
    const tx = await contracts.cover.addCover({ info, ...cover })
    console.log('Created the cover %s: %s/tx/%s', cover.coverName, hre.network.config.explorer, tx.hash)
  } catch (error) {
    console.error('Error deploying the cover')
    throw error
  }
}

const deploy = async () => {
  try {
    const cover = okx

    const contracts = await getContracts()
    const info = await ipfs.write(cover)

    console.log('\n')

    printer.push(['Cover Contract', contracts.cover.address])
    printer.push(['Stake with Fee', weiAsToken(cover.stakeWithFee, 'NPM')])
    printer.push(['Cover Info', `https://ipfs.io/ipfs/${info}`])

    printer.map(x => console.log(x.join(': ')))
    ruler()

    await approve(contracts, cover)

    ruler()

    await addCover(cover, contracts, info)

    ruler()
  } catch (error) {
    console.error('Failed to deploy the OKX cover.')
    console.error('\n')
    console.error(error)
  }
}

module.exports = { deploy }
