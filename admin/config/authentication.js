var session = require('express-session'),
    passport = require('passport'),
    RedisStore = require('connect-redis')(session);

function getVariable(app, name) {
  var value = app.get(name);

  if (!value) {
    throw new Error(name + ' is not set');
  }

  return value;
}

module.exports = function(app) {

  // cookie session ============================================================

  var cookieSecret = getVariable(app, 'cookie_secret'),
      redisConfig = app.get('redis_configuration'),
      sessionStore;

  if (redisConfig && redisConfig.host) {
    var redisOptions = {
      host:     redisConfig.host,
      port:     redisConfig.port || 6379,
      pass:     redisConfig.password || '',
      prefix:   'pos_session_'
    };

    sessionStore = new RedisStore(redisOptions);
  }

  app.use(session({
    name: 'pos-admin',
    secret:   cookieSecret,
    saveUninitialized: false,
    resave:   false,
    rolling:  false,
    store:    sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false
    }
  }));

  // passport middleware =======================================================

  app.use(passport.initialize());
  app.use(passport.session());
};
