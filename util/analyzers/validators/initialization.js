const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }
  const suppressionMissing = code.toLowerCase().indexOf('@suppress-initialization') === -1 && code.toLowerCase().indexOf('@custom:suppress-initialization') === -1

  if (code.toLowerCase().indexOf('function initia') > -1 && suppressionMissing) {
    return '\x1b[31m' + '* Ensure that there is access control for this initializer' + '\x1b[0m'
  }

  return null
}

module.exports = validate
