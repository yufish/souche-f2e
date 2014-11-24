/************************************************************************************************************************/
/************************************************** app_directives.js ***************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('appView', function() {
		return {
			replace: true,
			transclude: true,
			template:
				'<div>'+
				  	'<div ng-if="app.iconUrl" class="ios7-style-icon" style="background-image:url({{app.iconUrl}})"></div>'+
	              	'<div ng-if="!app.iconUrl" class="iconfont-icon-placeholder icon-64"></div>'+
	              	'<div class="metadata">'+
	                	'<div class="app-name">{{app.name}}</div>'+
	                	'<div class="app-type-badge">{{getFormattedType(app.appType)}}</div>'+
	              	'</div>'+
	              	'<div ng-if="appsInBundleList.length < 10" class="addIcon" ng-click="addAppToBundleAction($index, app)"></div>'+
              	'</div>',
			link: function(scope, element, attrs) {

			}
		}
	});

	/*
		if app header main nav is too long - pull nav items into "more" dropdown. If window width is resized larger, pull items back out.
	*/
	itcApp.directive('appHeaderNav',function(){
		return {
			scope: {
				'origNavObj': '=appHeaderNav' // get this for length of nav items
			},
			link: function(scope,element,attrs) {

				$(window).resize(function(){
                	fixNav();
                });

				var getLIWidthTotal = function() {
					var liArray = element.find('li:not(li li):visible'); //base width on full li total... we'll only be showing hidding .mainNavLinks though
                	var liWidthTotal = 0;
                	angular.forEach(liArray, function(liElement) {
                		liWidthTotal += $(liElement).outerWidth(true);
                	});
                	return liWidthTotal;
				}

				var hideAllOverflowNav = function() {
					var navitems = element.find('#navOverflow li');
					$(navitems).each(function(index) {
						$(navitems[index]).hide();
					});
				}

				var showAllMainNav = function() {
					var navitems = element.find('li.mainNavLinks');
					$(navitems).each(function(index) {
						$(navitems[index]).show();
					});
				}

                var fixNav = function() {
                	if (scope.origNavObj) {
						totalNumNavItems = scope.origNavObj.length;
	                	var fullULWidth = element.width();
	                	var liArrayOverflow = element.find('#navOverflow li');
			            var liArray = element.find('li.mainNavLinks');
			            showAllMainNav(); //reset what's visible...
			            var liWidthTotal = getLIWidthTotal();

		                if (fullULWidth > liWidthTotal) {
			                hideAllOverflowNav(); //hide all more nav if navigation is ok and all overflow is already hidden
			            } else if (liWidthTotal > fullULWidth) {
			            	var count = totalNumNavItems-1;
			            	while (count > 0 && liWidthTotal > fullULWidth) {
			            		//show main nav item and hide overflow items
			            		$(liArrayOverflow).each(function(index){
			            			if (index < count) {
			            				$(liArrayOverflow[index]).hide();
			            			} else {
			            				$(liArrayOverflow[index]).show();
			            			}
			            		});
			            		$(liArray).each(function(index){
			            			if (index < count) {
			            				$(liArray[index]).show();
			            			} else {
			            				$(liArray[index]).hide();
			            			}
			            		});
			            		liWidthTotal = getLIWidthTotal();
			            		var test = element.find('li:visible:not(li li)');
			            		count--;
			            	}
			            }
	                }
	                scope.$on('pageIsLoaded', function() {
			            fixNav();
			        });
			        scope.$on('$locationChangeSuccess',function(){
			        	fixNav();
			        });
		    	}	
				scope.$watch('origNavObj',function() {
					fixNav();
				});	

			}
		}
	});

});

