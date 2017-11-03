var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var indexfile = path.join(__dirname + '/static/index.html');
    console.log(indexfile);
    res.sendFile('../static/index.html');
}).post('/', function(req, res, next) {
    req.setEncoding('utf8');
    var data = req.body;

    console.log('RB: ' + req.rawBody);
    if (req.connections.length > 0) {
        for (idx in req.connections) {
            req.connections[idx].send(req.rawBody);
        }
    }
    return res.send({
        status: 200
    });
});
module.exports = router;