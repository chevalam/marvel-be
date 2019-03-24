/* global require,exports, console */
var http = require("http");
var crypto = require("crypto");
require('dotenv').config();

var cache = [];

var PRIV_KEY = process.env.PRIV_KEY;
var API_KEY = process.env.API_KEY;
//default not avail image
var IMAGE_NOT_AVAIL =
  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";

exports.getCache = function() {
  return cache;
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function getCover(cb) {
  //first select a random year
  var year = getRandomInt(1970, 2019);
  //then a month
  var month = getRandomInt(1, 12);

  var cache_key = year + "_" + month;

  if (cache_key in cache) {
    console.log("had cache for " + cache_key);
    var images = cache[cache_key].images;
    cache[cache_key].hits++;
    cb({ posts: images });
  } else {
    var url =
      "http://gateway.marvel.com/v1/public/comics?limit=100&format=comic&formatType=comic&apikey=" +
      API_KEY;
    var ts = new Date().getTime();
    var hash = crypto
      .createHash("md5")
      .update(ts + PRIV_KEY + API_KEY)
      .digest("hex");
    url += "&ts=" + ts + "&hash=" + hash;

    console.log(new Date() + " " + url);

    http.get(url, function(res) {
      var body = "";

      res.on("data", function(chunk) {
        body += chunk;
      });

      res.on("end", function() {

        var result = JSON.parse(body);
        var images;

        if (result.code === 200) {
          images = [];
          for (var i = 0; i < result.data.results.length; i++) {
            var comic = result.data.results[i];
            if (comic.thumbnail && comic.thumbnail.path != IMAGE_NOT_AVAIL) {
              var image = {};
              image.title = comic.title;
              // console.log('comic ', comic);
              for (var x = 0; x < comic.dates.length; x++) {
                if (comic.dates[x].type === "focDate") {
                  image.date = new Date(comic.dates[x].date);
                }
              }
              image.url =
                comic.thumbnail.path + "." + comic.thumbnail.extension;
              image.price = comic.prices[0].price;
              images.push(image);
            }
          }
          //now cache it
          cache[cache_key] = { hits: 1 };
          cache[cache_key].images = images;
          cb({ posts: images });
        } else {
          console.log(new Date() + " Error: " + JSON.stringify(result));
          cb({ error: result.code });
        }
        //console.log(data);
      });
    });
  }
}

exports.getCover = getCover;
