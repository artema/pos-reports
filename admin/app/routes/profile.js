var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).end();
};

var onError = function(res) {
  return function(e) {
    console.error(e);
    res.status(500).end();
  };
};

module.exports = function(app) {
  app.get('/api/profile', isAuthenticated, function(req, res) {
    var users = app.get('users');

    users.getCompany(req.user).then(function(company) {
      var user = req.user;

      res.json({
        auth_token: user.authtoken,
        company: company.name
      });
    }, onError(res));
  });

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

  app.post('/api/profile/sign-up', isAuthenticated, function(req, res) {
    var users = app.get('users');

    users.findByName(req.body.username).then(function(user) {
      if (user) {
        return res.status(400).json({ message: 'Пользователь с таким логином уже существует.' });
      }

      user = {
        company_id: req.user.company_id,
        login: req.body.username,
        password: req.body.password
      };

      users.createUser(user).then(function(id) {
        res.json({ id: id });
      }, function(e) {
        console.error(e);
        res.status(400).json({ message: 'Ошибка при создании пользователя.' });
      });
    }, function(e) {
      console.error(e);
      res.status(400).json({ message: 'Ошибка при регистрации пользователя.' });
    });
  });

  app.post('/api/profile/create-company', isAuthenticated, function(req, res) {
    var users = app.get('users');

    var company = {
      name: req.body.name
    };

    users.createCompany(company).then(function(id) {
      res.json({ id: id });
    }, function(e) {
      console.error(e);
      res.status(400).json({ message: 'Ошибка при создании компании.' });
    });
  });

  app.post('/api/profile/generate-auth-token', isAuthenticated, function(req, res) {
    var users = app.get('users');

    users.generateAuthToken(req.user).then(function(token) {
      res.json({ token: token });
    }, function(e) {
      console.error(e);
      res.status(400).json({ message: 'Ошибка при генерации ключа.' });
    });
  });
};
