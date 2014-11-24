/************************************************************************************************************************/
/*********************************************** simple_drop_directive.js ***********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('simpleDropElement',function($sce, $http, $timeout){
		return {
            restrict: 'A',
            templateUrl: getGlobalPath('/itc/views/directives/simple_drop_template.html'),
            scope: {
                url: "=",
                showDropZone: "=",
                error: "=",
                styleClass: "@",
                callBackFunc: '&',
                callBackFile: '=',
                isRequired: '=',
                errorKeys: '=',
                missingImage: '@',
                origUrl: '=',
                curUrl: '=',
                imageValidationData: "=",
                locFile: '=',
                dropLabel: '@',
                allowedFileTypes: "@"
            }, 

			
            link: function(scope, element, attrs) {
                scope.error = false;
                var zone = element.find(".zone");

                var isImage = function(item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    //console.log("ALLOWED FILE TYPES" + scope.allowedFileTypes);
                    if (scope.allowedFileTypes !== undefined && scope.allowedFileTypes !== null && scope.allowedFileTypes !== "") {
                        return scope.allowedFileTypes.indexOf(type) !== -1;
                    } else {
                        return '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
                    }
                }

                scope.$watch('url',function(newVal, oldVal){
                    // commenting out the outer if
                    // if there's already an app icon on page load, this function does unexpected things and newVal and oldVal ARE the same.
                    
                    //if (newVal != oldVal) { // if the url is changing. 
                        if (newVal) { // if adding an image, make drop zone disappear immediately
                            scope.showDropZone = false;
                        }
                        // Listening to webkitTransitionEnd in simple_image_directive.js to set showDropZone to true.
                    //}

                });

                scope.onFileSelect = function($files) {
                    var file;
                    for (var i = 0; i < $files.length; i++) {
                      file = $files[i];
                      if(isImage(file)) {
                        //scope.imageFileSelectedForUpload(file);

                        scope.validateFileSize(file);
                      } else {
                        scope.error = scope.locFile['ITC.AppVersion.GeneralInfoSection.AppIconErrors.WrongType'];
                      }
                    }   
                };

                scope.imageFileSelectedForUpload = function(file) { 
                    //var imgFile = URL.createObjectURL(file);
                    //scope.url = imgFile; // display image temporarily until save...
                    //include call back on save...
                    scope.callBackFile = file;
                    scope.$apply();
                    scope.callBackFunc();
                    scope.clearError();     
                };


                scope.$watch('error', function(newVal, oldVal) {
                    if (newVal) {
                        scope.showError(newVal);
                    }
                    else {
                        scope.clearError();
                    }
                });
                scope.showError = function(msg) {
                    zone.addClass("invalid");
                    scope.errorMsg = $sce.trustAsHtml(msg);
                    element.find('.errorPopUp').addClass('stayopen');
                    $timeout(function(){
                        element.find('.errorPopUp').removeClass('stayopen');
                    },3000);
                };

                scope.clearError = function() {
                    zone.removeClass("invalid");
                    //scope.errorMsg = "";
                    scope.error = false;
                };

                scope.$watch('errorKeys',function(){
                    scope.updateErrorState();
                });

                scope.$watch('curUrl',function() {
                    scope.updateErrorState();
                });

                scope.updateErrorState = function() {
                    if (scope.errorKeys !== null && scope.errorKeys !== undefined && scope.errorKeys.length > 0 && scope.origUrl === scope.curUrl) {
                        element.find('.zone').addClass('invalid-srvr');
                        scope.showingServerError = true;
                        scope.errorMsg = "";
                        angular.forEach(scope.errorKeys,function(value){
                            scope.errorMsg += "<p>"+value+"</p>";
                        });
                        scope.errorMsg = $sce.trustAsHtml(scope.errorMsg);
                    } else {
                        element.find('.zone').removeClass('invalid-srvr');
                        scope.showingServerError = false;
                    }
                }


                
                if (scope.isRequired !== undefined) {
                    if (scope.isRequired === "true" || scope.isRequired === true) {
                        scope.isRequired = true;
                    } else {
                        scope.isRequired = false;
                    }
                }
                scope.$watch('url',function() {
                    if ((scope.url === null || scope.url === "") && scope.isRequired && !scope.showingServerError) {
                        element.find('.zone').addClass('invalid');
                        scope.errorMsg = $sce.trustAsHtml(scope.missingImage);
                    } else {
                        element.find('.zone').removeClass('invalid');
                    }
                });


                element.find('.zone').on('mouseenter', function(){
                    if (element.find('.zone').hasClass('invalid') || element.find('.zone').hasClass('invalid-srvr')) {
                        element.find('.errorPopUp').addClass('open');
                    }
                });
                element.find('.zone').on('mouseleave', function(){
                    element.find('.errorPopUp').removeClass('open');
                });

                // Checks if file size is under 1 GB.
               /* scope.validateFileSize = function(file) {
                    var megabytes = file.size/1000000;
                    return megabytes < 1000; // valid if under 1000 MB (1GB)
                };*/  

                scope.validateFileSize = function(file) {
                    if (scope.imageValidationData) {
                        var ret;
                        var validSizesForDevice = scope.imageValidationData;

                        var loadFunc = function() {
                            var width = this.width;
                            var height = this.height;

                            var dimensionsArr = new Array();
                            var expectedW, expectedH, expectedDimensionsArr;
                            
                            /* EXPECTING RATIO RANGE DATA TO BE PROVIDED AS: {'ratioRange':['2:1','1:2'],'minLong':1024} */
                            if (validSizesForDevice.ratioRange !== undefined && validSizesForDevice.minLong !== undefined) {
                                //check first that one of the sizes matches the minLong...
                                if (width >= validSizesForDevice.minLong || height >= validSizesForDevice.minLong) {
                                   //check ratio range...
                                   var ratioOne = validSizesForDevice.ratioRange[0].split(":");
                                   var ratioTwo = validSizesForDevice.ratioRange[1].split(":");

                                   var ratioOneFraction = ratioOne[0]/ratioOne[1];
                                   var ratioTwoFraction = ratioTwo[0]/ratioTwo[1];

                                   console.log("ratioOneFraction " + ratioOneFraction);
                                   console.log("ratioTwoFraction " + ratioTwoFraction);

                                    //get ratio fraction of image
                                    var imageRatioFractionOne = width/height;
                                    var imageRatioFractionTwo = height/width;

                                    console.log("imageRatioFractionOne " + imageRatioFractionOne);
                                    console.log("imageRatioFractionTwo " + imageRatioFractionTwo);

                                    if ((imageRatioFractionOne <= ratioOneFraction && imageRatioFractionOne >=ratioTwoFraction) || (imageRatioFractionTwo <= ratioOneFraction && imageRatioFractionTwo >=ratioTwoFraction)) {
                                        scope.imageFileSelectedForUpload(file);
                                        return;
                                    }
                                }
                                                                
                                // if got here, the height/width do not match the expected heights/widths.
                                scope.error = scope.locFile.interpolate('ITC.apps.validation.newstand_art_invalid_size');
                                scope.$apply();

                            } else {
                            /* TODO add support for ratio checking */
                                for (var i = 0; i < validSizesForDevice.length; i++) {
                                    expectedDimensionsArr = validSizesForDevice[i].split("x");
                                    expectedW = parseInt(expectedDimensionsArr[0]); 
                                    expectedH = parseInt(expectedDimensionsArr[1]); 
                                    if (expectedW === width && expectedH === height) {
                                        scope.imageFileSelectedForUpload(file);
                                        return;
                                    }
                                }

                                // if got here, the height/width do not match the expected heights/widths.
                                scope.error = scope.locFile['ITC.AppVersion.GeneralInfoSection.AppIconErrors.WrongDimensions'];
                                scope.error = scope.error.replace('@@width@@',expectedW);
                                scope.error = scope.error.replace('@@height@@',expectedH);
                                scope.$apply();
                            }
                        };

                        var loadErrorFunc = function() {
                            console.log("some error happened getting image dimensions on the client. not sending to DU");
                            scope.error = scope.locFile['ITC.AppVersion.GeneralInfoSection.AppIconErrors.ImageNotLoaded'];
                            scope.$apply();
                            //if the image didn't show up on client - let's not send it to DU...?
                            //scope.imageFileSelectedForUpload(file);
                        };

                        // create a dummy element just to get the width and height of the image.
                        var img = document.createElement('img');
                        var jqImg = $(img);
                        jqImg.bind('load', loadFunc);
                        jqImg.bind('error', loadErrorFunc);
                        img.src = URL.createObjectURL(file);
                    } else {
                        //no image dimension validation provided - this will be provided by D U
                        scope.imageFileSelectedForUpload(file);
                        return;
                    }
                };

            } // end link

		} // end return
	}); // end itcApp.directive

}); // end define

