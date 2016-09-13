const debug = require('debug')('cpt:errorHelper');
const boom = require('boom');
const PrettyError = require('pretty-error');

const prettyError = new PrettyError();

module.exports = (res, code, message) => (
  (err) => {
    const error = boom.wrap(err, code, message);
    debug(prettyError.render(error));
    res.status(error.output.statusCode)
      .json(error.output.payload);
  }
);
