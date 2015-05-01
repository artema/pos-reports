var pkg = require('../package.json'),
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
  app.set('cookie_secret', getVariable('COOKIE_SECRET'));
};
