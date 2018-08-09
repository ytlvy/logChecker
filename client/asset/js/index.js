angular.module('LogChecker', ['ngWebSocket', 'services.index', 'luegg.directives', 'ngSanitize'])
.controller('indexController', function($scope, MyData) {
    $scope.MyData = MyData;
    $scope.glued = true;
    $scope.colorColums = "";
    $scope.filterValue = "ACT:VIDEO_LOG";
    $scope.simpleBtnText = "DETAIL";

    var isFileter = false;
    $scope.isSimple = true;

    $scope.showSimple = function() {
        $scope.isSimple = !$scope.isSimple;
        if($scope.isSimple)
            $scope.simpleBtnText = "DETAIL";
        else 
            $scope.simpleBtnText = "SIMPLE";
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

        if(scope.isSimple) {
            var ignorepatter = /[<|](REALTIME|PROD|VER|PLAT|FROM|SRC|UUID|IDFA|UI|DEV|JAILB|OSV|CIP|DEP|NE):[^|]+/gi;
            item = item.replace(ignorepatter, "");
        }

        if(scope.colorColums.length > 0) {
            colums = scope.colorColums.split(",");
            colums.forEach(function(element){
                var pattern =  eval("/[<|]("+element+":[^|]+)/gi");
                var match = pattern.exec(item);
                if(match) {
                    item = item.replace(match[1], "<b class=\"" + scope.randomColor()  +"\">"+match[1]+"</b>" );
                }
            });
        }

        return $sce.trustAsHtml(item);
    }
}])