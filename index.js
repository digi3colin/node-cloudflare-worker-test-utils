const { Request, Response, Headers } = require("node-fetch");
const { URL } = require("url");
const fetch = require("node-fetch");
const atob = require("atob");
const btoa = require("btoa");
const crypto = new (require("node-webcrypto-ossl"))();
const { TextDecoder, TextEncoder } = require("util");

global.atob = atob;
global.btoa = btoa;
global.fetch = fetch;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.URL = URL;

global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.crypto = crypto;

global.HTMLRewriter = class HTMLRewriter{
  constructor() {
    //https://github.com/cloudflare/lol-html
    throw new Error('HTMLRewrite not implemented');
  }
};

// code snippet from
// https://github.com/gja/cloudflare-worker-local
function chomp(str) {
  return str.substr(0, str.length - 1);
}

const buildRequest = (url, opts={}) => {
  const parsedURL = new URL(url);
  const headers = new Headers();
  // CF Specific Headers
  headers.set("CF-Ray", "0000000000000000");
  headers.set("CF-Visitor", JSON.stringify({ scheme: chomp(parsedURL.protocol) }));
  headers.set("CF-IPCountry", "DEV");
  headers.set("CF-Connecting-IP", "127.0.0.1");
  headers.set("X-Real-IP", "127.0.0.1");
  headers.append("X-Forwarded-For", "127.0.0.1");
  headers.append("X-Forwarded-Proto", chomp(parsedURL.protocol));

  Object.keys(opts.headers).forEach(key => headers.set(key, opts.headers[key]));

  const result = new Request(url, {headers: headers, opts});
  const props = Object.assign({}, opts);
  delete props.headers;
  delete props.body;
  delete props.method;
  return Object.assign(result, props);
};

module.exports = {
  buildRequest : buildRequest,
};