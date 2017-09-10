var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var request = require ('request');
var fs = require('fs');

var passwordless = require('passwordless');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var mime = require('mime');
var crypto = require('crypto');
var session=require('express-session');
var bodyParser = require('body-parser');
var redis = require("redis");
var client = redis.createClient();
router.use(session({secret: 'ssshhhhh'}));
router.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
  	destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    	crypto.pseudoRandomBytes(16, function (err, raw) {
      		cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    	});
  	}
});

var upload = multer({ storage: storage });

/* GET home page. */
router.post('/uploaddetails', upload.single('picture'), function(req,res,next) {
	var formdata = {

		Data: { data: { name: req.body.name, aadharid: req.body.aadhaarid, age: req.body.age},
  		file: fs.createReadStream(req.file.path),
	}}
	request.post({url:'http://localhost:8000/apikey'}, function optionalCallback(err, httpResponse, body) {

	  	if (err) {
	    	return console.error('upload failed:', err);
	  	}
	  	console.log('Upload successful!  Server responded with:', body);
	  	if(body.answer = "yes")
	  	{
	  		next();
	  	}
	});
	},  passwordless.requestToken(
		// Simply accept every user

		function(user, delivery, callback) {
			callback(null, user);
	}),	function(req, res) {
			client.on("error",function(err){
				console.log(err);
			});
			client.set(req.body.user, req.body.name + ',' + req.body.aadhaarid + ',' + req.body.age + ',' + req.body.address + ',' + req.file.path);

	  		res.render('sent');
	});
module.exports = router;
