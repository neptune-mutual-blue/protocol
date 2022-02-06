const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  if ((name || '').split('/').indexOf('libraries') > -1) {
    return null
  }

  if (code.indexOf('nonReentrant') === -1 && code.toLowerCase().indexOf('@suppress-reentrancy') === -1) {
    return '\x1b[31m' + '* Non Reentrancy logic not found. Are you sure this function should be publicly accessible?' + '\x1b[0m'
  }

  return null
}

module.exports = validate
