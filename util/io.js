const path = require('path')
const fs = require('fs').promises

const ensureDirectory = async (directory) => {
  try {
    await fs.access(directory)
  } catch {
    await fs.mkdir(directory)
  }
}

const ensureFile = async (file, content = '{}') => {
  try {
    await fs.access(file)
  } catch {
    await ensureDirectory(path.dirname(file))
    await fs.writeFile(file, content)
  }
}

const saveToDisk = async (filePath, contents) => {
  await fs.writeFile(filePath, JSON.stringify(contents, null, 2))
}

const fetchValue = async (cache, key) => {
  if (!cache) {
    return ''
  }

  const { file, id } = cache
  const contents = await fs.readFile(file)
  const parsed = JSON.parse(contents)

  const node = parsed[id]

  if (node && node[key]) {
    return node[key]
  }

  return ''
}

const cacheValue = async (cache, key, value) => {
  if (!cache) {
    return
  }

  const { file, id } = cache
  const contents = await fs.readFile(file)
  const parsed = JSON.parse(contents)

  if (!Object.getOwnPropertyDescriptor(parsed, id)) {
    parsed[id] = {}
  }

  parsed[id][key] = value

  await fs.writeFile(file, JSON.stringify(parsed, null, 2))
}

const readFile = async (filePath) => {
  const data = await fs.readFile(filePath)
  return data.toString()
}

const findFiles = async (extension, directoryName, results = []) => {
  const files = await fs.readdir(directoryName, { withFileTypes: true })

  for (const f of files) {
    const fullPath = path.join(directoryName, f.name)

    if (f.isDirectory()) {
      await findFiles(extension, fullPath, results)
    } else {
      if (fullPath.split('.').pop() === extension) {
        results.push(fullPath)
      }
    }
  }

  return results
}

module.exports = { saveToDisk, ensureDirectory, ensureFile, cacheValue, fetchValue, findFiles, readFile }
