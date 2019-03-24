/* global require, exports */
var marvel = require("../marvel");

exports.index = function(req, res) {
  res.render("index", { title: "Marvel Comic Cover Viewer" });
};

exports.cover = function(req, res) {
  var cover = marvel.getCover(function(cover) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(cover));
    res.end();
  });
};
