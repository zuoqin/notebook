angular.module('appRoutes', ['ngRoute'])
.config(function($routeProvider, $locationProvider){
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
			templateUrl: '/views/pages/view.html',
			controller: 'viewController'
		})

		/*.when('/edit/:id', {
			templateUrl: '/views/pages/edit.html'/*,
			controller: 'editController'
		})*/

		.when('/edit2/:id', {
			templateUrl: '/views/pages/edit.html'/*,
			controller: 'editController'*/
		})
	$locationProvider.html5Mode(true);
})