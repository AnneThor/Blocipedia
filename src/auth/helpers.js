const bcrypt = require("bcryptjs");

module.exports = {

  //middleware function - if passport has authenticated a user it will be stored as req.user
  ensureAuthenticated(req, res, next) {
    if(!req.user) {
      req.flash("notice", "You must be signed in to do that");
      return res.redirect("/users/signin");
    } else {
      next();
    }
  },

  //compares entered password to decrypted password from db, returns true if they match
  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }

}
