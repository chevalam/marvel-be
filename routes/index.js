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

// exports.posts = function(req, res) {
// 	var posts = marvel.getPosts(function(posts) {
// 		res.writeHead(200, { 'Content-Type': 'application/json' });
// 		res.write(JSON.stringify(posts));
// 		res.end();
// 	});
// };

exports.cache = function(req, res) {
  var cache = marvel.getCache();
  //massage the cache a bit
  var cacheDisplay = [];
  for (var c in cache) {
    cacheDisplay.push({
      key: c,
      hits: cache[c].hits,
      images: cache[c].images.length
    });
  }
  console.log(cacheDisplay);
  res.render("cache", { cache: cacheDisplay });
};
