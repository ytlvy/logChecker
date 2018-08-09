var index = angular.module('services.index', ['ngSanitize']);

index.factory('MyData', function($websocket, $sce) {
    // Open a WebSocket connection
    var ws = $websocket('ws://localhost:8888/');
    var collection = [];
    var debugLogs   = [];
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
    });

    var paraseDebugLog = function(message){
        
        var found = message.match(/^==(\w*)==/);

        debugLogs.push({
            content: message,
            level: found[1],
            timeStamp: event.timeStamp
        });
    };

    var randomColor = function() {
        let colors = ['palette-turquoise', 'palette-emerald', 'palette-peter-river', 'palette-amethyst', 'palette-carrot'];
        return colors[Math.floor(Math.random()*colors.length)];
    }

    var paraseServerLog = function(message){

        var aHtml = message;

        colums = ["ACT", "EVENT", "PSRC",  "PT",]; //"TYPE",
        colums.forEach(function(element){
            var pattern =  eval("/[<|]("+element+":[^|]+)/gi");
            var match = pattern.exec(aHtml);
            if(match) {
                aHtml = aHtml.replace(match[1], "<b class=\"" + randomColor()  +"\">"+match[1]+"</b>" );
            }
        });

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
    return {
        collection: collection,
        status: function() {
            return ws.readyState;
        },
        send: function(message) {
            if (angular.isString(message)) {
                ws.send(message);
            } else if (angular.isObject(message)) {
                ws.send(JSON.stringify(message));
            }
        },
        clear: function () {
            collection.length = 0;
        }
    };
})