var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var request = require ('request');

/* GET home page. */
router.post('/uploaddetails', function(req,res,next) {
	var formdata = {
		Data: {data: {name: req.body.name, aadharid: req.body.aadharid, age: req.body.age},
  		file: fs.createReadStream(req.body.picture),
	}}
	request.post({url:'<YourUrl>', formData: formData}, function optionalCallback(err, httpResponse, body) {
	  	if (err) {
	    	return console.error('upload failed:', err);
	  	}
	  	console.log('Upload successful!  Server responded with:', body);
	  	if(body.answer = "yes")
	  	{
	  		next();
	  	}
	}
}, passwordless.requestToken(
		// Simply accept every user
		function(user, delivery, callback) {
			callback(null, user);
		}),
		function(req,res) {
			res.render('sent');
		}
});
module.exports = router;
