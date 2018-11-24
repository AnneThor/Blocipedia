const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {

  beforeEach( done => {
    this.wiki;
    this.user;
    sequelize.sync({force: true}).then( res => {
      User.create({
        name: "testUser",
        email: "test@email.com",
        password: "password",
      })
      .then( user => {
        this.user = user;
        Wiki.create({
          title: "A test wiki",
          body: "A test body",
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
        });
      })
    });
  }); //end of beforeEach

  describe("GET /wikis", () => {

    it("should return a status code 200 and a list of wikis", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        expect(body).toContain("A test wiki");
        done();
      });
    });

  }); // end of GET /wikis test

  describe("GET wikis/new", () => {

    it("should render a form to create a new wiki", done => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });

  }); // end of describe GET/wiki new

  describe("POST wikis/create", () => {

    beforeEach( done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 1 //flag to indicate logged in user
        }
      }, (err, res, body) => {
        done();
      });
    });

    it("should create a new wiki and redirect to the wiki", done => {

      let options = {
        url: `${base}create`,
        form: {
          title: "A new test wiki",
          body: "Body of the wiki body",
          private: false,
          userId: this.user.id,
        }
      };

      request.post( options, (err, res, body) => {
        Wiki.findOne( { where: { title: "A new test wiki"}} )
        .then( wiki => {
          expect(res.statusCode).toBe(303);
          expect(wiki.title).toBe("A new test wiki");
          expect(wiki.body).toBe("Body of the wiki body");
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        })
      });
    });

  }); // end of describe POST/create wiki

  describe("GET /wikis/:id", () => {

    it("should render a view with the selected wiki", done => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("A test wiki");
        done();
      });
    });

  });// end of describe get wikis by id


  describe("POST /wikis/:id/destroy", () => {

    it("should delete the wiki with the associated ID", done => {
      Wiki.all()
      .then(wikis => {
        const wikiCountBeforeDelete = wikis.length;
        expect(wikiCountBeforeDelete).toBe(1);//that is created in the beforeEach
        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.all()
          .then( wikis => {
            expect(err).toBeNull();
            expect(wikis.length).toBe(wikiCountBeforeDelete-1);
            done();
          })
        });
      });
    });

  }); // end of describe wiki destroy

  describe("GET /wikis/:id/edit", () => {

    it("should render a view with an edit topic form", done => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).toContain("A test wiki");
        expect(body).toContain("A test body");
        done();
      });
    });

  }); // end of descript wiki edit

  describe("POST /wikis/:id/update", () => {

    it("should update the topic with the given values", done => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "The NEW wiki title!",
          body: "The NEW wiki body",
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Wiki.findOne({
          where: { id: this.wiki.id }
        })
        .then( wiki => {
          expect(wiki.title).toBe("The NEW wiki title!");
          expect(wiki.body).toBe("The NEW wiki body");
          done();
        });
      });
    });

  }); //end of wiki update

}); //end of test suite
