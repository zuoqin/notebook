(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('editController',
    [
        '$scope', '$rootScope', '$location', 'persistenceService', 'Offline',
        function ($scope, $rootScope, $location, persistenceService, Offline) {
            $scope.showSuccessMessage = false;
            $scope.showFillOutFormMessage = false;
            $scope.isOnline = true;
            $scope.item = {};
            $rootScope.showList = false;
            $rootScope.showItems = false;

            var parts = $location.absUrl().split('/');
            var id = parts[parts.length - 1];
            var uuidLength = 24;
            if (id.length < uuidLength) {
                id = null;
            }
            if (id != null) {
                persistenceService.getById(id).then(
                    function(item) {
                        $scope.item = item;
                        if ($scope.item.images !== undefined && $scope.item.images.length > 0) {
                            //var newImage = document.createElement('img');
                            //newImage.src = $scope.item.images[0].data;

                            //document.getElementById($scope.item.images[0].pic).innerHTML = newImage.outerHTML;                            
                        }
                        else{
                            var images = new Array({ data: null, contentType: null, id:"inputFileToLoad", pic:"imgTest"});
                            $scope.item.images = images;
                        }


                    },
                    function(error) {
                        $scope.error = error;
                    });
            }
            else{
                var images = new Array();// data: null, contentType: null, id:"inputFileToLoad", pic:"imgTest"});
                $scope.item.images = images;                
            }

            $scope.cancel = function() {
                window.location = '/';
            };

            var hasAnItemToSave = function() {
                var hasValue = function(value) {
                    if (typeof value === 'string') {
                        return value.length > 0;
                    }
                    return value > 0;
                };

                var returnValue =
                    hasValue($scope.item.title);
                        //&& hasValue($scope.item.content);
                return returnValue;
            };

            $scope.encodeImageFileAsURL = function(){

                var filesSelected = document.getElementById("upload_input").files;
                if (filesSelected.length > 0)
                {
                    var fileToLoad = filesSelected[0];

                    var fileReader = new FileReader();

                    fileReader.onload = function(fileLoadedEvent) {
                        var srcData = fileLoadedEvent.target.result; // <--- data: base64
                        
                        var newImage = document.createElement('img');
                        newImage.src = srcData;

                        //document.getElementById($scope.item.images[0].pic).innerHTML = newImage.outerHTML;
                        //alert("Converted Base64 version is "+document.getElementById("imgTest").innerHTML);
                        //console.log("Converted Base64 version is "+document.getElementById("imgTest").innerHTML);
                        if ($scope.item.images === undefined || $scope.item.images.length === 0) {
                            $scope.item.images = [{ data: srcData, contentType: 'image/png' }];
                        }
                        else
                        {
                            $scope.item.images.unshift({data:srcData, contentType:'image/png'});    
                        }

                        

                        //$scope.item.images[0].data = srcData;
                        //$scope.item.images[0].contentType = 'image/png';   
                    }
                    fileReader.readAsDataURL(fileToLoad);
                }
            };

            $scope.save = function() {
                var saveItem = hasAnItemToSave();
                $scope.showFillOutFormMessage = !saveItem;
                if (saveItem) {

                    var item = $scope.item;
                    item.modified = new Date();
                 
                    //Temp code
                    // if (item.UserId == 0 || item.UserId === undefined) {
                    //     item.UserId = 1;
                    // }
                    // if (item.TopicId == 0 || item.TopicId === undefined) {
                    //     item.TopicId = 1;
                    // }
                    persistenceService.action.save(item).then(
                        function(result) {
                            $scope.showSuccessMessage = true;
                            $scope.showErrorMessage = false;
                        },
                        function(error) {
                            $scope.showSuccessMessage = false;
                            $scope.showErrorMessage = true;
                        });
                }

            }

            Offline.on('confirmed-down', function () {
                $scope.$apply(function () {
                    $scope.isOnline = false;
                });
            });
            Offline.on('confirmed-up', function () {
                $scope.$apply(function() {
                    $scope.isOnline = true;
                });
            })
    }]);

}());