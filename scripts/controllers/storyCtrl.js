(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('StoryController',
    [
        'Story', '$scope', '$sce', '_', 'persistenceService', '$q','$rootScope',
        function(Story, $scope, $sce, _, persistenceService, $q,$rootScope)
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
        	    //var id = $rootScope.stories[index]._id;
                $rootScope.stories[index].isDeleted = true;
                $rootScope.stories[index].modified = new Date();
                persistenceService.setAction(1);
                //var item = $rootScope.stories[index];
                persistenceService.action.getById($rootScope.stories[index]._id).then(
                    function(result){
                        result.isDeleted = true;
                        result.modified = new Date();

                        persistenceService.action.save(result).then(
                            function() {
                                setTimeout(function () {
                                    $rootScope.$apply(function () {
                                        $rootScope.stories.splice(index, 1);
                                        $rootScope.showList = true;

                                    });
                                }, 100); 
                            });

                    }
                    );
      
        	    // persistenceService.action.delete(id).then(
        	    //     function(result) {
        	    //         $rootScope.stories.splice(index, 1);
        	    //     },
        	    //     function(error) {
        	    //         $scope.error = error;
        	    //     });		
        		//persistenceService.deleteItem(item);
        	};


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
                                                        topic: item.topic,
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
                                    //if (item.isDeleted === undefined || item.isDeleted === false) {
                                        $rootScope.stories.push({
                                            _id: item._id,
                                            title: $sce.trustAsHtml(item.title),
                                            introduction: $sce.trustAsHtml(item.introduction),
                                            modified: new Date(item.modified),
                                            isDeleted: item.isDeleted === true ? true : false,
                                            topic: item.topic,
                                            creator: item.UserId,
                                            content: $sce.trustAsHtml(item.content)
                                        });                                        
                                    //};
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
            //if ($rootScope.stories.length === 0) {
                var lazyGetData = _.debounce(getData, 1000);
                $rootScope.stories = [];
                //if ($rootScope.showItems === true) {
                    lazyGetData();
                //}                
            //};
        }]);

}());