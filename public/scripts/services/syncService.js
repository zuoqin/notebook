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
                                if (count !== undefined) {
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
                            Offline.options = {checks: {xhr: {url: '/favicon/' + Math.uuid()}, active: 'image'}};
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
                         Offline.options = {checks: {xhr: {url: '/favicon/' + Math.uuid()}}};
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
                            var lastupload = new Date(0);
                            if ($window.localStorage.getItem('lastupload') !== undefined &&
                                $window.localStorage.getItem('lastupload') !== null
                                )
                            {
                                lastupload = $window.localStorage.getItem('lastupload');
                            }
                            items.forEach(function(item)
                            {
                                if (new Date(item.modified) > new Date(lastupload))
                                {
                                    remotePersistenceStrategy.save(item).then(function (result)
                                    {
                                        if (item._id !== undefined && item._id !== null)
                                        {
                                            if (item._id.length > 24)
                                            {
                                                var newItem = result;
                                                localDBService.delete(dbModel.objectStoreName, item._id).then(function(result)
                                                {
                                                    if (item.isDeleted === undefined || item.isDeleted === false)
                                                    {
                                                        localDBService.insert(dbModel.objectStoreName, newItem, '_id').then(
                                                            function(result){
                                                            });
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                if(item.isDeleted === true)
                                                {
                                                    localDBService.delete(dbModel.objectStoreName, item._id).then(
                                                    function(result){
                                                        //console.log(result);
                                                    });                                                              
                                                }
                                            }
                                        }
                                        stored.push(1);
                                        if (stored.length == items.length) {
                                            $window.localStorage.setItem('lastupload', new Date());
                                            deferred.resolve(true);
                                        }

                                    }, function(result){
                                        deferred.reject(result);
                                    });
                                }
                                else
                                {
                                    stored.push(1);
                                }
                                
                                if (stored.length == items.length) {
                                    $window.localStorage.setItem('lastupload', new Date());
                                    deferred.resolve(true);
                                }

                            });
                            
                        }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
            };
            return svc;
    }]);
}());
