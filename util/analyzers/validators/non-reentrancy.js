const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  if ((name || '').split('/').indexOf('libraries') > -1) {
    return null
  }

  const suppressionMissing = code.toLowerCase().indexOf('@suppress-reentrancy') === -1 && code.toLowerCase().indexOf('@custom:suppress-reentrancy') === -1

  if (code.indexOf('nonReentrant') === -1 && suppressionMissing) {
    return '\x1b[31m' + '* Non Reentrancy logic not found. Are you sure this function should be publicly accessible?' + '\x1b[0m'
  }

  return null
}

module.exports = validate
