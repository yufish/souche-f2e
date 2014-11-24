/************************************************************************************************************************/
/************************************************ app_iap_directives.js *************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('itcScrollingTitle', function() {
		return {
			link: function(scope,element,attrs) {
				var fixTitleBar = function(){
                	if (element.hasClass('fixedheader')) {
						
						var fullHeaderWidth = element.outerWidth(true);
						var buttonsWidth = element.find('.formActionButtons').outerWidth(true);
						var titleWidth = element.find('.title').outerWidth(true);
						var versWidth = element.find('.version').outerWidth(true);

						var headerWidthAvailableForTitleAndVersion = fullHeaderWidth - buttonsWidth - 70; //adjust for paddings
						var maxWidthAvailableForTitle = headerWidthAvailableForTitleAndVersion - versWidth;
						var widthAvailableForTitleText = maxWidthAvailableForTitle - 40; //adjust for icon

						element.find('.title').css('maxWidth',maxWidthAvailableForTitle);
						element.find('.titletext').css('maxWidth',widthAvailableForTitleText);
						element.find('.page-subnav').fadeOut(100);
					} else {
						element.find('.page-subnav').fadeIn(100);
					}
                }

				fixTitleBar();

				$(window).on('scroll',fixTitleBar);

				$(window).on('resize',fixTitleBar);

				scope.$on("$destroy",function(){
                    $(window).off('scroll',fixTitleBar);
                    $(window).off('resize',fixTitleBar);
                });

                scope.$watch(function(){
                	return element.find('.titletext').html()
                },function(newVal,oldVal){
                	if (newVal !== oldVal) {
                		fixTitleBar();
                	}
                });
                scope.$watch(function(){
                	return element.find('.version').html()
                },function(newVal,oldVal){
                	if (newVal !== oldVal) {
                		fixTitleBar();
                	}
                });
			}
		}
	});

});

