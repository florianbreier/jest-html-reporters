const fs = require("fs");
const path = require('path')
const {addAttach, getAttachDir, setAttachDir, getTempDir, setTempDir, readAttachInfos} = require('./helper')

const localTemplatePath = path.resolve(__dirname, './dist/index.html')

function mkdirs(dirpath) {
  if (!fs.existsSync(path.dirname(dirpath))) {
    mkdirs(path.dirname(dirpath))
  }
  fs.mkdirSync(dirpath)
}

function imgToBase64(imgPath) {
  const fileName = path.resolve(imgPath)
  if (fs.statSync(fileName).isFile()) {
    const fileData = fs.readFileSync(fileName).toString('base64')
    return `data:image/${fileName.split('.').pop()};base64,${fileData}`
  }
  return undefined
}

// for #32
const getCustomInfosFromEnv = () => {
  const { JEST_HTML_REPORTERS_CUSTOM_INFOS } = process.env
  if (JEST_HTML_REPORTERS_CUSTOM_INFOS) {
    try {
      const infos = JSON.parse(JEST_HTML_REPORTERS_CUSTOM_INFOS)
      if (infos) {
        return Object.entries(infos).map(([key, value]) => ({ title: key, value }))
      }
    } catch (err) {
      console.warn('the value of Custom info env must be a json string')
    }
  }
  return undefined
}

// my-custom-reporter.js
class Reporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
    this.init()
  }

  async onRunComplete(contexts, results) {
    const {
      publicPath = process.cwd(),
      filename = 'jest_html_reporters.html',
      logoImgPath,
      customInfos = getCustomInfosFromEnv(),
    } = this._options
    const logoImg = logoImgPath ? imgToBase64(logoImgPath) : undefined
    results.config = this._globalConfig
    results.endTime = Date.now()
    results._reporterOptions = { ...this._options, logoImg, customInfos }
    results.attachInfos = await readAttachInfos(publicPath)
    fs.existsSync(publicPath) === false && publicPath && mkdirs(publicPath)

    const data = JSON.stringify(results)
    const filePath = path.resolve(publicPath, filename)
    // fs.writeFileSync('./src/devMock.json', data)
    const htmlTemplate = fs.readFileSync(localTemplatePath, 'utf-8')
    const outPutContext = htmlTemplate
        .replace('$resultData', JSON.stringify(data))
    fs.writeFileSync(filePath, outPutContext, 'utf-8')
    this.removeTempDir()
    console.log('📦 reporter is created on:', filePath)
  }

  init() {
    setTempDir(this._options.tempDir);
    setAttachDir(this._options.attachDir);
    this.initAttachDir()
  }

  initAttachDir() {
    this.removeTempDir()
    this.removeAttachDir()
    fs.mkdirSync(getTempDir(), {recursive: true})
    fs.mkdirSync(getAttachDir(), {recursive: true})
  }

  removeTempDir() {
    fs.rmdirSync(getTempDir(), {recursive: true})
  }

  removeAttachDir() {
    fs.rmdirSync(getAttachDir(), {recursive: true})
  }
}

Reporter.addAttach = addAttach;
module.exports = Reporter
