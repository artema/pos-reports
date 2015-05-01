var passport = require('passport');

module.exports = function(app) {
  app.get('/panel', passport.authenticate('admin'), function(req, res) {
    res.render('panel');
  });
};
