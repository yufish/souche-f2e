/************************************************************************************************************************/
/*********************************************** centering_directives.js ************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

    // vertically centers the image (once loaded) onto it's parent.
    itcApp.directive('centerImageVertically', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element[0].style.marginLeft = -1000 + "px"; // so it doesn't fly in from the top
                element.bind('load', function() {
                    var that = this;
                    $timeout(function() {    
                        var h = that.naturalHeight; // that.offsetHeight; 
                        var w = that.naturalWidth;
                        var container = element.closest(".zone");
                        if (container.length === 0) {
                            container = element.closest(".container");
                        }
                        var ph = container[0].offsetHeight; 
                        var marginTop;
                        if (h <= ph) {
                            that.style.height = h + "px"; 
                            marginTop = (ph - h)/2;
                        }
                        else { // height of image is greater than height of zone
                            var ratio = ph/h;
                            that.style.height = ph + "px"; 
                            w = w * ratio;
                            marginTop = 0;
                        }
                        that.style.width = w + "px";
                        that.style.marginTop = marginTop + "px";

                        that.style.marginLeft = "0px";
                    }, 500); // I don't like doing this setTimeout, but the image doesn't seem to have a height until half a second after 'load' is triggered.
                }); 

            }
        };
    });

    // centers a div onto it's parent element.
    itcApp.directive('centerMe', function() {  
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var el = element;
                var parentEl = el.parent();
                //el.css("left", (parentEl.width() - el.width())/2 + "px");
                var parentHeight = parentEl.height();
                var elHeight = el.height();
                if (elHeight === 0) {
                    elHeight = el[0].clientHeight;
                }
                el.css("top", (parentHeight - elHeight)/2 + "px");
            }
        };
    });  

}); // end define

