const Enumerable = require('node-enumerable')

const generate = async (all) => {
  Enumerable.from(all)
    .orderBy(x => x.prefix)
    .thenBy(x => x.key)
    .each(c => {
      const comment = c.comment ? ` // ${c.comment}` : ''
      console.info(`export const ${c.prefix}${c.key} = toBytes32("${c.value}");${comment}`)
    })
}

module.exports = { generate }
