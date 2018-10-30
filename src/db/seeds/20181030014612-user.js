'use strict';
const faker = require("faker");

let users = [];
let userRole;

for (let i=0; i<15; i++) {
  let randomNum = Math.floor(Math.random()*(3-1)+1);
  switch(randomNum) {
      case 1:
        this.userRole = "standard";
        break;
      case 2:
        this.userRole = "admin";
        break;
      case 3:
        this.userRole = "premium";
        break;
      default:
        this.userRole = "standard"
  }

  users.push({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.hacker.noun(),
    role: this.userRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterfact.bulkDelete("Users", null, {});
  }
};
