var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var indexfile = path.join(__dirname + '/static/index.html');
    console.log(indexfile);
    res.sendFile('../static/index.html');
}).post('/', function(req, res, next) {
    req.setEncoding('utf8');

    console.log('RB: ' + req.rawBody);
    for (var i = req.connections.length - 1; i >= 0; i--) {
        req.connections[i].send(req.rawBody);
    }
    
    return res.send({
        status: 200
    });
});
module.exports = router;