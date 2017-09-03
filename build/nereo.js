"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrimaryTimedAccountsBalances = undefined;

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _nereoApi = require("./nereo-api");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPrimaryTimedAccountsBalances = exports.getPrimaryTimedAccountsBalances = () => new Promise((resolve, reject) => {
  Promise.all([(0, _nereoApi.getTimedAccounts)(), (0, _nereoApi.getLeaveRequests)(), (0, _nereoApi.getBalances)()]).then(([timedAccountsResults, leaveRequestsResults, balancesResults]) => {
    const timedAccounts = timedAccountsResults.data.results;
    const leaveRequests = leaveRequestsResults.data.results;
    const balances = balancesResults.data.balance_user_accounts;
    const primaryTimedAccounts = computePrimaryTimedAccounts(timedAccounts, leaveRequests);
    const primaryTimedAccountsBalances = [];
    primaryTimedAccounts.forEach(primaryTimedAccount => {
      let balanceForToday = balances.find(balance => balance.timed_account === primaryTimedAccount.id).balance_dates.find(balanceDate => balanceDate.date === (0, _moment2.default)().format('YYYY-MM-DD')).balance;
      primaryTimedAccountsBalances.push({
        tatitle: primaryTimedAccount.tatitle,
        balance: balanceForToday
      });
    });
    resolve(primaryTimedAccountsBalances);
  }).catch(error => {
    console.log(error);
    reject(new Error(error));
  });
});

const computePrimaryTimedAccounts = (timedAccounts, leaveRequests) => {
  let primaryTimedAccounts = [];
  timedAccounts.filter(timedAccount => !timedAccount.secondary).forEach(timedAccount => {
    const startCredit = timedAccount.startCredit;
    const endCredit = timedAccount.endCredit;
    const startDebt = timedAccount.startDebt;
    const endDebt = timedAccount.endDebt;
    const minDate = (0, _moment2.default)(_constants.NEREO_MIN_DATE);
    const maxDate = (0, _moment2.default)(_constants.NEREO_MAX_DATE);
    if ((null === endCredit || minDate.isSameOrBefore(endCredit)) && (null === startCredit || maxDate.isSameOrAfter(startCredit)) || (null === endDebt || minDate.isSameOrBefore(endDebt)) && (null === startDebt || maxDate.isSameOrAfter(startDebt))) {
      primaryTimedAccounts.push(timedAccount);
    } else {
      var matchingLeaveRequests = filterLeaveRequestsOnTimedAccount(leaveRequests, timedAccount);
      matchingLeaveRequests.length > 0 && primaryTimedAccounts.push(timedAccount);
    }
  });
  return primaryTimedAccounts;
};

const filterLeaveRequestsOnTimedAccount = (leaveRequests, timedAccount) => leaveRequests.filter(leaveRequest => {
  const matching = !1;
  return leaveRequest.leaveRequestDates.forEach(leaveRequestDate => {
    leaveRequestDate.distribution.forEach(distribution => {
      if (distribution.account === timedAccount.id) {
        return void (matching = !0);
      }
    });
  }), matching;
});