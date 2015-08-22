window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || Window.msIndexedDB
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


angular.module('MyApp', [ 'ngResource', 'ngCookies', 'ngRoute'])

.config(['$provide', '$httpProvider', '$routeProvider', '$locationProvider',

    function($provide, $httpProvider, $routeProvider, $locationProvider
        ){
    	$httpProvider.interceptors.push('AuthInterceptor');



    	$provide.constant('indexedDB', window.indexedDB);
        $provide.constant('_', window._);
        $provide.constant('localStorage', window.localStorage);
        $provide.constant('Offline', window.Offline);
        $provide.value('nullItem', {
            _id: '',
            created: new Date(-8640000000000000),
            modified: new Date(-8640000000000000)
        });
        $provide.value('dbModel', {
            name: 'journalitems',
            version: '1.2',
            instance: null,
            objectStoreName: 'items',
            keyName: '_id',
            upgrade: function(e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains('items')) {
                    db.createObjectStore('items', {
                        keyPath: '_id'
                    });
                }
            }
        });



        $routeProvider
        .when('/', {
            templateUrl: '/views/pages/home.html',
            controller: 'MainController',
            controllerAs: 'main'
        })


        .when('/login', {
            templateUrl: '/views/pages/login.html',
            controller: 'MainController'
        })

        .when('/signup', {
            templateUrl: '/views/pages/signup.html'
        })

        .when('/view/:id', {
            templateUrl: '/views/pages/view.html'//,
            //controller: 'viewController'
        })

        .when('/edit/:id', {
            templateUrl: '/views/pages/edit.html'//,
            //controller: 'editController'
        })

        .when('/new/:topic', {
            templateUrl: '/views/pages/edit.html',
            controller: 'editController'
        })
        $locationProvider.html5Mode(true);

    }
]);





