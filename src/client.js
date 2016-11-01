export const DEFAULT_HOST = 'http://apiv2.bitclubnetwork.com'
export const DEFAULT_PORT = 80
export const BASE_PATH = ''
export const DEFAULT_API_VERSION = null
export const AUTH_REQUIRED_DEFAULT = false

export const DEFAULT_TIMEOUT = 5000

export var USER_AGENT_SERIALIZED = null
export const USER_AGENT = {
  lang: 'node',
  lang_version: process.version,
  platform: process.platform,
  publisher: 'missingcorner',
  uname: null,
}

export const PACKAGE_VERSION = '1.0.0'

let instance = null

class MCApiClient {
  constructor() {
    if (!instance) {
      instance = this
    }

    this._api = {
      token: null,
      host: DEFAULT_HOST,
      port: DEFAULT_PORT,
      basePath: BASE_PATH,
      version: DEFAULT_API_VERSION,
      key: null,
      timeout: DEFAULT_TIMEOUT,
      authRequiredByDefault: AUTH_REQUIRED_DEFAULT,
      agent: null,
      dev: false,

    }

    this.basicMethods = null

    // this.setApiKey(key)
    // this.setApiVersion(version)
    return instance
  }

  setResources(resources) {
    this._resources = resources
    this._prepareResources()
  }

  setHost(host, port, protocol) {
    this._setApiField('host', host)
    if (port) {
      this._setApiField('port', port)
    }
    if (protocol) {
      this._setApiField('protocol', protocol.toLowerCase())
    }
  }

  setBasePath(path) {
    this._setApiField('basePath', path)
  }

  setFullUrl(url) {
    this._setApiField('fullUrl', url)
  }

  setApiVersion(version) {
    this._setApiField('version', version)
  }

  setApiKey(key) {
    this._setApiField('key', key)
  }

  setBasicMethod(methods) {
    this.basicMethods = methods
  }

  setAuthToken(token) {
    if (token) {
      this._setApiField('token', token)
    }
  }

  removeAuthToken() {
    this._setApiField('token', null)
  }

  setTimeout(timeout) {
    this._setApiField(
      'timeout',
      timeout == null ? MCApiClient.DEFAULT_TIMEOUT : timeout
    )
  }

  getApiField(key) {
    return this._api[key]
  }

  _setApiField(key, value) {
    this._api[key] = value
  }

  getClientUserAgent() {
    return new Promise((resolve) => {
      if (MCApiClient.USER_AGENT_SERIALIZED) {
        return resolve(MCApiClient.USER_AGENT_SERIALIZED)
      }
      USER_AGENT_SERIALIZED = JSON.stringify(MCApiClient.USER_AGENT)
      return resolve(MCApiClient.USER_AGENT)
    })
  }

  _prepareResources() {
    for (const name in this._resources) {
      this[name[0].toLowerCase() + name.substring(1)] = new this._resources[name](this)
    }
  }
}

export default new MCApiClient()
