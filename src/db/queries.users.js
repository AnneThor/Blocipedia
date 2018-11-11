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
    console.log("inside downgrade user");
    console.log("DOWNGRADE ID", id);
    return User.findById(id)
    .then( user => {
      if(!user) {
        console.log("Invalid user");
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

  upgradeUser(id, callback) {
    console.log("inside upgrade user");
    return User.findById(id)
    .then( user => {
      if(!user) {
        console.log("Invalid user");
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
