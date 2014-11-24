/************************************************************************************************************************/
/********************************************* simple_fileicon_directive.js *********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('simpleFileIcon', function($sce, $timeout) {
        return {
          restrict: 'A',
          templateUrl: getGlobalPath('/itc/views/directives/simple_fileicon_template.html'),
          scope: {
            fileObject: "=",
            origFileObject: "=",
            error: "=",
            styleClass: "@",
            locFile: "=",
            iconLabel: "@"
          },          
          link: function(scope, element, attrs) {

            //scope.error = false;
            var zone = element.find(".fileIconWrapper");
            var errorClass = "error";
            var srvrErrorClass= "error-srvr";
            if (scope.fileObject !== undefined && scope.fileObject !== null && scope.fileObject.isRequired) {
                errorClass = "invalid"; // if the field is required - use "invalid" and block saving.
                srvrErrorClass= "invalid-srvr";
            }

            //using this to send D U errors down to directive
            scope.$watch('error', function() {
                if (scope.error) {
                    scope.showError(scope.error);
                } else {
                    scope.clearError();
                }
            });

            scope.showError = function(msg) {
                zone.addClass(errorClass);
                if (scope.errorMsg !== undefined && scope.errorMsg !== null) {
                    scope.errorMsg = $sce.trustAsHtml(msg);
                }
                element.find('.errorPopUp').addClass('stayopen');
                //scope.$apply();
                $timeout(function(){
                        element.find('.errorPopUp').removeClass('stayopen');
                    },3000);
            };

            scope.clearError = function() {
                zone.removeClass(errorClass);
                scope.errorMsg = "";
            };

            var deleteButton = element.find(".deleteIcon");
            deleteButton.bind('click', function() {
                scope.fileObject.value = null; 
                scope.$apply();
            });

            scope.$watch('fileObject',function(){
                if (scope.fileObject !== undefined && scope.fileObject !== null && scope.origFileObject !== undefined && scope.fileObject.errorKeys !== undefined && scope.fileObject.errorKeys !== null) {
                    if (scope.fileObject.errorKeys.length > 0 && scope.origFileObject.value.url === scope.fileObject.value.url) {
                        zone.addClass(srvrErrorClass);
                        scope.errorMsg = "";
                        angular.forEach(scope.fileObject.errorKeys,function(value){
                            scope.errorMsg += value+"<br />";
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
                    }
                }
            });

            zone.on('mouseenter', function(){
                if (zone.hasClass(errorClass) || zone.hasClass(srvrErrorClass)) {
                    element.find('.errorPopUp').addClass('open');
                }
            });
            zone.on('mouseleave', function(){
                element.find('.errorPopUp').removeClass('open');
            });


            
          },
        }
    });

}); // end define

