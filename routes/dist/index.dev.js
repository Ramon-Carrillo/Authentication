"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../config/auth'),
    ensureAuthenticated = _require.ensureAuthenticated,
    forwardAuthenticated = _require.forwardAuthenticated; //* Welcome Page


router.get('/', function (req, res) {
  return res.render('welcome');
}); //* Dashboard

router.get('/dashboard', ensureAuthenticated, function (req, res) {
  return res.render('dashboard', {
    name: req.user.name
  });
});
module.exports = router;