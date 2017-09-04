import { readFileSync } from "jsonfile";
import moment from "moment";

import Table from 'cli-table';

export const prettyPrintBalances = (balances) => {
    let table = new Table({
        head: ['Account', 'Balance']
      , colWidths: [30, 10]
    });
    balances.forEach((balance) => {
        table.push([balance.tatitle, balance.balance])
    })
    return table.toString()
}

export const getVersion = () =>
  readFileSync('./package.json').version

export const getFirstDayOfCurrentMonth = () => {
  const today = moment();
  const year = today.year();
  const month = today.month();
  return moment([year, month, 1]);
}

export const getLastDayOfCurrentMonth = () => {
  const today = moment();
  const year = today.year();
  const nextMonth = today.month() === 11 ? 0 : today.month() + 1;
  return moment([year, nextMonth, 1]).subtract(1, 'day');
}
