var express = require('express');
var router = express.Router();
var request = require ('request');
var fs = require('fs');
var path = require('path');

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

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var models  = require(path.join(__dirname, '/../' ,'models'));
var Admins = models.Admins;
var users = models.users;
var votes = models.votes;


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
router.post('/uploaddetails', upload.single('picture'), 
    function(req, res, next) {
	request.post({
        // url: 'http://c55e251e.ngrok.io/mock-api/user/auth',
        url : 'http://localhost:8000/apikey',
        formData: {
            aadhaar_id: req.body.aadhaarid,
            dob: req.body.dob,
            image: fs.createReadStream(__dirname + '/../' + req.file.path),
        }}, function(err, response, body) {
        	console.log(body);
            // var message = JSON.parse(body);
            // console.log(message.data);
            // else if(message.data.auth_status == true) {
            //  next();
            // }
            if (err) {
                console.log(err);
                res.render(error);
            } else if(body === 'yes') {
                next();
            } else {
            	res.render('register', {message: "Check aadhaarid / dob / fingerprint"})
            }
        });
	},  passwordless.requestToken(
		// Simply accept every user
		function(user, delivery, callback) {
			callback(null, user);
	}),	function(req, res) {
			client.on('error', function (err) {
				console.log(err);
			});
			client.set(req.body.user, req.body.name 
                + ',' + req.body.aadhaarid 
                + ',' + req.body.dob 
                + ',' + req.body.address 
                + ',' + req.file.path);

	  		res.render('sent');
	});
router.post('/uploadToVote', upload.single('picture'), 
    function(req, res, next) {
    var user = req.session.user;
    var key1 = req.body.keyone;
    var key2 = req.body.keytwo;
    var key3 = req.body.keythree;
    var party = req.body.party;
    console.log(party);

    var origKey, uploadedKey;
    var aadhaarid, dob;
    uploadedKey = key1 + key2 + key3;
    console.log(user);
    users.findOne({ where: { email: user }})
    .then(function (voter) {
        console.log(voter);
        aadhaarid = voter.aadhaarid;
        dob = voter.dob;
        origKey = voter.key;

        request.post({
            url: 'http://localhost:8000/apikey',
            formData: {
                aadhaar_id: aadhaarid,
                dob: dob,
                image: fs.createReadStream(__dirname+'/../'+req.file.path),
            }}, function(err, response, body) {
                // console.log(body);
                // var message = JSON.parse(body);
                // console.log(message.data);
                if(err) {
                    console.log(err);
                    res.render('error');
                }
                else if(body === 'yes' && uploadedKey === origKey) {
                    res.send('Thanks for voting');
                    /*Enter the vote in vote table after encrypting party name*/
                    var voteDetails = {
                        party: encrypt(req.body.party)
                    };
                    votes.sync({ force: false }).then(function () {
                        return votes.create(voteDetails);
                    });
                    users.update({
                        voted : 'y'
                    },{
                        where: { aadhaarid: voter.aadhaarid }
                    }).then(function () {});
                }
                else {
                    console.log(uploadedKey);
                    console.log(origKey);
                    res.send('Vote not registered');
                }
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
    
module.exports = router;
