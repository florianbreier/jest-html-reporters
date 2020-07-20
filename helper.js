const fs = require('fs-extra')
const path = require('path')

let tempDir = "./temp";
const getTempDir = () => tempDir;
const setTempDir = (val) => tempDir = val || tempDir;

let attachDir = "./jest-html-reporters-attach";
const getAttachDir = () => attachDir;
const setAttachDir = (val) => attachDir = val || attachDir;

/**
 *
 * @param {Buffer | string} attach
 * @param {string} description
 */
const addAttach = async (attach, description) => {
  const {testPath, testName} = getJestGlobalData()
  // type check
  if (typeof attach !== 'string' && !Buffer.isBuffer(attach)) {
    console.error(`[jest-html-reporters]: Param attach error, not a buffer or string, pic ${testName} - ${description} log failed.`)
    return
  }
  const fileName = generateRandomString()
  if (typeof attach === 'string') {
    const attachObject = { testPath, testName, filePath: attach, description }
    await fs.promises.mkdir(`${tempDir}/data/`,{recursive:true});
    await fs.writeJSON(`${tempDir}/data/${fileName}.json`, attachObject)
  }

  if (Buffer.isBuffer(attach)) {
    const path = `${tempDir}/images/${fileName}.jpg`
    try {
      await fs.promises.mkdir(`${tempDir}/images`,{recursive:true});
      await fs.promises.mkdir(`${tempDir}/data`,{recursive:true});
      await fs.writeFile(path, attach)
      const attachObject = { testPath, testName, fileName: `${fileName}.jpg`, description }
      await fs.writeJSON(`${tempDir}/data/${fileName}.json`, attachObject)
    } catch (err) {
      console.error(err)
      console.error(`[jest-html-reporters]: Param attach error, can not save as a image, pic ${testName} - ${description} log failed.`)
    }
  }
}

const getJestGlobalData = () => {
  let testPath = ''
  let currentTestName = ''
  ;[...Object.getOwnPropertySymbols(global)].forEach(key => {
    if (global[key].state && global[key].matchers) {
      const state = global[key].state || {}
      testPath = state.testPath
      currentTestName = state.currentTestName
    }
  })
  return { testPath, testName: currentTestName }
}

const generateRandomString = () => `${Date.now()}${Math.random()}`

const readAttachInfos = async (publicPath) => {
  const result = {}
  try {
    await fs.promises.mkdir(`${tempDir}/data`,{recursive:true});
    await fs.promises.mkdir(`${tempDir}/images`,{recursive:true});
    const attachData = await fs.readdir(`${tempDir}/data`)
    const dataList = await Promise.all(attachData.map(data => fs.readJSON(`${tempDir}/data/${data}`, { throws: false })))
    const outPutDir = path.resolve(publicPath, attachDir)
    const attachFiles = await fs.readdir(`${tempDir}/images`)
    console.log(attachFiles, outPutDir)
    if (attachFiles.length) await fs.copy(`${tempDir}/images`, outPutDir)

    dataList.forEach(attachObject => {
      if (!attachObject) return

      const { testPath, testName, filePath, description, fileName } = attachObject
      if (!result[testPath]) result[testPath] = {}
      if (!result[testPath][testName]) result[testPath][testName] = []

      result[testPath][testName].push({
        filePath: fileName ? path.join(attachDir, fileName) : filePath,
        description,
      })
    })
  } catch (err) {
    console.error(err)
    console.error(`[jest-html-reporters]: parse attach failed!`)
  }

  return result
}


module.exports = {
  addAttach,
  readAttachInfos,
  getTempDir,
  setTempDir,
  getAttachDir,
  setAttachDir,
}
