/**
 * Utils
 * 
 * Some util methods.
 */

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

export const getFirstDayOfMonth = (date) => {
  const year = date.year();
  const month = date.month();
  return moment([year, month, 1]);
}

export const getLastDayOfMonth = (date) => {
  const year = date.month() === 11 ? date.year() + 1 : date.year();
  const nextMonth = date.month() === 11 ? 0 : date.month() + 1;
  return moment([year, nextMonth, 1]).subtract(1, 'day');
}
