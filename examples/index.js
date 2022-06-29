const dedicated = require('./dedicated')
const diversified = require('./diversified')

const covers = [
  ...dedicated.covers,
  ...diversified.covers
]

const { products } = diversified

module.exports = { covers, products, dedicated, diversified }
