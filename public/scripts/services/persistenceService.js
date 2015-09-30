﻿(function() {
        'use strict';
        var app = angular.module('MyApp');
        app.service('persistenceService',
        [
            '$q', 'remotePersistenceStrategy', 'localPersistenceStrategy',
            function($q, remotePersistenceStrategy, localPersistenceStrategy)
            {
                var self = this;
                var stories = [];

                self.addStory = function(newStory) {
                      stories.push(newStory);
                };

                self.clearStories = function(){
                    stories = [];
                };

                self.getStories = function(){
                      return stories;
                };



                self.persistenceType = 'local';
                
                self.action = localPersistenceStrategy;
                self.deleteItem = function(id){
                    return localPersistenceStrategy.delete(id);
                };

                self.ClearLocalDB = function () {
                        var deferred = $q.defer();
                        localPersistenceStrategy.clearAll().then(
                            function() {
                                deferred.resolve();
                            }, deferred.reject
                            );
                        return deferred.promise;
                };

                self.setAction = function (id) {
                    if (id === 0) {
                        self.action = remotePersistenceStrategy;
                    } else {
                        self.action = localPersistenceStrategy;
                    }
                };
                
                self.getAction = function() {
                    if (self.action === remotePersistenceStrategy) {
                        return 0;
                    } else {
                        return 1;
                    }
                };

                self.getRemoteItem = function(id) {
                    return remotePersistenceStrategy.getById(id);
                };
                self.getLocalItem = function (id) {
                    return localPersistenceStrategy.getById(id);
                };
                self.getUser = function (username) {
                    return localPersistenceStrategy.getUser(username);
                };
                self.setUser = function (user) {
                    return localPersistenceStrategy.setUser(user);
                };
                self.getById = function (id) {
                    var deferred = $q.defer();
                    if (self.action === remotePersistenceStrategy) {
                        var remoteItem = {},
                            localItem = {};
                        self.getRemoteItem(id).then(function(rItem) {
                            remoteItem = rItem;
                            self.getLocalItem(id).then(function(lItem) {
                                localItem = lItem;
                                if (localItem.modified > (new Date(remoteItem.modified))) {
                                    deferred.resolve(localItem);
                                } else {
                                    deferred.resolve(remoteItem);
                                }
                            }, deferred.reject);
                        }, deferred.reject);
                    } else {
                        self.getLocalItem(id).then(deferred.resolve, deferred.reject);
                    }
                    return deferred.promise;
                };
                return self;
            }
        ]);
    }()
);

