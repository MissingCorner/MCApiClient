import utils from './utils'
const OPTIONAL_REGEX = /^optional!/

export function method(spec) {
  const commandPath = typeof spec.path === 'function' ? spec.path
    : utils.makeURLInterpolator(spec.path || '')
  const requestMethod = (spec.method || 'GET').toUpperCase()
  const urlParams = spec.urlParams || []

  return function () {
    const args = [].slice.call(arguments)

    const callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    const deferred = this.createDeferred(callback)
    const urlData = this.createUrlData()

    const data = typeof args[args.length - 1] === 'object' ? args.pop() : null
    for (let i = 0, l = urlParams.length; i < l; ++i) {
      // Note that we shift the args array after every iteration so this just
      // grabs the "next" argument for use as a URL parameter.
      const arg = args[0]

      let param = urlParams[i]

      const isOptional = OPTIONAL_REGEX.test(param)
      param = param.replace(OPTIONAL_REGEX, '')
      if (!arg && arg !== 0) {
        if (isOptional) {
          urlData[param] = ''
          args.shift()
          continue
        }

        const err = new Error(
          `Bitclub: Argument "${urlParams[i]}" required, but got: ${arg}
          (on API request to ${requestMethod} ${this.path}/${spec.path})`
        )
        deferred.reject(err)
        return deferred.promise
      }

      urlData[param] = args.shift()
    }

    const requestPath = this.createFullPath(commandPath, urlData)
    const requestCallback = (response) => {
      deferred.resolve(
        spec.transformResponseData ? spec.transformResponseData(response) : response
      )
    }
    const errorCallback = (err) => {
      deferred.reject(err)
    }

    // Default auth is required, unless otherwise
    const auth = spec.hasOwnProperty('auth') ? spec.auth : this.authRequired

    const options = spec.options || {}
    this._request(requestMethod, requestPath, data, auth, options)
      .then(requestCallback)
      .catch(errorCallback)

    return deferred.promise
  }
}
export default method
