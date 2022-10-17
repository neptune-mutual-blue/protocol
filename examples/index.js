const diversified = require('./diversified')
const dedicated = require('./dedicated')

const covers = [
  ...diversified.covers,
  ...dedicated
]

const { products } = diversified

module.exports = { covers, diversified, dedicated, products }
