"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLastDayOfMonth = exports.getFirstDayOfMonth = exports.getVersion = exports.prettyPrintBalances = undefined;

var _jsonfile = require("jsonfile");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _cliTable = require("cli-table");

var _cliTable2 = _interopRequireDefault(_cliTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prettyPrintBalances = exports.prettyPrintBalances = function prettyPrintBalances(balances) {
  var table = new _cliTable2.default({
    head: ['Account', 'Balance'],
    colWidths: [30, 10]
  });
  balances.forEach(function (balance) {
    table.push([balance.tatitle, balance.balance]);
  });
  return table.toString();
}; /**
    * Utils
    * 
    * Some util methods.
    */

var getVersion = exports.getVersion = function getVersion() {
  return (0, _jsonfile.readFileSync)('./package.json').version;
};

var getFirstDayOfMonth = exports.getFirstDayOfMonth = function getFirstDayOfMonth(date) {
  var year = date.year();
  var month = date.month();
  return (0, _moment2.default)([year, month, 1]);
};

var getLastDayOfMonth = exports.getLastDayOfMonth = function getLastDayOfMonth(date) {
  var year = date.month() === 11 ? date.year() + 1 : date.year();
  var nextMonth = date.month() === 11 ? 0 : date.month() + 1;
  return (0, _moment2.default)([year, nextMonth, 1]).subtract(1, 'day');
};