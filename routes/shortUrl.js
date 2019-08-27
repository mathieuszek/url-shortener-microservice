var express = require('express');
var router = express.Router();
var dns = require('dns');

var ShortUrl = require('../models/shortUrl');

router.get('/', function(req, res) {
  ShortUrl.find({}, '-_id -__v', function(err, urls) {
    if(err) {
      res.send('error has occured');
    } else {
      res.json(urls);
    }
  });
});

router.get('/:short', function(req, res) {
  ShortUrl.findOne({short_url: req.params.short}, function(err, url) {
    if(err) {
      res.send('invalid shortcut');
    } else {
      res.redirect(url.original_url);
    }
  });
});

router.post('/new', function(req, res) {
  if(req.body.url.indexOf('://') < 0) {
    return res.json({error: "invalid URL"});
  }
  let originalUrl = req.body.url;
  let protocol = originalUrl.split('://')[0];
  let hostname = originalUrl.split('://')[1].split('/')[0];
  var lookup = dns.lookup(hostname, function(err, addresses, family) {
    if(err) {
      return res.json({error: "invalid URL"});
    }    
  });
  let newUrl = new ShortUrl({
    original_url: originalUrl
  });
  createAndSaveShortUrl(newUrl, res);
  
});

function createAndSaveShortUrl(newUrl, res) {
  let randomStr = Math.random().toString(36).substring(2, 5);
  ShortUrl.findOne({short_url: randomStr}, function(err, url) {
    if(err) {
      return res.json({error: "invalid URL"});
    } else if(url == null) {
      newUrl.short_url = randomStr;
      newUrl.save(function(err, url) {
      if(err) {
        return res.json({error: "save error"});
      }
        return res.json(newUrl.getPublicFields());
      });
    } else {
      createAndSaveShortUrl(newUrl, res);
    }
  })
}
module.exports = router;