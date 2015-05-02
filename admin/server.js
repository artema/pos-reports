// server.js

var app = require('express')();
var http = require('http').createServer(app);

// configuration ===============================================================

require('./config/variables')(app);
require('./config/middleware')(app);
require('./config/models')(app);
require('./config/authentication')(app);
require('./config/views')(app);

// application =================================================================

require('./app/authentication')(app);
require('./app/routes')(app);

// server ======================================================================

var server = http.listen(process.env.PORT || 8081, function() {
	console.log("App listening on port " + server.address().port);
});
