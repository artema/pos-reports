var AWS = require('aws-sdk'),
    moment = require('moment');

function formatDate(date, days) {
  var result = moment(date);

  if (days > 0) {
    result.add(days, 'days');
  }

  return result.format('YYYY-MM-DD 00:00:00');
}

function formatDateShort(date, days) {
  var result = moment(date);

  if (days > 0) {
    result.add(days, 'days');
  }

  return result.format('YYYY-MM-DD');
}

function Reports(pool) {
  this._pool = pool;
}

Reports.prototype.customer_average = function(query) {
  return this._report(
    'SELECT `location_key`, DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `value` FROM `report-customer-average` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDate(query.date), formatDate(query.date, query.days) ]
  );
};

Reports.prototype.customer_top = function(query) {
  return this._report(
    'SELECT `customer_key`, DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `value` FROM `report-customer-top` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDate(query.date), formatDate(query.date, query.days) ]
  );
};

Reports.prototype.item_pair = function(query) {
  return this._report(
    'SELECT `location_key`, DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `item1_key`, `item2_key` FROM `report-item-pair` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDate(query.date), formatDate(query.date, query.days) ]
  );
};

Reports.prototype.item_popular = function(query) {
  return this._report(
    'SELECT `location_key`, DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `item_key`, `value` FROM `report-item-popular` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDate(query.date), formatDate(query.date, query.days) ]
  );
};

Reports.prototype.item_top = function(query) {
  return this._report(
    'SELECT `location_key`, DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `item_key`, `value` FROM `report-item-top` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDate(query.date), formatDate(query.date, query.days) ]
  );
};

Reports.prototype.sales_total = function(query) {
  return this._report(
    'SELECT `location_key`, DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `amount` as `value` FROM `report-sales-total` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDate(query.date), formatDate(query.date, query.days) ]
  );
};

Reports.prototype.staff_top = function(query) {
  return this._report(
    'SELECT `location_key`, DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `staff_key`, `value` FROM `report-staff-top` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDate(query.date), formatDate(query.date, query.days) ]
  );
};

Reports.prototype.billing = function(query) {
  return this._report(
    'SELECT DATE_FORMAT(`date`, "%Y-%m-%d") `date`, `sales` FROM `billing` WHERE `company_id` = ? AND `date` >= ? AND `date` < ? ORDER BY `date` ASC',
    [ query.company.id, formatDateShort(query.date), formatDateShort(query.date, query.days) ]
  );
};

Reports.prototype.uploadData = function(company, payload) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var kinesis = new AWS.Kinesis();

    kinesis.putRecord({
      Data: JSON.stringify({
        company: company.id,
        sales: payload.sales || []
      }),
      PartitionKey: 'web',
      StreamName: 'pos-input'
    }, function(e) {
      if (e) {
        return reject(e);
      }

      resolve();
    });
  });
};

Reports.prototype._report = function(query, values) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._pool.getConnection(function(err, connection) {
      if (err) {
        return reject(err);
      }

      connection.query(query, values, function(err, rows) {
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
