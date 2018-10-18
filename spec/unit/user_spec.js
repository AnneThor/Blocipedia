const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

  beforeEach( done => {
    sequelize.sync({force:true})
    .then( () => {
      done();
    })
    .catch( err => {
      console.log(err);
      done();
    });
  });

  describe("#create()", () => {

    it("should create a User object with a valid email and password", done => {
      User.create({
        name: "SomeName",
        email: "user@example.com",
        password: "1234567890",
      })
      .then( user => {
        expect(user.name).toBe("SomeName");
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with an invalid email or password", done => {
      User.create({
        name: "UserName",
        email: "It's a me, Mario!",
        password: "1234567890",
      })
      .then( user => {
        //code will not run because Sequelize will create an error
        done();
      })
      .catch( err => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with an email already taken", done => {
      User.create({
        name: "UserName",
        email: "user@example.com",
        password: "1234567890",
      })
      .then( user => {
        User.create({
          name: "UserName2",
          email: "user@example.com",
          password: "anotherPassword",
        })
        .then( user => {
          //code will not run because Sequelize will create an error
          done();
        })
        .catch( err => {
          expect(err.message).toContain("Validation error");
          done();
        });
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });

  });

});
