// **********************************************************
// app.js

console.log('Connect2Health');

// **********************************************************
// require 

var package_json = require('./package.json');
var http = require("http");
var https = require("https");
var url = require('url');
var express = require('express');
var js2xmlparser = require('js2xmlparser');
var path = require('path');
var fsr = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var configEnv = require('./config/env.json');

// **********************************************************
// config

var NODE_ENV = process.env.NODE_ENV;
console.log('NODE_ENV : '+ NODE_ENV );

var NODE_PORT =  process.env.PORT || configEnv[NODE_ENV].NODE_PORT;
console.log('NODE_PORT : '+ NODE_PORT );

var GS_PATH = configEnv[NODE_ENV].GS_PATH;
console.log('GS_PATH : '+ GS_PATH );

// **********************************************************
// console start

console.log('package_json.name : '+ package_json.name );
console.log('package_json.version : '+ package_json.version );
console.log('package_json.description : '+ package_json.description );

//console.log('config_app_port : '+ config_app_port );
//console.log('config_db_url : '+ config_db_url );

// **********************************************************
// logging

var logDirectory = __dirname + '/log';

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = fsr.getStream({
	filename: logDirectory + '/c2h-api-%DATE%.log',
	frequency: 'daily',
	verbose: false
});

var app = express();

app.use(morgan('combined', {stream: accessLogStream}))

// **********************************************************

//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(__dirname + '/client'));

// **********************************************************
// server

var server = app.listen(NODE_PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('\n  listening at http://%s:%s', host, port);

});

module.exports = app;
