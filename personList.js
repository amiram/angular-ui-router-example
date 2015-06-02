app.controller('personsController', ['$scope', 'DataService', function($scope, DataService) {
    $scope.getPersons = function() {
        DataService.getPersons().then(function(persons) {
            $scope.persons = persons;
        });
    };

    $scope.getPersons();
}]);