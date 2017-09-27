'use strict';

import * as config from './NetworkConfig'
var self = this || global;
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob: 'FileReader' in self && 'Blob' in self && (function() {
    try {
      new Blob()
      return true
    } catch(e) {
      return false
    }
  })(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  rawHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':')
    var key = parts.shift().trim()
    if (key) {
      var value = parts.join(':').trim()
      headers.append(key, value)
    }
  });

  return headers;
}

export default function fetchPolyfill (input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)
    var xhr = new XMLHttpRequest()

 
    if (init.timeout) {
      xhr.timeout = init.timeout;
    }else{
      xhr.timeout = config.TIMEOUT; 
    }


    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      resolve(new Response(body, options))
    }

    xhr.onerror = function() {
      reject(-1)
    }

    xhr.ontimeout = function() {
      reject(-2)
    }

    xhr.open(request.method, request.url, true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob'
    }

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value)
    })

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}