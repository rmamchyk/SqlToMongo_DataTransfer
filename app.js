var path = require('path');
var express = require('express');
var app = express();

// mongo configuration
var mongodbConn = require(path.join(__dirname, 'services', 'mongoUtil'));
mongodbConn.connect();

// sql configuration
var sqlConfig = {
        user: 'ChupUser',
        password: 'chup',
        server: 'EPUAKYIST0007', 
        database: 'GadgetLineDb'
};

// sql connection
var sql = require("mssql");

// mongo connection
var mongo = require("mongodb");

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function(req, res){
    res.send("Hi there! Can I help you with transfering data from MSSQL to Mongo db.\n");
});

app.get('/sql/categories', function (req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Categories', function (err, result) {
            if (err) console.log(err);
            res.send(result.recordset);
            sql.close();
        });
    });
});

app.get('/sql/products', function (req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Products', function (err, result) {
            if (err) console.log(err);
            res.send(result.recordset);
            sql.close();
        });
    });
});

app.get('/mongo/categories', function(req, res){

});

app.get('/mongo/produts', function(req, res){
	
});

app.listen(8181, function(){
	console.log('Listening on port 8181');
});

module.exports = app;

// Set absolute paths for partials
app.locals.basedir = path.join(__dirname, '');
