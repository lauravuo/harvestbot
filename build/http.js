'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rxios = require('rxios');

exports.default = (baseURL, headers = {}) => {
  const api = new _rxios.Rxios({
    baseURL,
    headers
  });

  const getJson = url => api.get(url);
  const postJson = (url, payload) => api.post(url, payload);

  return { getJson, postJson };
};