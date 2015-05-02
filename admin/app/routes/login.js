var passport = require('passport'),
    debug = require('debug')('admin:authorization');

module.exports = function(app) {

  // GET /logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  //GET /login
  app.get('/login', function(req, res){
    var callback = req.query.callback || '/';

    if (req.isAuthenticated()) {
      return res.redirect(callback);
    }

    res.render('login');
  });

  //POST /login
  app.post('/login', function(req, res, next) {
    var callback = req.query.callback || '/';

    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        return res.render('login', {
          error: { message: info && info.message ? info.message : null },
          username: req.body.username
        });
      }

      req.login(user, function(err) {
        if (err) {
          return next(err);
        }

        return res.redirect(callback);
      });
    })(req, res, next);
  });
};
