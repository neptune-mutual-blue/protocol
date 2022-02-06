const path = require('path')
const fs = require('fs').promises
const io = require('../io')
const validators = require('./validators')

const getFileList = async () => io.findFiles('json', path.join(process.cwd(), 'artifacts', 'build-info'))
const getArtifact = async () => (await Promise.all((await getFileList()).map(async (x) => ({ name: x, stat: await fs.stat(x) })))).sort((a, b) => b.stat.ctime - a.stat.ctime)[0].name

const parse = async (file) => {
  return JSON.parse(await io.readFile(file))
}

const findNodesHavingKey = (object, key, value) => {
  const result = []

  const walk = (o) => {
    if (!o) {
      return
    }

    if ((!!Object.getOwnPropertyDescriptor(o, key) && o[key] === value)) {
      result.push(o)
    }

    const properties = Object.keys(o)

    for (const i in properties) {
      const property = o[properties[i]]
      const type = typeof property

      type === 'object' && walk(property)
      type instanceof Array && property.forEach(x => walk(x))
    }
  }

  walk(object)
  return result
}

const validate = async (name, code, selector) => {
  const warnings = []

  for (const validator of validators) {
    const result = await validator(code, selector, name)

    if (result) {
      warnings.push(result)
    }
  }

  if (warnings.length) {
    console.log('/*')
    console.log('\x1b[36m' + '* Path:', name + '\x1b[0m')

    console.log(`\x1b[31m* ${warnings.length} warning(s) found \x1b[0m`)
    warnings.forEach(x => console.log(x))

    console.log('*/')

    console.log(code, '\n')
  }

  return warnings.length || 0
}

const findNonReadableFunctions = (nodes) => nodes.filter(x =>
  ['public', 'external'].indexOf(x.visibility || '') > -1 &&
      ['view', 'pure'].indexOf(x.stateMutability) === -1
)

const checkIfIgnored = (name) => {
  const ignored = ['StoreKeyUtil.sol', 'Store.sol', 'Fake', 'Migrations.sol']

  if (!name.startsWith('contracts/')) {
    return true
  }

  for (const i in ignored) {
    const term = ignored[i]
    if (name.toLowerCase().indexOf(term.toLowerCase()) > -1) {
      return true
    }
  }

  return false
}

const begin = async () => {
  const artifact = await getArtifact()
  const parsed = await parse(artifact)

  let count = 0
  let warningCount = 0

  for (const name in parsed.output.sources) {
    const contract = parsed.output.sources[name]
    const contractNode = contract.ast.nodes.filter(x => ['contract', 'library'].indexOf(x.contractKind) > -1)

    const nodes = findNodesHavingKey(contractNode, 'nodeType', 'FunctionDefinition')
    const filtered = findNonReadableFunctions(nodes)

    if (!filtered) {
      continue
    }

    for (const i in filtered) {
      const node = filtered[i]

      const { functionSelector } = node
      const selector = findNodesHavingKey(contractNode, 'functionSelector', functionSelector)[0]

      if (!selector) {
        continue
      }

      const source = parsed.input.sources[name]
      const [start, length] = selector.src.split(':')
      const code = source.content.substr(start, length)

      if (checkIfIgnored(name)) {
        continue
      }

      const warnings = await validate(name, code, selector)
      count++
      warningCount += warnings
    }
  }

  console.log('/* %d functions update the state */', count)
  console.log('/* %d functions with warnings */', warningCount)
  console.log('/* ---------------------------------------------------------- */')
}

console.log('pragma confuse vscode to suppress warnings')
console.log('\n\x1b[1m' + '/* List of contract functions that update the state */' + '\x1b[0m')
console.log('/* ---------------------------------------------------------- */\n')

begin()
