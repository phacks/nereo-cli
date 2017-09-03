'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getVersion = exports.prettyPrintBalances = undefined;

var _jsonfile = require('jsonfile');

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const prettyPrintBalances = exports.prettyPrintBalances = balances => {
    let table = new _cliTable2.default({
        head: ['Account', 'Balance'],
        colWidths: [30, 10]
    });
    balances.forEach(balance => {
        table.push([balance.tatitle, balance.balance]);
    });
    return table.toString();
};

const getVersion = exports.getVersion = () => (0, _jsonfile.readFileSync)('./package.json').version;