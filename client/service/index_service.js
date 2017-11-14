var index = angular.module('services.index', ['ngSanitize']);

index.factory('MyData', function($websocket, $sce) {
    // Open a WebSocket connection
    var ws = $websocket('ws://localhost:8888/');
    var collection = [];
    ws.onMessage(function(event) {

        var res;
        try {
            res = JSON.parse(event.data);
        } catch (e) {
            res = {
                'username': 'anonymous',
                'message': event.data
            };
        }

        var colors = ['palette-turquoise', 'palette-emerald', 'palette-peter-river', 'palette-amethyst', 'palette-carrot'];

        var actpattern = /(.*?)(\W)(ACT[^|]+)(.*?)/g;
        var eventpattern = /(.*?)(\W)(EVENT[^|]+)(.*?)/g;
        var typepattern = /(.*?)(\W)(TYPE[^|]+)(.*?)/g;
        var timepattern = /(.*?)(\W)(IS_TIMELINE[^|]+)(.*?)/g;
        

        var ignorepatter = /\W(REALTIME|PROD|VER|PLAT|FROM|SRC|UUID|IDFA|UI|DEV|JAILB|OSV|CIP|DEP|NE)[^|]*\|/g;

        var replaceMent = "$1$2 <b class=\"" + colors[Math.floor(Math.random()*colors.length)]  +"\">$3</b> $4";
        var aHtml = res.message.replace(actpattern, replaceMent);
       
        aHtml = aHtml.replace(eventpattern, replaceMent);
        aHtml = aHtml.replace(typepattern, replaceMent);
        aHtml = aHtml.replace(timepattern, replaceMent);

        aHtml = aHtml.replace(ignorepatter, "");

        collection.push({
            username: res.username,
            content: aHtml,
            timeStamp: event.timeStamp
        });
    });
    ws.onError(function(event) {
        console.log('connection Error', event);
    });
    ws.onClose(function(event) {
        console.log('connection closed', event);
    });
    ws.onOpen(function() {
        console.log('connection open');
        ws.send('ws client connect success');
    });
    // setTimeout(function() {
    //   ws.close();
    // }, 500)
    setInterval(function(){
        if(collection[collection.length-1].content != "--") {
            collection.push({
                username: "--",
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