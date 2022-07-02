const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  const suppressionMissing = code.toLowerCase().indexOf('@suppress-revert') === -1 && code.toLowerCase().indexOf('@custom:suppress-revert') === -1

  if (code.toLowerCase().indexOf('revert') > -1 && suppressionMissing) {
    return '\x1b[31m' + '* Ensure that the usage of revert is correct' + '\x1b[0m'
  }

  return null
}

module.exports = validate
