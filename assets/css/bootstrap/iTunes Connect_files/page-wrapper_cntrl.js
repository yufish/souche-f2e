/************************************************************************************************************************/
/************************************************ page-wrapper_cntrl.js *************************************************/
/************************************************************************************************************************/

'use strict';
define(['app'], function (itcApp) {
	var pageWrapperController = function ($scope,sharedProperties,$rootScope,userSessionService,localizationService,referenceDataService,$sce,$cookies,mainNavService,$location,appDetailsService) {

		$scope.updateMainNav = function() {
 			if ($rootScope.currentPage === "Homepage") {
				$scope.onHomepage = true;
			} else {
				$scope.onHomepage = false;
			}
		};

		$scope.loadUserSession = function() {
	        userSessionService.async().then(function(data) {
	            $scope.user = data.data;
	            usersessionloaded = true;
	            $scope.checkIsReady();
	        });
	    };

	    $scope.loadMainNavModules = function() {
	        mainNavService.async().then(function(data) {
	            $scope.mainNavigation = data.data;
	            $scope.pageWrapperVars.mainNavigationCount = $scope.mainNavigation.length;
	            mainNavloaded = true;
	            $scope.checkIsReady();
	        });
	    };

	    $scope.l10n = [];

	    $scope.loadLocalizationKeys = function() {
			localizationService.async().then(function(data) {
				// Store the localization array
	            $scope.l10n = data.data || [];
	            
	            // The interpolate function allows us to replace arbitrary variables with their appropriate value
	            // Usage: l10n.interpolate( <localization key>, <data object>)
	            $scope.l10n.interpolate = function( localizationKey, replacements ) {
	            	var text = this[ localizationKey ] || localizationKey,
	            		r = replacements;
	            	if (typeof r === 'object' && Object.keys(r).length > 0) {
	            		for (var key in r) {
	            			if (r.hasOwnProperty(key)) {
		            			r['@@'+key+'@@'] = r[key];
		            			delete r[key];
		            		}
	            		}
	            		var rgx = new RegExp( Object.keys(r).join('|'), 'gi');
	            		return text.replace(rgx, function(match) { return r[match] });
	            	} else {
	            		return text;
	            	}
	            };
	            localizationloaded = true;
	            $scope.checkIsReady();
	        });
	    };

	    $scope.loadReferenceData = function() {
				referenceDataService.async().then(function(data) {
		            $scope.referenceData = data.data;
		            referenceDataloaded = true;
		            $scope.checkIsReady();

		            //load dev/qa header info
		            $scope.loadDevQAHeaderInfo();

		        });
	    };

		//var sharedPropertiesObj = sharedProperties.isReady();
		$scope.checkIsReady = function() {
			if (usersessionloaded && localizationloaded && referenceDataloaded && mainNavloaded) {
				//let child scope know we're ready...
				$scope.parentScopeLoaded = true;
				$scope.$broadcast("parentScopeLoaded");
			} else {
				$scope.parentScopeLoaded = false;
			}
			if($rootScope.isReady && usersessionloaded && localizationloaded && referenceDataloaded) {
				$scope.isLoaded = true;
				$scope.$broadcast("pageIsLoaded");
			} else {
				$scope.isLoaded = false;
			}
		}

		$scope.getYear = new Date().getFullYear();
		$scope.showTOS = function() {
			$scope.pageWrapperVars.showTOS = true;
		}
		$scope.closeTOS = function() {
			$scope.pageWrapperVars.showTOS = false;
		}

		//onLoad
		var usersessionloaded = false;
		var localizationloaded = false;
		var referenceDataloaded = false;
		var mainNavloaded = false;
		$scope.parentScopeLoaded = false;
		$scope.signoutlink = logouturl; //pull in global logout url into header


		$scope.updateMainNav();
		$scope.checkIsReady();
		$scope.loadUserSession();
		$scope.loadMainNavModules();
		$scope.loadLocalizationKeys();
		$scope.loadReferenceData();
		$scope.isSaving = false;
		$scope.pageWrapperVars = {};
		$scope.pageWrapperVars.showTOS = false;

		//global environment variables to use in HTML
		$scope.global_itc_path = global_itc_path;
		$scope.global_itc_home_url = global_itc_home_url;

		$scope.setIsSaving = function(isItSaving) {
			if (isItSaving) {
				$scope.isSaving = true;
			} else {
				$scope.isSaving = false;
			}
		}


		//For Dev/QA Headers...adamid and bundle id display
		$scope.$on('$routeChangeSuccess', function () {
			$scope.loadDevQAHeaderInfo();
        });
        $scope.loadDevQAHeaderInfo = function() {
        	if ($scope.referenceData !== undefined && $scope.referenceData.isDevOrQA) {
	            $scope.pageWrapperVars.adamId = $scope.getAdamIdFromPath();
	            if ($scope.pageWrapperVars.adamId !== undefined && $scope.pageWrapperVars.adamId !== null && $scope.pageWrapperVars.adamId !== '') {
		            $scope.loadHeaderData($scope.pageWrapperVars.adamId);
		        }
	        }
        }
        $scope.getAdamIdFromPath = function() {
        	var path = $location.path();
            var pathParts = path.split("/");
            //if first item in path is "app" get adam id (should be second value)
            if (pathParts[1] == "app" && pathParts[2]) {
            	 return pathParts[2];
            } else {
            	return null;
            }
        }
		$scope.loadHeaderData = function(adamId) {
			if (adamId !== null && adamId !== '') {
				appDetailsService.async(adamId).then(function(data) {
					if (data.data.bundleIdSuffix !== null && data.data.bundleIdSuffix.value !== null) {
						$scope.pageWrapperVars.bundleId = data.data.bundleId.value.replace("*","") + data.data.bundleIdSuffix.value;
					} else {
					$scope.pageWrapperVars.bundleId = data.data.bundleId.value;
					}
				});
			}
		}


		$rootScope.$watch('currentPage',function(value){
			$scope.currentPage = value;
			$scope.updateMainNav();
		});
		$rootScope.$watch('isReady',function(value){
			$scope.checkIsReady();
		});
		/*$rootScope.$watch('currentclass',function(value){
			
			
		});*/

		/********* GLOBAL UTILITY FUNCTIONS *********/
		$scope.renderHtml = function(html_code) {
    		return $sce.trustAsHtml(html_code);
		};

		$scope.getGlobalFilePathMap = function(filepath) {
			return getGlobalPath(filepath);
		}

		//use to reutn values from JSON without ng-repeat's auto sorting
		$scope.notSorted = function(obj){
			if (!obj) {
				return [];
			}
			return Object.keys(obj);
		}
		$scope.urlEncode = function(string) {
            return encodeURIComponent(string);
        }
        
        $scope.showDebugMenu = function() {
        	$scope.debugMenuVisible = true;
        }
        $scope.hideDebugMenu = function() {
        	$scope.debugMenuVisible = false;
        }
        

	}

	itcApp.controller('pageWrapperController', ['$scope', 'sharedProperties','$rootScope','userSessionService','localizationService', 'referenceDataService','$sce','$cookies','mainNavService','$location','appDetailsService', pageWrapperController]);
});


