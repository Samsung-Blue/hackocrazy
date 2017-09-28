var express = require('express');
var router = express.Router();
var request = require ('request');
var fs = require('fs');
var path = require('path');

var passwordless = require('passwordless');
var bcrypt = require('bcrypt');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var mime = require('mime');
var crypto = require('crypto');

var session=require('express-session');
var bodyParser = require('body-parser');

var redis = require("redis");
var client = redis.createClient();

// Enable sessions
router.use(session({secret: 'ssshhhhh'}));
router.use(bodyParser.urlencoded({ extended: false }));

// For encryption of party name
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var models  = require(path.join(__dirname, '/../' ,'models'));
var Admins = models.Admins;
var users = models.users;
var votes = models.votes;


var storage = multer.diskStorage({
  	destination: function (req, file, cb) {
        var imagePath = path.join(__dirname, '/../', 'uploads');
        cb(null, imagePath)
  },
  filename: function (req, file, cb) {
    	crypto.pseudoRandomBytes(16, function (err, raw) {
      		cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    	});
  	}
});

var upload = multer({ storage: storage });

// Registration
router.post('/uploaddetails', upload.single('picture'), 
    function(req, res, next) {
    // Send Post request to aadhaar api
    // var imagePath = path.join(__dirname, '..', req.file.path); 
	request.post({
        url: 'http://139.59.86.176:8000/mock-api/user/auth',
        formData: {
            aadhaar_id: req.body.aadhaarid,
            dob: req.body.dob,
            image: fs.createReadStream(req.file.path),
        }}, function(err, response, body) {
        	if (body)
                var message = JSON.parse(body);
            if (err) {
                console.log(err);
                res.render('error',{message: err});
            } else if(message.data.auth_status == true) {
                // Only if aadhaar id, age and fingerprint is verified , proceed
                next();
            } else {
            	res.render('register', {message: "Check aadhaarid / dob / fingerprint"})
            }
        });
	},  passwordless.requestToken(
		// Accept every user who is verified and send one time link
		function(user, delivery, callback) {
			callback(null, user);
	}),	function(req, res) {
			client.on('error', function (err) {
				console.log(err);
			});
            // Insert the registration form details into temporary database ( redis )
			client.set(req.body.user, req.body.name 
                + ',' + req.body.aadhaarid 
                + ',' + req.body.dob 
                + ',' + req.body.address 
                + ',' + req.file.path);

            // One time link is sent
	  		res.render('sent');
	});

// Vote request
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
    // Three parts of key uploaded by user 
    uploadedKey = key1 + key2 + key3;

    console.log(user);
    // To check aadhaar id with the key uploaded by the user
    users.findOne({ where: { email: user }})
    .then(function (voter) {
        
        aadhaarid = voter.aadhaarid;
        dob = voter.dob;
        origKey = voter.key;
        var imagePath = path.join(__dirname, '..', req.file.path); 
        // Check the fingerprint uploaded again
        request.post({
            url: 'http://139.59.86.176:8000/mock-api/user/auth',
            formData: {
                aadhaar_id: aadhaarid,
                dob: dob,
                image: fs.createReadStream(imagePath),
            }}, function(err, response, body) {
                if (body)
                    var message = JSON.parse(body);
                if(err) {
                    console.log(err);
                    res.render('error', {message: err});
                }
                else if(message.data.auth_status == true 
                    && bcrypt.compareSync(aadhaarid, uploadedKey)) {
                    // If fingerprint is verified and uploaded key is checked with aadhaar id
                    res.send('Thanks for voting');

                    // Enter the vote in vote table after encrypting party name
                    var voteDetails = {
                        party: encrypt(req.body.party)
                    };

                    // Add vote to votes table
                    votes.sync({ force: false }).then(function () {
                        return votes.create(voteDetails);
                    });

                    // Update users table
                    users.update({
                        voted : 'y'
                    },{
                        where: { aadhaarid: voter.aadhaarid }
                    }).then(function () {});

                }
                else {
                    // Vote is not registered 
                    res.send('Vote not registered');
                    console.log(bcrypt.compareSync(aadhaarid, uploadedKey));
                }
            });
        });
    });

// Encryption function
function encrypt (text) {
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
 
// Decryption function
function decrypt (text) {
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = router;
