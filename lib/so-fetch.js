'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getQS = getQS;
exports.soFetch = soFetch;

require('whatwg-fetch');

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function getQS(params) {
  if (!params || typeof params === 'object' && !Array.isArray(params) && !Object.keys(params).length) {
    throw new TypeError('Params Should be an object');
  }

  return Object.keys(params).reduce(function (string, key, index, outerKeys) {
    if (Array.isArray(params[key]) && params[key].length || !Array.isArray(params[key]) && params[key] !== undefined) {
      if (params[key] && Array.isArray(params[key])) {
        return string + (string === '?' ? '' : '&') + params[key].reduce(function (innerString, value, index, innerKeys) {
          return innerString + encodeURIComponent(key) + '[]=' + encodeURIComponent(value) + (index !== innerKeys.length - 1 ? '&' : '');
        }, '');
      } else if (params[key] && typeof params[key] === 'object' && Object.keys(params[key]).length) {
        return string + (string === '?' ? '' : '&') + Object.keys(params[key]).reduce(function (innerString, innerKey, index, innerKeys) {
          return innerString + encodeURIComponent(key) + '[' + encodeURIComponent(innerKey) + ']=' + encodeURIComponent(params[key][innerKey]) + (index !== innerKeys.length - 1 ? '&' : '');
        }, '');
      } else {
        return string + (string === '?' ? '' : '&') + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }
    }
    return string;
  }, '?');
}

;

function soFetch(url, options) {
  var body = options.body;
  var method = options.method;
  var actionType = options.actionType;
  var responseBinding = options.responseBinding;
  var qs = options.qs;
  var headers = options.headers;
  var credentials = options.credentials;

  return function (dispatch) {
    var optionsForFetch = { method: method || 'get' };
    if (credentials === undefined) optionsForFetch.credentials = 'same-origin';
    if (credentials) optionsForFetch.credentials = credentials;
    if (body) optionsForFetch.body = JSON.stringify(body);
    if (method === 'put' || method === 'post') {
      optionsForFetch.headers = headers || { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    }
    return fetch(url + (qs ? getQS(qs) : ''), optionsForFetch).then(checkStatus).then(function (res) {
      return res.json();
    }).then(function (res) {
      var action = { type: actionType };
      action[responseBinding || 'payload'] = res;
      return dispatch(action);
    })['catch'](function (err) {
      console.log(err.stack);
      throw new Error(err);
    });
  };
}

;
