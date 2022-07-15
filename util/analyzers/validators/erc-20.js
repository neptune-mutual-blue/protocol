const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }
  const suppressionMissing = code.toLowerCase().indexOf('@suppress-malicious-erc20') === -1 && code.toLowerCase().indexOf('@custom:suppress-malicious-erc') === -1

  if (code.toLowerCase().indexOf('erc20') > -1 && suppressionMissing) {
    return '\x1b[31m' + '* Ensure that you validate this ERC-20 token instance if the address came from user input' + '\x1b[0m'
  }

  return null
}

module.exports = validate
