const { isMock } = require('./mock')

const validate = async (code, selector, name) => {
  if (isMock(name)) {
    return null
  }

  const addressArgs = selector.parameters
    .parameters.filter(x => x.typeName.name === 'address' &&
            ['account', 'to', 'from', 'v', 'sendTo'].indexOf(x.name) === -1)

  if (addressArgs.length && code.toLowerCase().indexOf('@suppress-address-trust-issue') === -1) {
    return '\x1b[31m' + `* Ensure [${addressArgs.map(x => x.name).join(',')}] can be trusted. Ensure this function has AccessControl logic. Ensure you validate address before using.` + '\x1b[0m'
  }

  return null
}

module.exports = validate
