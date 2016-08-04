(function () {
    'use strict';
    var app = angular.module('MyApp');

    app.factory('User',
    ['$http',
    function($http){
		var svc = {
		create: function(userdata){
			return $http.post('/api/user/signup', userdata);
		},

		all: function(){
			return $http.get('/api/users');	
		},
		update: function(userdata){
			return $http.put('/api/user/update', userdata);	
		}

	};
    return svc;
    }
    ]);


}());