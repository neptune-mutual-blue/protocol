const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  const hasPausable = code.toLowerCase().indexOf('pause') > -1
  const isLibrary = (name || '').split('/').indexOf('libraries') > -1
  const suppressionMissing = code.toLowerCase().indexOf('@suppress-pausable') === -1 && code.toLowerCase().indexOf('@custom:suppress-pausable') === -1

  if (!(hasPausable || isLibrary) && suppressionMissing) {
    return '\x1b[31m' + '* Pausable logic not found' + '\x1b[0m'
  }

  return null
}

module.exports = validate
