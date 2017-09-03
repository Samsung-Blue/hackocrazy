var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');

var passwordless = require('passwordless');

var models  = require(path.join(__dirname, '/../' ,'models'));
var users = models.users;

/* GET home page. */
router.get('/', function(req, res, next) {
	router.host = req.protocol + '://' + req.get('host');
  	res.render('index', { msg: '' });
});

router.post('/login',passwordless.requestToken(
	function(user, delivery, callback) {
		users.findOne ({where : {email : user}})
		.then(function(voter) {
			if ( !voter ) {
				callback(null,null);
			} else
				callback(null,user);
		});
	}),
	function(req, res) {
		users.findOne({ where: { email: user }})
		.then(function (voter) {
			if ( !voter ) {
				res.render('sent');
			} else {
				res.render('index', { msg: 'User does not exist' });
			}
		}).catch(function (err) {
			res.render('index', { msg: 'Some error occurred' });
		});
	});

router.get('/register', function(req,res,next) {
	res.render('register');
});

module.exports = router;
