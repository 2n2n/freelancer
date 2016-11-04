var app = angular.module('freelancer', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider) {
    routeProvider.when('/', {
        redirectTo: '/home'
    })
    routeProvider.when('/home', {
        templateUrl:  './views/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
    .when('/register', {
        templateUrl: './views/register.html',
        controller: 'AuthController'
    })
    .when('/portfolio/add', {
        templateUrl: './views/portfolio/add_form.html',
        controller: 'DashboardController'
    })
    .when('/login', {
        templateUrl: './views/login.html',
        controller: 'AuthController'
    })
    .otherwise({ redirectTo: '/home'})

    locationProvider.html5Mode(true).hashPrefix('!');
}]);
app.controller('AuthController', ['$scope', '$http', function(scope, http) {
    scope.errors = [];
    scope.authenticate = function(credentials){
        credentials = credentials || { email: '', password: '' };
        http.post('http://localhost/freelancer/api/login', credentials)
        .then(function(r) {

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
            
            }
        });
    };
    scope.register = function(info) {
        info = info || {first_name: '', last_name: '', email: '', password: '', password_confirm: ''};
        http.post('http://localhost/freelancer/api/register', info)
        .then(function(r){

            if( r.data.hasOwnProperty('response') && r.data.response == true) 
            {
                alert('registration success!');   
            }
            else 
            {
                scope.errors = [];
                Object.keys(r.data).forEach(function(k, val){
                    scope.errors.push(r.data[k]);
                });
            }
        });
    }
}]);

app.controller('DashboardController', ['$scope', '$http', function(scope, http) {
    scope.errors = [];
    http.get('http://localhost/freelancer/api/account/me')
    .then(function(r) {
        scope.user = r.data;
    });
    http.get('http://localhost/freelancer/api/portfolio/all')
    .then(function(r) {
        scope.protfolios = r.data;
    });

    scope.portfolio = {
        add: function(formdata) {
            console.log(formdata);
            formdata = formdata || {title: '', description: '', price: 0.00, images:["", ""]};
            http.post('http://localhost/freelancer/api/portfolio/add', formdata)
            .then(function(r) {
                if(r.data.hasOwnProperty('response'))
                {
                    if(r.data.response)
                    {
                        alert(r.data.msg);
                    }
                    else 
                    {
                        scope.errors = [r.data.msg];
                    }
                }
                else
                {
                    scope.errors = [];
                    Object.keys(r.data).forEach(function(k, val){
                        scope.errors.push(r.data[k]);
                    });
                }
            });
        }
    };
}]);

app.controller('AppController',['$scope', '$http', function(scope) {
    scope.message = 'Hello world!';
    scope.data = [];
}]);
