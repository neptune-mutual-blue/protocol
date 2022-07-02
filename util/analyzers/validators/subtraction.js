const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  const suppressionMissing = code.toLowerCase().indexOf('@suppress-subtraction') === -1 && code.toLowerCase().indexOf('@custom:suppress-subtraction') === -1

  if (code.toLowerCase().indexOf('subtract') > -1 && suppressionMissing) {
    return '\x1b[31m' + '* Warning: Please ensure this subtraction does not result in an underflow.' + '\x1b[0m'
  }

  if (code.toLowerCase().indexOf(' - ') > -1 && suppressionMissing) {
    return '\x1b[31m' + '* Warning: Please ensure this subtraction does not result in an underflow.' + '\x1b[0m'
  }

  return null
}

module.exports = validate
