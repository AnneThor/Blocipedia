const collabQueries = require("../db/queries.collaborators");
const userQueries = require("../db/queries.users");
const Authorizer = require("../policies/application");
const Collab = require("../db/models").Collaborators;
const User = require("../db/models").User;

module.exports = {

  addCollab(req, res, next) {
    let email = req.body.collabEmail;
    userQueries.getUserId(email, (err, user) => {
      if (err || !user) {
        console.log(err);
        req.flash('notice', "No such user found, please check the email you entered.");
      }
      return collabQueries.isCollab( user.id, req.params.id, (err, collab) => {
        if (err) {
          console.log(err);
          req.flash("notice", "An error occurred please try again.");
          res.redirect("/wikis/${wiki.id}/edit");
        } else if (!collab) {
          return collabQueries.addCollab( user.id, req.params.id, (err, collab) => {
              if (err) {
                console.log(err);
                res.redirect("/wikis/${wiki.id}/edit");
              } else {
                req.flash("notice", `${user.name} was added as a collaborator`);
                res.redirect(`/wikis/${req.params.id}/edit`);
              }
            });
        } else { //the collab already exists
          req.flash("notice", "The user is already a collaborator");
          res.redirect(`/wikis/${req.params.id}/edit`);
        }
      })
    })
    .catch( err => {
      console.log(err);
      req.flash("notice", "There was an error");
      res.redirect("/wikis/${wiki.id}/edit");
    })
  },

  removeCollab(req, res, next) {
    let email = req.body.collabEmail;
    userQueries.getUserId(email, (err, user) => {
      if (err || !user) {
        console.log(err);
        req.flash('notice', "No such user found, please check the email you entered.");
        res.redirect(`/wikis/${req.params.id}/edit`);
        next();
      }
      return collabQueries.isCollab( user.id, req.params.id, (err, collab) => {
        if ( collab ) {
          return collabQueries.removeCollab(user.id, req.params.id, (err, collab) => {
            if (err) {
              console.log(err);
              res.redirect(`wikis/${req.params.id}/edit`);
            } else {
              req.flash('notice', `${user.name} has been removed.`);
              res.redirect(`/`);
            }
          })
        } else { //the user was not a collaborator
          req.flash("notice", "The user is not a collaborator!");
          res.redirect(`/wikis/${req.params.id}/edit`);
        }
      })
    })
    .catch( err => {
      console.log(err);
      req.flash("notice", "There was an error");
      res.redirect("/wikis/${wiki.id}/edit");
    })
  },

}
