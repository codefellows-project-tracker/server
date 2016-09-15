const debug = require('debug')('cpt:errorHelper');
const boom = require('boom');

module.exports = (res, code, message) => (
  (err) => {
    const error = boom.wrap(err, code, message);
    debug(error);
    res.status(error.output.statusCode)
      .json(error.output.payload);
  }
);
