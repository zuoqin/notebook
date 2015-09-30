(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('editController',
    [
        '$scope', '$rootScope', '$location', 'persistenceService',
        function ($scope, $rootScope, $location, persistenceService) {
            $scope.showSuccessMessage = false;
            $scope.showFillOutFormMessage = false;
            $scope.isOnline = true;
            $scope.item = {};
            $rootScope.showList = false;
            $rootScope.showItems = false;

            var parts = $location.absUrl().split('/');
            var id = parts[parts.length - 1];
            if (id.indexOf('?') > 0) {
                id = id.substring(0,id.indexOf('?'));
            }
            var uuidLength = 24;
            var topic = '';
            if (id.length < uuidLength) {
                topic = id;
                id = null;

            }
            if (id !== null) {
                persistenceService.getById(id).then(
                    function(item) {
                        $scope.item = item;
                        if ($scope.item.images !== undefined && $scope.item.images.length > 0) {
                            //var newImage = document.createElement('img');
                            //newImage.src = $scope.item.images[0].data;

                            //document.getElementById($scope.item.images[0].pic).innerHTML = newImage.outerHTML;                            
                        }
                        else{
                            var images = [];
                            $scope.item.images = images;
                        }


                    },
                    function(error) {
                        $scope.error = error;
                    });
            }
            else{
                var images = [];
                $scope.item.images = images;                
                $scope.item.topic = topic;
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
            $scope.deleteImage = function(index)
            {
                $scope.item.images.splice(index, 1);
            };

            $scope.encodeImageFileAsURL = function(){

                var filesSelected = document.getElementById('upload_input').files;
                if (filesSelected.length > 0)
                {
                    var fileToLoad = filesSelected[0];

                    var fileReader = new FileReader();

                    fileReader.onload = function(fileLoadedEvent) {
                        var srcData = fileLoadedEvent.target.result; // <--- data: base64
                        var contentType = (filesSelected !== null && filesSelected !== undefined) ? filesSelected[0].type : '';

                        var filename = (filesSelected !== null && filesSelected !== undefined) ? filesSelected[0].name : '';
                        
                        if (filename === null || filename === undefined || filename.length < 1) {
                            filename = 'Image' + ($scope.item.images.length+1);
                        }

                        if (srcData.indexOf('data:image') === -1)
                        {

                            var pic1 = srcData.indexOf(';base64');
                            contentType = (filesSelected[0].type === null || filesSelected[0].type === undefined) ?
                                'image/png' : filesSelected[0].type;


                            window.alert(contentType);
                            srcData = 'data:' + contentType + srcData.substring(pic1);

                            window.alert(srcData);
                        }

                        var images = $scope.item.images;
                        if ($scope.item.images === undefined || $scope.item.images.length === 0) {
                            images = [{data: srcData, contentType: contentType, pic: filename}];
                        }
                        else
                        {
                            images.unshift({data:srcData, contentType: contentType, pic: filename});    
                        }

                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.item.images = images;
                            });
                        }, 100);                    
                    };
                    fileReader.readAsDataURL(fileToLoad);
                }
            };

            $scope.save = function() {
                var saveItem = hasAnItemToSave();
                $scope.showFillOutFormMessage = !saveItem;
                if (saveItem) {

                    var item = $scope.item;
                    item.modified = new Date();
                    item.isDeleted = false;
                 
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

                            // var obj = _.find($rootScope.stories, function(obj)
                            //     {
                            //         return obj._id === item._id;
                            //     });
                        },
                        function(error) {
                            $scope.showSuccessMessage = false;
                            $scope.showErrorMessage = true;
                        });
                }

            };
    }]);

}());