app.service('DataService', ['$q', function ($q) {

    var data;

    if (!localStorage.data) {

        data = [
            {
                id: 1,
                firstName: 'Fletcher',
                lastName: 'Flosi'
            },
            {
                id: 2,
                firstName: 'Kris',
                lastName: 'Marrier'
            },
            {
                id: 3,
                firstName: 'Minna',
                lastName: 'Amigon'
            },
            {
                id: 4,
                firstName: 'Graciela',
                lastName: 'Ruta'
            },
            {
                id: 5,
                firstName: 'Mattie',
                lastName: 'Poquette'
            },
            {
                id: 6,
                firstName: 'Yuki',
                lastName: 'Whobrey'
            },
        ];

        localStorage.data = JSON.stringify(data);
    }
    else {
        data = JSON.parse(localStorage.data);
    }

    return {
        getPersons: function () {
            return $q.when($.extend(true, [], data));
        },

        getPerson: function (id) {
            var person = data.filter(function (p) { return p.id == id; })[0];
            return $q.when($.extend(true, {}, person));
        },

        savePerson: function (person) {
            var existingPerson = data.filter(function (p) { return p.id == person.id; })[0];
            if (existingPerson) {
                existingPerson.firstName = person.firstName;
                existingPerson.lastName = person.lastName;
                localStorage.data = JSON.stringify(data);
            }
        }
    }
}]);
