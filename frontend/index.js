var app = angular.module('freelancer', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider) {
    routeProvider.when('/home', {
        templateUrl:  'views/dashboard/dashboard.html'
    })
    .when('login', {
        templateUrl: 'views/login.html',
        controller: 'AuthController'
    })
    .when()
    .otherwise({ redirectTo: '/home'})

    locationProvider.html5Mode(true);
}]);
app.controller('AuthController', ['$scope', function(scope) {
    scope.errors = [];
    scope.message = "WELCOME AUTH!";
}]);
app.controller('DashboardController', ['$scope', function(scope) {
    scope.message = "WELCOME DASHBOARD";
}]);
app.controller('AppController',['$scope', '$http', function(scope, http) {
    scope.message = 'Hello world!';
    scope.data = [];
    http.get('http://localhost/freelancer/api/account/me')
    .then(function(r) {
    // this callback will be called asynchronously
    // when the response is available
    console.log(r);
        scope.data = r.data;
    })
}]);
