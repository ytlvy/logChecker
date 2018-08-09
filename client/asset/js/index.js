angular.module('LogChecker', ['ngWebSocket', 'services.index', 'luegg.directives', 'ngSanitize'])
.controller('indexController', function($scope, MyData) {
    $scope.MyData = MyData;
    $scope.glued = true;
    $scope.colorColums = "";
    $scope.filterValue = "ACT:VIDEO_LOG";
    $scope.simpleBtnText = "DETAIL";
    $scope.clientIp= "clientIP";

    var isFileter = false;
    $scope.isSimple = false;

    $scope.doColorize = function() {
        var cols = $scope.colorColums.split(",");
        $scope.MyData.extendColumn(cols);
    }

    $scope.showSimple = function() {
        $scope.isSimple = !$scope.isSimple;
        $scope.MyData.showDetail($scope.isSimple);
        if($scope.isSimple)
            $scope.simpleBtnText = "SIMPLE";
        else 
            $scope.simpleBtnText = "DETAIL";
    }

    $scope.clientFilter = function(msg) {
        if($scope.clientIp.length>0 && $scope.clientIp!="clientIP") {
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