"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterLeaveRequestsOnTimedAccount = exports.computePrimaryTimedAccounts = exports.computeBalancesForPrimayTimedAccounts = undefined;

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var computeBalancesForPrimayTimedAccounts = exports.computeBalancesForPrimayTimedAccounts = function computeBalancesForPrimayTimedAccounts(primaryTimedAccounts, balances, date) {
  var primaryTimedAccountsBalances = [];
  primaryTimedAccounts.forEach(function (primaryTimedAccount) {
    var balanceForToday = balances.find(function (balance) {
      return balance.timed_account === primaryTimedAccount.id;
    }).balance_dates.find(function (balanceDate) {
      return balanceDate.date === (0, _moment2.default)(date).format("YYYY-MM-DD");
    }).balance;
    primaryTimedAccountsBalances.push({
      tatitle: primaryTimedAccount.tatitle,
      balance: balanceForToday
    });
  });
  return primaryTimedAccountsBalances;
};

var computePrimaryTimedAccounts = exports.computePrimaryTimedAccounts = function computePrimaryTimedAccounts(timedAccounts, leaveRequests, date) {
  var primaryTimedAccounts = [];
  timedAccounts.filter(function (timedAccount) {
    return !timedAccount.secondary;
  }).forEach(function (timedAccount) {
    var startCredit = timedAccount.startCredit;
    var endCredit = timedAccount.endCredit;
    var startDebt = timedAccount.startDebt;
    var endDebt = timedAccount.endDebt;
    var minDate = (0, _utils.getFirstDayOfMonth)(date);
    var maxDate = (0, _utils.getLastDayOfMonth)(date);
    if ((null === endCredit || minDate.isSameOrBefore(endCredit)) && (null === startCredit || maxDate.isSameOrAfter(startCredit)) || (null === endDebt || minDate.isSameOrBefore(endDebt)) && (null === startDebt || maxDate.isSameOrAfter(startDebt))) {
      primaryTimedAccounts.push(timedAccount);
    } else {
      var matchingLeaveRequests = filterLeaveRequestsOnTimedAccount(leaveRequests, timedAccount);
      matchingLeaveRequests.length > 0 && primaryTimedAccounts.push(timedAccount);
    }
  });
  return primaryTimedAccounts;
};

var filterLeaveRequestsOnTimedAccount = exports.filterLeaveRequestsOnTimedAccount = function filterLeaveRequestsOnTimedAccount(leaveRequests, timedAccount) {
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