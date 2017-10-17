var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

exports.connect = function() {
    if(mongo.DB) { return mongo.DB }
    mongoClient.connect('mongodb://localhost:27017/gadgetline', function(err, db) {
        if(err){
            console.log("Problem with mongo, help!");
            console.log(err);
        }else{
            console.log("Connected mongodb.")
            mongo.DB = db
        }
    });
}