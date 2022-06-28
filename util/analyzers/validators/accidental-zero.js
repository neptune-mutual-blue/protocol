const { isLib } = require('./lib')
const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isLib(name) || isMock(name)) {
    return null
  }

  const supressionMissing = code.toLowerCase().indexOf('@suppress-accidental-zero') === -1
  const hasLogic = code.toLowerCase().indexOf('> ') > -1 || code.toLowerCase().indexOf('>= ') > -1 || code.toLowerCase().indexOf('< ') > -1 || code.toLowerCase().indexOf('<= ') > -1

  if (supressionMissing && hasLogic) {
    return '\x1b[31m' + '* Warning: Ensure that either of these values are not unassigned or accidentally zero' + '\x1b[0m'
  }

  return null
}

module.exports = validate
