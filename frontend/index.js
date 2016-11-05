"use strict";

var app = angular.module('freelancer', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider) {
    routeProvider.when('/', {
        redirectTo: '/landing'
    })
    routeProvider.when('/home', {
        templateUrl:  './views/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
    .when('/setting', {
        templateUrl: './views/dashboard/account_setting.html',
        controller: 'AccountController'
    })
    .when('/landing', {
        templateUrl: './views/landing.html',
        controller: 'ProfileController'
    })
    .when('/profile/:id', {
        templateUrl: './views/profile/profile.html',
        controller: 'ProfileController'
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
        controller: 'AppController'
    })
    .otherwise({ redirectTo: '/home'})

    locationProvider.html5Mode(true).hashPrefix('!');
}]);
app.controller('AccountController', ['$scope', '$http', '$location', function(scope, http, $location) {
    scope.credentials = angular.copy(scope.$parent.user);
    var promiseManager = function(r) {
        if(r.data.hasOwnProperty('response'))
        {
            if(r.data.response)
            {
                alert(r.data.msg);
                scope.$parent.user = r.data.user;
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
    scope.account = {
        update: function(credentials) {
            http.post('http://localhost/freelancer/api/profile/update', credentials)
            .then(promiseManager);
        },
        cancel: function() {
            angular.copy(scope.$parent.user, scope.credentials);
            $location.path('/home');
        }
    }
}]);
app.controller('ProfileController', ['$scope', '$http', '$routeParams', function(scope, http, routeParams) {
    scope.profiles = [];
    if(routeParams.hasOwnProperty('id'))
    {
        scope.portfolios = [];
        http.post('http://localhost/freelancer/api/portfolio/all', routeParams)
        .then(function(r) {
            {
                scope.portfolios = r.data;
            }
        });
        http.post('http://localhost/freelancer/api/profile/get', routeParams)
        .then(function(r){
            scope.user = r.data;
        })
    }
    else
    {
        http.get('http://localhost/freelancer/api/profile/all')
        .then(function(r){
            scope.profiles = r.data;
        })
    }

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
    else if(scope.$parent.user !== null)
     {
        http.post('http://localhost/freelancer/api/message/inbox', {id: scope.$parent.user.id})
        .then(function(r) {
            scope.messages = r.data;
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
            formdata = formdata || {id: scope.$parent.id, title: '', description: '', price: 0.00, images:["", ""]};
            formdata['id'] = scope.$parent.id;
            // http.post('http://localhost/freelancer/api/portfolio/add', formdata)
            // .then(promiseManager);
        },
        edit: function(formdata) {
            formdata['id'] = scope.$parent.id;
             formdata = formdata || {title: '', description: '', price: 0.00, images:["", ""]};
            //  http.post('http://localhost/freelancer/api/portfolio/update', formdata)
            //  .then(promiseManager);
        }
    };

}]);
app.controller('MessageController', ['$scope', '$routeParams', '$http',function(scope, routeParams, http) {
    scope.errors = [];
    http.post('http://localhost/freelancer/api/profile/get', {id: routeParams.id })
    .then(function(r) {
        scope.user = r.data;
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
    scope.message = function(formdata)
    {
        formdata = formdata || {message: '', email: '', name: '', subject:'' };
        formdata['userid'] = routeParams.id;
        http.post('http://localhost/freelancer/api/message/send', formdata)
        .then(promiseManager)
    }
}]);
app.controller('AppController',['$scope', '$location', '$http', 'UserService', function(scope, location, http, UserService) {
    scope.user = UserService.getUser();
    scope.$on('$routeChangeSuccess', function(s, cur, prev) {
        var filter = ['/','/login', '/register', '/profile', '/forgot', '/message/:id', '/profile/:id','/landing'];
        if(scope.user != undefined && cur.$$route.originalPath == '/login') {
            location.path('/home');
        }
        if(scope.user == undefined && filter.indexOf(cur.$$route.originalPath) == -1)
        {
            location.path('/login');
        }
    });
    scope.authenticate = function(credentials){
        credentials = credentials || { email: '', password: '' };
        http.post('http://localhost/freelancer/api/login', credentials)
        .then(function(r) {

            if(r.data.hasOwnProperty('response') && r.data.response)
            {
                UserService.setUser(r.data.user);
                scope.user = UserService.getUser();
                console.log(scope.user);
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
    scope.logout = function() {
        UserService.logout();
        $location.path('/login');
    }
}]);

app.service('UserService', ['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
    this.user = null;
    var db = {
        config: {
            schema: 'user',
            engine: $window.localStorage
        },
        exist: function() {
            return this.config.engine.hasOwnProperty(this.config.schema);
        },
        getSchema: function() {
            return JSON.parse(this.config.engine.getItem(this.config.schema));
        },
        get: function(key) {
            var use = this.config.engine.getItem(this.config.schema);
            var data = JSON.parse(use);
            return data[key];
        },
        create: function(data) {
            this.config.engine.setItem(this.config.schema, JSON.stringify(data));
        },
        delete: function() {
            this.config.engine.clear();
        },
        set: function(key, value) {
            try {
                var schema = JSON.parse(this.config.engine.getItem(this.config.schema));
                schema[key] = value;
                var set = JSON.stringify(schema);
                this.config.engine.setItem(this.config.schema, set);
            } catch (e) {
                console.error(e.toString());
            }
        }
    }

    this.getUser = function() {
        // check user info is stored in web storage.
        if(db.exist()) { return db.getSchema() }
        // if not exist return null;
    }

    this.setUser = function(data) {
        db.create(data);
    }

    this.logout = function () {
        db.delete(); // delete the whole schema
    }
}]);
