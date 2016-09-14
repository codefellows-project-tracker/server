const Vantage = require('vantage');
const Table = require('cli-table');
const chalk = require('chalk');

const User = require('./models/user');

const vantage = new Vantage();

// List all users
vantage
  .command('user-list')
  .description('List all users')
  .action(function() {
    return User.find({})
      .then((users) => {
        const table = new Table({
          head: [
            'Name',
            'Email',
            'Approved',
            'Role',
          ],
        });

        users.forEach((user) => {
          table.push([
            user.name,
            user.email,
            user.approved ? chalk.green(user.approved) : chalk.red(user.approved),
            user.role === 'admin' ? chalk.red.bold.underline(user.role) : user.role,
          ]);
        });

        this.log(table.toString());
      });
  });


module.exports = vantage;
