var db = require('../models/db');

var data = require('../public/data/data.json');

db.connect(function(db) {
  for (var i = 0; i < data.length; i += 1000) {
    db.collection('items').insert(data.slice(i, i + 1000), function(err, results) {
      if (err) {
        return console.log(err);
      }
      console.log('done');
    });
  }
});
