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


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
