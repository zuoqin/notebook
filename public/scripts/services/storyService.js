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

			getbyid:  function(id){
				return $http.get('/api?id=' + id);
			},
			StoryFromTime:  function(datetime){
				if (datetime.datetime === null || datetime.datetime === undefined) {
					datetime = new Date(0);
				}
				return $http.post('/api', datetime);
			},
			update: function(storyData){
				return $http.put('/api', storyData);
			},
			'delete': function(storyData){
				return $http.delete('/api/' + storyData._id);
			},
			send: function(sendData){
				return $http.post('/api/email/' + sendData.data._id, sendData);
			},
		};
		return svc;
     	}
   ]);
}());