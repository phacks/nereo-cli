#!/usr/bin/env node
"use strict";

var _vorpal = require("vorpal");

var _vorpal2 = _interopRequireDefault(_vorpal);

var _nereo = require("./nereo");

var _utils = require("./utils");

var _auth = require("./auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vorpal = (0, _vorpal2.default)();

vorpal.command("login", "Login to Nereo").action(function (args, callback) {
  vorpal.activeCommand.prompt({
    type: 'input',
    name: 'token',
    message: `To get your token, go to your profile, in the Developers tab. \
Please note that this token shares the same rights as your user account.
Your token and UserId will be stored in the ~/.nereorc file.

Token: `
  }).then(function (answer) {
    return (0, _auth.setToken)(answer.token);
  }).then(function () {
    return (0, _auth.setUserId)();
  }).then(function () {
    return callback();
  }).catch(function (error) {
    vorpal.activeCommand.log('There was a problem. See the error logs for more info.');
    throw error;
  });
});

vorpal.command("balances", "Show balances").action(function (args, callback) {
  (0, _nereo.getPrimaryTimedAccountsBalances)().then(function (balances) {
    vorpal.activeCommand.log((0, _utils.prettyPrintBalances)(balances));
    callback();
  }).catch(function (error) {
    if (error.message === 'Unauthenticated') {
      vorpal.activeCommand.log('You need to log in to access your balances. Try the `login` command.');
      callback();
    } else {
      vorpal.activeCommand.log('There was a problem. See the error logs for more info.');
      throw error;
    }
  });
});

vorpal.command("version", "Show current nereo-cli version").action(function (args, callback) {
  vorpal.activeCommand.log((0, _utils.getVersion)());
  callback();
});

vorpal.delimiter("nereo-cli$").show();