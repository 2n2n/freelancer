var app = angular.module('freelancer', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider) {
    routeProvider.when('/', {
        redirectTo: '/landing'
    })
    routeProvider.when('/home', {
        templateUrl:  './views/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
    .when('/landing', {
        templateUrl: './views/landing.html',
        controller: 'ProfileController'
    })
    .when('/profile/:id', {
        templateUrl: './views/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
    .when('/forgot', {
        templateUrl: './views/forgot.html',
        controller: 'AuthController'
    })
    .when('/register', {
        templateUrl: './views/register.html',
        controller: 'AuthController'
    })
    .when('/message/inbox', {
        templateUrl: './views/contact/message.html',
        controller: 'DashboardController'
    })
    .when('/message/:id', {
        templateUrl: './views/contact/contact.html',
        controller: 'MessageController'
    })
    .when('/portfolio/add', {
        templateUrl: './views/portfolio/add_form.html',
        controller: 'DashboardController'
    })
    .when('/portfolio/edit/:id', {
        templateUrl: './views/portfolio/edit_form.html',
        controller: 'DashboardController'
    })
    .when('/login', {
        templateUrl: './views/login.html',
        controller: 'AuthController'
    })
    .otherwise({ redirectTo: '/home'})

    locationProvider.html5Mode(true).hashPrefix('!');
}]);
app.controller('ProfileController', ['$scope', '$http', function(scope, http) {
    scope.profiles = [];
    http.get('http://localhost/freelancer/api/profile/all')
    .then(function(r){
        scope.profiles = r.data;
    })
}]);
app.controller('AuthController', ['$scope', '$http', '$location', function(scope, http, location) {
    scope.errors = [];
    var promiseManager = function(r) {
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
    };
    scope.authenticate = function(credentials){
        credentials = credentials || { email: '', password: '' };
        console.log(credentials);
        http.post('http://localhost/freelancer/api/login', credentials)
        .then(function(r) {

            if(r.data.hasOwnProperty('response') && r.data.response)
            {
                scope.$parent.user = r.data.user;
                location.path('/home');
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

    scope.forgot = function(formdata)
    {
        http.post('http://localhost/freelancer/api/auth/forgot', formdata)
        .then(promiseManager);
    }
}]);

app.controller('DashboardController', ['$scope', '$http', '$routeParams', function(scope, http, routeParams) {
    scope.errors = [];
    scope.formdata = {};
    scope.messages = [];

    if( routeParams.hasOwnProperty('id') )
    {
        http.post('http://localhost/freelancer/api/portfolio/get', {id: routeParams.id })
        .then(function(r) {
            scope.user = r.data;
        })
    }

    http.get('http://localhost/freelancer/api/portfolio/all')
    .then(function(r) {
        scope.protfolios = r.data;
    });
    var promiseManager = function(r) {
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
    };
    scope.portfolio = {
        add: function(formdata) {
            formdata = formdata || {title: '', description: '', price: 0.00, images:["", ""]};
            http.post('http://localhost/freelancer/api/portfolio/add', formdata)
            .then(promiseManager);
        },
        edit: function(formdata) {
             formdata = formdata || {title: '', description: '', price: 0.00, images:["", ""]};
             http.post('http://localhost/freelancer/api/portfolio/update', formdata)
             .then(promiseManager);
        }
    };

}]);
app.controller('MessageController', ['$scope', '$routeParams', '$http',function(scope, routeParams, http) {
    http.post('http://localhost/freelancer/api/profile/get', {id: routeParams.id })
    .then(function(r) {
        scope.user = r.data;
    })
}]);
app.controller('AppController',['$scope', '$location', function(scope, location) {
    scope.user = null;
    scope.$on('$routeChangeSuccess', function(s, cur, prev) {
        console.log(prev, '<---');
        var filter = ['/','/login', '/register', '/profile', '/forgot', '/message/:id', '/profile/:id','/landing'];
        if(scope.user === null && filter.indexOf(cur.$$route.originalPath) == -1)
        {
            location.path('/login');
        }
        if(scope.user != null && cur.$$route.originalPath == '/login') {
            if(cur)
            location.path('/home');
        }
    });
    scope.logout = function()
    {
        scope.user = null;
        location.path('/login');
    }
}]);
