angular.module('userService', [])

.factory('User', function($http){
	var userFactory = {};

	userFactory.create = function(userdata){
		return $http.post('/api/signup', userdata);
	};

	userFactory.all = function(){
		return $http.get('/api/users');	
	};
})