"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrimaryTimedAccountsBalances = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _nereoApi = require("./nereo-api");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPrimaryTimedAccountsBalances = exports.getPrimaryTimedAccountsBalances = function getPrimaryTimedAccountsBalances() {
  return new Promise(function (resolve, reject) {
    Promise.all([(0, _nereoApi.getTimedAccounts)(), (0, _nereoApi.getLeaveRequests)(), (0, _nereoApi.getBalances)()]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          timedAccountsResults = _ref2[0],
          leaveRequestsResults = _ref2[1],
          balancesResults = _ref2[2];

      var timedAccounts = timedAccountsResults.data.results;
      var leaveRequests = leaveRequestsResults.data.results;
      var balances = balancesResults.data.balance_user_accounts;
      var primaryTimedAccounts = computePrimaryTimedAccounts(timedAccounts, leaveRequests);
      var primaryTimedAccountsBalances = [];
      primaryTimedAccounts.forEach(function (primaryTimedAccount) {
        var balanceForToday = balances.find(function (balance) {
          return balance.timed_account === primaryTimedAccount.id;
        }).balance_dates.find(function (balanceDate) {
          return balanceDate.date === (0, _moment2.default)().format('YYYY-MM-DD');
        }).balance;
        primaryTimedAccountsBalances.push({
          tatitle: primaryTimedAccount.tatitle,
          balance: balanceForToday
        });
      });
      resolve(primaryTimedAccountsBalances);
    }).catch(function (error) {
      console.log(error);
      reject(new Error(error));
    });
  });
};

var computePrimaryTimedAccounts = function computePrimaryTimedAccounts(timedAccounts, leaveRequests) {
  var primaryTimedAccounts = [];
  timedAccounts.filter(function (timedAccount) {
    return !timedAccount.secondary;
  }).forEach(function (timedAccount) {
    var startCredit = timedAccount.startCredit;
    var endCredit = timedAccount.endCredit;
    var startDebt = timedAccount.startDebt;
    var endDebt = timedAccount.endDebt;
    var minDate = (0, _moment2.default)(_constants.NEREO_MIN_DATE);
    var maxDate = (0, _moment2.default)(_constants.NEREO_MAX_DATE);
    if ((null === endCredit || minDate.isSameOrBefore(endCredit)) && (null === startCredit || maxDate.isSameOrAfter(startCredit)) || (null === endDebt || minDate.isSameOrBefore(endDebt)) && (null === startDebt || maxDate.isSameOrAfter(startDebt))) {
      primaryTimedAccounts.push(timedAccount);
    } else {
      var matchingLeaveRequests = filterLeaveRequestsOnTimedAccount(leaveRequests, timedAccount);
      matchingLeaveRequests.length > 0 && primaryTimedAccounts.push(timedAccount);
    }
  });
  return primaryTimedAccounts;
};

var filterLeaveRequestsOnTimedAccount = function filterLeaveRequestsOnTimedAccount(leaveRequests, timedAccount) {
  return leaveRequests.filter(function (leaveRequest) {
    var matching = !1;
    return leaveRequest.leaveRequestDates.forEach(function (leaveRequestDate) {
      leaveRequestDate.distribution.forEach(function (distribution) {
        if (distribution.account === timedAccount.id) {
          return void (matching = !0);
        }
      });
    }), matching;
  });
};