/************************************************************************************************************************/
/************************************************** global_services.js **************************************************/
/************************************************************************************************************************/

'use strict';

define([], function () {

  	var global_services = angular.module('global_services', []);
	
	/*
	Usage: service to pull in all localization keys and text
	*/
  	global_services.service('localizationService', function($http){
  		var myService = {
	    async: function() {
	      var promise = $http.get(global_itc_path + '/ra/l10n').then(function (response) {
	        return response.data;
	      });
	      // Return the promise to the controller
	      return promise;
	    }
	  };
	  return myService;	
  	});

  	global_services.service('mainNavService', function($http){
  		var myService = {
	    async: function() {
	      var promise = $http.get(global_itc_path + '/ra/nav/header/modules').then(function (response) {
	        return response.data;
	      });
	      // Return the promise to the controller
	      return promise;
	    }
	  };
	  return myService;	
  	});

  	/*
	Usage: service to pull in all reference data ***currently specific to apps - should be made generic
	*/
  	global_services.service('referenceDataService', function($http){
		var myService = {
			async: function() {
				var promise = $http.get(global_itc_path + '/ra/ref/').then(function (response) {
					return response.data;
				});
				// Return the promise to the controller
				return promise;
			}
		};
		return myService;	
  	});


	/*
	Usage: service to manage datepicker functionality
	*/
	global_services.service('datePickerSerivce',function(){

	    var months = new Array("Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
	    var today = new Date();
	    var todayFormatted = months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
	    var maxDayFormatted = "Dec 31, " + (today.getFullYear()+1);

	    return {
	        cleanDate: function(datestring){
	            if (datestring != "" && datestring != "none" && datestring != "None" && datestring != "No End Date" && datestring != "Existing") {
	                var c = new Date(datestring);
	                return months[c.getMonth()] + " " + c.getDate() + ", " + c.getFullYear();
	            } else {
	            	return datestring;
	            }
	        },
	        checkRange: function(startDateElement,EndDateElement) {
	            var startDateTimestamp = Date.parse($(startDateElement).val());
	            var endDateTimestamp = Date.parse($(EndDateElement).val());
	            if (endDateTimestamp <= startDateTimestamp) {
	                return false;
	            } else {
	                return true;
	            }
	        },
	        getMaxDay: function() {
	            return maxDayFormatted;
	        },
	        getShortMonth: function(num) {
	            return months[num];
	        }
	    }
	});

	/*
	USAGE: Service to share properties between controllers on the same page
	*/
	global_services.service('sharedProperties', function () {
	    var breadCrumbs = []; // set like this: sharedProperties.setBreadCrumbs(0,{"link":"#","text": "Manage Apps"});
	    var tabNav = [];
	    //var pageReady = false;
	    return {
	        getBreadCrumbs: function () {
	            return breadCrumbs;
	        },
	        setBreadCrumbs: function(key,value) {
	            breadCrumbs[key] = value;
	        },
	        addBreadCrumbs: function(valuesArray) {
	          //clear breadcrumbs first
	          breadCrumbs = [];
	          angular.forEach(valuesArray, function(value){
	            breadCrumbs.push(value);
	          });  
	        },
	        removeBreadCrumbsBelow: function(key) {
	            breadCrumbs.splice(key+1);
	        },
	        getTabNav: function() {
	            return tabNav;
	        },
	        setTabNav: function(key,value) {
	            tabNav[key] = value;
	        },
	        addTabNavs: function(valuesArray) {
	          //clear tabs first:
	          tabNav = [];
	          angular.forEach(valuesArray, function(value){
	            tabNav.push(value);
	          });  
	        }
	    };
	});

	/*
	Usage: service to store links
	*/
	global_services.factory('linkManager',function($http){
	  return {
	    manageAppsLink: function() {
	      return {"link":global_itc_path + "/da/LCAppPage","text": "Manage Apps","external":true};
	    },
	    appDetailsLink: function(adamId,appname){
	      return {"link": global_itc_path + "/da/LCAppPage?adamId="+adamId,"text": appname,"external":true};
	    },
	    manageIapLink: function(adamId) {
	      return {"link": global_itc_home_url + "/app/"+adamId+"/addons","text": "In-App Purchases"};
	    }
	  }
	});

	/*
	Usage: Service to retrieve info about current user
	*/
	global_services.service('userSessionService',function($http){
	  var myService = {
	    async: function() {
	      var promise = $http.get(global_itc_path + '/ra/user/detail',{cache:false}).then(function (response) {
	      	// console.log("USER INFO SERVICE RESPONSE >>>>");
          	// console.log(response.data);
	        return response.data;
	      });
	      // Return the promise to the controller
	      return promise;
	    }
	  };
	  return myService;
	});

	/*
	Usage: Service to pull in news and alerts for homepage
	*/
	global_services.service('newsAlertsService',function($http){
	  var myService = {
	    async: function() {
	      var promise = $http.get(global_itc_path + '/ra/user/homeMessages').then(function (response) {
	        return response.data;
	      });
	      // Return the promise to the controller
	      return promise;
	    }
	  };
	  return myService;
	});

	/*
	Usage: Update Users Email
	*/
	global_services.service('updateEmailService',function($http){
		var myService = {
			updateEmail: function(email) {
				 var promise = $http.post(global_itc_path + '/ra/user/updateUserEmail',email).then(function(response) {
			      	return response.data;
				});
				return promise;
			}
		}
		return myService;
	});

	/*
	Usage: Service to pull contract update notices
	*/
	global_services.service('contractUpdatesService',function($http){
	  var myService = {
	    async: function() {
	      var promise = $http.get(global_itc_path + '/ra/contract/getDetails').then(function (response) {
	        return response.data;
	      });
	      // Return the promise to the controller
	      return promise;

	    }
	  };
	  return myService;
	});
	/*
    Usage: Service to pull in data for the Resources page
    */
    global_services.service('resourcePageDataService',function($http){
      var myService = {
        async: function() {
          var promise = $http.get(global_itc_path + '/ra/resources').then(function (response) {
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        }
      };
      return myService;
    });

});

