const path = require('path')
const fs = require('fs').promises
const {
  FormatTypes,
  Interface
} = require('@ethersproject/abi')

const { exists, findFiles, writeFile, ensureFile } = require('../io')

const srcAbiFolder = path.resolve('.', process.argv[2])
const targetFile = path.resolve('.', process.argv[3])

if (!exists(srcAbiFolder)) {
  throw Error('Invalid ABI directory')
}

const generateFileContents = async () => {
  const files = await findFiles('json', srcAbiFolder)

  if (files.length === 0) {
    throw Error('No ABIs found')
  }

  const contents = []
  const exportedVariables = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    const variable = path.parse(file).name
    const abi = await fs.readFile(file)
    try {
      const iface = new Interface(abi.toString())

      // abi constant declaration
      contents.push(
        `const ${variable} = ${JSON.stringify(iface.format(FormatTypes.full), null, 2)}`
      )
    } catch (error) {
      console.error('Invalid ABI %s', file, error)
    }

    exportedVariables.push(variable)
  }

  // export statement
  contents.push(`export {\n  ${exportedVariables.join(',\n  ')}\n}`)

  return contents.join('\n\n')
}

async function main () {
  console.log('Generating abi:js from %s', srcAbiFolder)
  const contents = await generateFileContents()

  await ensureFile(targetFile)
  await writeFile(targetFile, contents)
  console.log('Generated: %s', targetFile)
}

main()
