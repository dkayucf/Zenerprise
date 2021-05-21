/**
 * @typedef {String} FileName
 * @typedef {String} FilePath
 * @typedef {Object<string, any>} Config
 */

const fileSystem = require('fs')
const path = require('path')
const R = require('ramda')

// data FileName = String
// data FilePath = String
// data Config = Object

/**
 * Transforms the name of a config file into a useable file path.
 * @param {FileName} filename The name of the file
 * @returns {FilePath} The path to the config file
 */
const getFilePath = filename =>
  path.resolve(__dirname, './', `${filename}.json`)

// getConfig :: FileName -> Config
const getConfig = configFile =>
  JSON.parse(fileSystem.readFileSync(getFilePath(configFile), 'utf-8'))

// getSubPathOfConfig :: String -> Config -> String -> ObjectProperty
const getSubPathOfConfig = R.curry((initialProp, configFile, secondaryProp) =>
  R.path([initialProp, secondaryProp], getConfig(configFile))
)

// getEndpoint :: Config -> String -> ObjectProperty
// example call config.getEndpoint('campusfinances', 'relatedLinks')
// example call config.getEndpoint('campusfinances')('relatedLinks')
const getEndpoint = getSubPathOfConfig('endpoints')

// getErrorCode :: Config -> String -> ObjectProperty
const getErrorCode = getSubPathOfConfig('error_codes')

/**
 * Reads a file from the file system and returns a promise with its contents.
 * Will always use utf-8 encoding.
 * @param {FilePath} path
 * @returns {Promise<string>} The contents of the file.
 */
const readFilePromise = path =>
  new Promise((resolve, reject) =>
    fileSystem.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  )

/**
 * Gets a config file as a promise.
 * @example
 * getConfigPromise('transcriptorder')
 *  .then(transcriptOrderConfig => transcriptOrderConfig)
 * @param {FileName} filename
 * @returns {Promise<Config>} A promise containing the requested config. Already parsed as JSON.
 */
const getConfigPromise = R.pipe(getFilePath, readFilePromise, p =>
  p.then(JSON.parse)
)

const sendProperty = R.curry((res, propName, data) =>
  res.send(R.prop(propName, data))
)

// Retrieve a property from a config file and send the response
// res = response object from express
// configName = name of ONE.UF config to use
// propName = name of property to be retrieved and sent
const sendPropertyFromConfig = (res, configName, propName) =>
  getConfigPromise(configName)
    .then(sendProperty(res, propName))
    .catch(e => {
      console.error(e)
    })

module.exports.getFilePath = getFilePath
module.exports.getConfig = getConfig
module.exports.getEndpoint = getEndpoint
module.exports.getErrorCode = getErrorCode
module.exports.readFilePromise = readFilePromise
module.exports.getConfigPromise = getConfigPromise
module.exports.sendPropertyFromConfig = sendPropertyFromConfig
