const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  if (code.toLowerCase().indexOf('todo') > -1 || code.toLowerCase().indexOf('to-do') > -1) {
    return '\x1b[31m' + '* Warning: complete the todo list' + '\x1b[0m'
  }

  return null
}

module.exports = validate
