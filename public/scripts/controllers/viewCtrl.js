(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('viewController',
    [
        '$scope', '$sce', '$location', 'persistenceService', '$routeParams',
        function ($scope, $sce, $location, persistenceService, $routeParams)
        {
            $scope.showSuccessMessage = false;
            $scope.showFillOutFormMessage = false;
            $scope.isOnline = true;
            $scope.item = {};
            $scope.showItems = false;


            
            var parts = $location.absUrl().split('/');
            var id = parts[parts.length - 1];
            var uuidLength = 24;
            if (id.length < uuidLength) {
                id = null;
            }

            $scope.edit = function () {
                if (id != null) {
                    window.location.href = "/edit/" + id;
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