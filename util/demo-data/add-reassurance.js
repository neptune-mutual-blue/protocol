const { covers } = require('../../examples/dedicated')
const { ether, getRandomNumber, weiAsToken, STABLECOIN_DECIMALS } = require('../helper')
const { approve } = require('../contract-helper/erc20')
const faucet = require('../contract-helper/faucet')
const PRECISION = STABLECOIN_DECIMALS

const add = async (coverKey, payload) => {
  const [owner] = await ethers.getSigners() // eslint-disable-line
  const amount = ether(getRandomNumber(250_000, 5_000_000), PRECISION)

  const { dai, reassuranceContract } = payload

  await faucet.request(dai, amount)

  await approve(dai.address, reassuranceContract.address, owner, amount)

  await reassuranceContract.connect(owner).addReassurance(coverKey, owner.address, amount)

  console.info('Added %s to the reassurance vault.', weiAsToken(amount, 'DAI', PRECISION))
}

const addReassurance = async (payload) => {
  for (const i in covers) {
    const { key, coverName } = covers[i]

    console.info('Adding reassurance to %s', coverName)
    await add(key, payload)
  }
}

module.exports = { addReassurance }
