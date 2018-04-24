var index = angular.module('services.index', ['ngSanitize']);

index.factory('MyData', function($websocket, $sce) {
    // Open a WebSocket connection
    var ws = $websocket('ws://localhost:8888/');
    var collection = [];
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

        var actpattern = /(.*?)(\W)(ACT[^|]+)(.*?)/g;
        var eventpattern = /(.*?)(\W)(EVENT[^|]+)(.*?)/g;
        var typepattern = /(.*?)(\W)(TYPE[^|]+)(.*?)/g;
        var timepattern = /(.*?)(\W)(IS_TIMELINE[^|]+)(.*?)/g;
        var psrcpattern = /(.*?)(\W)(PSRC[^|]+)(.*?)/g; 
        var ptpattern = /(.*?)(\W)(PT[^|]+)(.*?)/g; 

        var ignorepatter = /\W(REALTIME|PROD|VER|PLAT|FROM|SRC|UUID|IDFA|UI|DEV|JAILB|OSV|CIP|DEP|NE)[^|]*\|/g;

        var aHtml = message.replace(actpattern, "$1$2 <b class=\"" + randomColor()  +"\">$3</b> $4");
       
        aHtml = aHtml.replace(eventpattern, "$1$2 <b class=\"" + randomColor()  +"\">$3</b> $4");
        aHtml = aHtml.replace(typepattern, "$1$2 <b class=\"" + randomColor()  +"\">$3</b> $4");
        aHtml = aHtml.replace(timepattern, "$1$2 <b class=\"" + randomColor()  +"\">$3</b> $4");
        aHtml = aHtml.replace(psrcpattern, "$1$2 <b class=\"" + randomColor()  +"\">$3</b> $4");
        aHtml = aHtml.replace(ptpattern, "$1$2 <b class=\"" + randomColor()  +"\">$3</b> $4");


        aHtml = aHtml.replace(ignorepatter, "");
        aHtml = aHtml.replace("<PID", "PID");

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