const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

  //before each test create a Wiki and associated user
  beforeEach( done => {
    this.user;
    this.wiki;
    sequelize.sync({force: true}).then( res => {
      User.create({
        name: "testUser",
        email: "test@user.com",
        password: "testPass"
      })
      .then( user => {
        this.user = user;
        Wiki.create({
          title: "My first wiki",
          body: "First wiki on the site",
          private: false,
          userId: this.user.id,
        })
        .then( wiki => {
          this.wiki = wiki;
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        })
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });
  }); // end of before each

  describe("#create()", () => {

    it("should create a wiki object with title, body, user", done => {
      Wiki.create({
        title: "A test wiki",
        body: "A test body",
        private: false,
        userId: this.user.id,
      })
      .then( wiki => {
        expect(wiki.title).toBe("A test wiki");
        expect(wiki.body).toBe("A test body");
        expect(wiki.private).toBe(false);
        expect(wiki.userId).toBe(this.user.id);
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });

    it("should not create a wiki with missing attributes", done => {
      Wiki.create({
        title: "A second wiki test",
        private: false,
        userId: this.user.id,
      })
      .then( wiki => {
        //code won't execute because it won't create
        done();
      })
      .catch( err => {
        expect(err.message).toContain("Wiki.body cannot be null");
        done();
      })
    });

  }); //end of describe/create

  describe("#setUser()", () => {

    it("should associate a wiki and a user together", done => {
      User.create({
        name: "userName",
        email: "user@email.com",
        password: "password",
      })
      .then( newUser => {
        expect(this.wiki.userId).toBe(this.user.id);
        this.wiki.setUser(newUser)
        .then( wiki => {
          expect(wiki.userId).toBe(newUser.id);
          done();
        });
      })
    });

  }); // end of describe/setUser

  describe("#getUser()", () => {

    it("should return the associated user", done => {
      this.wiki.getUser()
      .then( associatedUser => {
        expect(associatedUser.email).toBe("test@user.com");
        done();
      });
    });

  }); // end of describe getuser

})
