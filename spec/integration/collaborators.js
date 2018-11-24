const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborators;

describe( "routes : collaborators", () => {

  //before all tests clear out the test db
  beforeEach( done => {
    sequelize.sync({force:true})
    .then( ()=> {
      done();
    })
    .catch( err => {
      console.log(err);
      done();
    })
  });

  describe("POST /wikis/:id/addCollab", () => {

    //set up a standard user and login as a premium user
    beforeEach( done => {
      this.standardUser;
      User.create({
        name: "standardUser",
        email: "standard@user.com",
        password: "password",
        role: "standard",
      })
      .then( user => {
        this.standardUser = user;
      })
    })


  })



})
