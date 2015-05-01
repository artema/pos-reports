var LocalStrategy = require('passport-local').Strategy,
    passport = require('passport');

module.exports = function(app) {

  var localStrategy = new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function() {

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
