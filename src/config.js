const envalid = require('envalid');

module.exports = envalid.cleanEnv(process.env, {
  SECRET: envalid.str(),
  VANTAGE_USERNAME: envalid.str(),
  VANTAGE_PASSWORD: envalid.str(),
});
