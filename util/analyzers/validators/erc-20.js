const validate = async (code) => {
  if (code.toLowerCase().indexOf('erc20') > -1) {
    return '\x1b[31m' + '* Ensure that you validate this ERC-20 token instance if the address came from user input' + '\x1b[0m'
  }

  return null
}

module.exports = validate
