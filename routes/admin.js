var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs');
var session=require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var email   = require("emailjs");
var emailDetails = require('../env.js');
var yourEmail = emailDetails.email;
var yourPwd = emailDetails.pwd;
var yourSmtp = emailDetails.smtp;
var server  = email.server.connect({
   user:    yourEmail, 
   password: yourPwd, 
   host:    yourSmtp, 
   ssl:     true,
});


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
var crypto = require('crypto');



router.use(session({secret: 'ssshhhhh'}));
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/',function(req, res) {
	res.render('adminlogin',{msg: ""});
});

router.post('/login',function(req,res) {
	Admins.findOne({where : {name : req.body.user} }).then(function(admin){
		if(bcrypt.compareSync(req.body.password,admin.password))
		{
			// users.findAll().then(function(voters){
			// 	res.render('admin',{rows : voters});
			// }).catch(function(err){
			// 	console.log(err);
			// });
			res.render('adminop');
		}
		else
		{
			res.render('adminlogin',{msg: "Wrong Username or Password"});
		}
	}).catch(function(err){
		console.log(err);
		res.render('adminlogin',{msg: "Some error has occurred"});
	});
});
router.post('/sendKeyOne',function(req,res) {
	users.findAll().then(function(rows){
		rows.forEach(function(item) {
			var message = {
			text : item.aadhaarid,
			from : yourEmail,
			to : item.email,
			subject : "Key1",
			attachment:
			[
				
			]
		};
		server.send(message,function(err,message){
			console.log(err||message);
			if(!err)
			{
				res.render('admin');
			}
		});

		});
		
	});
});
module.exports = router;