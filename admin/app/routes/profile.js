var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).end();
};

module.exports = function(app) {
  app.post('/api/profile/change-password', isAuthenticated, function(req, res) {
    var users = app.get('users');

    if (!users.validatePassword(req.user, req.body.old_password)) {
      return res.status(401).json({ message: 'Неверный пароль.' });
    }

    users.changePassword(req.user, req.body.new_password).then(function() {
      res.json({});
    }, function(e) {
      console.error(e);
      res.status(400).json({ message: 'Ошибка при смене пароля.' });
    });
  });
};
