const express = require("express");
const app = express();

const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

appConfig.init(app, express);
routeConfig.init(app);

module.exports = app;

//this file should hole the routes & respective handlers
//middleware, app configuration, error handling, etc
