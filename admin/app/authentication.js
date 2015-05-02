var LocalStrategy = require('passport-local').Strategy,
    passport = require('passport');

module.exports = function(app) {
  var users = app.get('users');

  var localStrategy = new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      session: true
    },
    function(login, password, done) {
      users.findByName(login).then(function(user) {
        if (!user) {
          return done(null, false, { message: 'Пользователь не найден.' });
        }

        if (!users.validatePassword(user, password)) {
          return done(null, false, { message: 'Неверный пароль.' });
        }

        return done(null, user);
      }, done);
    }
  );

  passport.use(localStrategy);

  passport.serializeUser(function(user, done) {
    done(null, user.login);
  });

  passport.deserializeUser(function(login, done) {
    users.findByName(login).then(function(user) {
      done(null, user);
    }, done);
  });
};
