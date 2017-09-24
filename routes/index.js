var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');

var redis = require("redis");
var client = redis.createClient();

var session=require('express-session');
var bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');
var passwordless = require('passwordless');

var models  = require(path.join(__dirname, '/../' ,'models'));
var users = models.users;
var Admins = models.Admins;

//Enable sessions
router.use(session({secret: 'ssshhhhh'}));
router.use(bodyParser.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', function (req, res, next) {
	// Add one admin
	var adminName = "admin";
	var adminPwd = "helloadmin";
	var salt=bcrypt.genSaltSync(1);
  	var hash=bcrypt.hashSync(adminPwd,salt);
  	adminPwd = hash;
  	var adminDetails = {
		name: adminName,
		password: adminPwd
  	};
  	Admins.sync({force: true})
  	.then( function() {
		return Admins.create(adminDetails);
  	});
	
	// Get host name
	router.host = req.protocol + '://' + req.get('host');
	console.log(router.host); 

	// Render home page
  	res.render('index', { msg: '' });
});

// On clicking one time link
router.get('/storeOrCheckDetails', 
	passwordless.restricted( { failureRedirect: '/' } ), 
	function (req, res) {
	users.findOne({ where: { email: req.user }}).then(function (voter) {
		// If user doesn't exist in the database
		if (!voter) {	
			// Get details from temporary redis database
			client.get(req.user, function (err, details) {
		  		result = details.split(',');

		  		// Hash aadhaar id 
		  		var salt = bcrypt.genSaltSync(1);
				var hash = bcrypt.hashSync(result[1], salt);
				var key = hash;

				// User details to be entered into database
		  		var userDetails = {
			  		aadhaarid: result[1],
			  		name: result[0],
			  		dob: result[2],
			  		address: result[3],
			  		email: req.user,
			  		fppath: result[4],
			  		voted: 'n',
			  		key: key
	  			};
	  			users.sync({force: false}).then(function(){
	  				return users.create(userDetails);
  				});

  				// Render instructions page 
  				res.render('instructions');
			});
		} else {
			req.session.user = req.user;
			// If user is present in the database and not voted yet
			if (voter.voted == 'n') {
				res.render('vote');
			} else { 	// If user has already voted
				res.render('voted');
			}
		}
	});
});

// On login, send one time link
router.post('/login', passwordless.requestToken(
	function(user, delivery, callback) {
		users.findOne ({ where: { email : user }})
		.then(function (voter) {
			if ( !voter ) {
				callback(null, null);
			} else
				callback(null, user);
		});
	}),
	function(req, res) {
		users.findOne({ where: { email: req.body.user }})
		.then(function (voter) {
			// If user attempts to login without registering
			if ( !voter ) {
				res.send('Register first');
			} else {	// One time link is sent
				res.render('sent');
			}
		}).catch(function (err) {
			res.send('Some error occured');
		});
	});

// Get Register Page
router.get('/register', function(req, res, next) {
	// Get host name
	router.host = req.protocol + '://' + req.get('host');
	res.render('register', { message: '' });
});

module.exports = router;
