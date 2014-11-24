/************************************************************************************************************************/
/**************************************************** app_filters.js ****************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.filter('brazilRatingClass',function(){
		return function(brazilRating) {
			switch(brazilRating) {
                case "10":
                    return "brazil10";
                case "12":
                   	return "brazil12";
                case "14":
                    return "brazil14";
                case "16":
                    return "brazil16";
                case "18":
                    return "brazil18";
               	default:
               		return "";
            }
		};
	});

});

