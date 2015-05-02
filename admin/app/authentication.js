var LocalStrategy = require('passport-local').Strategy,
    passport = require('passport');

module.exports = function(app) {
  var localStrategy = new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password'
    },
    function(username, password, done) {
      var users = app.get('users');

      users.findByName(username).then(function(user) {console.log(user);
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        if (!users.validatePassword(user, password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      }, function(e) {console.log(e);
        done(e);
      });
    }
  );

  passport.use('admin', localStrategy);

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
};
