// GLOBAL because it's used everywhere
path = require('path');

var express = require('express');
var app = express();

// Connect to Mongo
var mongodbConn = require(path.join(__dirname, 'services', 'mongoUtil'));
mongodbConn.connect();

// mongo db and sql db connection
var sql = require("mssql");
var mongo = require("mongodb");

app.use(express.static(path.join(__dirname, '..', 'public')));


app.get('/', function(req, res){
    res.send("Hi there! Can I help you with transfering data from MSSQL to Mongo db.\n");
});

app.get('/categories', function (req, res) {
    // config for your SQL database
    var config = {
        user: 'ChupUser',
        password: 'chup',
        server: 'EPUAKYIST0007', 
        database: 'GadgetLineDb' 
    };
    // connect to your SQL database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Categories', function (err, recordset) {
            if (err) {
            	console.log(err)
			} else {
				
			}
            // send records as a response
            res.send(recordset);
        });
    });
});

app.listen(8181, function(){
	console.log('Listening on port 8181');
});

module.exports = app;

// Set absolute paths for partials
app.locals.basedir = path.join(__dirname, '');
