/************************************************************************************************************************/
/********************************************* snapshot_errors_directive.js *********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

    /*
        This is no longer used. But should you want to use it, put this html somewhere like version.html:
        <div snapshot-error-display error-check-func="getGeneralErrorsInGroup()"></div>
    */

	itcApp.directive('snapshotErrorDisplay',function(){
		return {
            restrict: 'A',
            template: '<div class="snapshotGeneralErrors">{{errorCheckFunc()}}</div>',
            scope: {
                errorCheckFunc: "&"
            }, 

            link: function(scope, element, attrs) {
                //element.html(scope.errorCheckFunc());

            }

        };

    })

});

