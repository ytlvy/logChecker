angular.module('LogChecker', ['ngWebSocket', 'services.index', 'luegg.directives', 'ngSanitize'])
.controller('indexController', function($scope, MyData) {
    $scope.MyData = MyData;
    $scope.glued = true;

    $scope.filterValue = "ACT:VIDEO_LOG";
    var isFileter = false;

    $scope.myfilter = function (msg) {
        console.log("begin filter" + msg);
        if(!isFileter) {
            return true;
        }

        console.log("begin filter" + msg);

        var pattern = new RegExp($scope.filterValue);
        return msg.content.match(pattern);
    }

    $scope.doClear = function () {
        $scope.MyData.clear();
    }

    $scope.doFilter = function (msg) {
        isFileter = true;
    }

})
.filter('htmlTrust',function($sce){
    return function(item){
        return $sce.trustAsHtml(item);
    }
})
;