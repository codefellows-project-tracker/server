const Table = require('cli-table');
const chalk = require('chalk');

const Project = require('../models/project');

module.exports = (vantage) => {
  // List all users
  vantage
    .command('project-list')
    .description('List all projects')
    .action(function() {
      return Project.find({})
        .then((projects) => {
          const table = new Table({
            head: [
              'ID',
              'Name',
              'Users',
              'Approved',
            ],
          });

          projects.forEach((project) => {
            table.push([
              project.id,
              project.name,
              project.users.length,
              project.approved ? chalk.green(project.approved) : chalk.red(project.approved),
            ]);
          });

          this.log(table.toString());
        });
    });

  vantage
    .command('project-approve <approve> <id>')
    .description('Approve or Disapprove a project')
    .action(function(args) {
      return Project.findOneAndUpdate({ _id: args.id }, { approved: args.approve }, { new: true })
        .then((project) => {
          if (project.approved) {
            this.log(`Project "${project.name}" (id: ${project._id}) is ${chalk.green('approved!')}`); // eslint-disable-line max-len
          } else {
            this.log(`Project "${project.name}" (id: ${project._id}) is ${chalk.red.bold('disapproved!')}`); // eslint-disable-line max-len
          }
        });
    });
};
