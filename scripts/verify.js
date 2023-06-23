const hre = require('hardhat')
const deployment = require('../.deployments/bsc.json')
const io = require('../util/io')
const path = require('path')
const network = 'bsc'
const deploymentId = 6

const ensureDirectory = async () => {
  await io.ensureDirectory(path.join(process.cwd(), '.verify'))
  await io.ensureDirectory(path.join(process.cwd(), '.verify', network))
  await io.ensureDirectory(path.join(process.cwd(), '.verify', network, deploymentId.toString()))
}

const getLibs = async (contract) => {
  const { data, contractName } = contract

  if (data && data.libraries) {
    const file = path.join(process.cwd(), '.verify', network, deploymentId.toString(), `${contractName}.libs.json`)
    await io.writeFile(file, JSON.stringify(data.libraries))

    return `--libraries ${file}`
  }
}

const getContractName = async (contract) => {
  const { contractName } = contract
  const { sourceName } = await hre.artifacts.readArtifact(contractName)

  return `--contract ${sourceName}:${contractName}`
}

const getArguments = async (contract) => {
  const { contractName, constructorArguments } = contract

  if (constructorArguments) {
    const file = path.join(process.cwd(), '.verify', network, deploymentId.toString(), `${contractName}.json`)
    await io.writeFile(file, JSON.stringify(constructorArguments))

    return `--constructor-args ${file}`
  }
}

const start = async () => {
  await ensureDirectory()
  const deployments = deployment[deploymentId].deployments
  const all = ['#!/usr/bin/env bash\nset -e\n']

  for (const name in deployments) {
    const contract = deployments[name]
    const { contractName, address, verified } = contract

    if (verified) {
      continue
    }

    const parts = [`echo Verifying ${contractName} at ${address}\nnpx hardhat verify --network ${network}`]

    parts.push(await getLibs(contract))

    parts.push(address)

    parts.push(await getContractName(contract))

    parts.push(await getArguments(contract))

    const processed = `${parts.map(x => x && x).join(' ')}\n\nsleep 10\nclear\n`

    all.push(processed)
  }

  const file = path.join(process.cwd(), '.verify', network, `${deploymentId}.sh`)
  await io.writeFile(file, all.join('\n'))

  console.info('Run the following commands:\nchmod +x %s\n%s', file, file)
}

start()
