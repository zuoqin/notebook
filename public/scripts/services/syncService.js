'use strict';

angular.module('syncService', ['storyService'])

.factory('syncService', function(Story, Offline, localDBService, dbModel, $q, remotePersistenceStrategy){
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
                    items.forEach(function(item) {
                        remotePersistenceStrategy.save(item).then(function (result) {
                            //if (result) {
                            //    localDBService.clear(dbModel.objectStoreName).then(function(res) {
                            stored.push(1);
                            if (stored.length == items.length) {
                                deferred.resolve(true);
                            }
                            //    }, deferred.reject);
                            //} else {
                            //    deferred.reject('Unable to clear object store');
                            //    }
                        }, deferred.reject);
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
                                        return new Date(b.modifiedDate) - new Date(a.modifiedDate);
                                    });
                                    items.forEach(function (item) {
                                        //if (persistenceService.getAction() === 0) {
                                        persistenceService.action.save(item).then(
                                            function() {
                                                $rootScope.items.push({
                                                    ItemId: item.ItemId,
                                                    Title: $sce.trustAsHtml(item.Title),
                                                    Introduction: $sce.trustAsHtml(item.Introduction),
                                                    modifiedDate: new Date(item.modifiedDate),
                                                    TopicId: item.TopicId,
                                                    UserId: item.UserId,
                                                    Contents: $sce.trustAsHtml(item.Contents)
                                                });

                                            });
                                        //}
                                    });
                                }
                                );
                            
                        } else {
                            items.sort(function (a, b) {
                                return new Date(b.modifiedDate) - new Date(a.modifiedDate);
                            });
                            items.forEach(function (item) {
                                $rootScope.items.push({
                                    ItemId: item.ItemId,
                                    Title: $sce.trustAsHtml(item.Title),
                                    Introduction: $sce.trustAsHtml(item.Introduction),
                                    modifiedDate: new Date(item.modifiedDate),
                                    TopicId: item.TopicId,
                                    UserId: item.UserId,
                                    Contents: $sce.trustAsHtml(item.Contents)
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
        //var lazyGetData = _.debounce(getData, 1000);
        // download: function () {
        //     var stored = [];
        //     var deferred = $q.defer();
        //     localDBService.open(dbModel).then(function() {
        //         localDBService.getAll(dbModel.objectStoreName).then(function (items) {
        //             items.forEach(function(item) {
        //                 remotePersistenceStrategy.save(item).then(function (result) {
        //                     //if (result) {
        //                     //    localDBService.clear(dbModel.objectStoreName).then(function(res) {
        //                     stored.push(1);
        //                     if (stored.length == items.length) {
        //                         deferred.resolve(true);
        //                     }
        //                     //    }, deferred.reject);
        //                     //} else {
        //                     //    deferred.reject('Unable to clear object store');
        //                     //    }
        //                 }, deferred.reject);
        //             });
                    
        //         }, deferred.reject);
        //     }, deferred.reject);
        //     return deferred.promise;
        // }
    };
    return svc;
})
