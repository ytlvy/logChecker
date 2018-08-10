var index = angular.module('services.index', ['ngSanitize']);

angular.module('LogChecker', ['ngWebSocket', 'services.index', 'luegg.directives', 'ngSanitize'])
.controller('indexController', function($scope, MyData) {
    $scope.MyData = MyData;
    $scope.glued = true;
    $scope.colorColums = "";
    $scope.filterValue = "ACT:VIDEO_LOG";
    $scope.simpleBtnText = "Detail";
    $scope.clientIp= "clientIP";
    $scope.clientsTxt = "(" + MyData.clients.length +")";

    var isFileter = false;
    $scope.isSimple = false;

    //$.toaster({ priority : 'success', title : 'Notice', message : 'Your message here'});

    $scope.doColorize = function() {
        var cols = $scope.colorColums.split(",");
        $scope.MyData.extendColumn(cols);
    }

    $scope.$watch('clientIp', function(newVal, oldVal){
        console.log("clientIp was changed to:"+newVal);
        $scope.clientIp = newVal;

        if(!newVal || newVal.toString().substring(0, "clientIP".length) === "clientIP") { 
            $scope.MyData.doClientFilter("");
        }
        else {
            $scope.MyData.doClientFilter(newVal);
        }
      });

    $scope.$watch('MyData.clients.length', function(newVal, oldVal){
        if(parseInt(newVal) > parseInt(oldVal))
            $.toaster({ priority : 'danger', title : 'Notice', message : 'new client ' + $scope.MyData.clients[$scope.MyData.clients.length - 1] + ' connect'});
        else {
            $.toaster({ priority : 'info', title : 'Notice', message : 'a client leave'});
        }

        if(newVal != oldVal && $scope.clientIp.substring(0, "clientIP".length) == "clientIP") {
            $scope.clientsTxt = ("(" + newVal + ")");
            // $scope.clientIp= "clientIP" + ("(" + newVal + ")");
        }

      });

    $scope.showSimple = function() {

        $scope.isSimple = !$scope.isSimple;
        $scope.MyData.showDetail($scope.isSimple);
        if($scope.isSimple)
            $scope.simpleBtnText = "Simple";
        else 
            $scope.simpleBtnText = "Detail";
    }

    $scope.clientFilter = function(msg) {
        if($scope.clientIp.length>0 && $scope.clientIp.substring(0, "clientIP".length) != "clientIP") {
              return msg.content.substring(0, $scope.clientIp.length) === $scope.clientIp;
        }
        else {
            return true;
        }
    }

    $scope.myfilter = function (msg) {
        // console.log("begin filter" + msg);

        if(!isFileter) {
            return true;
        }

        // console.log("begin filter" + msg);

        var pattern = new RegExp($scope.filterValue);
        return msg.content.match(pattern);
    }

    $scope.randomColor = function() {
        let colors = ['palette-turquoise', 'palette-emerald', 'palette-peter-river', 'palette-amethyst', 'palette-carrot'];
        return colors[Math.floor(Math.random()*colors.length)];
    }   

    $scope.doClear = function () {
        $scope.MyData.clear();
    }

    $scope.doFilter = function (msg) {
        isFileter = true;
    }

})
.filter('htmlTrust', ['$sce', function($sce){
    return function(item){
        return $sce.trustAsHtml(item);
    }
}])
.filter('colorize', ['$sce', function($sce){ //colorize:this
    return function(item, scope){
        if(item.length < 1) return;

        return $sce.trustAsHtml(item);
    }
}])