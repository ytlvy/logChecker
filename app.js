
/**
 * Module dependencies.
 * @private
 */

const express = require('express');
var path = require('path');
// var bodyParser = require('body-parser');
var router = express.Router();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 19908 });

process.title = "kwlog";

// route
var app = express();
var connections = [];

// server configure
// view engine setup
app.set('views', path.join(__dirname, 'client'));
app.set('view engine', 'ejs');

// 静态资源目录
app.use(express.static(path.join(__dirname, 'client')));

function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.connections = connections;
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

// router 设置
var index = require('./server/routes/route_index');
app.use('/', index);
// app.use('/debug', index);

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

//websocket server
wss.on('connection', function connection(ws) {
  connections.push(ws);
  ws.on('message', function incoming(message) {
    // if(message.indexOf("serverLogClient") > -1) {
    //   connections["serverLogClient"] = ws;
    // }
    // else if(message.indexOf("serverLogClient")>-1) {
    //   connections["serverLogClient"] = ws;
    // }

    console.log('received: %s', message);
  });

  ws.send('client connected');
});

if (module.parent) {
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(19909, function listening() {
      console.log('Listening on 19909');
  });
}

