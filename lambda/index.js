var async = require('async'),
    reportsHandler = require('./reports');

exports.handler = function(event, context) {
  var tasks = event.Records.map(function(record) {
    var entry = JSON.parse(new Buffer(record.kinesis.data, 'base64').toString('ascii'));

    return reportsHandler(entry);
  });

  async.parallel(tasks, function(err, res) {
		context.done(err || null, 'Complete');
	});
};
