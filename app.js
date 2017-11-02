const express = require('express');
var path = require('path');
// const http = require('http');
// const url = require('url');
// const WebSocket = require('ws');
// var bodyParser = require('body-parser');
var router = express.Router();

// route
// var index = require('./routes/index');


var expressWs = require('express-ws')(express());
const app = expressWs.app;
var connections = [];

// view engine setup
app.set('views', path.join(__dirname, 'static'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'static')));

function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function(){
    next();
  });
}


app.use(rawBody);
// app.use(bodyParser.json({ type: 'application/json' }))
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.text({ type: 'text/html' }))
// app.use(bodyParser.text({ type: '*/*' }));
// app.use(bodyParser.raw({ type: '*/*' }));

// app.use(rawBody);


// app.use('/', index);
/* GET home page. */
router.get('/', function(req, res, next) {
  var indexfile = path.join(__dirname + '/static/index.html');
  console.log(indexfile);
  res.sendFile('../static/index.html');
  }).post('/', function(req, res, next) {
    
    req.setEncoding('utf8');
    var data = req.body;
    // var obj = JSON.parse(data);
    // console.log(req.body);
    console.log('RB: ' + req.rawBody);
    if(connections.length>0) {
      connections[0].send(req.rawBody);
    }
    return res.send({
            status: 200
        });
  });
app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.ws('/ws', function(ws, req) {

  console.log('ws');
  connections.push(ws);

  ws.on('message',  function(msg) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

app.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
});

if (module.parent) {
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(8080, function listening() {
      console.log('Listening on');
  });
}

