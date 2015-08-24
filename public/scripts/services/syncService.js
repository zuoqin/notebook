﻿(function () {
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
                    Offline.options = {

                        // Should we check the connection status immediatly on page load.
                        checkOnLoad: false,

                        // Should we monitor AJAX requests to help decide if we have a connection.
                        interceptRequests: true,

                        // Should we automatically retest periodically when the connection is down (set to false to disable).
                        reconnect: {
                        // How many seconds should we wait before rechecking.
                        initialDelay: 3,

                        // How long should we wait between retries.
                        //delay: (1.5 * last delay, capped at 1 hour)
                        },
                        checks: {image: {url: '/favicon1' + Math.uuid()}, active: 'image'}
                    };
                    var deferred = $q.defer();
                    Offline.on('confirmed-up', function() {
                    //     svc.check().then(function(result) {
                            Offline.options = {checks: {xhr: {url: '/favicon/' + Math.uuid()}, active: 'image'}}
                     //        Offline.check();
                             deferred.resolve(true);
                    //     }, deferred.reject);
                     });
                    return deferred.promise;
                },
                monitorDown: function() {
                    Offline.options = {

                      // Should we check the connection status immediatly on page load.
                      checkOnLoad: false,

                      // Should we monitor AJAX requests to help decide if we have a connection.
                      interceptRequests: true,

                      // Should we automatically retest periodically when the connection is down (set to false to disable).
                      reconnect: {
                        // How many seconds should we wait before rechecking.
                        initialDelay: 3,

                        // How long should we wait between retries.
                        //delay: (1.5 * last delay, capped at 1 hour)
                        },
                        checks: {image: {url: '/favicon1'}}
                    };                    
                    var deferred = $q.defer();
                    Offline.on('confirmed-down', function() {
                         Offline.options = {checks: {xhr: {url: '/favicon/' + Math.uuid()}}}
                         //Offline.check();
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
                                                        if (item.isDeleted === undefined || item.isDeleted === false) {
                                                            localDBService.insert(dbModel.objectStoreName, newItem, "_id").then(
                                                                function(result){

                                                                })                                                                
                                                        };
    
                                                    })
                                                
                                            }
                                            else{
                                                if(item.isDeleted === true)
                                                {
                                                    localDBService.delete(dbModel.objectStoreName, item._id).then(
                                                    function(result){
                                                        //console.log(result);
                                                    });                                                              
                                                }
                                            }
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
