const cp = require('child_process')
const {AutoLanguageClient} = require('atom-languageclient')

class SwiftLanguageClient extends AutoLanguageClient {
  getGrammarScopes() { return [ 'source.swift' ] }
  getLanguageName() { return 'Swift' }
  getServerName() { return 'Swift Language Server' }

  constructor() {
      super()

      this.statusElement = document.createElement('span')
      this.statusElement.className = 'inline-block'
  }

  startServerProcess() {
    // Currently, this only supports macOS
    if (process.platform !== 'darwin') {
      throw Error(`${this.getServerName()} is not supported on ${process.platform}`)
    }

    // TODO: Install the server if needed

    // const command = '/usr/local/bin/langserver-swift'
    const command = '/Users/michael/Library/Developer/Xcode/DerivedData/langserver-swift-egdjirsiwtmyyphdmvvjexrbqxed/Build/Products/Debug/LanguageServer'
    this.logger.debug(`starting ${command}`)
    const childProcess = cp.spawn(command, [], {})
    childProcess.on('exit', exitCode => {
      if (!childProcess.killed) {
        atom.notifications.addError(`${this.getServerName()} stopped unexpectedly.`, {
          dismissable: true,
          description: this.processStdErr ? `<code>${this.processStdErr}</code>` : `Exit code ${exitCode}`
        })
      }
      this.updateStatusBar('Stopped')
    })

    this.updateStatusBar('Started')

    return childProcess
  }

  consumeStatusBar(statusBar) {
    this.statusTile = statusBar.addRightTile({ item: this.statusElement, priority: 1000 })
  }

  updateStatusBar(text) {
      this.statusElement.textContent = `${this.name} ${text}`
  }
}

module.exports = new SwiftLanguageClient()
