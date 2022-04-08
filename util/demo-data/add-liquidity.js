const { covers } = require('../../examples/covers')
const composer = require('../composer')
const { ether, getRandomNumber, weiAsToken } = require('../helper')
const { toBytes32 } = require('../key')
const { approve } = require('../contract-helper/erc20')
const faucet = require('../contract-helper/faucet')

const add = async (coverKey, payload) => {
  const [lp] = await ethers.getSigners() // eslint-disable-line
  const amount = ether(getRandomNumber(250_000, 5_000_000))
  const stake = ether(getRandomNumber(1000, 125_000))

  const { dai, npm } = payload
  const vault = await composer.vault.getVault(payload, coverKey)

  await faucet.request(dai, amount)
  await faucet.request(npm, stake)

  await approve(dai.address, vault.address, lp, amount)
  await approve(npm.address, vault.address, lp, stake)

  await vault.connect(lp).addLiquidity(coverKey, amount, stake, toBytes32(''))

  console.info('Added %s to the vault. Stake: %s', weiAsToken(amount, 'DAI'), weiAsToken(stake, 'NPM'))
}

const addLiquidity = async (payload) => {
  for (const i in covers) {
    const { key, coverName } = covers[i]

    console.info('Adding liquidity to %s', coverName)
    await add(key, payload)
  }
}

module.exports = { addLiquidity }
