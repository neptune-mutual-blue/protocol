const validate = async (code) => {
  if (code.toLowerCase().indexOf('subtract') === -1 && code.toLowerCase().indexOf('@suppress-subtraction') === -1) {
    return '\x1b[31m' + '* Warning: Please ensure this subtraction does not result in an underflow.' + '\x1b[0m'
  }

  return null
}

module.exports = validate
