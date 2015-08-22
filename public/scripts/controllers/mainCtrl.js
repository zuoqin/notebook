(function() {
	'use strict';
	var app = angular.module('MyApp');
	app.controller('MainController',
    [
        '$rootScope', '$location','Auth',
        function($rootScope, $location, Auth){
		var vm = this;

        
    	vm.model = {
        	message: "This is my app111!!!"
    	};

		vm.loggedIn = Auth.isLoggedIn();

		$rootScope.$on('$routeChangeStart', function(){
			vm.loggedIn = Auth.isLoggedIn();


			Auth.getUser().then( function(data){
				vm.user = data.data;
			});
		});

		vm.doLogout = function(){
			Auth.logout();
			$rootScope.showItems = false;
			$rootScope.isLoggedIn = false;
			$location.path('/login');
		};

		vm.doLogin = function(){
			vm.processing = true;
			vm.error = '';

			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data){
					vm.processing = false;

					Auth.getUser().then(function(data){
						vm.user = data.data;
					});

					if(data.success)
					{
						$rootScope.showItems = false;
						$rootScope.isLoggedIn = true;						
						$location.path('/');
					}
					else
					{
						vm.error = data.message;
						$rootScope.showList = false;
	                    var type = "warning";
	                    var message = "Downloaded items";
	                    var title = "Login";
	                    $rootScope.alert = {
	                        hasBeenShown: true,
	                        show:true,
	                        type:type,
	                        message:data.message,
	                        title:title
	                    };

	                    setTimeout(function () {
	                        $rootScope.$apply(function () {
	                            $rootScope.showList = true;
	                        });
	                    }, 2000);	                    					
					};
				});
		}
	}]);

}());