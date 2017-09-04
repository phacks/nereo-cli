import moment from "moment";

import { getFirstDayOfMonth, getLastDayOfMonth } from "./utils";

export const computeBalancesForPrimayTimedAccounts = (
  primaryTimedAccounts,
  balances,
  date
) => {
  const primaryTimedAccountsBalances = [];
  primaryTimedAccounts.forEach(primaryTimedAccount => {
    let balanceForToday = balances
      .find(balance => balance.timed_account === primaryTimedAccount.id)
      .balance_dates.find(
        balanceDate => balanceDate.date === moment(date).format("YYYY-MM-DD")
      ).balance;
    primaryTimedAccountsBalances.push({
      tatitle: primaryTimedAccount.tatitle,
      balance: balanceForToday
    });
  });
  return primaryTimedAccountsBalances;
};

export const computePrimaryTimedAccounts = (timedAccounts, leaveRequests, date) => {
  let primaryTimedAccounts = [];
  timedAccounts
    .filter(timedAccount => !timedAccount.secondary)
    .forEach(timedAccount => {
      const startCredit = timedAccount.startCredit;
      const endCredit = timedAccount.endCredit;
      const startDebt = timedAccount.startDebt;
      const endDebt = timedAccount.endDebt;
      const minDate = getFirstDayOfMonth(date);
      const maxDate = getLastDayOfMonth(date);
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

export const filterLeaveRequestsOnTimedAccount = (leaveRequests, timedAccount) =>
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
