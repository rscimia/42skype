/*jslint node: true */
"use strict";

var spark =require('spark');
var http = require('http');

var http = require('http');

var server = http.createServer(function(req, res) {

	spark.on('login', function() {
	  	// If login is successful we get and accessToken,
	  	// we'll use that to call Spark API ListDevices
	  	var devicesPr = spark.listDevices();

	  	res.writeHead(200);
  		res.end('Vous êtes bien logué');

	  	devicesPr.then(
	    // We get an array with devices back and we list them
	    function(devices){
	    	console.log('API call List Devices: ', devices);

	     	// callback to be executed by each core
	      	var callback = function(err, data) {
	        	if (err) {
	          		console.log('An error occurred while getting core attrs:', err);
	        	} else {
	          		console.log('Core attr retrieved successfully:', data);
	        	}
	     	};

	      	// The function needs to be defined  in the firmware uploaded to the
	      	// the Spark core and registered to the Spark cloud, same thing we do
	      	// with variables. You pass along the name of the function and the params.
	      	spark.callFunction(devices[0].id, 'color', '50', callback);

	      	// Once you hvae a device/core instance you can use that to call functions on it.
	      	// The main difference between this and directly using the main `spark` instance is
	      	// that you no longer need to pass the id.
	      	var core = devices[0];
	      	core.callFunction('color', '120', callback);
	    },
	    function(err) {
	    	console.log('API call failed: ', err);
	    });
	});

	// Login as usual
	spark.login({ username: 'romain@42factory.com', password: '42spark' });
  	
});

server.listen(8080);
