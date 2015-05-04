var moment = require('moment');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).end();
};

var onData = function(res) {
  return function(data) {
    res.json(data);
  };
};

var onError = function(res) {
  return function(e) {
    console.error(e);
    res.status(500).end();
  };
};

module.exports = function(app) {
  function createReport(name) {
    app.get('/api/report/' + name, isAuthenticated, function(req, res) {
      var reports = app.get('reports'),
          users = app.get('users');

      users.getCompany(req.user).then(function(company) {
        reports[name.replace('-', '_')]({
          date: req.query.date,
          days: req.query.days || 1,
          company: company
        }).then(onData(res), onError(res));
      }, onError(res));
    });
  }

  createReport('customer-average');
  createReport('customer-top');
  createReport('item-pair');
  createReport('item-popular');
  createReport('item-top');
  createReport('sales-total');
  createReport('staff-top');
};
