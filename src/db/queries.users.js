const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {

  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword,
    })
    .then( user => {
      callback(null, user);
    })
    .catch( err => {
      callback(err);
    });
  },

  downgradeUser(id, callback) {
    return User.findById(id)
    .then( user => {
      if(!user) {
        return callback("User not found");
      }
      user.updateAttributes({
        role: "standard"
      })
      .then( () => {
        callback(null, user);
      })
      .catch( err => {
        callback(err);
      });
    });
  },

  getUserId(userEmail, callback) {
    return User.find({
      where: {email: userEmail}
    })
    .then( user => {
      if (!user) {
        return callback("User not found");
      }
      callback(null, user);
    })
    .catch(err => {
      callback(err);
    });
  },

  upgradeUser(id, callback) {
    return User.findById(id)
    .then( user => {
      if(!user) {
        return callback("User not found");
      }
      user.updateAttributes({
        role: "premium"
      })
      .then( () => {
        callback(null, user);
      })
      .catch( err => {
        callback(err);
      });
    });
  },

}
