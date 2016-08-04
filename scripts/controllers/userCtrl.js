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
				if ($window !== undefined && $window.localStrorage !== undefined) {
					$window.localStrorage.setItem('token', response.data.token);	
				}
				

				$location.path('/login');
			});
		};
    }]);

	app.controller('UserManageController',
	['User', '$location', '$window', 'Auth', '$scope', '$http',
	function(User,$location,$window, Auth, $scope, $http){
		var vm = this;

		var data = Auth.getUser().then( function(data){
			vm.user = data.data;
			$scope.user = vm.user;
			var weibotoken = $window.localStorage.getItem('weibotoken');
			if (weibotoken !== null && weibotoken !== undefined) {
				$scope.user.weibotoken = weibotoken;
			}	
		});
		
	    var parts = $location.absUrl();//.split('/');
        var code = '';
        if (parts.indexOf('?') > 0) {
            code = parts.substring(parts.indexOf('?'));
            $http({method:'GET',
        		url:'/api/weibo/token' + code,
        		headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        	})

            .then(function(response)
            {
            	if (response.data.access_token !== undefined &&
            		response.data.access_token !== null) {
	                $window.localStorage.setItem('weibotoken', response.data.access_token);
	                
	                setTimeout(function () {
	                    $scope.$apply(function () {
	                        $scope.user.weibotoken = response.data.access_token;
	                    });
	                }, 100);

            	} else{
            		var error = response.data.error;
	                toastr.options.closeButton = true;
	                toastr.options.closeMethod = 'fadeOut';
	                toastr.options.closeDuration = 300;
	                toastr.options.closeEasing = 'swing';
	                toastr.options.positionClass = "toast-bottom-right";
	                toastr.error(error, 'An error occured');
	                $location.path('/user');
            	}

            }, function(response){
            	alert('Some error.');
            });     
        }

		$scope.getweibotoken = function()
		{
			var weibotoken = $window.localStorage.getItem('weibotoken');
			if (weibotoken === null || weibotoken === undefined) {
				$window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=588957036&redirect_uri=http://www.lifemall.com/service/user&response_type=code';
			}
		};


		$scope.save = function()
		{
			var weibotoken = $window.localStorage.getItem('weibotoken');
			if (weibotoken !== null && weibotoken !== undefined) {
				User.update($scope.user).then(function(response){
					vm.message = response.data.message;
				});				
			}		
		};
    }]);


}());