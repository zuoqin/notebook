(function() {
    'use strict';
    var app = angular.module('MyApp');
    app.controller('viewController',
    [
        '$scope', '$rootScope', '$sce', '$location', 'persistenceService', '$routeParams', 'Story', '$http', '$window',
        function ($scope, $rootScope, $sce, $location, persistenceService, $routeParams, Story, $http, $window)
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

            $scope.hasWeiboid = function(index){
                if (index !== undefined && index !== null) {
                    return ($scope.item.images[index].weiboid !== undefined && $scope.item.images[index].weiboid !== null);
                }
                else
                {
                    return ($scope.item.weiboid !== undefined && $scope.item.weiboid !== null);   
                }
            }
            $scope.deletefromweibo = function(index){
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
                        var picid = 0;
                        if (index !== undefined && index !== null) {
                            picid = item.images[index].weiboid;
                        }
                        else
                        {
                            picid = item.weiboid;
                        }

                        if (picid !== undefined && picid !== null) {
                            var weibotoken = $window.localStorage.getItem('weibotoken');
                            if (weibotoken !== null && weibotoken !== undefined) {
                                var auth = 'OAuth2 ' + weibotoken;



                                $http({method: 'POST',
                                    url:'https://api.weibo.com/2/statuses/destroy.json',
                                    data: "id=" + picid,
                                    headers:{'Content-Type': 'application/x-www-form-urlencoded',
                                            'Authorization': auth}
                                })
                                .success(function(response)
                                {                         
                                    item.modified = new Date();
                                    if (index !== undefined && index !== null) {
                                        item.images[index].weiboid = null;
                                    }
                                    else
                                    {
                                        item.weiboid = null;    
                                    }
                                    
                                    persistenceService.action.save(item).then(function()
                                    {
                                        $rootScope.postingweibo = false;
                                        $rootScope.alert.show = false;                       
                                        $rootScope.postingweibo = false;
                                        setTimeout(function () {
                                            $rootScope.$apply(function () {
                                                $scope.item.weiboid = item.weiboid;
                                                $scope.item.images = item.images;
                                            });
                                        }, 100);                                    

                                    });
                                });                            

                            };                              
                        };
                    }
                );
            };

            // setTimeout(function () {
            //     $rootScope.$apply(function () {
            //         $rootScope.alert.show = false;
               
            //         $rootScope.postingweibo = false;
            //     });
            // }, 3000);


            // The sendData function is our main function
            function sendData(binary, index) {

                // To construct our multipart form data request,
                // We need an XMLHttpRequest instance
                var XHR      = new XMLHttpRequest();

                // We need a sperator to define each part of the request
                var boundary = "----WebKitFormBoundary5EaJNmmdPVXH1CBC";

                // And we'll store our body request as a string.
                var data     = "";
                data += "\r\n"
                data += "--" + boundary + "\r\n";
                data += 'Content-Disposition: form-data; name="status"';
                data += "\r\n" + "\r\n";
                data += "My new post......"
                data += "\r\n"
                data += "--" + boundary + "\r\n";
                data += 'Content-Disposition: form-data; name="url"';
                data += "\r\n" + "\r\n";
                data += "http://lifemall.com"
                data += "\r\n"

                // So, if the user has selected a file
                if (binary !== undefined && binary !== null)
                {
                    // We start a new part in our body's request
                    data += "--" + boundary + "\r\n";

                    data += 'Content-Disposition: form-data; name="pic"; filename="shell.png"' + '\r\n';
                    data += 'Content-Type: image/jpeg';
                    // There is always a blank line between the meta-data and the data
                    data += '\r\n';
                    data += '\r\n';
                    // We happen the binary data to our body's request


                    var nBytes = binary.length;
                    for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                        data += binary[nIdx];
                   }

                  data +=  '\r\n'; 
                }

                // For text data, it's simpler
                // We start a new part in our body's request
                data += "--" + boundary + "\r\n";
                data += 'Content-Disposition: form-data; name="source"';
                data += '\r\n';
                data += '\r\n';
                data += '588957036'
                data += '\r\n';
                data += "--" + boundary + "--\r\n";



                // We define what will happen if the data are successfully sent
                XHR.addEventListener('load', function(event) {
                    if (event.target.status === 200 ) {
                        var ffff = JSON.parse(event.target.response)

                        persistenceService.getById(id).then(
                            function (item) {   
                                item.modified = new Date();

                                if (index !== undefined && index !== null) {
                                    item.images[index].weiboid = ffff.id;
                                }
                                else
                                {
                                    item.weiboid = ffff.id;
                                }


                                        
                                persistenceService.action.save(item).then(function()
                                {
                                    $rootScope.postingweibo = false;
                                    $rootScope.alert.show = false;                       
                                    $rootScope.postingweibo = false;                            
                                    setTimeout(function () {
                                        $rootScope.$apply(function () {
                                            $scope.item.weiboid = item.weiboid;
                                            $scope.item.images = item.images;
                                        });
                                    }, 100);  
                                });

                            }
                        );                        
                    }
                    else
                    {
                        alert('Yeah! Data sent and response loaded.');
                    }
                    
                });

                // We define what will happen in case of error
                XHR.addEventListener('error', function(event) {
                    alert('Oups! Something goes wrong.');
                });

                // We setup our request
                XHR.open('POST','/api/weibo/upload'  );  //'https://upload.api.weibo.com/2/statuses/upload.json'

                // We add the required HTTP header to handle a multipart form data POST request
                XHR.setRequestHeader('Content-Type','multipart/form-data; boundary=' + boundary);

                var weibotoken = $window.localStorage.getItem('weibotoken');
                if (weibotoken !== null && weibotoken !== undefined) {
                    var auth = 'OAuth2 ' + weibotoken;
                    XHR.setRequestHeader('Authorization', auth);
                };  
                

                //XHR.setRequestHeader('Content-Length', data.length);

                // And finally, We send our data.
                // Due to Firefox's bug 416178, it's required to use sendAsBinary() instead of send()

  
                //XHR.sendAsBinary(data);

                var nBytes = data.length, ui8Data = new Uint8Array(nBytes);
                for (var nIdx = 0; nIdx < nBytes; nIdx++)
                {
                    ui8Data[nIdx] = data.charCodeAt(nIdx) & 0xff;
                }
                /* send as ArrayBufferView...: */
                XHR.send(ui8Data);
                /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */                
              };






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
                            var weibotoken = $window.localStorage.getItem('weibotoken');
                            if (weibotoken !== null && weibotoken !== undefined) {
                                var auth = 'OAuth2 ' + weibotoken;
                                var storytext = item.title.substring(140);
                                if (storytext.length < 138) {
                                    storytext += '\r\n';
                                    if (storytext.length < 140) {
                                        var len1 = storytext.length;
                                        storytext += item.content.substring(139 - len1);
                                    };


                                };
                                $http({method: 'POST',
                                    url:'/api/weibo/update', //https://api.weibo.com/2/statuses/update.json
                                    data: "status=" + storytext,
                                    headers:{'Content-Type': 'application/x-www-form-urlencoded',
                                            'Authorization': auth}
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
                        }
                        else
                        {
                            var srcData = item.images[index].data;
                            if (srcData.indexOf("data:image") > -1)
                            {
                                var pic1 = srcData.indexOf(";base64,")
                                srcData = srcData.substring(pic1 + 8);
                            };                            
                            var decodedData = window.atob(srcData); // decode the string
                            sendData(decodedData, index);
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