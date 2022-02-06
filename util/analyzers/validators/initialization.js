const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  if (code.toLowerCase().indexOf('function initiali') > -1 && code.toLowerCase().indexOf('@suppress-initialization') === -1) {
    return '\x1b[31m' + '* Ensure that there is access control for this initializer' + '\x1b[0m'
  }

  return null
}

module.exports = validate
