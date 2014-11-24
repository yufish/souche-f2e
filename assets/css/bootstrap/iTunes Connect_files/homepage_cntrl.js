/************************************************************************************************************************/
/************************************************** homepage_cntrl.js ***************************************************/
/************************************************************************************************************************/

'use strict';
define(['app'], function (itcApp) {
	var homepageController = function($scope, $location,$window, sharedProperties,$rootScope, $sce, newsAlertsService,userSessionService,$cookies, $cookieStore) {

        $scope.setisReady = function() {
            $rootScope.isReady = ($scope.newsloaded) ? true : false;
        }
	    
		$scope.loadNewsAlerts = function() {
            newsAlertsService.async().then(function(data) {

                    $scope.fullfeed = data.data;

                    $scope.news = _.where($scope.fullfeed, { type: 'NEWS' })
                    $scope.hasNews = ($scope.news.length > 0) ? true : false;
                    // console.log("news feeed >>",$scope.news)
                    
                    //    WARN = fatal errors
                    // DEFAULT = standard errors
                    $scope.alerts   = _.where($scope.fullfeed, { type: 'ALERT', level: 'WARN' });
                    $scope.warnings = _.where($scope.fullfeed, { type: 'ALERT', level: 'DEFAULT' });
                    
                    // $scope.warnings = [
                    //     { header: 'Test Warning', message: 'This is just a test. Any anxiety you may experience is unnecessary.'},
                    //     { header: 'Test Warning', message: 'This is another test. At this point, your anxiety is justified.'}
                    // ]
                    // $scope.alerts = [
                    //     { header: 'Test Alert', message: 'Something broke in a major way... but you can do something about it :)' }
                    // ]
                    
                    $scope.hasAlerts   = ($scope.alerts.length > 0)   ? true : false;
                    $scope.hasWarnings = ($scope.warnings.length > 0) ? true : false;
                    
                    // console.log('warnings', $scope.warnings)
                    // console.log('alerts', $scope.alerts)

                    $scope.newsloaded = true;
                    $scope.setisReady();
                    
                    // Limit the height of News area, if we have more than one news item
                    $scope.hasLongNews = ($scope.news.length > 1);
                    $scope.newsTruncated = !!($scope.hasLongNews);
                    
                    if ($scope.hasAlerts !== true && $scope.hasWarnings !== true && $scope.news.length < 1) {
                        $rootScope.hasNoMessaging = true;
                    }
            });
        };
        
        // Show More/Less news items
        $scope.toggleNewsVisibility = function($event) {
            $scope.newsTruncated = !$scope.newsTruncated;
        };

        $scope.showHtml = function(text) {
        	return $sce.trustAsHtml(text);
        }

        $scope.checkContracts = function() {
            if ($scope.user !== undefined && $scope.user !== null) {
                if ($scope.user.hasContractInfo && $cookies.viewedCpage !== $cookies.wosid) {
                    //send to contract page if user has contract info and has not seen this session
                    $window.location.href = "contractinfo";
                }
            }
        };

		//run on load 

		$rootScope.currentPage = "Homepage";
	    $rootScope.isReady = false;

        //$rootScope.oldwrapperclass = $rootScope.wrapperclass; //load old class that will now need to be removed
        $rootScope.bodyClass = "homepage";
        $rootScope.wrapperclass = "homepageFullWrapper";
        $rootScope.currentclass = "";

        $scope.newsloaded = false;
	    $scope.isHome = true;
        $scope.loadNewsAlerts();
        $scope.checkContracts();

        $cookieStore.remove('appsSearchQuery'); // Remove apps search cookie so it the last search isn't constantly retained

        $scope.$watch('user',function(){
            $scope.checkContracts();
        });

        $scope.$on('$locationChangeStart', function (event, next, current) {

            // If we're loading the My Apps page, reset cookies for filters
            if (next.indexOf("/a/app") !== -1)  {
                $cookies.selectedType = undefined;
                $cookies.selectedStatus = undefined;
            }
        });
	}

	itcApp.register.controller('homepageController', ['$scope', '$location','$window', 'sharedProperties','$rootScope','$sce','newsAlertsService', 'userSessionService','$cookies', '$cookieStore', homepageController]);
});


