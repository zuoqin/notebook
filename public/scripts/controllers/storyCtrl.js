(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('StoryController',
    [
        'Story', '$scope', '$sce', '_', 'persistenceService', 'Offline', '$q','$rootScope',
        function(Story, $scope, $sce, _, persistenceService, Offline, $q,$rootScope)
        {
        	var vm = this;
        	
        	vm.createStory = function(){
        		vm.message = '';
        		Story.create(vm.storyData).success(function(data){
        			vm.storyData = '';
        			vm.message = data.message;
        			vm.stories.push(data);
        		});

        	};

        	vm.deleteStory = function(index){
        	    var id = $rootScope.stories[index]._id;
        	    persistenceService.action.delete(id).then(
        	        function(result) {
        	            $rootScope.stories.splice(index, 1);
        	        },
        	        function(error) {
        	            $scope.error = error;
        	        });		
        		//persistenceService.deleteItem(item);
        	}


            var getData = function () {
                $rootScope.stories = [];
                vm.showList = false;
                var deferred = $q.defer();
                //if( authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
                    persistenceService.action.getAll().then(
                        function (items) {
                            if (persistenceService.getAction() === 0) {
                                persistenceService.ClearLocalDB().then(
                                    function() {
                                        persistenceService.setAction(1);
                                        items.sort(function(a, b) {
                                            return new Date(b.modified) - new Date(a.modified);
                                        });
                                        items.forEach(function (item) {
                                            //if (persistenceService.getAction() === 0) {
                                            persistenceService.action.save(item).then(
                                                function() {
                                                    $rootScope.stories.push({
                                                        _id: item._id,
                                                        title: $sce.trustAsHtml(item.title),
                                                        introduction: $sce.trustAsHtml(item.introduction),
                                                        modified: new Date(item.modified),
                                                        //TopicId: item.TopicId,
                                                        creator: item.creator,
                                                        content: $sce.trustAsHtml(item.Content)
                                                    });

                                                });
                                            //}
                                        });
                                    }
                                    );
                                
                            } else {
                                items.sort(function (a, b) {
                                    return new Date(b.modified) - new Date(a.modified);
                                });
                                items.forEach(function (item) {
                                    $rootScope.stories.push({
                                        _id: item._id,
                                        title: $sce.trustAsHtml(item.title),
                                        introduction: $sce.trustAsHtml(item.introduction),
                                        modified: new Date(item.modified),
                                        //TopicId: item.TopicId,
                                        craetor: item.UserId,
                                        content: $sce.trustAsHtml(item.content)
                                    });
                                    //if (persistenceService.getAction() === 0) {
                                    //persistenceService.action.save(item);

                                    //}
                                });
                                
                                
                            }

                            deferred.resolve(true);
                            $rootScope.showList = true;
                            $rootScope.showItems = true;
                            $scope.showEmptyListMessage = (items.length === 0);
                            $rootScope.stories.sort(function(a, b) {
                                return new Date(b.modified) - new Date(a.modified);
                            });

                        },
                        function (error) {
                            $scope.error = error;
                        });
                //};
                return deferred.promise;
            };

            var lazyGetData = _.debounce(getData, 1000);
            $rootScope.stories = [];
        	//if ($rootScope.showItems === true) {
        	    lazyGetData();
        	//}
        }]);

}());