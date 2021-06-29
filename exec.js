/* Credits to Vladimir Tolstikov
https://blog.cloudboost.io/node-js-writing-shell-scripts-using-modern-javascript-instead-of-bash-774e0859f965
*/

/**
 * Executes shell command as it would happen in BASH script
 * @param {string} command
 * @param {Object} [options] Object with options. Set `capture` to TRUE, to capture and return stdout.
 *                           Set `echo` to TRUE, to echo command passed.
 * @returns {Promise<{code: number, data: string | undefined, error: Object}>}
 */
const exec = function (command, { capture = false, echo = false } = {}) {
  if (echo) {
    console.log(command)
  }

  const spawn = require('child_process').spawn
  const childProcess = spawn('bash', ['-c', command], { stdio: capture ? 'pipe' : 'inherit' })

  return new Promise((resolve, reject) => {
    let stdout = ''

    if (capture) {
      childProcess.stdout.on('data', (data) => {
        stdout += data
      })
    }

    childProcess.on('error', function (error) {
      reject(error)
    })

    childProcess.on('close', function (code) {
      if (code > 0) {
        reject(new Error('Command failed with code ' + code))
      } else {
        resolve({ code: code, data: stdout })
      }
    })
  })
}

module.exports = { exec }
