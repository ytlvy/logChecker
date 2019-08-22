var path = require('path');
var express = require('express');
var router = express.Router();
var Base64 = require('js-base64').Base64;

/* GET home page. */
router.get('/', function(req, res, next) {
    var indexfile = path.join(__dirname + '../../../client/index.html');
    console.log(indexfile);
    res.sendFile(indexfile);
}).post('/', function(req, res, next) {
    req.setEncoding('utf8');

    console.log('RB: ' + req.rawBody);
    var clientIp = (req.headers['x-forwarded-for'] || req.headers['x-forwarded-for1'] || req.connection.remoteAddress || '').split(',')[0].trim();
    if (clientIp.substr(0, 7) == "::ffff:") {
        clientIp = clientIp.substr(7);
    }
    console.log('client: ' + clientIp);
    for (var i = req.connections.length - 1; i >= 0; i--) {
        req.connections[i].send(clientIp + " =-= " +req.rawBody);
    }
    
    return res.status(200).send({
        status: 200
    });
});

router.post('/music.yl', function(req, res, next) {
    req.setEncoding('utf8');

    console.log('RB: ' + req.rawBody);
    for (var i = req.connections.length - 1; i >= 0; i--) {
        req.connections[i].send(Base64.decode(req.rawBody));
    }
    
    return res.status(200).send({
        status: 200
    });
});

router.get('/debug', function(req, res, next) {
    var indexfile = path.join(__dirname + '../../../client/debug.html');
    console.log(indexfile);
    res.sendFile(indexfile);
}).post('/debug', function(req, res, next) {
    req.setEncoding('utf8');

    // console.log('RB: ' + req.rawBody);
    for (var i = req.connections.length - 1; i >= 0; i--) {
        req.connections[i].send(req.rawBody);
    }
    
    return res.status(200).send({
        status: 200
    });
});

router.get('/network', function(req, res, next) {
    var indexfile = path.join(__dirname + '../../../client/network.html');
    console.log(indexfile);
    res.sendFile(indexfile);
}).post('/network', function(req, res, next) {
    req.setEncoding('utf8');

    console.log('RB: ' + req.rawBody);
    var clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
    if (clientIp.substr(0, 7) == "::ffff:") {
        clientIp = clientIp.substr(7);
    }
    console.log('client11: ' + clientIp);
    for (var i = req.connections.length - 1; i >= 0; i--) {
        req.connections[i].send(clientIp + " =-= " + req.rawBody);
    }
    
    return res.status(200).send({
        status: 200
    });
});
module.exports = router;