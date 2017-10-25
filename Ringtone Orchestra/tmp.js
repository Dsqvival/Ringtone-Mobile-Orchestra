var mongo = require('./mongo');

mongo.connect(function(db) {
  var test = db.collection('test');

  test.insert({ random: 'ha' }, function(err, results) {
    console.log(err)
    console.log(results);

    test.find({}).toArray(function(err, docs) {
      console.log(docs);
    });
  });
});
