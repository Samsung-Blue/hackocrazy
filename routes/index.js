var express = require('express');
var router = express.Router();
var request = require('request');

var models  = require(path.join(__dirname, '/../' ,'models'));
var users = models.users;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { msg: '' });
});

router.post('/login', function(req, res, next) {
	// users.findOne()
});

module.exports = router;
