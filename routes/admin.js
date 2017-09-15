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

router.post('/login',function(req,res){
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

module.exports = router;