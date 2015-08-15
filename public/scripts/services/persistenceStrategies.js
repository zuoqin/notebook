(function () {
    'use strict';
    var app = angular.module('MyApp');

    app.factory('remotePersistenceStrategy',
    ['Story', '$http', '$q',
        function(Story, $http, $q){
        var svc = {
            save: function(item) {
                var deferred = $q.defer();
                // $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                // $http.post('/api/Item', item)
                //     .success(function() {
                //             deferred.resolve();
                //         }
                //         )
                //     .error(deferred.reject);
                if (item._id !== undefined && item._id !== null) {
                    if (item._id.length > 24) {
                        Story.create(item).success(function(data){
                            deferred.resolve(data);
                        });
                    }
                    else{
                        Story.update(item).then( function(){
                            deferred.resolve();
                        });                    
                    }
                };

                return deferred.promise;
            },
            getAll: function() {
                
                var deferred = $q.defer();
                // $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                // $http.get('/api/Item')
                //     .success(deferred.resolve)
                //     .error(deferred.reject);
                return deferred.promise;
            } ,
            getById: function(id) {
                
                var deferred = $q.defer();
                // $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                // $http.get('/api/Item/' + id)
                //     .success(deferred.resolve)
                //     .error(deferred.reject);
                return deferred.promise;
            } ,
            'delete': function (id) {
                
                var deferred = $q.defer();
                // $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                // $http.delete('/api/Item/' + id)
                //     .success(deferred.resolve)
                //     .error(deferred.reject);
                return deferred.promise;
            }
        };
        return svc;
        }
    ]);

    app.factory('localPersistenceStrategy', 
    [
        '$q', 'localDBService', 'nullItem', 'dbModel',
        function($q, localDBService, nullItem, dbModel){
            var svc = {
                dbModel: dbModel,
                localDBService: localDBService,
                clearAll: function() {
                    var deferred = $q.defer();
                    localDBService.open(dbModel).then(function () {
                        localDBService.clear(dbModel.objectStoreName).then(function (res) {
                            if (res) {
                                deferred.resolve(true);
                            } else {
                                deferred.reject("Unable to clear object store");
                            }
                        }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                save: function (item) {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbModel).then(function(e) {
                        var id = item._id;
                        if (id === null || id === undefined) {
                            localDBService.insert(svc.dbModel.objectStoreName, item, '_id')
                                .then(deferred.resolve, deferred.reject);
                        } else {
                            svc.exists(id).then(function(doesExist) {
                                if (doesExist) {


                                    localDBService.open(svc.dbModel).then(function() {
                                        localDBService.getById(svc.dbModel.objectStoreName, id)
                                            .then(function (res) {
                                                if (res) {
                                                    
                                                    if (new Date(res.modified) < new Date(item.modified)) {
                                                        localDBService.update(svc.dbModel.objectStoreName, item, id)
                                                            .then(deferred.resolve, deferred.reject);

                                                    }else{
                                                        deferred.resolve(true);
                                                    }
                                                }
                                                    
                                                }, deferred.reject);
                                    }, deferred.reject);
                                } else {
                                    localDBService.insert(svc.dbModel.objectStoreName, item, '_id')
                                        .then(deferred.resolve, deferred.reject);
                                }
                            }, deferred.reject);
                        }
                    }, deferred.reject);
                    return deferred.promise;
                },
                getAll: function () {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbModel).then(function () {
                        localDBService.getAll(svc.dbModel.objectStoreName)
                            .then(deferred.resolve, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                getById: function (id) {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbModel).then(function() {
                        localDBService.getById(svc.dbModel.objectStoreName, id)
                            .then(function (res) {
                                if (res) {
                                    deferred.resolve(res);
                                }
                                    
                                }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                exists: function(id) {
                    var deferred = $q.defer();
                    svc.getById(id).then(function (_Event) {
                        var item = _Event;
                        if (item != undefined && item !== true) {
                            deferred.resolve(item._id === id);
                        } else {
                            deferred.resolve(false);
                        }
                    },deferred.reject);
                    return deferred.promise;
                },
                'delete': function (id) {
                    var deferred = $q.defer();
                    localDBService.delete(svc.dbModel.objectStoreName, id).then(
                        function(result){
                                deferred.resolve(result)
                            },
                                 deferred.reject);
                    return deferred.promise;
                }
            };
            return svc;
        }
    ]);


}());
