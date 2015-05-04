var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login?callback=' + encodeURIComponent(req.path));
};

module.exports = function(app) {
  app.get('/panel', isAuthenticated, function(req, res) {
    res.render('panel');
  });
};
