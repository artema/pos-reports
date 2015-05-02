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

      connection.query('SELECT * FROM `user` WHERE `login` = ?', [name], function(err, rows) {
        if (err) {
          return reject(err);
        }

        connection.release();

        resolve(rows);
      });
    });
  });
};

module.exports = function(pool) {
  return new Users(pool);
};
