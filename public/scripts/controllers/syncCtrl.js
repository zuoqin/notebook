'use strict';
angular.module('syncCtrl', ['storyService'])

.controller('syncController',
function(Story, $rootScope, $scope, $timeout, syncService, Auth, persistenceService, $q, $sce, $window){
    var vm = this;
    vm.getData = function(){
        var deferred = $q.defer();
        $rootScope.stories = [];
        persistenceService.action.getAll().then(
            function (items) {
                items.forEach(function (item) {
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
                deferred.resolve(true);
            });
         return deferred.promise;
        };
    if (Auth.isLoggedIn()) {
        $rootScope.isLoggedIn = true;
        //$rootScope.showItems = true;
        //$rootScope.showList = false;
    } else {
        $rootScope.isLoggedIn = false;
        $rootScope.showList = true;
    }
    syncService.monitorUp().then(
        function(result) {
            $timeout(function() {
                $rootScope.hasLocalDataToSync = result;
            });
        },
        function(error) {
            $scope.error = error;
        });
    syncService.monitorDown().then(
        function (result) {
            $timeout(function () {
                $rootScope.hasLocalDataToSync = false;//result;
            });
        },
        function (error) {
            $rootScope.error = error;
        });




    $scope.search = function () {
        var items = [];//$rootScope.stories;
        $rootScope.showList = false;
        //$rootScope.stories.splice(0, $rootScope.stories.length);
        vm.getData().then(function(result){            
            var srch = $scope.filtertext;
            if ($rootScope.stories !== undefined) {
                for (var i = 0 ; i < $rootScope.stories.length ; i++) {
                    if (($rootScope.stories[i].title !== undefined && $rootScope.stories[i].title.toString().toLowerCase().indexOf(srch.toLowerCase()) > -1) ||
                        ($rootScope.stories[i].introduction !== undefined && $rootScope.stories[i].introduction.toString().toLowerCase().indexOf(srch.toLowerCase()) > -1) ||
                        ($rootScope.stories[i].content !== undefined && $rootScope.stories[i].content.toString().toLowerCase().indexOf(srch.toLowerCase()) > -1)) {
                        items.push($rootScope.stories[i]);
                    };
                };
            
            }
            //items = $rootScope.stories;
            setTimeout(function () {
                $rootScope.$apply(function () {
                    $rootScope.stories = items;
                    $rootScope.showList = true;
                });
            }, 100);

        });
    };


    $scope.sync = function () {
        $rootScope.showList = false;
        syncService.sync().then(
            function (result) {
                $rootScope.showList = true;
                $rootScope.hasLocalDataToSync = false;
            },
            function(error) {
                $rootScope.error = error;
            });
    }
    $scope.download = function () {
        $rootScope.showList = false;
        Story.allStory().success(function(data)
        {
            $rootScope.stories =[];
            var stories = data;
            persistenceService.setAction(1);
            var curDate = new Date();
            $window.localStorage.setItem('lastdownload', curDate);
            //persistenceService.ClearLocalDB().then(function() {

            stories.forEach(function (item) {
                persistenceService.action.save(item).then(function() {
                    $rootScope.stories.push({
                        _id: item._id,
                        title: $sce.trustAsHtml(item.title),
                        introduction: $sce.trustAsHtml(item.introduction),
                        modified: new Date(item.modified),
                        created: new Date(item.created),
                        //topic: item.topic,
                        creator: item.creator,
                        content: $sce.trustAsHtml(item.content)
                    });

                });
            });
            $rootScope.stories.sort(function(a, b) {
                return new Date(b.modified) - new Date(a.modified);
            });
            $rootScope.showList = true;

        });
    }

    syncService.check().then(
        function(result) {
            $timeout(function() {
                $rootScope.hasLocalDataToSync = result;
            });
        },
        function(error) {
            $rootScope.error = error;
        });


});