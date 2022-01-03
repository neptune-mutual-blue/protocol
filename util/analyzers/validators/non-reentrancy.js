const validate = async (code) => {
  if (code.indexOf('nonReentrant') === -1 && code.toLowerCase().indexOf('@suppress-reentrancy') === -1) {
    return '\x1b[31m' + '* Non Reentrancy logic not found. Are you sure this function should be publicly accessible?' + '\x1b[0m'
  }

  return null
}

module.exports = validate
