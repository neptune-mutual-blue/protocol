const defi = require('./defi')
const prime = require('./prime')

const covers = [
  defi.cover,
  prime.cover
]

const products = [
  ...defi.products,
  ...prime.products
]

module.exports = { covers, products }
