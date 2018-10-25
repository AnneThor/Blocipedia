module.exports = {

  init(app){
    const staticRoutes = require("../routes/static");
    const wikiRoutes = require("../routes/wikis");
    const userRoutes = require("../routes/users");

    app.use(staticRoutes);
    app.use(wikiRoutes);
    app.use(userRoutes);

    if(process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

  }
  
}
