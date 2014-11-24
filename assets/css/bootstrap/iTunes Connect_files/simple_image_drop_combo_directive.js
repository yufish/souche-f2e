/************************************************************************************************************************/
/***************************************** simple_image_drop_combo_directive.js *****************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('simpleImageDropCombo',function($sce, $http, $timeout){
		return {
            restrict: 'A',
            templateUrl: getGlobalPath('/itc/views/directives/simple_image_drop_combo_template.html'),
            scope: {
                url: "=",
                error: "=",
                styleClass: "@",
                callBackFunc: "&",
                callBackFile: "=",
                isRequired: '=',
                errorKeys: '=',
                missingImage: '@',
                origUrl: '=',
                curUrl: '=',
                imageValidationData: "=", //can be an object with a value of an array of sizes ie. 1024x2024, 1136x640 OR an object with ratio size information in this format: {'ratioRange':['2:1','1:2'],'minLong':1024} **larger ratio fraction needs to come first in array ie. 2:1 = "2" -> 1:2 = ".5"
                locFile: "=",
                dropLabel: '@',
                fileInProgress: '=',
                allowedFileTypes: "=",
                valueToClearOnDelete: "="
            }, 

            link: function(scope, element, attrs) {
                // let the two child directives inside simple_image_drop_combo_template.html do all the work! (the info in scope gets passed cleverly to them.)

                scope.showDropZone = true; // default
                
            } // end link

		} // end return
	}); // end itcApp.directive

}); // end define

