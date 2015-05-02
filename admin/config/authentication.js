var session = require('express-session'),
    passport = require('passport');

function getVariable(app, name) {
  var value = app.get(name);

  if (!value) {
    throw new Error(name + ' is not set');
  }

  return value;
}

module.exports = function(app) {

  // cookie session ============================================================

  var cookieSecret = getVariable(app, 'cookie_secret');

  app.use(session({
    name: 'pos-admin',
    secret: cookieSecret,
    saveUninitialized: false,
    resave: false,
    rolling: false,
    unset: 'destroy',
    cookie: {
      maxAge: 1000 * 60 * 30,
      secure: app.get('env') === 'production'
    }
  }));

  app.use(function(req, res, next) {
    if (!req.session) {
      return next(new Error('Session is not available.'));
    }
    next();
  });

  // passport middleware =======================================================

  app.use(passport.initialize());
  app.use(passport.session());
};
