/************************************************************************************************************************/
/************************************************** global_filters.js ***************************************************/
/************************************************************************************************************************/

define([], function () {

	var global_filters = angular.module('global_filters', []);

	global_filters.filter('statusClass',function(){
		return function(status) {
			switch(status) {
				case 0:
					return "ready";
				case 1:
					return "waiting";
				case 2:
					return "attn";
			}
		};
	});

	global_filters.filter('startFrom', function() {
	    return function(input, start) {
	        if(input && !_.isEmpty(input)) {
	            start = +start; //parse to int
	            return input.slice(start);
	        }
	        return [];
	    };
	});

	global_filters.filter('threeColSort',function(){
		return function(arr) {
			if (arr !== undefined) {
				var maxColLength = Math.ceil(arr.length/3);
				var trackCount = 1;
				var newArray = [];
				for(var i = 0; i < maxColLength; i++) {
					newArray.push(arr[i]);
					if (arr[maxColLength + i] !== undefined) {
						newArray.push(arr[maxColLength + i])	
					}
					if (arr[(maxColLength*2) + i] !== undefined) {
						newArray.push(arr[(maxColLength*2) + i])	
					}
				}
				return newArray;
			}
		}
	});
	/*
THIS DATA IS NOW IN REFERENCE DATA - DELETE THIS...
	global_filters.filter('versionFormatting',function(){
		return function(state) {
			switch(state) {
				case "readyForSale":
					return "Ready For Sale";
				case "developerRemovedFromSale":
					return "Developer Removed From Sale";
				case "pendingDeveloperRelease":
					return "Pending Developer Release";
				case "waitingForReview":
					return "Waiting For Review";
				case "prepareForUpload":
					return "Prepare for Upload";
			}
		};
	});*/
	global_filters.filter('addSpaceAfterComma',function(){
		return function(text) {
			if (text != undefined && text != "") {
				return text.replace(/,/g, ', ');
			}
			return false;
		}
	});
	global_filters.filter('monthFormat',function(){
		return function(month) {
			switch(month) {
				case 0:
					return "Jan";
				case 1:
					return "Feb";
				case 2: 
					return "Mar";
				case 3:
					return "Apr";
				case 4:
					return "May";
				case 5:
					return "Jun";
				case 6:
					return "Jul";
				case 7:
					return "Aug";
				case 8:
					return "Sep";
				case 9:
					return "Oct"
				case 10:
					return "Nov";
				case 11:
					return "Dec";
			}
		};
	});

    global_filters.filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) === ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + "&hellip;";
            }
            return input;
        };
    });

    global_filters.filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + "&hellip;";
                }
            }
            return input;
        };
    });

});

