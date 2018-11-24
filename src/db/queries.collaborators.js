const Collab = require("./models").Collaborators;
const User = require("./models").User;

module.exports = {

  addCollab(userId, wikiId, callback) {
    return Collab.create({
      userId: userId,
      wikiId: wikiId,
    })
    .then( collab => {
      console.log(collab);
      callback(null, collab);
    })
    .catch( err => {
      callback(err);
    });
  },

  isCollab(userId, wikiId, callback) {
    return Collab.find({where: {wikiId: wikiId, userId: userId}, include: [{model: User}] })
    .then( collab => {
      callback(null, collab);
    })
    .catch( err => {
      callback(err);
    })
  },

  removeCollab(userId, wikiId, callback) {
    return Collab.destroy({
      where: {userId: userId, wikiId: wikiId}
    })
    .then( collab => {
      callback( null, collab );
    })
    .catch( err => {
      callback( err );
    });
  },

}
