var AWS = require('aws-sdk'),
    moment = require('moment'),
    uuid = require('node-uuid');

if (process.env.NODE_ENV !== 'production') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'me' });
  AWS.config.update({ region: 'eu-west-1' });
}

function run(day, company) {
  function getRandom(array) {
    return array[Math.round(Math.random() * (array.length - 1))];
  }

  var items = [
    { name: 'item1', price: 10.5 },
    { name: 'item2', price: 5 },
    { name: 'item3', price: 9 },
    { name: 'item4', price: 15.75 },
    { name: 'item5', price: 3.5 },
    { name: 'item6', price: 10 },
    { name: 'item7', price: 0.5 },
    { name: 'item8', price: 7 },
    { name: 'item9', price: 4 }
  ];

  var customers = [
    "customer1",
    "customer2",
    "customer3",
    "customer4"
  ];

  var staff = [
    "staff1",
    "staff2",
    "staff3",
    "staff4"
  ];

  var locations = [
    "location1",
    "location2"
  ];

  var kinesis = new AWS.Kinesis();

  for (var v = 0; v < 5; v++) {
    var sales = [];
    for (var i = 0; i < 100; i++) {
      var checkId = uuid.v4(),
          checkLocation = getRandom(locations),
          checkStaff = getRandom(staff),
          checkCustomer = getRandom(customers),
          checkDate = moment(day)
            .add(Math.floor(24 * Math.random()), 'hours')
            .add(Math.floor(60 * Math.random()), 'minutes')
            .add(Math.floor(60 * Math.random()), 'seconds');

      if (Math.random() < 0.7) {
        checkCustomer = null;
      }

      for (var j = 0; j < Math.random() * 4; j++) {
        var item = getRandom(items);
        var check = {
          time: checkDate.format(),
          location: checkLocation,
          check: checkId,
          staff: checkStaff,
          item: item.name,
          price: item.price,
          customer: checkCustomer
        };

        sales.push(check);
      }
    }

    kinesis.putRecord({
      Data: JSON.stringify({
        company: company,
        sales: sales
      }),
      PartitionKey: 'test',
      StreamName: 'pos-input'
    }, function(err) {
      if (err) {
        console.error(err, err.stack);
      }
      else {
        console.log('Complete');
      }
    });
  }
}

run('2015-05-05', 1);
