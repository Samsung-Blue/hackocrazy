var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs');
var session=require('express-session');
var path = require('path');
var bodyParser = require('body-parser');

var models  = require(path.join(__dirname, '/../' ,'models'));
var Admins = models.Admins;
var users = models.users;
var vote = models.vote;

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


var images= models.images;
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var mime = require('mime');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';



router.use(session({secret: 'ssshhhhh'}));
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function (req, res) {
	res.render('adminlogin', { msg: '' });
});

router.post('/login', function (req, res) {
	Admins.findOne( { where: { name: req.body.user } } )
	.then(function (admin) {
		if (bcrypt.compareSync(req.body.password, admin.password)) {
			req.session.user = 'admin';
			res.render('adminop',{msg:'' });
		} else {
			res.render('adminlogin', { msg: 'Wrong Username or Password' });
		}
	}).catch(function (err) {
		console.log(err);
		res.render('adminlogin', { msg: 'Some error has occurred' });
	});
});
router.post('/sendKey', function (req, res) {
	users.findAll().then(function (rows) {
		rows.forEach(function (item) {
			var keyPart;
			console.log(req.body.msg);
			if(req.body.msg == 'keyOne') {
				keyPart = item.key.substring(0,item.key.length/3);
			} else if(req.body.msg == 'keyTwo') {
				keyPart = item.key.substring(item.key.length/3,item.key.length*2/3);
			} else if(req.body.msg == 'keyThree') {
				keyPart = item.key.substring(item.key.length*2/3,item.key.length);
			}
			console.log(keyPart);

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
					res.render('adminop',{msg: 'Key sent successfully'});
				}
			});
		});	
	});
});

function encrypt (text) {
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
 
function decrypt (text) {
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
router.post('/countVotes', function(req,res,next) {
	var partyOneCount = 0;
	var partyTwoCount = 0;
	var partyThreeCount = 0;

	votes.findAll().then(function(partynames) {
		partynames.forEach(function(item) {
			var party = decrypt(item);
			if(party == 'Party1') {
				partyOneCount++;
			}
			else if( party == 'Party2') {
				partyTwoCount++;
			}
			else if( party == 'Party3') {
				partyThreeCount++;
			}

		});
	});
	res.render('adminop',{msg: 'Party One :'+ partyOneCount + 'Party Two :'+partyTwoCount + 'Party Three :'+partyThreeCount});
});
router.post('/logout',function(req,res,next) {
	req.session.user=null;
	res.render('adminlogin',{msg: ""});
});

module.exports = router;