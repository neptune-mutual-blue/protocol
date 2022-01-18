const Enumerable = require('node-enumerable')
const files = require('./requirement')
const codegen = require('./code-generator')
const codegenAs = require('./code-generator-as')
const processor = require('./processor')
const template = require('./template')
const [, , type] = process.argv

const start = async () => {
  const candidates = []
  const mode = type && type.replace('--', '')
  const { pre, post } = template.get(mode)

  console.log(pre)
  console.log('\n')

  for (const i in files) {
    const result = await processor.process(files[i])
    candidates.push(...result)
  }

  if (mode === 'as') {
    await codegenAs.generate(candidates)
    return
  }

  Enumerable.from(candidates)
    .groupBy(x => x.scope)
    .each(async (scope) => codegen.generate(scope.key, scope.toArray()))

  const scopes = Enumerable.from(candidates).select(x => x.scope).distinct().toArray().join(', ')

  console.log(post.replace('{{scopes}}', scopes))
}

start()
