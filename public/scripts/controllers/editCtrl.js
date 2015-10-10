(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('editController',
    [
        '$scope', '$rootScope', '$location', 'persistenceService',
        function ($scope, $rootScope, $location, persistenceService) {
            $scope.isModified = false;
            $scope.showFillOutFormMessage = false;
            $scope.isOnline = true;
            $scope.item = {};
            $rootScope.showList = false;
            $rootScope.showItems = false;
            var resizeCtrl = function(id){
                setTimeout(function () {
                    $scope.$apply(function () {
                        var content = $(id).val();//item.introduction;
                        content = content.replace(/\n/g, '<br>');
                        var hiddenDiv = $(document.createElement('div'));
                        hiddenDiv.addClass('hiddendiv');
                        hiddenDiv.html(content);
                        $('body').append(hiddenDiv);
                        var element = $(id);
                        element.addClass('noscroll');
                        $(id).css('height', hiddenDiv.height() + 20);
                        

                        element.bind('keyup', function() {
                            
                            content = $(this).val();
                            content = content.replace(/\n/g, '<br>');
                            hiddenDiv.html(content);

                            $(this).css('height', hiddenDiv.height() + 20);

                        });

                    });
                }, 50);

            };


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

                        resizeCtrl('#title');
                        resizeCtrl('#introduction');
                        resizeCtrl('#content');
                        $scope.item = item;
                        sessionStorage.setItem('isModified', item._id);
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


            $scope.change = function(){
                $scope.isModified = true;
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
                        var contentType = (filesSelected !== null && filesSelected !== undefined && filesSelected.length > 0) ?
                            filesSelected[0].type : '';

                        var filename = (filesSelected !== null && filesSelected !== undefined) ? filesSelected[0].name : '';
                        
                        if (filename === null || filename === undefined || filename.length < 1) {
                            filename = 'Image' + ($scope.item.images.length+1);
                        }

                        if (srcData.indexOf('data:image') === -1)
                        {

                            var pic1 = srcData.indexOf(';base64');
                            if (contentType === null || contentType === undefined || contentType.length < 1) {
                                contentType = 'image/png';
                            }

                            srcData = 'data:' + contentType + srcData.substring(pic1);
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
                        }, 50);
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
                 
                    persistenceService.action.save(item).then(
                        function(result) {
                            //$scope.showSuccessMessage = true;
                            $scope.showErrorMessage = false;
                            $scope.isModified = false;

                            setTimeout(function () {
                                $rootScope.$apply(function () {
                                    toastr.options.closeButton = true;
                                    toastr.options.closeMethod = 'fadeOut';
                                    toastr.options.closeDuration = 300;
                                    toastr.options.closeEasing = 'swing';
                                    toastr.options.positionClass = "toast-bottom-right";
                                    toastr.success('Data has been saved');
                                });
                            }, 100);
                        },
                        function(error) {
                            //$scope.showSuccessMessage = false;
                            $scope.showErrorMessage = true;
                        });
                }

            };
    }]);

}());