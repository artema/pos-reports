var ejs = require('ejs'),
    express = require('express'),
    pkg = require('../package.json');

function getVariable(app, name) {
  var value = app.get(name);

  if (!value) {
    throw new Error(name + ' is not set');
  }

  return value;
}

module.exports = function(app) {
  app.use(express.static('./public/'));

  app.engine('.html', ejs.renderFile);

  app.set('view engine', 'jade');

  if (app.get('env') === 'development') {
    app.locals.pretty = true;
    app.locals.compileDebug = true;
  }
};
