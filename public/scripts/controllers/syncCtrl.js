(function() {
    'use strict';

    var app = angular.module('MyApp');
    app.controller('syncController',
    [
        'Story', '$location', '$rootScope', '$scope', '$timeout', 'syncService', 'Auth', 'persistenceService', '$q', '$sce', '$window',
        function(Story, $location, $rootScope, $scope, $timeout, syncService, Auth, persistenceService, $q, $sce, $window
            )
        {
            var vm = this;

            vm.getData = function () {
                $location.path('/');
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
                                    $rootScope.stories.push({
                                        _id: item._id,
                                        title: $sce.trustAsHtml(item.title),
                                        introduction: $sce.trustAsHtml(item.introduction),
                                        modified: new Date(item.modified),
                                        topic: item.topic,
                                        creator: item.UserId,
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

            if (Auth.isLoggedIn()) 
            {
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
                }
            );
            syncService.monitorDown().then(
                function (result) {
                    $timeout(function () {
                        $rootScope.hasLocalDataToSync = false;//result;
                    });
                },
                function (error) {
                    $rootScope.error = error;
                }
            );


            $scope.getData = function(){
                $scope.filtertext = "";
                $scope.search();
                $location.path('/');
            }

            $scope.filterByTopic = function(topic){
                var items = [];
                $rootScope.showList = false;
                vm.getData().then(function(result){            
                    if ($rootScope.stories !== undefined) {
                        for (var i = 0 ; i < $rootScope.stories.length ; i++) {

                            if (topic !== 'Other') {
                                if ($rootScope.stories[i].topic === topic) {
                                    items.push($rootScope.stories[i]);
                                };                                
                            }
                            else
                            {
                                if ($rootScope.stories[i].topic !== 'Programming' &&
                                    $rootScope.stories[i].topic !== 'Life' &&
                                    $rootScope.stories[i].topic !== 'Research'
                                    ) {
                                    items.push($rootScope.stories[i]);
                                };                                   
                            }
                        };
                    
                    }
                    setTimeout(function () {
                        $rootScope.$apply(function () {
                            $rootScope.stories = items;
                            $rootScope.showList = true;
                        });
                    }, 100);

                });
            };


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
            };


            $scope.download = function () {
                $rootScope.showList = false;
                $rootScope.stories =[];
                Story.allStory().success(function(data)
                {
                    $rootScope.stories =[];
                    var stories = data;
                    persistenceService.setAction(1);
                    var curDate = new Date();
                    $window.localStorage.setItem('lastdownload', curDate);
                    //persistenceService.ClearLocalDB().then(function() {

                    
                    var type = "warning";
                    var message = "Downloaded items";
                    var title = "Download";
                    $rootScope.alert = {
                        hasBeenShown: true,
                        show:true,
                        type:type,
                        message:message,
                        title:title
                    };


                    setTimeout(function () {
                        $rootScope.$apply(function () {
                            data.forEach(function (item) {
                                persistenceService.action.save(item).then(function() {
                                    $rootScope.stories.push({
                                        _id: item._id,
                                        title: $sce.trustAsHtml(item.title),
                                        introduction: $sce.trustAsHtml(item.introduction),
                                        modified: new Date(item.modified),
                                        created: new Date(item.created),
                                        topic: item.topic,
                                        creator: item.creator,
                                        content: $sce.trustAsHtml(item.content)
                                    });

                                    if ($rootScope.stories.length === data.length) {
                                        $rootScope.stories.sort(function(a, b) {
                                            return new Date(b.modified) - new Date(a.modified);
                                        });
                                        $rootScope.alert.show = false;
                                        
                                        $rootScope.showList = true;

                                    };

                                });
                            });
                        });
                    }, 1000);
                });
            };

            syncService.check().then(
                function(result) {
                    $timeout(function() {
                        $rootScope.hasLocalDataToSync = result;
                    });
                },
                function(error) {
                    $rootScope.error = error;
                }
            );

        }]);
}());
