"use strict";

var express = require('express');

var router = express.Router();

var bcrypt = require('bcryptjs');

var passport = require('passport'); //* User model


var User = require('../models/User'); //* Login Page


router.get('/login', function (req, res) {
  return res.render('login');
}); //* Register Page

router.get('/register', function (req, res) {
  return res.render('register');
}); //* Register Handle

router.post('/register', function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password,
      password2 = _req$body.password2;
  var errors = []; //* Check required fields

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please fill in all fields'
    });
  } //* Check password matches


  if (password !== password2) {
    errors.push({
      msg: 'Password does not match'
    });
  } //* Check password length


  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2
    });
  } else {
    //* Validation Passed 
    User.findOne({
      email: email
    }).then(function (user) {
      if (user) {
        //* User exists
        errors.push({
          msg: 'Email is already registered.'
        });
        res.render('register', {
          errors: errors,
          name: name,
          email: email,
          password: password,
          password2: password2
        });
      } else {
        var newUser = new User({
          name: name,
          email: email,
          password: password
        }); //* Hash Password

        bcrypt.genSalt(10, function (err, salt) {
          return bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err; //* Set password to hash

            newUser.password = hash; //* Save user

            newUser.save().then(function (user) {
              req.flash('success_msg', 'You are now registered and can log in');
              res.redirect('/users/login');
            })["catch"](function (err) {
              return console.log(err);
            });
          });
        });
      }
    });
  }
}); //* Login Handler 

router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}); //* Logout Handler

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
module.exports = router;