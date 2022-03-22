const { isLib } = require('./lib')
const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isLib(name) || isMock(name)) {
    return null
  }

  const hasUint = code.toLowerCase().indexOf('uint') > -1
  const supressionMissing = code.toLowerCase().indexOf('@suppress-zero-value-check') === -1
  const hasCheck = code.toLowerCase().indexOf('> ') > -1 || code.toLowerCase().indexOf('>= ') > -1

  if (hasUint && supressionMissing && !hasCheck) {
    return '\x1b[31m' + '* Warning: Ensure that the uint value is not zero' + '\x1b[0m'
  }

  return null
}

module.exports = validate
