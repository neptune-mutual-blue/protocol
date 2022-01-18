const tas = require('./template-as')
const tjs = require('./template-js')
const tts = require('./template-ts')

const get = (type) => {
  if (type === 'ts') {
    return tts
  }

  if (type === 'as') {
    return tas
  }

  return tjs
}

module.exports = { get }
