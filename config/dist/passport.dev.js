"use strict";

var LocalStorage = require('passport-local').Strategy;

var mongoose = require('mongoose');

var bcrypt = require('bcryptjs'); //* Load User Model


var User = require('../models/User');

module.exports = function (passport) {
  passport.use(new LocalStorage({
    usernameField: 'email'
  }, function (email, password, done) {
    //* Match User
    User.findOne({
      email: email
    }).then(function (user) {
      if (!user) {
        return done(null, false, {
          message: 'That email is not registered.'
        });
      } //* Match Password


      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Password incorrect'
          });
        }
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  }));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};