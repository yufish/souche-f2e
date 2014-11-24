/************************************************************************************************************************/
/********************************************* simple_filedrop_directive.js *********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('simpleFileDropElement',function($sce, $http, $timeout){
		return {
            restrict: 'A',
            templateUrl: getGlobalPath('/itc/views/directives/simple_filedrop_template.html'),
            scope: {
                fileObject: "=",
                error: "=",
                styleClass: "@",
                callBackFunc: '&',
                callBackFile: "=",
                missingFile: '@',
                origFileObject: '=',
                allowedFileTypes: "=", //array of accepted file types NOT USING....
                locFile: '=',
                dropLabel: '@'
            }, 

			
            link: function(scope, element, attrs) {
                //scope.error = false;
                var zone = element.find(".zone");
                var errorClass = "error";
                var srvrErrorClass= "error-srvr";
                if (scope.fileObject !== undefined && scope.fileObject != null && scope.fileObject.isRequired) {
                    errorClass = "invalid"; // if the field is required - use "invalid" and block saving.
                    srvrErrorClass= "invalid-srvr";
                }

                var acceptedFileTypesString = "|";
                angular.forEach(scope.allowedFileTypes,function(value,key){
                    acceptedFileTypesString += value+"|";
                });

               /* var isFile = function(item) {
                    console.log("FILE TYPE: " + item.type);
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return acceptedFileTypesString.indexOf(type) !== -1;
                }*/

                scope.onFileSelect = function($files) {
                    var file;
                    for (var i = 0; i < $files.length; i++) {
                        file = $files[i];
                        scope.fileSelectedForUpload(file);
                    }   
                };

                scope.fileSelectedForUpload = function(file) { 
                    /*var imgFile = URL.createObjectURL(file);*/
                    //include call back on save...
                    scope.callBackFile = file;
                    scope.$apply();
                    scope.callBackFunc();
                    scope.clearError();
                    /*scope.url = imgFile;*/ // display image temporarily until save...         
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
                    zone.addClass(errorClass);
                    scope.errorMsg = $sce.trustAsHtml(msg);
                    element.find('.errorPopUp').addClass('stayopen');
                    $timeout(function(){
                        element.find('.errorPopUp').removeClass('stayopen');
                    },3000);
                };

                scope.clearError = function() {
                    zone.removeClass(errorClass);
                    scope.errorMsg = "";
                    scope.error = false;
                };

                scope.$watch('fileObject',function(){
                    if (scope.fileObject !== undefined && scope.fileObject !== null && scope.origFileObject !== undefined && scope.fileObject.errorKeys !== undefined && scope.fileObject.errorKeys !== null) {
                        if (scope.fileObject.errorKeys.length > 0 && scope.origFileObject.value === scope.fileObject.value) {
                            zone.addClass(srvrErrorClass);
                            scope.showingServerError = true;
                            scope.errorMsg = "";
                            angular.forEach(scope.fileObject.errorKeys,function(value){
                                scope.errorMsg += "<p>"+value+"</p>";
                            });
                            scope.errorMsg = $sce.trustAsHtml(scope.errorMsg);
                            //watch for url to change and pull off errorkeys when a change has been completed.
                            scope.$watch('origFileObject.value.url',function(){
                                if(scope.origFileObject.value.url !== scope.fileObject.value.url) {
                                    zone.removeClass(srvrErrorClass);
                                    scope.showingServerError = false;  
                                }
                            });
                        } else {
                            zone.removeClass(srvrErrorClass);
                            scope.showingServerError = false;
                        }
                    } else {
                        scope.showingServerError = false;
                    }
                });
                scope.$watch('fileObject.value',function(){
                    //if this is required and we don't have a url and we're not already showing errorKey(s) - show an error
                    if (scope.fileObject !== undefined && scope.fileObject !== null && (scope.fileObject.value === null || scope.fileObject.value === undefined) && scope.fileObject.isRequired && !scope.showingServerError) {
                        zone.addClass(errorClass);
                        scope.errorMsg = $sce.trustAsHtml(scope.missingFile);
                    } else {
                        zone.removeClass(errorClass);
                    }
                });
        
                //show hide error popups
                zone.on('mouseenter', function(){
                    if (zone.hasClass(errorClass) || zone.hasClass(srvrErrorClass)) {
                        element.find('.errorPopUp').addClass('open');
                    }
                });
                zone.on('mouseleave', function(){
                    element.find('.errorPopUp').removeClass('open');
                });

            } // end link

		} // end return
	}); // end itcApp.directive

}); // end define

