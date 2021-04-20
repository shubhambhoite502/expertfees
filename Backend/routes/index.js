var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('./../model/userModel');
var transport = require('./../config/mail');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
const app = require('../app');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const passport = require('passport');


/* register */
router.post('/register', function (req, res) {
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  let newUser = new User(req.body);
    User.findOne({$or:[{userid: req.body.userid},{email:req.body.email}]}, function (err, user) {
    if (user) {
      response = { success: false, message: 'Email or userid is already exist.' };
      res.json(response);
    } else {
      newUser.save(function (err, user) {
        if (err) {
          response = { success: false, message: err };
        } else {
          response = { success: true, message: 'User sign up successfully.' };
        }
        res.json(response);
      });
    }
  });
});

/* login */
router.post('/login', function (req, res, next) {
  let response = {};
  User.findOne({ userid: req.body.userid }, function (err, user) {
    if (err) {
      response = { success: false, message: err };
    } else if (user == null) {
      response = { success: false, message: 'User is not exist.' };
    } else {
     
      if (bcrypt.compareSync(req.body.password, user.password)) {
      
        const token = jwt.sign(user.toJSON(), process.env.SECERT_KEY, { expiresIn: 3600 });
        const payload = {
            id: user._id,
            email: user.email,
            userid: user.userid,
            admin: user.admin
        };
        response = { success: true, user: user,   token:'JWT ' + token,message:'User Login Successfully!' };
      } else {
        response = { success: false, message: 'Invalid Email/Password' };
      }
      
        }

    return res.json(response);
  });
});

// get user info

router.get('/userProfile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  response = {success: true, message: 'You are authorised!', user: req.user };
  res.json(response);
})


/* get Users */
router.post('/getUsers', function (req, res, next) {
  User.find({},function(err,users){  
    res.json(users);
});
})

/* admin login */
router.post('/admin-login', function (req, res, next) {
  let response = {};
  User.findOne({ userid: req.body.userid }, function (err, user) {
    if (err) {
      response = { success: false, message: err };
    } else if (user == null) {
      response = { success: false, message: 'User is not exist.' };
    } else {
      if (user.admin == true) {
       if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign(user.toJSON(), process.env.SECERT_KEY, { expiresIn: 3600 });
          const payload = {
            id: user._id,
            email: user.email,
            userid: user.userid,
            admin: user.admin
        };      
          response = { success: true, user: user,   token:'JWT ' + token,message:'User Login Successfully!' };
          
        } else {
          response = { success: false, message: 'Invalid Email/Password' };
        }
      } else {
        response = { success: false, message: 'Not authorized user.' };
      }
    }

    return res.json(response);
  });
});

/* forgot password */
router.post('/forgot-password', function (req, res, next) {
  let response = {};
  User.findOne({ userid: req.body.userid }, function (err, user) {
    if (err) {
      res.json({ success: false, message: err });
    } else if (user == null) {
      res.json({ success: false, message: 'User is not exist.' });
    } else {
      let token = crypto.randomBytes(20).toString('hex');
      User.findOneAndUpdate({ userid: user.userid }, { $set: { reset_password_token: token } }, { new: true }, (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }
        const mailOptions = {
          from: 'mySqlDemoEmail@gmail.com',
          to: `${user.email}`,
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `http://localhost:4200/resetpassword/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };
        console.log('sending mail');

        transport.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json({ success: true, message: 'You should receive an email shortly with further instructions' });
          }
        });
      });
    }
  });
});

/* reset password */
router.get('/reset/:resetPasswordToken', function (req, res, next) {
  User.findOne({ reset_password_token: req.params.resetPasswordToken }, (err, user) => {
    if (user == null) {
      console.error('password reset link is invalid or has expired');
      res.json({ success: false, message: 'password reset link is invalid or has expired' });
    } else {
      res.status(200).send({
        success: true,
        email: user.email,
        message: 'password reset link a-ok',
      });
    }
  });
});

/* update password */
router.post('/update-password/', function (req, res, next) {
  User.findOne({ userid: req.body.userid }, (err, user) => {
    if (user == null) {
      res.json({ success: false, message: 'User is not exist.' });
    } else {
      req.body.password = bcrypt.hashSync(req.body.password, salt);
      User.findOneAndUpdate({ userid: req.body.userid }, { $set: { password: req.body.password } }, { new: true }, (err, user) => {
        res.json({ success: true, message: 'password updated successfully.' });
      })
    }
  });
});

router.get('/', function (req, res, next) {
  res.send("ExpertFees API is running.");
});

module.exports = router;
