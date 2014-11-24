/************************************************************************************************************************/
/********************************************* menu_item_pill_directive.js **********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	// A directive for a menu item pill. Triggers a menuPillClicked event in the parent scope when this pill is clicked.
	// Example use:
	// <ul role="menu" class="pilltabgroup" >
	//		<div menu-item-pill ng-repeat="dev in deviceNames" menu-id="deviceMenuItem" content="{{deviceNameMap[dev]}}" value="{{dev}}"></div>
	//	</ul>

	itcApp.directive('menuItemPill', function($timeout) {
        return {
			restrict: 'A',
			template: '<li role="menuitem"><a href=""><div></div><span class="errorsml" ng-show="hasError()"></span></a></li>',
			replace: true,
			scope: {
				content: "@", // string to display inside the pill
				value: "@", // value gets passed thru "menuPillClicked" event when this pill is clicked
				menuId: "@", // an id for this menu item. The parent scope will use this id when "menuPillClicked" is triggered
				hasError: "&",
				currentValue: "@" // the value of the currently selected pill (set from parent scope)
			}, 

			link: function(scope, element, attrs) {
				element.find('a div').html(scope.content);
				scope.makeCurrent = function() {
					element.siblings().removeClass("current");
					element.addClass("current");
				};

				scope.$watch('currentValue', function(newVal, oldVal) {
                    if (newVal && newVal === scope.value) {
                        scope.makeCurrent();
                    }
                });

				element.bind('click', function() {
                    var data = {};
                    data.value = scope.value;
                    data.id = scope.menuId;
                    
                    scope.$emit("menuPillClicked", data);
            	});
			}

      	};
    });
});    

