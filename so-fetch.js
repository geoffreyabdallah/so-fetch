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

function getQS(qs){

  if (!params || typeof params !== 'object' && !Object.keys(params).length){
    throw new TypeError('Params Should be an object');
  }

  return Object.keys(params).reduce((string, key, index, outerKeys) => {
    var returnString;
    if (params[key] && Array.isArray(params[key])) {
      returnString = params[key].reduce((string, value, index, innerKeys) => {
        return string += encodeURIComponenet(key) + '[]=' + encodeURIComponenet(value) + (index !== innerKeys.length - 1 ? '&' : '');
      }, string);
    } else if (params[key] && typeof params[key] === 'object' && Object.keys(params[key]).length) {
      returnString = Object.keys(params[key]).reduce((string, innerKey, index, innerKeys) => {
        return (string += encodeURIComponenet(key) + '[' + encodeURIComponenet(innerKey) + ']=' + encodeURIComponenet(params[key][innerKey]) + (index !== innerKeys.length - 1 ? '&' : ''));
      }, string);
    } else {
      returnString = string += encodeURIComponenet(key) + '=' + encodeURIComponenet(params[key]);
    }
    return returnString  + (index !== outerKeys.length - 1 ? '&' : ''); 
  }, '?');
};

export default function(url, options){
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
    if (qs) getQS(qs);
    return fetch(url, optionsForFetch)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => {
      var action = { type: actionType };
      action[responseBinding || 'payload'] = res;
      return dispatch(action);
    })
    .catch(err => {
      console.log(err.stack);
      throw new Error(err);
    }); 
  };
};

