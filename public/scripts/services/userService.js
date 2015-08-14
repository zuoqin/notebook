(function () {
    'use strict';
    var app = angular.module('MyApp');

    app.factory('User',
    ['$http',
    function($http){
		var svc = {
		create: function(userdata){
			return $http.post('/api/signup', userdata);
		},

		all: function(){
			return $http.get('/api/users');	
		}
	};
    return svc;
    }
    ]);


}());