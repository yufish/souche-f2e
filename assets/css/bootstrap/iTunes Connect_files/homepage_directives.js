/************************************************************************************************************************/
/************************************************ homepage_directives.js ************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {
	itcApp.directive('itcHomePage',['$timeout',function($timeout){
		return {
			link: function(scope,element,attrs){
				
				//fix homepage layout when icons are less than 4
				function homepagefix() {
					
					var nav 	   = element.find("#main-nav"),
						navItems   = nav.find('li'),
						numOfItems = navItems.length;
					
					if (numOfItems <= 4 && numOfItems !== 0) {
						
						var percentage = 100 / numOfItems;
						navItems.width(percentage + "%");
						var newMaxWidth = 215 * numOfItems;
						
						if ($(window).width() > 1225) {
							newMaxWidth = 245 * numOfItems;
						}
						nav.css('maxWidth',newMaxWidth+"px");
						
					} else {
						navItems.addClass('managedWidth');
					}
				}

				$(window).on('resize',homepagefix);
				scope.$on("$destroy",function(){
                    $(window).off('resize',homepagefix);
                });

				scope.$on('parentScopeLoaded',function(){
					homepagefix();
				});
				/*scope.$watch(function(){
					homepagefix();
				});*/
			}
		}
	}]);
});


