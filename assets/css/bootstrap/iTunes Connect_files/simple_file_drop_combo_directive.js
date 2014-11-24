/************************************************************************************************************************/
/***************************************** simple_file_drop_combo_directive.js ******************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('simpleFileDropCombo',function($sce, $http, $timeout){
		return {
            restrict: 'A',
            templateUrl: getGlobalPath('/itc/views/directives/simple_file_drop_combo_template.html'),
            scope: {
                fileObject: "=",
                error: "=",
                styleClass: "@",
                callBackFunc: "&",
                callBackFile: "=",
                missingFile: '@',
                origFileObject: '=',
                allowedFileTypes: "=",
                locFile: "=",
                iconLabel: "@",
                dropLabel: "@",
                fileInProgress: '='
            }, 

            link: function(scope, element, attrs) {
                // let the two child directives inside simple_image_drop_combo_template.html do all the work! (the info in scope gets passed cleverly to them.)
    
            } // end link

		} // end return
	}); // end itcApp.directive

}); // end define

