const path = require('path')
const fs = require('fs').promises
const io = require('../io')

const getFileList = async () => io.findFiles('json', path.join(process.cwd(), 'artifacts', 'build-info'))
const getArtifact = async () => (await Promise.all((await getFileList()).map(async (x) => ({ name: x, stat: await fs.stat(x) })))).sort((a, b) => b.stat.ctime - a.stat.ctime)[0].name

const parse = async (file) => {
  const parsed = JSON.parse(await io.readFile(file))
  return parsed
}

const findNodesHavingKey = (object, key, value) => {
  const result = []

  const walk = (object) => {
    if (!object) {
      return
    }

    if ((!!Object.getOwnPropertyDescriptor(object, key) && object[key] === value)) {
      result.push(object)
    }

    const properties = Object.keys(object)

    for (let i = 0; i < properties.length; i++) {
      const property = object[properties[i]]
      const type = typeof property

      type === 'object' && walk(property, result, key, value)
      type instanceof Array && property.forEach(x => walk(x, result, key, value))
    }
  }

  walk(object)
  return result
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

    const filtered = nodes.filter(x =>
      ['public', 'external'].indexOf(x.visibility || '') > -1 &&
      ['view', 'pure'].indexOf(x.stateMutability) === -1
    )

    if (!filtered) {
      continue
    }

    for (let i = 0; i < filtered.length; i++) {
      const warnings = []
      const node = filtered[i]

      const { functionSelector } = node
      const selector = findNodesHavingKey(contractNode, 'functionSelector', functionSelector)[0]

      if (!selector) {
        continue
      }

      const source = parsed.input.sources[name]
      const [start, length] = selector.src.split(':')
      const code = source.content.substr(start, length)

      if (!name.startsWith('contracts/') || name.startsWith('contracts/fake') || name === 'contracts/Migrations.sol') {
        continue
      }

      // console.info(i, filtered.length, name, selector.parameters.parameters.filter(x => x.typeName.name === 'address'))

      const addressArgs = selector.parameters
        .parameters.filter(x => x.typeName.name === 'address' &&
            ['account', 'to', 'from', 'v', 'sendTo'].indexOf(x.name) === -1)

      if (addressArgs.length && code.toLowerCase().indexOf('@suppress-address-trust-issue') === -1) {
        warnings.push('\x1b[31m' + `* Ensure [${addressArgs.map(x => x.name).join(',')}] can be trusted. Ensure this function has AccessControl logic. Ensure you validate address before using.` + '\x1b[0m')
      }

      if (code.indexOf('nonReentrant') === -1 && code.toLowerCase().indexOf('@suppress-reentrancy') === -1) {
        warnings.push('\x1b[31m' + '* Non Reentrancy logic not found. Are you sure this function should be publicly accessible?' + '\x1b[0m')
      }

      if (code.indexOf('AccessControl') === -1 && code.toLowerCase().indexOf('@suppress-acl') === -1) {
        warnings.push('\x1b[31m' + '* Access control logic not found. Are you sure this function should be publicly accessible?' + '\x1b[0m')
      }

      if (code.toLowerCase().indexOf('revert') > -1 && code.toLowerCase().indexOf('@suppress-revert') === -1) {
        warnings.push('\x1b[31m' + '* Ensure that the usage of revert is correct' + '\x1b[0m')
      }

      if (code.toLowerCase().indexOf('pause') === -1 && code.toLowerCase().indexOf('@suppress-pausable') === -1) {
        warnings.push('\x1b[31m' + '* Pausable logic not found' + '\x1b[0m')
      }

      if (code.toLowerCase().indexOf('erc20') > -1) {
        warnings.push('\x1b[31m' + '* Ensure that you validate this ERC-20 token instance if the address came from user input' + '\x1b[0m')
      }

      if (code.toLowerCase().indexOf('todo') > -1 || code.toLowerCase().indexOf('to-do') > -1) {
        warnings.push('\x1b[31m' + '* Warning: complete the todo list' + '\x1b[0m')
      }

      if (code.toLowerCase().indexOf('not implemented') > -1 || code.toLowerCase().indexOf('to-do') > -1) {
        warnings.push('\x1b[31m' + '* Error: implement the missing functionalities' + '\x1b[0m')
      }

      if (warnings.length) {
        console.log('/*')
        console.log('\x1b[36m' + '* Path:', name + '\x1b[0m')

        console.log(`\x1b[31m* ${warnings.length} warning(s) found \x1b[0m`)
        warnings.map(x => console.log(x))

        console.log('*/')

        console.log(code, '\n')
        warningCount++
      }

      count++
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
