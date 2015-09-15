(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('viewController',
    [
        '$scope', '$rootScope', '$sce', '$location', 'persistenceService', '$routeParams', 'Story', '$http',
        function ($scope, $rootScope, $sce, $location, persistenceService, $routeParams, Story, $http)
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

            $scope.deletefromweibo = function(){
                $rootScope.postingweibo = true;
                var type = "warning";
                var message = "Downloaded items";
                var title = "Download";
                $rootScope.alert = {
                    hasBeenShown: true,
                    show:true,
                    type:type,
                    message:message,
                    title:title
                };                     

                $http({method: 'POST',
                    url:'https://api.weibo.com/2/statuses/destroy.json',
                    data: "id=" + $scope.item.weiboid,
                    headers:{'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'OAuth2 2.008OxyKC0CdMrdde3dbca8709bIjUC'}
                }).success(function(response) { 


                persistenceService.getById(id).then(
                    function (item) {                        
                            item.modified = new Date();
                            item.weiboid = null;
                            persistenceService.action.save(item).then(function() {
                                $rootScope.postingweibo = false;
                                $rootScope.alert.show = false;                       
                                $rootScope.postingweibo = false;                            

                            });
                    });
                    },
                    function (error) {
                        $scope.error = error;
                    });
            };

                // setTimeout(function () {
                //     $rootScope.$apply(function () {
                //         $rootScope.alert.show = false;
                   
                //         $rootScope.postingweibo = false;
                //     });
                // }, 3000);

            $scope.sendtoweibo = function (index) {
                $rootScope.postingweibo = true;
                var type = "warning";
                var message = "Downloaded items";
                var title = "Download";
                $rootScope.alert = {
                    hasBeenShown: true,
                    show:true,
                    type:type,
                    message:message,
                    title:title
                };                     


                persistenceService.getById(id).then(
                    function (item) {

                        if (index === undefined || index === null) {

                            $http({method: 'POST',
                                url:'https://api.weibo.com/2/statuses/update.json',
                                data: "status=" + item.title,
                                headers:{'Content-Type': 'application/x-www-form-urlencoded',
                                        'Authorization': 'OAuth2 2.008OxyKC0CdMrdde3dbca8709bIjUC'}
                            }).success(function(response) { 
                                item.modified = new Date();
                                item.weiboid = response.id;
                                persistenceService.action.save(item).then(function() {
                                    $rootScope.postingweibo = false;
                                    $rootScope.alert.show = false;                       
                                    $rootScope.postingweibo = false;                            

                                });
                            });

                        }
                        else
                        {
                            index = index;
                        }
                    });

                
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
                        $scope.item.weiboid = item.weiboid;
                    },
                    function (error) {
                        $scope.error = error;
                    });
            }
       }]);

}());