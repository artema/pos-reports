var AWS = require('aws-sdk'),
    pkg = require('../package.json'),
    querystring = require('querystring');

function getVariable(name) {
  if (!process.env[name]) {
    throw new Error(name + ' environment variable is not set.');
  }

  return process.env[name];
}

function parseVariable(name) {
  return querystring.parse(getVariable(name));
}

module.exports = function(app) {
  if (process.env.NODE_ENV !== 'production') {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'me' });
    AWS.config.update({ region: 'eu-west-1' });
  }

  app.set('cookie_secret', getVariable('COOKIE_SECRET'));
  app.set('database', parseVariable('DATABASE'));
  app.set('redis_configuration', querystring.parse(process.env.REDIS_CONFIGURATION));
};
