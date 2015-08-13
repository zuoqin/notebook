(function () {
    'use strict';
    var app = angular.module('MyApp');
    app.service('syncService',
    [
        'Story', 'Offline', 'localDBService', 'dbModel', '$q', 'remotePersistenceStrategy', '$window',
        function(Story, Offline, localDBService, dbModel, $q, remotePersistenceStrategy, $window){
            var svc = {
                check: function() {
                    var deferred = $q.defer();
                    localDBService.open(dbModel).then(function() {
                        localDBService.getCount(dbModel.objectStoreName).then(
                            function (count) {
                                if (count != undefined) {
                                    deferred.resolve(count > 0);
                                } else {
                                    deferred.resolve(false);
                                }
                            }, deferred.reject);
                    }, deferred.rejec);
                    return deferred.promise;
                },
                monitorUp: function() {

                    var deferred = $q.defer();
                    Offline.on('confirmed-up', function() {
                        svc.check().then(function(result) {
                            deferred.resolve(result);
                        }, deferred.reject);
                    });
                    return deferred.promise;
                },
                monitorDown: function() {
                    var deferred = $q.defer();
                    Offline.on('confirmed-down', function() {
                        deferred.resolve(false);
                    });
                    return deferred.promise;
                },
                sync: function () {
                    var stored = [];
                    var deferred = $q.defer();
                    localDBService.open(dbModel).then(function() {
                        localDBService.getAll(dbModel.objectStoreName).then(function (items) {
                            var lastDownload = new Date($window.localStorage.getItem('lastdownload'));
                            items.forEach(function(item) {
                                if (new Date(item.modified) > lastDownload) {
                                    remotePersistenceStrategy.save(item).then(function (result) {
                                        if (item._id !== undefined && item._id !== null) {
                                            if (item._id.length > 24) {
                                                var newItem = result;
                                                localDBService.delete(dbModel.objectStoreName, item._id).then(
                                                    function(result){
                                                        //var newItem = item;
                                                        //newItem._id = result._id;
                                                        //newItem.creator = result.creator;
                                                        localDBService.insert(dbModel.objectStoreName, newItem, "_id").then(
                                                        function(result){

                                                        })        
                                                    })
                                                
                                            };
                                        }
                                        //    }, deferred.reject);
                                        //} else {
                                        //    deferred.reject('Unable to clear object store');
                                        //    }
                                    }, deferred.reject);

                                };
                                stored.push(1);
                                if (stored.length == items.length) {
                                    deferred.resolve(true);
                                }

                            });
                            
                        }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                
                getData: function () {
                    $rootScope.items = [];
                    $rootScope.showList = false;
                    $scope.thisList = false;
                    var deferred = $q.defer();
                    if( authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
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
                                                        $rootScope.items.push({
                                                            _id: item.id,
                                                            title: $sce.trustAsHtml(item.title),
                                                            introduction: $sce.trustAsHtml(item.introduction),
                                                            modified: new Date(item.modified),
                                                            //TopicId: item.TopicId,
                                                            creator: item.creator,
                                                            content: $sce.trustAsHtml(item.content)
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
                                        $rootScope.items.push({
                                            _id: item._id,
                                            title: $sce.trustAsHtml(item.title),
                                            introduction: $sce.trustAsHtml(item.introduction),
                                            modified: new Date(item.modified),
                                            //TopicId: item.TopicId,
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
                                
                                $scope.showEmptyListMessage = (items.length === 0);


                            },
                            function (error) {
                                $scope.error = error;
                            });
                    };
                    return deferred.promise;
                },
            };
            return svc;
    }]);
}());
