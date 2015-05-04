var moment = require('moment');

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD 00:00:00');
}

function Reports(pool) {
  this._pool = pool;
}

Reports.prototype.customer_average = function(query) {
  return this._report(
    'SELECT `location_key`, `date`, `value` FROM `report-customer-average` WHERE `company_id` = ? AND `date` = ?',
    [ query.company.id, formatDate(query.date) ]
  );
};

Reports.prototype.customer_top = function(query) {
  return this._report(
    'SELECT `customer_key`, `date`, `value` FROM `report-customer-top` WHERE `company_id` = ? AND `date` = ?',
    [ query.company.id, formatDate(query.date) ]
  );
};

Reports.prototype.item_pair = function(query) {
  return this._report(
    'SELECT `location_key`, `date`, `item1_key`, `item2_key` FROM `report-item-pair` WHERE `company_id` = ? AND `date` = ?',
    [ query.company.id, formatDate(query.date) ]
  );
};

Reports.prototype.item_popular = function(query) {
  return this._report(
    'SELECT `location_key`, `date`, `item_key`, `value` FROM `report-item-popular` WHERE `company_id` = ? AND `date` = ?',
    [ query.company.id, formatDate(query.date) ]
  );
};

Reports.prototype.item_top = function(query) {
  return this._report(
    'SELECT `location_key`, `date`, `item_key`, `value` FROM `report-item-top` WHERE `company_id` = ? AND `date` = ?',
    [ query.company.id, formatDate(query.date) ]
  );
};

Reports.prototype.sales_total = function(query) {
  return this._report(
    'SELECT `location_key`, `date`, `amount` as `value` FROM `report-sales-total` WHERE `company_id` = ? AND `date` = ?',
    [ query.company.id, formatDate(query.date) ]
  );
};

Reports.prototype.staff_top = function(query) {
  return this._report(
    'SELECT `location_key`, `date`, `staff_key`, `value` FROM `report-staff-top` WHERE `company_id` = ? AND `date` = ?',
    [ query.company.id, formatDate(query.date) ]
  );
};

Reports.prototype._report = function(query, params) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      connection.query(query, params, function(err, rows) {
        if (err) {
          return reject(err);
        }

        connection.release();

        resolve(rows || []);
      });
    });
  });
};

module.exports = function(pool) {
  return new Reports(pool);
};
