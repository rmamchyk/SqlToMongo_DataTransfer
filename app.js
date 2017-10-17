// GLOBAL because it's used everywhere
path = require('path');

var express = require('express');
var app = express();

// Connect to Mongo
var mongodbConn = require(path.join(__dirname, 'services', 'mongoUtil'));
mongodbConn.connect();

app.use(express.static(path.join(__dirname, '..', 'public')));


app.get('/', function(req, res){
    res.send("Hi there! Can I help you with transfering data from MSSQL to Mongo db.\n");
});

app.listen(8181, function(){
	console.log('Listening on port 8181');
});

module.exports = app;

// Set absolute paths for partials
app.locals.basedir = path.join(__dirname, '');
