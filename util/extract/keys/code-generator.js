const Enumerable = require('node-enumerable')

const generate = async (groupKey, group) => {
  const prefixes = Enumerable.from(group).select(x => x.prefix).distinct().toArray()

  const builder = []
  builder.push(`const ${groupKey} = {`)

  Enumerable.from(group).groupBy(x => x.prefix).each(item => {
    const candidates = item.toArray()

    if (prefixes.length === 1) {
      const code = candidates.map(x => `  ${x.key}: toBytes32('${x.value === '0x00' ? '' : x.value}'),`)
      builder.push(...code)
    } else {
      builder.push(`  ${item.key.slice(0, -1)}: {`)
      const code = candidates.map(x => `    ${x.key}: toBytes32('${x.value === '0x00' ? '' : x.value}'),`)
      builder.push(...code)
      builder.push('  },')
    }
  })

  builder.push('}\n\n')
  console.log(builder.join('\n'))
}

module.exports = { generate }
