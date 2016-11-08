"use strict";

var app = angular.module('freelancer', ['ngRoute', 'ngFileUpload']);
app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider) {
    routeProvider.when('/', {
        redirectTo: '/landing'
    })
    routeProvider.when('/home', {
        templateUrl:  './views/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
    .when('/changepassword', {
        templateUrl: './views/dashboard/change_password.html',
        controller: 'AccountController'
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
app.controller('AccountController', ['$scope', '$http', '$location', 'UserService', function(scope, http, $location, UserService) {
    scope.user = UserService.getUser();
    scope.credentials = angular.copy(scope.user);
    scope.success = undefined;
    scope.errors = [];
    var promiseManager = function(r) {
        if(r.data.hasOwnProperty('response'))
        {
            if(r.data.response)
            {
                if(r.data.hasOwnProperty('user')) {
                    UserService.setUser(r.data.user);
                    scope.user = UserService.getUser();
                }

                scope.success = r.data.msg;
                scope.errors = [];
            }
            else
            {
                scope.success = undefined;
                scope.errors = [r.data.msg];
            }
        }
        else
        {
            scope.success = undefined;
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
            angular.copy(scope.user, scope.credentials);
            $location.path('/home');
        },
        changepassword: function(credentials) {
            credentials = credentials || { password: '', password_confirm: ''};
            var formdata = {
                'email': scope.user.email,
                'password': credentials.newpassword,
                'password_confirm': credentials.password_confirm
            }
            http.post('http://localhost/freelancer/api/acccount/rpwd', formdata)
            .then(promiseManager);
        }
    }
}]);
app.controller('ProfileController', ['$scope', '$http', '$routeParams', function(scope, http, routeParams) {
    scope.profiles = [];
    if(routeParams.hasOwnProperty('id'))
    {
        scope.portfolios = [];
        http({
            url: 'http://localhost/freelancer/api/portfolio/all',
            method: 'GET',
            params: routeParams
        })
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
        var params = { id: routeParams.id };
        if(scope.$parent.user !== null)
        {
            params['exception'] = [scope.$parent.user.id];
        }
        http({
            url: 'http://localhost/freelancer/api/profile/all',
            method: 'GET',
            params: params
        })
        .then(function(r){
            scope.profiles = r.data;
        })
    }

}]);
app.controller('AuthController', ['$scope', '$http', '$location', function(scope, http, location) {
    scope.errors = [];
    scope.success = undefined;
    var promiseManager = function(r) {
        if(r.data.hasOwnProperty('response'))
        {
            if(r.data.response)
            {
                scope.errors = [];
                scope.success = r.data.msg;
            }
        }
        else
        {
            scope.success = undefined;
            scope.errors = [];
            Object.keys(r.data).forEach(function(k, val){
                scope.errors.push(r.data[k]);
            });
        }
    };
    scope.register = function(info) {
        info = info || {first_name: '', last_name: '', email: '', password: '', password_confirm: ''};
        http.post('http://localhost/freelancer/api/register', info)
        .then(promiseManager);
    }

    scope.forgot = function(formdata)
    {
        http.post('http://localhost/freelancer/api/auth/forgot', formdata)
        .then(promiseManager);
    }
}]);
app.controller('DashboardController', ['$scope', '$http', '$routeParams', 'UserService', 'Upload', function(scope, http, routeParams, UserService, Upload) {
    scope.errors = [];
    scope.success = undefined;
    scope.formdata = {};
    scope.messages = [];
    scope.user = UserService.getUser();
    scope.img1 = '';
    scope.img2 = '';
    scope.onselect = function(file, name) {
        if(!file) return;
        Upload.upload({
            url: "http://localhost/freelancer/api/portfolio/upload",
            data: { file: file, id: scope.$parent.user.id }
        })
        .then(function(r){
            console.log(r.data);
            scope[name] = r.data.file_name;
        });
    }

    if(scope.user !== null)
     {
        http.post('http://localhost/freelancer/api/message/inbox', {id: UserService.getUser('id')})
        .then(function(r) {
            scope.messages = r.data;
        })
    }


    http({
        url: 'http://localhost/freelancer/api/portfolio/all',
        method: 'GET',
        params: {id: scope.user.id }
    })
    .then(function(r) {
        scope.portfolios = r.data;
    });
    var promiseManager = function(r) {
        if(r.data.hasOwnProperty('response'))
        {
            if(r.data.response)
            {
                scope.errors = [];
                scope.success = r.data.msg;
            }
            else
            {
                scope.success = undefined;
                scope.errors = [r.data.msg];
            }
        }
        else
        {
            scope.success = undefined;
            scope.errors = [];
            Object.keys(r.data).forEach(function(k, val){
                scope.errors.push(r.data[k]);
            });
        }
    };
    scope.portfolio = {
        add: function(formdata) {
            formdata = formdata || {title: '', description: '', price: 0.00, images:["", ""]};
            formdata.images = [
                'http://localhost/freelancer/frontend/uploads/images/' + scope.img1,
                'http://localhost/freelancer/frontend/uploads/images/' + scope.img2
            ];
            formdata['id'] = scope.$parent.user.id;
            http.post('http://localhost/freelancer/api/portfolio/add', formdata)
            .then(promiseManager);
        },
        edit: function(formdata) {
            formdata['id'] = scope.$parent.id;
             formdata = formdata || {title: '', description: '', price: 0.00, images:["", ""]};
             formdata['id'] = routeParams.id;
             http.post('http://localhost/freelancer/api/portfolio/update', formdata)
             .then(promiseManager);
        }
    };

}]);
app.controller('MessageController', ['$scope', '$routeParams', '$http',function(scope, routeParams, http) {
    scope.errors = [];
    scope.success = undefined;
    http.post('http://localhost/freelancer/api/profile/get', {id: routeParams.id })
    .then(function(r) {
        scope.user = r.data;
    });
    var promiseManager = function(r) {
        if(r.data.hasOwnProperty('response'))
        {
            if(r.data.response)
            {
                scope.errors = [];
                scope.success = r.data.msg;
            }
        }
        else
        {
            scope.errors = [];
            scope.success = undefined;
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
    scope.$on('user:update', function(){
        scope.user = UserService.getUser();
    });
    scope.$on('$routeChangeSuccess', function(e, cur, prev) {
        var filter = ['/','/login', '/register', '/profile', '/forgot', '/message/:id', '/profile/:id','/landing'];
        if(UserService.getUser() != null && cur.$$route.originalPath == '/login') {
            location.path('/home');
        }
        if(UserService.getUser() == null && filter.indexOf(cur.$$route.originalPath) == -1)
        {
            location.path('/login');
        }
    });

    scope.user = UserService.getUser();
    scope.authenticate = function(credentials){
        credentials = credentials || { email: '', password: '' };
        http.post('http://localhost/freelancer/api/login', credentials)
        .then(function(r) {

            if(r.data.hasOwnProperty('response') && r.data.response)
            {
                UserService.setUser(r.data.user);
                scope.user = UserService.getUser();
                scope.$emit('user:update');
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
        scope.user = UserService.getUser();
        scope.$emit('user:update');
        location.path('/login');
    }
}]);

app.factory('UserService', ['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
    var user = null;
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

    return {
        getUser: function(key) {
            // check user info is stored in web storage.
            if(db.exist()) {
                if(key != undefined) return db.getSchema()[key];
                return db.getSchema()
            }
            // if not exist return null;
            return null;
        },
        setUser: function(data) {
            db.create(data);
        },
        logout: function () {
            db.delete(); // delete the whole schema
        }
    }
}]);
