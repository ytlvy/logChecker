angular.module('LogChecker', ['ngWebSocket', 'services.index', 'luegg.directives'])
.controller('SomeController', function($scope, MyData) {
    $scope.MyData = MyData;
    $scope.glued = true;
});