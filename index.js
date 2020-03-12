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
  const { country = "DEV", ip = "127.0.0.1", ray = "0000000000000000", ...requestOpts } = opts;
  const request = new Request(url, { redirect: "manual", ...requestOpts });
  const headers = request.headers;
  const parsedURL = new URL(request.url);

  // CF Specific Headers
  headers.set("CF-Ray", ray);
  headers.set("CF-Visitor", JSON.stringify({ scheme: chomp(parsedURL.protocol) }));
  headers.set("CF-IPCountry", country);
  headers.set("CF-Connecting-IP", ip);
  headers.set("X-Real-IP", ip);

  // General Proxy Headers
  headers.append("X-Forwarded-For", ip);
  headers.append("X-Forwarded-Proto", chomp(parsedURL.protocol));

  return new Request(request, { headers });
};

module.exports = {
  buildRequest : buildRequest,
};