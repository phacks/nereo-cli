import moment from "moment";

import { getTimedAccounts, getLeaveRequests, getBalances } from "./nereo-api";
import {
  computePrimaryTimedAccounts,
  computeBalancesForPrimayTimedAccounts
} from "./nereo-service";
import { getFirstDayOfMonth, getLastDayOfMonth } from "./utils";

export const getPrimaryTimedAccountsBalances = date => {
  if (date === undefined) {
    date = moment();
  } else if (!moment(date).isValid()) {
    throw new Error("Invalid date");
  } else {
    date = moment(date);
  }
  return new Promise((resolve, reject) => {
    Promise.all([getTimedAccounts(), getLeaveRequests(date), getBalances(date)])
      .then(([timedAccountsResults, leaveRequestsResults, balancesResults]) => {
        const timedAccounts = timedAccountsResults.data.results;
        const leaveRequests = leaveRequestsResults.data.results;
        const balances = balancesResults.data.balance_user_accounts;
        const primaryTimedAccounts = computePrimaryTimedAccounts(
          timedAccounts,
          leaveRequests,
          date
        );
        const primaryTimedAccountsBalances = computeBalancesForPrimayTimedAccounts(
          primaryTimedAccounts,
          balances,
          date
        );
        resolve(primaryTimedAccountsBalances);
      })
      .catch(error => {
        console.log(error);
        reject(new Error(error));
      });
  });
};
