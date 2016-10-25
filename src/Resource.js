/**
 * creboard_v2
 * BitclubResources
 *
 * Created by Nhan Dang on 8/6/16.
 */

import path from 'path'
import utils from './utils'
import Promise from 'bluebird'
import { PACKAGE_VERSION } from './client'
import basicMethods from './Method.basic'

import fetch from 'isomorphic-fetch'

export default class Resource {
  constructor(client, urlData) {
    this._client = client
    this._urlData = urlData || {}
    this.basePath = utils.makeURLInterpolator(client.getApiField('basePath'));
    this.path = utils.makeURLInterpolator('')

    this.overridePort = null
    this.overrideHost = null
    this.overrideFullUrl = null

    this.requestDataProcessor = null
  }

  createDeferred(callback) {
    const defer = () => {
      let resolve = null
      let reject = null
      const promise = new Promise((...arg) => {
        resolve = arg[0]
        reject = arg[1]
      })
      return {
        resolve,
        reject,
        promise,
      }
    }

    const deferred = defer()

    if (callback) {
      // Callback, if provided, is a simply translated to Promise'esque:
      // (Ensure callback is called outside of promise stack)
      deferred.promise.then((res) => {
        setTimeout(() => {
          callback(null, res)
        }, 0)
      }, (err) => {
        setTimeout(() => {
          callback(err, null)
        }, 0)
      })
    }
    return deferred
  }

  createUrlData() {
    return { ...this._urlData }
  }

  createFullPath(commandPath, urlData) {
    const host = this.overrideHost || this._client.getApiField('host')
    const port = this.overridePort || this._client.getApiField('port')
    const fullUrl = this.overrideFullUrl || this._client.getApiField('fullUrl')

    const resourcePath = utils.makeURLInterpolator(this.path)
    const uri = path.join(
      this.basePath(urlData),
      resourcePath(urlData),
      typeof commandPath === 'function' ? commandPath(urlData) : commandPath
    ).replace(/\\/g, '/'); // ugly workaround for Windows

    if (fullUrl) {
      return `${fullUrl}${uri}`
    }
    return `${host}:${port}${uri}`
  }

  includeBasicMethod(methods) {
    methods.forEach((methodName) => {
      this[methodName] = basicMethods[methodName];
    }, this)
  }

  _responseHandler = async (req) => {
    if (req.status <= 299) {
      if (req.status === 204) {
        return null
      }
      return req.json()
    }
    const error = await req.json()
    throw { error, code: req.status }
  }

  async _request(method, url, data, auth, options) {
    let requestData = null
    // Custom processor?
    if (data) {
      if (this.requestDataProcessor) {
        requestData = this.requestDataProcessor(method, data, options.headers)
      } else {
        requestData = JSON.stringify(data)
      }
    }

    // Prepare headers
    const apiVersion = this._client.getApiField('version')

    let headers = {
      // Use specified auth token or use default from this stripe instance:
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': `MCApiClient/v1 NodeBindings/${PACKAGE_VERSION}`,
    }

    if (auth) {
      const token = this._client.getApiField('token')
      if (!token) {
        throw new Error(`auth is required but token is empty, for endpoint ${method} ${url}`)
      }
      headers.Authorization = `Bearer ${token}`
    }
    if (apiVersion) {
      headers['MCApiClient-Version'] = apiVersion
    }

    // Grab client-user-agent before making the request:

    headers['X-MCApi-Client-User-Agent'] = await this._client.getClientUserAgent()

    if (options) {
      headers = { ...headers, options }
    }

    // Call the API
    /* eslint-disable */
    console.log('\n')
    console.log('================')
    console.log(`path: ${method} ${url}`)
    // console.log('header:', headers)
    console.log('data:', requestData)
    console.log('================')
    /* eslint-enable */
    return fetch(url, {
      method,
      headers,
      body: requestData || undefined,
    }).then(this._responseHandler)
  }
}

