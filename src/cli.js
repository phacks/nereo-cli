import Vorpal from "vorpal";

import { getPrimaryTimedAccountsBalances } from "./nereo";
import { prettyPrintBalances, getVersion } from "./utils";
import { setToken, setUserId } from "./auth";

const vorpal = Vorpal();

vorpal.command("login", "Login to Nereo").action((args, callback) => {
  vorpal.activeCommand.prompt({
    type: 'input',
    name: 'token',
    message:
`To get your token, go to your profile, in the Developers tab. \
Please note that this token shares the same rights as your user account.
Your token and UserId will be stored in the ~/.nereorc file.

Token: `,
  })
  .then((answer) => setToken(answer.token))
  .then(() => setUserId())
  .then(() => callback())
  .catch((error) => {
    vorpal.activeCommand.log('There was a problem. See the error logs for more info.');
    throw(error);
  });
});

vorpal.command("balances", "Show balances").action((args, callback) => {
  getPrimaryTimedAccountsBalances().then(balances => {
    vorpal.activeCommand.log(prettyPrintBalances(balances));
    callback();
  })
  .catch((error) => {
    if (error.message === 'Unauthenticated') {
      vorpal.activeCommand.log('You need to log in to access your balances. Try the `login` command.');
      callback();
    }
    else {
      vorpal.activeCommand.log('There was a problem. See the error logs for more info.');
      throw(error);
    }
  });
});

vorpal.command("version", "Show current nereo-cli version").action((args, callback) => {
  vorpal.activeCommand.log(getVersion());
  callback();
})

vorpal.delimiter("nereo-cli$").show();
