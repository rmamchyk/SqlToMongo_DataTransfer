var path = require('path');
var express = require('express');
var app = express();

// Mongo db configuration
var mongodbConn = require(path.join(__dirname, 'services', 'mongoUtil'));
mongodbConn.connect();
var mongo = require("mongodb");

// SQL db configuration
var sqlConfig = {
        user: 'ChupUser',
        password: 'chup',
        server: 'EPUAKYIST0007', 
        database: 'GadgetLineDb',
        parseJSON: true
};
var sql = require("mssql");
var _ = require("underscore");

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function(req, res){
    res.send("Hi there! Can I help you with transfering data from MSSQL to Mongo db.\n");
});

app.get('/sql/categories', function (req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Categories;', function (err, result) {
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
        request.query('SELECT * FROM dbo.Products;', function (err, result) {
            if (err) console.log(err);
            res.send(result.recordset);
            sql.close();
        });
    });
});

app.get('/mongo/categories', function(req, res){
	var collection = mongo.DB.collection('categories');
	collection.find().toArray(function(err, docs) {
            if(err){
                console.log(err);
                console.log("Problem with loading Categories from mongodb!");
            }else{
                res.send(docs);
            }
        });
});

app.get('/mongo/products', function(req, res){
	var collection = mongo.DB.collection('products');
	collection.find().toArray(function(err, docs) {
            if(err){
                console.log(err);
                console.log("Problem with loading Products from mongodb!");
            }else{
                res.send(docs);
            }
        });
});

app.get('/transfer/categories', function(req, res){
		var collection = mongo.DB.collection('categories');

	    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Categories;', function (err, result) {
            if (err) console.log(err);
            res.send(result.recordset);
            sql.close();

           	//write the SQL recordset into Mongo "categories" collection.
            var bulk = collection.initializeUnorderedBulkOp();
            _.each(result.recordset, function(rec){
            	bulk.insert({ id: rec.Id, name: rec.Name, parentId: rec.ParentId});
            });
			bulk.execute();

        });
    });
});

app.get('/transfer/products', function(req, res){
	var collection = mongo.DB.collection('products');

	    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Products;', function (err, result) {
            if (err) console.log(err);
            res.send(result.recordset);
            sql.close();

            //write the SQL recordset into Mongo "products" collection.
            var bulk = collection.initializeUnorderedBulkOp();
            _.each(result.recordset, function(rec) {
            	bulk.insert({code: rec.Code, title: rec.Title, price: rec.Price, categoryId: rec.CategoryId});
            });
			bulk.execute();
        });
    });
});

app.listen(8181, function(){
	console.log('Listening on port 8181');
});

module.exports = app;

// Set absolute paths for partials
app.locals.basedir = path.join(__dirname, '');
