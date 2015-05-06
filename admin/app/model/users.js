var passwordHash = require('password-hash');

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

module.exports = function(pool) {
  return new Users(pool);
};
