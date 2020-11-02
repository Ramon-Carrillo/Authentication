"use strict";

//* Just add this as middleware to have protection.
module.exports = {
  ensureAuthenticated: function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }

    res.redirect('/dashboard');
  }
};