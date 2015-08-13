(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('UserController',
    ['User', function(User){
		var vm = this;

		vm.processing = true;

		User.all().success(function(data){
			vm.users = data;
       });

    }]);

	app.controller('UserCreateController',
	['User', '$location', '$window',
	function(User,$location,$window){
		var vm = this;

		vm.signupUser = function(){
			vm.message = '';

			User.create(vm.userData).then(function(response){
				vm.userData = {};

				vm.message = response.data.message;
				$window.localStrorage.setItem('token', response.data.token);

				$location.path('/');
			});
		};
    }]);

}());