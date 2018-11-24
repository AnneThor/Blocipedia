const wikiQueries = require("../db/queries.wikis");
const Authorizer = require("../policies/application");
const User = require("../db/models").User;
const markdown = require("markdown").markdown;

module.exports = {

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        userId: req.user.id,
        private: req.body.private,
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          console.log(err);
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      res.redirect(303, `/wikis/create`);
    }
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
      if(err) {
        res.redirect(500, `/wikis/${wiki.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if( err || wiki == null ) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/edit", {wiki});
      }
    });
  },

  index(req, res, next){
    if (!req.user) {
      res.redirect("wikis/not_authorized");
    }
    const standardUser = new Authorizer(req.user)._isStandard();
    if (!standardUser) {
      wikiQueries.getAllWikis( (err, wikis) => {
        if(err) {
          res.redirect(500, "static/index");
        } else {
          res.render("wikis/index", {wikis});
        }
      })
    } else {
      wikiQueries.getStandardWikis(req.user.id, (err, wikis) => {
        if(err) {
          res.redirect(500, "static/index");
        } else {
          res.render("wikis/index", {wikis});
        }
      })
    }
  },

  new(req, res, next) {
    res.render("wikis/new");
  },

  show(req, res, next) {
    if (!req.user) {
      res.render("wikis/not_authorized");
    };
    wikiQueries.getWiki(req.params.id, (err, wiki, user) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        let body = markdown.toHTML(wiki.body);
        res.render("wikis/show", {wiki, body, user});
      }
    });
  },


  test(req, res, next) {
    var stripe = require("stripe")("sk_test_K2dthx1cxd6ckkQJFD89Xdfr");

    const charge = stripe.charges.create({
      amount: 999,
      currency: 'usd',
      source: 'tok_visa',
      receipt_email: 'jenny.rosen@example.com',
    });
    res.redirect("/upgrade");
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if( err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${wiki.id}`);
      }
    });
  },

}
