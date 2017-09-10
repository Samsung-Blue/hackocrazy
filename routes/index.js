var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var redis = require("redis");
var client = redis.createClient();
var session=require('express-session');
var bodyParser = require('body-parser');

var passwordless = require('passwordless');

var models  = require(path.join(__dirname, '/../' ,'models'));
var users = models.users;

router.use(session({secret: 'ssshhhhh'}));
router.use(bodyParser.urlencoded({ extended: false }));



/* GET home page. */
router.get('/', function(req, res, next) {
	router.host = req.protocol+'://'+req.get('host');
	console.log(router.host);
	// var userDetails = {
 //  		aadhaarid : 222,
 //  		name : "",
 //  		age : 0,
 //  		address : "",
 //  		email : "",
 //  		fppath : "",
 //  		allowvote : "n",
 //  		voted : "n"
	// };
	// users.sync({force:false}).then(function(){
	// 	return users.create(userDetails);
	// });
  	res.render('index', { msg: '' });
});


router.get('/storeOrCheckDetails',passwordless.restricted({failureRedirect : '/'}),function(req,res){
	users.findOne({where : {email : req.user}}).then(function(voter){
		if(!voter)
		{	
			client.get(req.user,function(err,details){
				console.log(details);
		  		result = details.split(',');
		  		var userDetails = {
			  		aadhaarid : result[1],
			  		name : result[0],
			  		age : result[2],
			  		address : result[3],
			  		email : req.user,
			  		fppath : result[4],
			  		allowvote : "n",
			  		voted : "n"
	  			};
	  			users.sync({force: true}).then(function(){
	  				return users.create(userDetails);
  				});
  				res.render('instructions');
			});
		}
		else {
			res.send("You have been logged in");
		}
	});
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
		users.findOne({ where: { email: req.body.user }})
		.then(function (voter) {
			if ( !voter ) {
				res.send('Register first');
			} else {
				res.render('sent');
			}
		}).catch(function (err) {
			res.send('Some error occured');
		});
	});


router.get('/register', function(req,res,next) {
	res.render('register');
});

module.exports = router;
 