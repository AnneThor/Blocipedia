const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const User = require("../db/models").User;
const sgMail = require("@sendgrid/mail");

module.exports = {

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

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function() {
      if(!req.user) {
        req.flash("notice", "Sign in failed.  Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
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

}
