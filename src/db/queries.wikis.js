const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collab = require("./models").Collaborators;
const collabQueries = "./queries.collaborators.js";
const Authorizer = require("../policies/application.js");

module.exports = {

  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId,
    })
    .then( wiki => {
      callback(null, wiki);
    })
    .catch( err => {
      callback(err);
    })
  },

  deleteWiki(id, callback) {
    return Wiki.destroy({
      where: {id},
    })
    .then( wiki => {
      callback(null, wiki);
    })
    .catch( err => {
      callback(err);
    })
  },

  getAllWikis(callback){
    return Wiki.all()
    .then( wikis => {
      callback(null, wikis);
    })
    .catch( err => {
      callback(err);
    })
  },

  getStandardWikis(userId, callback) {
    var result = {
      wiki: null,
      collab: null
    };
    return Wiki.findAll({
      where: { private: false }
    })
    .then( wikis => {
      result.wiki = wikis;
      Wiki.findAll({
        include: [{
          model: Collab, as: "collaborators", where: {userId}
        }]
      })
      .then( wikis => {
        result.collab = wikis;
        var allWikis = result.wiki.concat(result.collab);
        callback(null, allWikis);
      })
      .catch( err => {
        console.log(err);
        callback(err);
      })
    })
    .catch( err => {
      console.log(err);
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.find(
      { where: {id: id}, include: {model:User} }
    )
    .then( wiki => {
      callback(null, wiki);
    })
    .catch( err => {
      callback(err);
    })
  },

  updateWiki(id, updatedWiki, callback) {
    return Wiki.findById(id)
    .then( wiki => {
      if(!wiki) {
        return callback("Wiki not found!");
      }
      wiki.update(updatedWiki, {
        fields: Object.keys(updatedWiki)
      })
      .then( () => {
        callback(null, wiki);
      })
      .catch( err => {
        callback(err);
      });
    });
  },

  downgradeWikis(id, callback) {
    return Wiki.update({
      private: false
    }, {
      where: { userId: id }
    })
  },

}
