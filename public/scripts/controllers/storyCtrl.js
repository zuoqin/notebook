angular.module('storyCtrl', ['storyService'])

.controller('StoryController', function(Story, $sce, persistenceService){
	var vm = this;
	Story.allStory().success(function(data){
		vm.stories = data;
		persistenceService.setAction(1);
        vm.stories.sort(function(a, b) {
            return new Date(b.modified) - new Date(a.modified);
        });
        vm.stories.forEach(function (item) {
            persistenceService.action.save(item).then(
                function() {
                    vm.stories.push({
                        _id: item._id,
                        title: $sce.trustAsHtml(item.title),
                        introduction: $sce.trustAsHtml(item.Introduction),
                        modified: new Date(item.modifiedDate),
                        //topic: item.topic,
                        creator: item.creator,
                        content: $sce.trustAsHtml(item.content)
                    });

                });
            //}
        })
	});

	vm.createStory = function(){
		vm.message = '';
		Story.create(vm.storyData).success(function(data){
			vm.storyData = '';
			vm.message = data.message;
			vm.stories.push(data);
		});

	};

	
})