var express = require('express');
var router = express.Router();
var path = require('path');

var session=require('express-session');
var bodyParser = require('body-parser');

var bcrypt=require('bcryptjs');

var models  = require(path.join(__dirname, '/../' ,'models'));
var Admins = models.Admins;
var users = models.users;

var email   = require("emailjs");
var emailDetails = require('../env.js');
var yourEmail = emailDetails.email;
var yourPwd = emailDetails.pwd;
var yourSmtp = emailDetails.smtp;
var server  = email.server.connect({
   user:    yourEmail, 
   password: yourPwd, 
   host:    yourSmtp, 
   ssl:     true
});

// Enable sessions
router.use(session({secret: 'ssshhhhh'}));
router.use(bodyParser.urlencoded({ extended: false }));

// Get admin login page
router.get('/', function (req, res) {
	res.render('adminlogin', { msg: '' });
});

// Login for admins
router.post('/login', function (req, res) {
	Admins.findOne( { where: { name: req.body.user } } )
	.then(function (admin) {
		// Compare password
		if (bcrypt.compareSync(req.body.password, admin.password)) {
			req.session.user = 'admin';
			// Render admin operations page
			res.render('adminop', {msg: ''});
		} else {
			// Render login page 
			res.render('adminlogin', { msg: 'Wrong Username or Password' });
		}
	}).catch(function (err) {
		console.log(err);
		res.render('adminlogin', { msg: 'Some error has occurred' });
	});
});

// To send key via email
router.post('/sendKey', function (req, res) {
	// Send key to all users
	users.findAll().then(function (rows) {
		rows.forEach(function (item) {
			var keyPart;

			console.log(key);

			// Three different keys
			if(req.body.msg == 'keyOne') {
				keyPart = item.key.substring(0, item.key.length / 3);
			} else if(req.body.msg == 'keyTwo') {
				keyPart = item.key.substring(item.key.length / 3, item.key.length * 2 / 3);
			} else if(req.body.msg == 'keyThree') {
				keyPart = item.key.substring(item.key.length * 2 / 3, item.key.length);
			}

			// Email to be sent by admin
			var message = {
				text: keyPart,
				from: yourEmail,
				to: item.email,
				subject: "Key for voting",
				attachment:
					[
						
					]
			};

			server.send(message, function (err, message) {
				console.log(err||message);
				if (!err) {
					res.render('adminop', { msg: req.body.msg + ' Sent' });
				}
			});
		});	
	});
});

module.exports = router;