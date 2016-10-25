'use strict'

var qs = require('qs');

var utils = module.exports = {

  /**
   * Outputs a new function with interpolated object property values.
   * Use like so:
   *   var fn = makeURLInterpolator('some/url/{param1}/{param2}');
   *   fn({ param1: 123, param2: 456 }); // => 'some/url/123/456'
   */
  makeURLInterpolator: (function () {
    var rc = {
      '\n': '\\n', '\"': '\\\"',
      '\u2028': '\\u2028', '\u2029': '\\u2029',
    };
    return function makeURLInterpolator(str) {
      var cleanString = str.replace(/["\n\r\u2028\u2029]/g, function ($0) {
        return rc[$0];
      });
      return function (outputs) {
        return cleanString.replace(/\{([\s\S]+?)\}/g, function ($0, $1) {
          return encodeURIComponent(outputs[$1] !== undefined ? outputs[$1] : '');
        });
      };
    };
  }()),

  /**
   * Return the data argument from a list of arguments
   */
  getDataFromArgs(args) {
    if (args.length > 0) {
      if (utils.isObject(args[0]) && !utils.isOptionsHash(args[0])) {
        return args.shift();
      }
    }
    return {};
  },

  /**
   * Return the options hash from a list of arguments
   */
  getOptionsFromArgs(args) {
    var opts = {
      auth: null,
      headers: {},
    }
    if (args.length > 0) {
      var arg = args[args.length - 1];
      if (utils.isAuthKey(arg)) {
        opts.auth = args.pop();
      } else if (utils.isOptionsHash(arg)) {
        var params = args.pop();
        if (params.api_key) {
          opts.auth = params.api_key;
        }
        if (params.idempotency_key) {
          opts.headers['Idempotency-Key'] = params.idempotency_key;
        }
        if (params.stripe_account) {
          opts.headers['Stripe-Account'] = params.stripe_account;
        }
      }
    }
    return opts;
  },

};
