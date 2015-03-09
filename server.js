/*jslint node: true */
"use strict";

var spark = require('spark');
var http = require('http');

var checkStatus = function(){
	http.get("http://mystatus.skype.com/savnika.num", function(res) {
	  	console.log("Got response: " + res.statusCode);
	  	res.on('data', function (chunk) {
		    console.log('BODY: ' + chunk);
		    spark.login({ username: 'romain@42factory.com', password: '42spark' }, sendSpark(chunk));
		});
	}).on('error', function(e) {
	  	console.log("Got error: " + e.message);
	});

	setTimeout(checkStatus, 2000);
}

var sendSpark = function(statusCode) {
  	// If login is successful we get and accessToken,
  	// we'll use that to call Spark API ListDevices

  	var devicesPr = spark.listDevices();

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

	      	// Once you have a device/core instance you can use that to call functions on it.
	      	// The main difference between this and directly using the main `spark` instance is
	      	// that you no longer need to pass the id.
	      	var core = devices[0];

	      	switch(statusCode){
	      	case 0:
				core.callFunction('color', '0', callback);
			case 1:
				core.callFunction('color', '40', callback);
			case 2:
				core.callFunction('color', '80', callback);
			case 3:
				core.callFunction('color', '120', callback);
			case 4:
				core.callFunction('color', '160', callback);
	      	}
	    },
	    function(err) {
	    	console.log('API call failed: ', err);
	    }
	);
});

checkStatus();

