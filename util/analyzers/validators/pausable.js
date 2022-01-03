const validate = async (code) => {
  if (code.toLowerCase().indexOf('pause') === -1 && code.toLowerCase().indexOf('@suppress-pausable') === -1) {
    return '\x1b[31m' + '* Pausable logic not found' + '\x1b[0m'
  }

  return null
}

module.exports = validate
