const io = require('../../io')

const extractPair = (match, scope, prefix, type) => {
  const parts = match.replace('bytes32 public constant ', '').split('=')
  let [key, contents] = parts

  let [value, comment] = contents.trim().split(';')

  key = key.trim().replace(prefix, '')
  value = value.replace(/"/g, '').trim()
  comment = (comment || '').replace('//', '').trim()

  return { scope, prefix, key, value, comment, type }
}

const process = async (file) => {
  const { type, scope, prefix, expression, src } = file
  const contents = await io.readFile(src)
  const matches = contents.match(expression)

  return matches.map(x => extractPair(x.trim(), scope, prefix, type))
}

module.exports = { process }
