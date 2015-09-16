(function () {
    'use strict';
    var app = angular.module('MyApp');
    
    app.factory('Auth',
    ['$http', '$q', 'AuthToken',
        function($http, $q, AuthToken){
			var authFactory = {};
			authFactory.login = function(username, password){
				return $http.post('/api/login', {
					username: username,
					password: password
				})
				.success(function(data){
					AuthToken.setToken(data.token);
					return data;
				})
			}


			authFactory.logout = function(){
				AuthToken.setToken();
			}

			authFactory.isLoggedIn = function(){
				if (AuthToken.getToken()) {
					return true;
				} else{
					return false;
				}
			};

			authFactory.getUser = function(){
				if (AuthToken.getToken()) {
					var person = {data:{data:'zuoqin'}};
					return $http.get('/api/me')
				} else{
					return $q.reject({message: "User has no token"});
				}
			};

			return authFactory;
        }
    ]);


    app.factory('AuthToken',
    ['$window', function($window){
		var authTokenFactory = {};
		authTokenFactory.getToken = function(){
			return $window.localStorage.getItem('token');
		}

		authTokenFactory.setToken = function(token){
			if (token) {
				$window.localStorage.setItem('token', token);
			} else{
				$window.localStorage.removeItem('token');
			}
		}

		return authTokenFactory;
    }]);


    app.factory('AuthInterceptor',
    ['$q', '$location', 'AuthToken',
        function($q, $location, AuthToken){
			var interceptorFactory = {};

			interceptorFactory.request = function(config){
				var token = AuthToken.getToken();

				if (token) {
					config.headers['x-access-token'] = token;
				};
				return config;
			};

			interceptorFactory.responseError = function(response){
				if (response.status == 403) {
					$location.path('login');
				};
				return $q.reject(response);
			};

			return interceptorFactory;
        }
    ]);

	
}());
