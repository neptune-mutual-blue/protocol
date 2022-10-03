const { addLiquidity } = require('./add-liquidity')
const { addReassurance } = require('./add-reassurance')

const create = async (payload) => {
  console.info('Creating demo data')
  await addLiquidity(payload)
  await addReassurance(payload)
}

module.exports = { create }
