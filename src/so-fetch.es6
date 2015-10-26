'use strict';

import 'whatwg-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function getQS(params){
  if (!params || typeof params === 'object' && !Array.isArray(params) && !Object.keys(params).length) {
    throw new TypeError('Params Should be an object');
  }

  return Object.keys(params).reduce((string, key, index, outerKeys) => {
    if ((Array.isArray(params[key]) && params[key].length) || !Array.isArray(params[key]) && params[key] !== undefined) {
      if (params[key] && Array.isArray(params[key])) {
        return string + (string === '?' ? '' : '&') + params[key].reduce((innerString, value, index, innerKeys) => {
          return innerString + encodeURIComponent(key) + '[]=' + encodeURIComponent(value) + (index !== innerKeys.length - 1 ? '&' : '');
        }, '');
      } else if (params[key] && typeof params[key] === 'object' && Object.keys(params[key]).length) {
        return string + (string === '?' ? '' : '&') + Object.keys(params[key]).reduce((innerString, innerKey, index, innerKeys) => {
          return innerString + encodeURIComponent(key) + '[' + encodeURIComponent(innerKey) + ']=' + encodeURIComponent(params[key][innerKey]) + (index !== innerKeys.length - 1 ? '&' : '');
        }, '');
      } else {
        return string + (string === '?' ? '' : '&') +  encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }
    }
    return string;
  }, '?');
};

export function soFetch(url, options){
  var {
    body,
    method,
    actionType,
    responseBinding,
    qs,
    headers,
    credentials
  } = options;
  return dispatch => {
    var optionsForFetch = { method: method || 'get' };
    if (credentials === undefined) optionsForFetch.credentials = 'same-origin';
    if (credentials) optionsForFetch.credentials = credentials;
    if (body) optionsForFetch.body = JSON.stringify(body);
    if (method === 'put' || method === 'post') {
      optionsForFetch.headers = headers || { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    }
    return fetch(url + (qs ? getQS(qs) : ''), optionsForFetch)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => {
      var action = { type: actionType };
      action[responseBinding || 'payload'] = res;
      return dispatch(action);
    });
  };
};
