"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrimaryTimedAccountsBalances = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _nereoApi = require("./nereo-api");

var _nereoService = require("./nereo-service");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPrimaryTimedAccountsBalances = exports.getPrimaryTimedAccountsBalances = function getPrimaryTimedAccountsBalances(date) {
  if (date === undefined) {
    date = (0, _moment2.default)();
  } else if (!(0, _moment2.default)(date).isValid()) {
    throw new Error("Invalid date");
  } else {
    date = (0, _moment2.default)(date);
  }
  return new Promise(function (resolve, reject) {
    Promise.all([(0, _nereoApi.getTimedAccounts)(), (0, _nereoApi.getLeaveRequests)(date), (0, _nereoApi.getBalances)(date)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          timedAccountsResults = _ref2[0],
          leaveRequestsResults = _ref2[1],
          balancesResults = _ref2[2];

      var timedAccounts = timedAccountsResults.data.results;
      var leaveRequests = leaveRequestsResults.data.results;
      var balances = balancesResults.data.balance_user_accounts;
      var primaryTimedAccounts = (0, _nereoService.computePrimaryTimedAccounts)(timedAccounts, leaveRequests, date);
      var primaryTimedAccountsBalances = (0, _nereoService.computeBalancesForPrimayTimedAccounts)(primaryTimedAccounts, balances, date);
      resolve(primaryTimedAccountsBalances);
    }).catch(function (error) {
      console.log(error);
      reject(new Error(error));
    });
  });
};