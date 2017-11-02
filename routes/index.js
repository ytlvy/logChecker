var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var indexfile = path.join(__dirname + '/static/index.html');
  console.log(indexfile);
  res.sendFile('../static/index.html');
  }).post('/', function(req, res, next) {
    
    req.setEncoding('utf8');
    var data = req.body;
    // var obj = JSON.parse(data);
    console.log(req.body);
    console.log('RB: ' + req.rawBody);
    return res.send({
            status: 200
        });
  });

module.exports = router;