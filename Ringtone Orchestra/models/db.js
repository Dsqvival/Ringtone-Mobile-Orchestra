var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/yo';

var connect = function(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.error('MongoDB Error!!!!!');
      console.log(err);
      return;
    }

    console.log("Connected correctly to server");
    callback(db);
  });
};

module.exports = function(collection, callback) {
  connect(function(db) {
    callback(db.collection(collection));
  });
};

module.exports.connect = connect;
