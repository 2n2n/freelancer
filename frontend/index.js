var app = angular.module('freelancer', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider) {
    routeProvider.when('/home', {
        templateUrl:  './views/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
    .when('/login', {
        templateUrl: './views/login.html',
        controller: 'AuthController'
    })
    .otherwise({ redirectTo: '/home'})

    locationProvider.html5Mode(true);
}]);
app.controller('AuthController', ['$scope', '$http', function(scope, http) {
    scope.errors = [];
    scope.authenticate = function(credentials){
        console.log('you tried to submit', credentials)
        http.post('http://localhost/freelancer/api/login', credentials)
        .then(function(r) {
            console.log(r.data);
            if(r.data[0] == 'welcome')
            {
                alert('Successfully authenticated.');
            }
            else if( r.data instanceof Object )
            {
                scope.errors = [];
                Object.keys(r.data).forEach(function(k, val){
                    scope.errors.push(r.data[k]);
                });
                // scope.errors;
            }
        });
    }
}]);
app.controller('DashboardController', ['$scope', '$http', function(scope, http) {
    scope.message = "WELCOME DASHBOARD";
    http.get('http://localhost/freelancer/api/account/me')
    .then(function(r) {
        scope.user = r.data;
    });
    http.get('http://localhost/freelancer/api/portfolio/all')
    .then(function(r) {
        scope.protfolios = r.data;
        console.log(r)
    });
}]);
app.controller('AppController',['$scope', '$http', function(scope) {
    scope.message = 'Hello world!';
    scope.data = [];
}]);
