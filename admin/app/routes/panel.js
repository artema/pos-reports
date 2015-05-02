var passport = require('passport');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

module.exports = function(app) {
  app.get('/panel', isAuthenticated, function(req, res) {
    res.render('panel');
  });
};
