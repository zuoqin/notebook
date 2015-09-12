(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('viewController',
    [
        '$scope', '$rootScope', '$sce', '$location', 'persistenceService', '$routeParams', 'Story',
        function ($scope, $rootScope, $sce, $location, persistenceService, $routeParams, Story)
        {
            $rootScope.showSuccessMessage = false;
            $rootScope.showFillOutFormMessage = false;
            $rootScope.isOnline = true;
            $scope.item = {};
            $rootScope.showItems = false;

            var recipients = "alexey.zuo@take5people.com";
            
            var parts = $location.absUrl().split('/');
            var id = parts[parts.length - 1];
            if (id.indexOf('?') > 0) {
                id = id.substring(0,id.indexOf('?'));
            };            
            var uuidLength = 24;
            if (id.length < uuidLength) {
                id = null;
            }

            $scope.edit = function () {
                if (id != null) {
                    window.location.href = "/edit/" + id;
                }
            };


            $scope.sendbyemail = function () {

                if (id != null) {
                    var a = $scope.viewController.recipients;
                    persistenceService.getById(id).then(
                        function (item) {
                            var recipients = {"recipients" : $scope.viewController.recipients, "data" : item};

                            Story.send(recipients);
                        },
                        function (error) {
                            $scope.error = error;
                        });
                }
            };

            if (id != null) {
                persistenceService.getById(id).then(
                    function (item) {
                        $scope.item._id = item._id;
                        $scope.item.title = $sce.trustAsHtml(item.title);
                        $scope.item.introduction = $sce.trustAsHtml(item.introduction);
                        $scope.item.topic = item.topic;
                        $scope.item.modified = new Date(item.modified);
                        $scope.item.images = item.images;
                        $scope.item.creator = item.creator;
                        $scope.item.content = $sce.trustAsHtml(item.content);
                    },
                    function (error) {
                        $scope.error = error;
                    });
            }
       }]);

}());