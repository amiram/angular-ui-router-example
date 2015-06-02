app.controller("personController", ['$scope', 'DataService' , function ($scope, DataService) {
    // $scope.person will be already present

    $scope.savePerson = function () {
        DataService.savePerson($scope.person);
    }
}]);