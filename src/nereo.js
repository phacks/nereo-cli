import moment from "moment";

import { getTimedAccounts, getLeaveRequests, getBalances } from "./nereo-api";
import { getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from "./utils";

export const getPrimaryTimedAccountsBalances = () =>
  new Promise((resolve, reject) => {
    Promise.all([getTimedAccounts(), getLeaveRequests(), getBalances()])
      .then(([timedAccountsResults, leaveRequestsResults, balancesResults]) => {
        const timedAccounts = timedAccountsResults.data.results;
        const leaveRequests = leaveRequestsResults.data.results;
        const balances = balancesResults.data.balance_user_accounts;
        const primaryTimedAccounts = computePrimaryTimedAccounts(
          timedAccounts,
          leaveRequests
        );
        const primaryTimedAccountsBalances = computeBalancesForPrimayTimedAccounts(
          primaryTimedAccounts,
          balances
        );
        resolve(primaryTimedAccountsBalances);
      })
      .catch(error => {
        console.log(error);
        reject(new Error(error));
      });
  });

const computeBalancesForPrimayTimedAccounts = (
  primaryTimedAccounts,
  balances
) => {
  const primaryTimedAccountsBalances = [];
  primaryTimedAccounts.forEach(primaryTimedAccount => {
    let balanceForToday = balances
      .find(balance => balance.timed_account === primaryTimedAccount.id)
      .balance_dates.find(
        balanceDate => balanceDate.date === moment().format("YYYY-MM-DD")
      ).balance;
    primaryTimedAccountsBalances.push({
      tatitle: primaryTimedAccount.tatitle,
      balance: balanceForToday
    });
  });
  return primaryTimedAccountsBalances;
};

const computePrimaryTimedAccounts = (timedAccounts, leaveRequests) => {
  let primaryTimedAccounts = [];
  timedAccounts
    .filter(timedAccount => !timedAccount.secondary)
    .forEach(timedAccount => {
      const startCredit = timedAccount.startCredit;
      const endCredit = timedAccount.endCredit;
      const startDebt = timedAccount.startDebt;
      const endDebt = timedAccount.endDebt;
      const minDate = getFirstDayOfCurrentMonth();
      const maxDate = getLastDayOfCurrentMonth();
      if (
        ((null === endCredit || minDate.isSameOrBefore(endCredit)) &&
          (null === startCredit || maxDate.isSameOrAfter(startCredit))) ||
        ((null === endDebt || minDate.isSameOrBefore(endDebt)) &&
          (null === startDebt || maxDate.isSameOrAfter(startDebt)))
      ) {
        primaryTimedAccounts.push(timedAccount);
      } else {
        var matchingLeaveRequests = filterLeaveRequestsOnTimedAccount(
          leaveRequests,
          timedAccount
        );
        matchingLeaveRequests.length > 0 &&
          primaryTimedAccounts.push(timedAccount);
      }
    });
  return primaryTimedAccounts;
};

const filterLeaveRequestsOnTimedAccount = (leaveRequests, timedAccount) =>
  leaveRequests.filter(leaveRequest => {
    let matching = !1;
    return (
      leaveRequest.leaveRequestDates.forEach(leaveRequestDate => {
        leaveRequestDate.distribution.forEach(distribution => {
          if (distribution.account === timedAccount.id) {
            return void (matching = !0);
          }
        });
      }),
      matching
    );
  });
