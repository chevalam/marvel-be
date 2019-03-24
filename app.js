/* global require, process */

var express = require("express");
var routes = require("./routes");
var http = require("http");
var path = require("path");
var hbs = require("hbs");
// var cors = require("cors");

var app = express();
// app.use(cors());
// app.options('*', cors());

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", hbs.__express);

app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(__dirname + "/public"));

// development only
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", routes.index);
app.get("/cover", routes.cover);
app.get("/cache", routes.cache);
// app.get("/posts", routes.posts);

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
