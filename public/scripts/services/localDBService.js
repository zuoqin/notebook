angular.module('localDBService', [])

.factory('localDBService', function($q, indexedDB){
    var _error = {
        setErrorHandlers : function(request, errorHandler) {
            if (typeof request != 'undefined') {
                if ('onerror' in request)
                    request.onerror = errorHandler;
                if ('onerror' in request)
                    request.onerror = errorHandler;
                if ('onerror' in request)
                    request.onerror = errorHandler;
                }
            }
    };

    var _db = {
        instance: null,
        transactionTypes: {
            readonly: 'readonly',
            readwrite: 'readwrite'
        },
        open: function(databaseModel) {
            var deferred = $q.defer();
            var request = indexedDB.open(databaseModel.name, databaseModel.version);
            _error.setErrorHandlers(request, deferred.reject);
            request.onupgradeneeded = databaseModel.upgrade;
            request.onsuccess = function(e) {
                _db.instance = e.target.result;
                _error.setErrorHandlers(_db.instance, deferred.reject);
                deferred.resolve();
            };
            request.onerror = function (event) {
                alert("Why didn't you allow my web app to use IndexedDB?!");
            };
            return deferred.promise;
        },
        requireOpenDB: function(objectStoreName, deferred) {
            if (_db.instance === null) {
                deferred.reject('You can not use an object store when the database is not open. Store name: ' + objectStoreName);
            }
        },
        getObjectStore: function(objectStoreName, mode) {
            var mode = mode || _db.transactionTypes.readonly,
                store;
            if (_db.instance != null) {
                var txn = _db.instance.transaction(objectStoreName, mode);
                store = txn.objectStore(objectStoreName);
            } else
                store = null;
            return store;
        },
        requireObjectStoreName: function(objectStoreName, deferred) {
            if (typeof(objectStoreName) === 'undefined' ||
                !objectStoreName ||
                objectStoreName.length === 0) {
                deferred.reject('An objectStoreName is required');
            }
        },
        getCount:function(objectStoreName) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName),
                count;
            if (store!= null) {
                var request = store.count();
                request.onsuccess = function (e) {
                    count = e.target.result;
                    deferred.resolve(count);
                };
            } else {
                count = 0;
            }
            
            return deferred.promise;
        },
        getAll:function(objectStoreName) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName);
            var cursor = store.openCursor();
            var data = [];
            cursor.onsuccess = function(e) {
                var result = e.target.result;
                if (result && result != null) {
                    data.push(result.value);
                    result.continue();
                } else {
                    deferred.resolve(data);
                }
            };
            return deferred.promise;
        },
        insert:function(objectStoreName, data, keyName) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite);
            var request;
            var date = new Date();
            if(data.created === undefined)
                data.created = date;

            if (data.modified === undefined)
                data.modified = date;

            request = store.add(data);
            request.onsuccess = function() {
                deferred.resolve(data);
            };
            return deferred.promise;
        },
        'delete':function(objectStoreName, key) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite),
                request = store.delete(key);
            request.onsuccess = deferred.resolve;
            return deferred.promise;
        },
        update:function(objectStoreName, data, key) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite),
                getRequest = store.get(key),
                updateRequest;
            getRequest.onsuccess = function(e) {
                var origData = e.target.result;
                if (origData != undefined) {
                    data.insertDate = origData.insertDate;
                    data.modifiedDate = new Date();
                    updateRequest = store.put(data);
                    updateRequest.onsuccess = function(e) {
                        deferred.resolve(data, e);
                    };
                }
            };
            return deferred.promise;
        },
        getById: function (objectStoreName, key) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName);
            var request = store.get(key);
            request.onsuccess = function (e) {
                if (e.target.result != undefined) {
                    deferred.resolve(e.target.result);
                } else {
                    deferred.resolve(true);
                }
                
                }; 
            return deferred.promise;
        },
        clear: function (objectStoreName) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite);
            var request = store.clear();
            request.onsuccess = deferred.resolve;
            return deferred.promise;
        },
        getUser: function (objectStoreName, user) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName);
            var request = store.get(user);
            request.onsuccess = function (e) {
                if (e.target.result != undefined) {
                    deferred.resolve(e.target.result);
                } else {
                    deferred.resolve(true);
                }
                
            }; 
            return deferred.promise;
        },
        setUser:function(objectStoreName, data) {
            var deferred = $q.defer();
            _db.requireObjectStoreName(objectStoreName, deferred);
            _db.requireOpenDB(objectStoreName, deferred);
            var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite);
            var request = store.add(data);
            request.onsuccess = function() {
                deferred.resolve(data);
            };
            return deferred.promise;
        },
    };
    return {
        open: _db.open,
        getAll: _db.getAll,
        insert: _db.insert,
        'delete': _db.delete,
        update: _db.update,
        getById: _db.getById,
        getCount: _db.getCount,
        clear: _db.clear,
        getUser: _db.getUser,
        setUser: _db.setUser
    };
})


