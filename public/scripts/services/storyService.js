(function () {
    'use strict';
    var app = angular.module('MyApp');

    app.factory('Story',
	[
        '$http',
        function($http){
		var svc = {

			create: function(storyData){
				return $http.post('/api', storyData);
			},

			allStory:  function(){
				return $http.get('/api');
			},
			update: function(storyData){
				return $http.put('/api', storyData);
			},
			'delete': function(storyData){
				return $http.delete('/api/' + storyData._id);
			},
		};
		return svc;
     	}
   ]);
}());