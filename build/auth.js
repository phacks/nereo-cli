"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUserId = exports.setToken = exports.getUserId = exports.getToken = undefined;

var _jsonfile = require("jsonfile");

var _nereoApi = require("./nereo-api.js");

var _constants = require("./constants");

var getToken = exports.getToken = function getToken() {
  var rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH);
  return rcFileObject.token;
}; /**
    * Auth
    * 
    * Handles all the logic related to the .nereorc file, i.e. authentication
    */

var getUserId = exports.getUserId = function getUserId() {
  var rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH);
  return rcFileObject.userId;
};

var setToken = exports.setToken = function setToken(token) {
  var rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH, { throws: false });
  rcFileObject ? rcFileObject.token = token : rcFileObject = { token };
  return (0, _jsonfile.writeFileSync)(_constants.NEREO_RC_PATH, rcFileObject);
};

var setUserId = exports.setUserId = function setUserId() {
  return (0, _nereoApi.getCurrentUser)().then(function (_ref) {
    var id = _ref.data.id;

    var rcFileObject = (0, _jsonfile.readFileSync)(_constants.NEREO_RC_PATH, { throws: false });
    rcFileObject ? rcFileObject.userId = id : rcFileObject = { userId: id };
    return (0, _jsonfile.writeFileSync)(_constants.NEREO_RC_PATH, rcFileObject);
  });
};