This small repo has an angular page that shows a list and the ability to edit each object. Routing is donw with angular ui-router.

Let's say we have a list of persons and we would like to:

 - Show a list of all persons.
 - Clicking on a person will open it in edit mode.
 - In the edit page:
	 - When you refresh the page you still see the same person
	 - When you go back by the browser you see the list again.

With angular we should create:

 - Module and master view
 - Controller and view for the person list
 - Controller and view for person edit

In order to add the browsing functionality we'll use the angular ui-router.

**app.js - Main Module:**

    var app = angular.module('app', ['ui.router']);

**index.html - Master view:**

    <html>
	<head>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.0/angular.min.js"></script>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min.js"></script>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	    <script src="app.js"></script>
	    <script src="dataService.js"></script>
	    <script src="personList.js"></script>
	    <script src="personEdit.js"></script>
	    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/css/bootstrap.min.css" />
	
	    <style>
	        body
	        {
	            max-width: 500px;
	            margin-left: auto;
	            margin-right: auto;
	        }
	    </style>
	</head>
	<body>
	    <div ng-app="app">
	    </div>
	</body>
	</html>

**personList.js - Controller for person list:**

    app.controller('personsController', ['$scope', 'DataService', function($scope, DataService) {
        $scope.getPersons = function() {
            DataService.getPersons().then(function(persons) {
                $scope.persons = persons;
            });
        };
    
        $scope.getPersons();
    }]);

**personList.html - View for person list:**

    <div ng-controller="personsController">
	    <table class="table">
	        <thead>
	            <tr>
	                <th>Id</th>
	                <th>First Name</th>
	                <th>Last Name</th>
	            </tr>
	        </thead>
	        <tbody>
	            <tr ng-repeat="p in persons">
	                <td>{{p.id}}</td>
	                <td>{{p.firstName}}</td>
	                <td>{{p.lastName}}</td>
	            </tr>
	        </tbody>
	    </table>
	</div>

**personEdit.js - Controller for person edit:**

    app.controller("personController", ['$scope', 'DataService' , function ($scope, DataService) {
	    // $scope.person will be already present

	    $scope.savePerson = function () {
	        DataService.savePerson($scope.person);
	    }
	}]);

**personEdit.html - View for person edit:**

    <div ng-controller="personController">
	    <form class="form">
	        <h1>Edit Person</h1>
	        <h4>Id: {{person.id}}</h4>
	        <div class="form-group">
	            <label>First Name:</label>
	            <input class="form-control" type="text" ng-model="person.firstName" />
	        </div>
	        <div class="form-group">
	            <label>Last Name:</label>
	            <input class="form-control" type="text" ng-model="person.lastName" />
	        </div>
	    </form>
	</div>

Well, so far just plain angular. Now we need to add the routing. In app.js wee add the following code:

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

We create two states. PersonList is the state that will use the list view as template. The url is "/" means that going to "index.html" without anything after it will load this view.
The PersonEdit state will load if the url has an id at the end like "index.html#/12345". As for the person it should show, we can distinguish between two cases. If we go from the list to the edit page, we already have the person object in scope so we can pass it to the edit controller, however if the user refreshes the edit page or just type the id in the address, we have only the person id so we need to get the person object from the data service. Because the PersonEdit state can be loaded without a person object, we need to define its initial value as null to be optional, otherwise the state won't be loaded without a person.
We can bring the person object in the person edit controller, but it will not be clean and nice. In addition, the user will see the edit form without the data until the object will be loaded and this is not nice either.
To solve that we use "resolve". if we have the person object in the stateParams (from the list page) then we just return it. If not, we get it from the data service with the id from the url. The "controller" afterwards is to initiate the person edit controller with the person we resolved.

Now lets add some markup to the views to make it work.
In index.html we need to define the views container with a "ui-view" directive:

    <div ng-app="app" ui-view>
    </div>

In personList.html we need to add a link in each row to the edit page. we will do it in the id table cell with the "ui-sref" attribute:

    <td><a ui-sref="PersonEdit({id: {{p.id}}, person: {{p}}})">{{p.id}}</a></td>
Notice that we have the person object already so we pass it in the stateParams.

In personEdit.html we need to add two button for back and save operations:

    <button class="btn btn-default" ui-sref="PersonList()">Back</button>
    <button class="btn btn-primary" ui-sref="PersonList()" ng-click="savePerson()">Save</button>

That's it. See it live at
> Written with [StackEdit](https://stackedit.io/).
