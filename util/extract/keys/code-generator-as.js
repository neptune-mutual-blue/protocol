const Enumerable = require('node-enumerable')

const generate = async (all) => {
  Enumerable.from(all)
    .orderBy(x => x.prefix)
    .thenBy(x => x.key)
    .each(c => {
      const comment = c.comment ? ` // ${c.comment}` : ''
      const value = c.value === '0x00' ? '"0x0000000000000000000000000000000000000010"' : `toBytes32("${c.value}")`
      console.info(`export const ${c.prefix}${c.key} = ${value};${comment}`)
    })
}

module.exports = { generate }
