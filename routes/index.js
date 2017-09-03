var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var redis = require("redis");
var client = redis.createClient();

var models  = require(path.join(__dirname, '/../' ,'models'));
var users = models.users;

/* GET home page. */
router.get('/', function(req, res, next) {
	router.host = req.protocol+'://'+req.get('host');
	console.log(router.host);
  	res.render('index', { msg: '' });
});

router.post('/login', function(req, res, next) {
	// users.findOne()
});
router.get('/storeOrCheckDetails',passwordless.restricted({failureRedirect : '/'}),function(req,res){
	users.findOne({where : {email : req.user}}).then(function(voter){
		if(!voter)
		{	
			client.get(req.user,function(err,details){
				console.log(details);
		  		result = details.split(',');
		  		var userDetails = {
			  		name : result[0],
			  		aadhaarid : result[1],
			  		age : result[2],
			  		address : result[3],
			  		email : req.user,
			  		fppath : req.file.path,
			  		allowvote : "n",
			  		voted : "n"
	  			};
	  			users.sync({force:false}).then(function(){
	  				return users.create(userDetails);
  				});
  				res.render('instructions');
			});
		}
	});
});

router.get('/register',function(req,res,next) {
	res.render('register');
});
module.exports = router;
 