var mysql = require('mysql'),
    reports = require('../app/model/reports'),
    users = require('../app/model/users');

module.exports = function(app) {
  var connection = mysql.createPool(app.get('database'));

  app.set('reports', reports(connection));
  app.set('users', users(connection));
};
