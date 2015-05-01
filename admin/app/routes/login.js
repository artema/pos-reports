var passport = require('passport'),
    debug = require('debug')('admin:authorization');

module.exports = function(app) {

  // GET /logout
  app.post('/logout', function(req, res){
    req.logout();
    res.status(200).end();
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

    passport.authenticate('admin', function(err, user, info) {
      if (err || !user) {
        return res.render('login', {
          error: { message: info && info.message ? info.message : null },
          username: req.body.username
        });
      }

      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }

        return res.redirect(callback);
      });
    })(req, res, next);
  });
};
