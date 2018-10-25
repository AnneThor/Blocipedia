const wikiQueries = require("../db/queries.wikis");

module.exports = {

  create(req, res, next) {
    console.log("inside create wikiController");
    console.log("req body title: ", req.body.title);
    console.log("req body body: ", req.body.body);
    console.log("req user id: ", req.user.id);
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      userId: req.user.id,
      private: req.body.private,
    };
    console.log("THE NEW WIKI VARIABLW IS: ", newWiki);
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        console.log(err);
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
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
    wikiQueries.getAllWikis( (err, wikis) => {
      if(err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next) {
    res.render("wikis/new");
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", {wiki});
      }
    });
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
