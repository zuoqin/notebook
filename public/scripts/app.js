angular.module('MyApp', [ 'ngResource', 'ngCookies', 'mainCtrl', 'authService', 'appRoutes',
	'userCtrl', 'userService', 'storyService', 'storyCtrl', 'viewCtrl', 'persistenceService',
	'PersistenceStrategies', 'localDBService', 'editCtrl'])

.config(['$provide', '$httpProvider', 

function($provide, $httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');



	$provide.constant('indexedDB', window.indexedDB);
    $provide.constant('_', window._);
    $provide.constant('localStorage', window.localStorage);
    $provide.constant('Offline', window.Offline);
    $provide.value('nullItem', {
        id: '',
        insertDate: new Date(-8640000000000000),
        modifiedDate: new Date(-8640000000000000)
    });
    $provide.value('dbModel', {
        name: 'journalitems',
        version: '1.2',
        instance: null,
        objectStoreName: 'items',
        keyName: '_id',
        upgrade: function(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains('items')) {
                db.createObjectStore('items', {
                    keyPath: '_id'
                });
            }
        }
    });

}
]);





