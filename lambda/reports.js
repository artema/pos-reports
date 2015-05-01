var AWS = require('aws-sdk'),
    s3 = new AWS.S3(),
    async = require('async'),
    stringify = require('csv-stringify'),
    moment = require('moment'),
    uuid = require('node-uuid');

function saveData(type, items) {
  columns = columns || [];

  var payloads = items.reduce(function(value, item) {
    if (!item) {
      return value;
    }

    var payload = value[item.session.id];

    if (!payload) {
      value[item.session.id] = payload = {
        session: item.session,
        data: []
      };
    }

    payload.data.push(item.data);
    return value;
  }, {});

  return Object.keys(payloads).map(function(key) {
    var payload = payloads[key];

    return function(next) {
      stringify(payload.data, function(err, output){
        if (err) {
          return next(err);
        }

        s3.putObject({
          Bucket: 'pos-reports',
          ContentType: 'text/csv',
          StorageClass: 'REDUCED_REDUNDANCY',
          Key: 'input/' + moment(payload.session.date).format('YYYY-MM-DD') + '/' + type + '/' + payload.session.id + '.csv',
          Body: output
        }, next);
      });
    };
  });
}

function getSession(sessions, time) {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  time = moment(time);

  var session = Object.keys(sessions).reduce(function(value, id) {
    var session = sessions[id];

    if (time.isSame(moment(session.date), 'day')) {
      return session;
    }

    return value;
  });

  if (!session) {
    session = {
      id: uuid.v4(),
      date: time.format('YYYY-MM-DD')
    };

    sessions[session.id] = session;
  }

  return session;
}

module.exports = function(entry) {
  var data = entry.data,
      tasks = [],
      sessions = {};

  if (data.sales) {
    console.log('Processing ' + data.sales.length + ' sale records...');

    tasks = tasks.concat(saveData('sales', data.sales.map(function(payload) {
      return {
        session: getSession(sessions, payload.time),
        data: [
          entry.company,
          payload.location,
          payload.time,
          payload.check,
          payload.staff,
          payload.customer,
          payload.item,
          payload.price
        ]
      };
    })));
  }

  return function(next) {
    console.log('Running ' + tasks.length + ' tasks...');

    async.parallel(tasks, next);
  };
};
