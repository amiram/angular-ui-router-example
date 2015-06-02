var app = angular.module('app', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/'); // for any unrecognized routing, go to '/'

    $stateProvider
        .state('PersonList', {
            url: '/', // e.g. ourdomain.com/persons/#/
            templateUrl: 'personList.html'
        })
        .state('PersonEdit', {
            url: '/:id', // e.g. ourdomain.com/persons/#/12345
            params: { person: null },
            templateUrl: 'personEdit.html',
            resolve: {
                person: ['DataService', '$stateParams', function (DataService, $stateParams) {
                    return $stateParams.person || DataService.getPerson($stateParams.id).then(function (person) {
                        return person;
                    });
                }]
            },
            controller: ['$scope', 'person', function ($scope, person) {
                $scope.person = person;
            }]
        });
});