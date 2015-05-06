var passwordHash = require('password-hash'),
    uuid = require('node-uuid');

function Users(pool) {
  this._pool = pool;
}

Users.prototype.findByName = function(name) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      connection.query('SELECT * FROM `user` WHERE `login` = ? LIMIT 1', [name], function(err, rows) {
        if (err) {
          return reject(err);
        }

        connection.release();

        resolve(rows[0] || null);
      });
    });
  });
};

Users.prototype.getCompany = function(user) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      connection.query('SELECT * FROM `company` WHERE `id` = ?', [user.company_id], function(err, rows) {
        if (err) {
          return reject(err);
        }

        connection.release();

        resolve(rows[0] || null);
      });
    });
  });
};

Users.prototype.validatePassword = function(user, password) {
  return passwordHash.verify(password, user.password);
};

Users.prototype.changePassword = function(user, password) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (!password || password.length < 4) {
      return reject(new Error('Bad password'));
    }

    password = passwordHash.generate(password);

    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      connection.query('UPDATE `user` SET `password` = ? WHERE `id` = ?', [ password, user.id ], function(err) {
        if (err) {
          return reject(err);
        }

        connection.release();

        resolve();
      });
    });
  });
};

Users.prototype.createUser = function(user) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (user.password.length < 4) {
      return reject(new Error('Bad password'));
    }

    user.password = passwordHash.generate(user.password);

    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      var token = self._generateAuthToken();

      connection.query('INSERT INTO `user` (login, password, company_id, authtoken) VALUES(?, ?, ?, ?)', [ user.login, user.password, user.company_id, token ], function(err, result) {
        if (err) {
          return reject(err);
        }

        connection.release();

        resolve(result.insertId);
      });
    });
  });
};

Users.prototype.createCompany = function(company) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      connection.query('INSERT INTO `company` (name) VALUES(?)', [ company.name ], function(err, result) {
        if (err) {
          return reject(err);
        }

        connection.release();

        resolve(result.insertId);
      });
    });
  });
};

Users.prototype.generateAuthToken = function(user, password) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      var token = self._generateAuthToken();

      connection.query('UPDATE `user` SET `authtoken` = ? WHERE `id` = ?', [ token, user.id ], function(err) {
        if (err) {
          return reject(err);
        }

        connection.release();

        user.authtoken = token;

        resolve(token);
      });
    });
  });
};

Users.prototype._generateAuthToken = function() {
  return uuid.v4().replace(/\-/g, '');
};

module.exports = function(pool) {
  return new Users(pool);
};
