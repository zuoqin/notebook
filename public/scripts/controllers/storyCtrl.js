angular.module('storyCtrl', ['storyService'])

.controller('StoryController', function(
	Story, $scope, $sce, _, persistenceService, Offline, $q,$rootScope
	//Story, $sce, persistenceService
	){
	var vm = this;
	// Story.allStory().success(function(data){
	// 	vm.stories = data;
	// 	persistenceService.setAction(1);
 //        vm.stories.sort(function(a, b) {
 //            return new Date(b.modified) - new Date(a.modified);
 //        });
 //        vm.stories.forEach(function (item) {
 //            persistenceService.action.save(item).then(
 //                function() {
 //                    vm.stories.push({
 //                        _id: item._id,
 //                        title: $sce.trustAsHtml(item.title),
 //                        introduction: $sce.trustAsHtml(item.Introduction),
 //                        modified: new Date(item.modifiedDate),
 //                        //topic: item.topic,
 //                        creator: item.creator,
 //                        content: $sce.trustAsHtml(item.content)
 //                    });

 //                });
 //            //}
 //        })
	// });

	vm.createStory = function(){
		vm.message = '';
		Story.create(vm.storyData).success(function(data){
			vm.storyData = '';
			vm.message = data.message;
			vm.stories.push(data);
		});

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
                                    return new Date(b.modifiedDate) - new Date(a.modifiedDate);
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
                    
                    $scope.showEmptyListMessage = (items.length === 0);


                },
                function (error) {
                    $scope.error = error;
                });
        //};
        return deferred.promise;
    };

    var lazyGetData = _.debounce(getData, 1000);

	//if ($rootScope.showItems === true) {
	    lazyGetData();
	//}
})