"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentUser = exports.getBalances = exports.getLeaveRequests = exports.getTimedAccounts = undefined;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _auth = require("./auth");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isAuthenticated = function isAuthenticated() {
  return _axios2.default.defaults.headers.common['Authorization'] !== undefined;
};

var setHeaders = function setHeaders() {
  try {
    var token = (0, _auth.getToken)();
    _axios2.default.defaults.headers.common['Authorization'] = `Token ${(0, _auth.getToken)()}`;
  } catch (e) {
    throw new Error('Unauthenticated');
  }
};

var getTimedAccounts = exports.getTimedAccounts = function getTimedAccounts() {
  if (!isAuthenticated()) {
    setHeaders();
  }
  return _axios2.default.get(`${_constants.NEREO_API_URL}/timed-accounts`, {
    params: {
      user: (0, _auth.getUserId)()
    }
  });
};

var getLeaveRequests = exports.getLeaveRequests = function getLeaveRequests() {
  if (!isAuthenticated()) {
    setHeaders();
  }
  return _axios2.default.get(`${_constants.NEREO_API_URL}/leaverequests`, {
    params: {
      userId: (0, _auth.getUserId)(),
      min_date: _constants.NEREO_MIN_DATE,
      max_date: _constants.NEREO_MAX_DATE,
      state: ["RE", "V1", "VA"],
      is_cancellation_request: "false"
    }
  });
};

var getBalances = exports.getBalances = function getBalances() {
  if (!isAuthenticated()) {
    setHeaders();
  }
  return _axios2.default.post(`${_constants.NEREO_API_URL}/users/${(0, _auth.getUserId)()}/balances/`, {
    start_date: _constants.NEREO_MIN_DATE,
    end_date: _constants.NEREO_MAX_DATE
  });
};

var getCurrentUser = exports.getCurrentUser = function getCurrentUser() {
  if (!isAuthenticated()) {
    setHeaders();
  }
  return _axios2.default.get(`${_constants.NEREO_API_URL}/users/current`);
};