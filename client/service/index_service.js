var index = angular.module('services.index', ['ngSanitize']);
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix){
    return this.slice(0, prefix.length) === prefix;
  };
}
index.factory('MyData', function($websocket, $sce) {
    // Open a WebSocket connection
    
    var collection = [];
    var debugLogs   = [];
    var showDetail_ = false;
    var extColorColums_ = [];
    var clients = ["clientIP"];
    var spClient_;

    var ws = $websocket('ws://localhost:8888/');
    ws.onMessage(function(event) {

        // var res;
        // try {
        //     res = JSON.parse(event.data);
        // } catch (e) {
        //     res = {
        //         'username': 'anonymous',
        //         'message': event.data
        //     };
        // }
        var message = event.data;

        var debugPattern =  /^==(\w*)==.*/;
        if(debugPattern.test(message)) {
            paraseDebugLog(message);
        }
        else {
            paraseServerLog(message);
        }
        paraseClients(message);
    });

    var paraseClients = function(message) {
        var matches = message.split(" =-= ");
        if(matches.length>1 && clients.indexOf(matches[0])==-1) {
            clients.push(matches[0]);
        }

    }
    var paraseDebugLog = function(message){
        
        var found = message.match(/^==(\w*)==/);

        debugLogs.push({
            content: message,
            level: found[1],
            timeStamp: event.timeStamp
        });
    };

    var randomColor = function() {
        let colors = ['palette-turquoise', 'palette-emerald', 'palette-peter-river', 'palette-amethyst', 'palette-carrot','palette-wet-asphalt','palette-midnight-blue','palette-sun-flower','palette-ALIZARIN'];
        return colors[Math.floor(Math.random()*colors.length)];
    }

    var paraseServerLog = function(message){

        var aHtml = message;

        if(spClient_.length>0 && !message.startsWith(spClient_)) {
            return;
        }

        colums = ["ACT", "EVENT", "PSRC",  "PT",]; //"TYPE",
        colums.forEach(function(element){
            var pattern =  eval("/[<|]("+element+":[^|]+)/gi");
            var match = pattern.exec(aHtml);
            if(match) {
                aHtml = aHtml.replace(match[1], "<b class=\"" + randomColor()  +"\">"+match[1]+"</b>" );
            }
        });


        if(!showDetail_) {
            var ignorepatter = /[<|](REALTIME|PROD|VER|PLAT|FROM|SRC|UUID|IDFA|UI|DEV|JAILB|OSV|CIP|DEP|NE):[^|]+/gi;
            aHtml = aHtml.replace(ignorepatter, "");
        }
        else {
            console.log("显示详情");
        }

        if(extColorColums_.length > 0) {
            console.log("进入扩展过滤");
            extColorColums_.forEach(function(element){
                var pattern =  eval("/[<|]("+element+":[^|]+)/gi");
                var match = pattern.exec(aHtml);
                if(match) {
                    aHtml = aHtml.replace(match[1], "<b class=\"" + randomColor()  +"\">"+match[1]+"</b>" );
                }
            });
        }

        collection.push({
            content: aHtml,
            timeStamp: event.timeStamp
        });
    };

    ws.onError(function(event) {
        console.log('connection Error', event);
    });
    ws.onClose(function(event) {
        console.log('serverLogClient closed', event);
        ws.send('serverLogClient closed');
    });
    ws.onOpen(function() {
        console.log('connection open');
        ws.send('serverLogClient connect');
    });
    // setTimeout(function() {
    //   ws.close();
    // }, 500)
    setInterval(function(){
        if(collection.length>0 && collection[collection.length-1].content != "--") {
            collection.push({
                content: "--",
                timeStamp: "---"
            });
        }

        if(debugLogs.length>0 && debugLogs[debugLogs.length-1].content != "--") {
            debugLogs.push({
                content: "--",
                timeStamp: "---"
            });
        }
    
    }, 1000);

    var factory = {
        collection: collection,
        clients:clients,
    };
    factory.extendColumn = function(columns) {
        extColorColums_ = columns;
    };
    factory.doClientFilter = function(cli) {
        spClient_ = cli;
    };
    factory.showDetail = function(showDe) {
        showDetail_ = showDe;
    };
    factory.status = function() {
        return ws.readyState;
    };
    factory.send = function(message) {
        if (angular.isString(message)) {
            ws.send(message);
        } else if (angular.isObject(message)) {
            ws.send(JSON.stringify(message));
        }
    };
    factory.clear = function () {
        collection.length = 0;
    };

    return factory;
})