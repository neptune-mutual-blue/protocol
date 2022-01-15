const Enumerable = require('node-enumerable')
const files = require('./requirement')
const code = require('./code-generator')
const processor = require('./processor')
const template = require('./template')
const [, , type] = process.argv

const start = async () => {
  const candidates = []
  const { pre, post } = template.get(type && type.replace('--', ''))

  console.log(pre)
  console.log('\n')

  for (const i in files) {
    const result = await processor.process(files[i])
    candidates.push(...result)
  }

  Enumerable.from(candidates)
    .groupBy(x => x.scope)
    .each(async (scope) => code.generate(scope.key, scope.toArray()))

  const scopes = Enumerable.from(candidates).select(x => x.scope).distinct().toArray().join(', ')

  console.log(post.replace('{{scopes}}', scopes))
}

start()
