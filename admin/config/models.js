var mysql = require('mysql'),
    users = require('../app/model/users');

module.exports = function(app) {
  var connection = mysql.createPool(app.get('database'));

  app.set('users', users(connection));
};
