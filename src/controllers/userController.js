const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const express = require("express");
const passport = require("passport");
const User = require("../db/models").User;
const sgMail = require("@sendgrid/mail");
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

module.exports = {

  charge(req, res, next) {
    //first process the charge
    var stripe = require("stripe")("sk_test_K2dthx1cxd6ckkQJFD89Xdfr");
    const token = req.body.stripeToken;
    const charge = stripe.charges.create({
      amount: 1500,
      currency: "usd",
      description: "upgrade to premium",
      source: token,
    })
    .catch(err => {
      res.redirect("/users/payment_error");
      next();
    });
    //second step is to update the user record
    userQueries.upgradeUser( req.body.userId, (err, user) => {
      if( err || user == null) {
        res.redirect(404, `/users/upgrade`);
      } else {
        res.redirect(`/users/payment_confirmation`);
      }
    });
  },

  create(req, res, next) {
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
      //user was successfully created
      //authenticate using the passport object
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
        //send confirmation email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: newUser.email,
          from: "annethor@bloc.com",
          subject: "Welcome to Blocipedia",
          text: "Welcome to Blocipedia",
          html: `<strong>Home of Markdown Wikis</strong>`
        };
        sgMail.send(msg);
      }
    });
  },

  paymentConfirmation(req, res, next) {
    res.render("users/payment_confirmation");
  },

  refund(req, res, next) {
    //updates the user record to "standard" role
    userQueries.downgradeUser( req.body.userId, (err, user) => {
      if( err || user == null) {
        res.redirect(404, `/users/downgrade`);
      } else {
        wikiQueries.downgradeWikis( req.body.userId, (err, user) => {
          if (err ) { res.redirect(404, "/users/downgrade")}
          else { res.redirect("/users/payment_confirmation") };
        })
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  upgrade(req, res, next) {
    res.render("users/upgrade", {keyPublishable});
  },

  downgrade(req, res, next) {
    res.render("users/downgrade", {keyPublishable});
  }

}
