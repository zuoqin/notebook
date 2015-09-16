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
				};
				

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
			};			
		});
		
	    var parts = $location.absUrl();//.split('/');
        var code = '';
        if (parts.indexOf('?') > 0) {
            code = parts.substring(parts.indexOf('?'));
            $http({method: 'POST',
                url:'https://api.weibo.com/oauth2/access_token' + code + '&grant_type=authorization_code&client_id=588957036&forcelogon=true&client_secret=d6d06112b69d8c6482dd00f870a78dcf&redirect_uri=http://www.lifemall.com',                
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response)
            {                         
                $window.localStorage.setItem('weibotoken', response.data.access_token);
                
                setTimeout(function () {
                    $scope.$apply(function () {
                        user.weibotoken = response.data.access_token;
                    });
                }, 100);

            }, function(response){
            	response = response;
            });     
        };    
		$scope.getweibotoken = function()
		{
			var weibotoken = $window.localStorage.getItem('weibotoken');
			if (weibotoken === null || weibotoken === undefined) {
				$window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=588957036&redirect_uri=http://www.lifemall.com/service/user&response_type=code';
			};
		}
    }]);


}());