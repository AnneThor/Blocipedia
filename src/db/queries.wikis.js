const Wiki = require("./models").Wiki;

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

  getStandardWikis(callback) {
    return Wiki.findAll(
      { where: { private: false } }
    )
    .then( wikis => {
      callback(null, wikis);
    })
    .catch( err => {
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.findById( id )
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
