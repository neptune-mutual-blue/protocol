const js = require('./template-js')
const ts = require('./template-ts')

const get = (type) => {
  if (type === 'ts') {
    return ts
  }

  return js
}

module.exports = { get }
