"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUserId = exports.setToken = exports.getUserId = exports.getToken = undefined;

var _jsonfile = require("jsonfile");

var _nereoApi = require("./nereo-api.js");

var _constants = require("./constants");

const getToken = exports.getToken = () => {
  const rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH);
  return rcFileObject.token;
};

const getUserId = exports.getUserId = () => {
  const rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH);
  return rcFileObject.userId;
};

const setToken = exports.setToken = token => {
  let rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH, { throws: false });
  rcFileObject ? rcFileObject.token = token : rcFileObject = { token };
  return (0, _jsonfile.writeFileSync)(_constants.NEREO_RC_PATH, rcFileObject);
};

const setUserId = exports.setUserId = () => (0, _nereoApi.getCurrentUser)().then(({ data: { id } }) => {
  let rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH, { throws: false });
  rcFileObject ? rcFileObject.userId = id : rcFileObject = { userId: id };
  return (0, _jsonfile.writeFileSync)(_constants.NEREO_RC_PATH, rcFileObject);
});