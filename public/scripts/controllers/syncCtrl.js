'use strict';
angular.module('syncCtrl', ['storyService'])

.controller('syncController',
function(Story, $rootScope, $scope, $timeout, syncService, Auth, persistenceService, $sce){
    if (Auth.isLoggedIn()) {
        $rootScope.isLoggedIn = true;
        $rootScope.showItems = true;
        $rootScope.showList = false;
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
            persistenceService.ClearLocalDB().then(function() {

            stories.forEach(function (item) {
                persistenceService.action.save(item).then(
                    function() {
                        $rootScope.stories.push({
                            _id: item._id,
                            title: $sce.trustAsHtml(item.title),
                            introduction: $sce.trustAsHtml(item.introduction),
                            modified: new Date(item.modified),
                            //topic: item.topic,
                            creator: item.creator,
                            content: $sce.trustAsHtml(item.content)
                        });

                    });
                }
                );
            $rootScope.stories.sort(function(a, b) {
                return new Date(b.modified) - new Date(a.modified);
            });

            });

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