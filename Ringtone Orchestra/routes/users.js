var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/alfa', function(req, res) {
  res.send("I'm Alfa and I'm cute")
});

router.get('/:id', function(req, res) {
  User.find({ id: req.params.id }, function(err, user) {
    res.send(user);
  });
});

module.exports = router;
