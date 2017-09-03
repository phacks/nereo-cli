import { readFileSync } from "jsonfile";

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
