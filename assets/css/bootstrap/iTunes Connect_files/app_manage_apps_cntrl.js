/************************************************************************************************************************/
/*********************************************** app_manage_apps_cntrl.js ***********************************************/
/************************************************************************************************************************/

'use strict';
define(['app'], function (itcApp) {

  var manageAppsController = function($scope, $rootScope, $filter, $http, $cookies, loadManageAppsDataService, $location) {

    $rootScope.isReady = false; // Must set this in every controller until we come up with a better solution
    $scope.apps = {};
    $scope.currentPage = 0;
    $scope.pageSize = 60;
    $scope.filteredData = {name: 'test'};
    $scope.appsSortOrder = "lastModifiedDate";
    $scope.reverse = true;
    $scope.numberOfPages = 0;
    $scope.appsViewMode = "grid";
    $scope.selectedType = 'All Types';
    $scope.availableTypes = ['iOS', 'Mac', 'iOS App Bundle'];
    $scope.selectedStatus = 'all';
    $scope.availableStatuses = ['readyForSale', 'prepareForUpload', 'waitingForUpload', 'uploadReceived', 'waitingForExportCompliance', 'waitingForReview', 'pendingContract', 'parking', 'processing', 'inReview', 'pendingDeveloperRelease', 'rejected', 'metadataRejected', 'removedFromSale', 'devRejected', 'developerRemovedFromSale', 'invalidBinary', 'missingScreenshot', 'deleted'];
    // for bundles, should be:
    //$scope.availableStatuses = ['readyForSale', 'prepareForSubmission', 'waitingForUpload', 'uploadReceived', 'waitingForExportCompliance', 'waitingForReview', 'pendingContract', 'parking', 'processing', 'inReview', 'pendingDeveloperRelease', 'rejected', 'metadataRejected', 'removedFromSale', 'devRejected', 'developerRemovedFromSale', 'invalidBinary', 'missingScreenshot', 'deleted'];
    $scope.errorString = "";
    $scope.searchFocus = false;
    $scope.modalcontent = {};

    // Variables we'll be getting back from the JSON, set to false to be safe
    $scope.canCreateAppBundles = false;
    $scope.canCreateIOSApps = false;
    $scope.canCreateMacApps = false;
    $scope.cloudStorageEnabled = false;
    $scope.macBundlesEnabled = false;
    $scope.showSharedSecret = false;

    $scope.headerText = "My Apps";
    $scope.bundleText = "Bundle";

    $scope.$on('parentScopeLoaded',function(event,data){
      $scope.headerText = $scope.l10n.interpolate('ITC.HomePage.ManagePurpleSoftwareLinkText');
      $scope.bundleText = $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.bundle');
    });

    $scope.init = function() {
      $rootScope.currentclass = "ManageApps"; //class to highlight the correct box...
      
      $scope.loadAppData();
      
      if ($cookies.appsViewMode) $scope.setView($cookies.appsViewMode);
    }

    $scope.$watch("query", function(query){

        $scope.query = query;

        $scope.filteredData = $scope.applySearchQualifications();

        $scope.updatePagination();
    });

    $scope.setIsReady = function() {
      $rootScope.isReady = true;
      $rootScope.wrapperclass = "nonfixedheader";
    }

    $scope.applySearchQualifications = function() {

      if ($scope.query != '') var filteredSearch = $filter('filter')($scope.apps, $scope.query);
      else filteredSearch = $scope.apps;

      filteredSearch = $filter('orderBy')(filteredSearch, $scope.appsSortOrder, $scope.reverse);

      // console.log("??? filteredSearch: ", filteredSearch);

      if ($scope.selectedType != 'All Types') {
        var tempSelectedType = $scope.selectedType;
        if ($scope.selectedType != 'iOS App Bundle') tempSelectedType = $scope.selectedType.toLowerCase();
        filteredSearch = _.where(filteredSearch, {type: tempSelectedType});
      }
      if ($scope.selectedStatus != 'all' && $scope.selectedStatus != '') filteredSearch = _.filter(filteredSearch, function(app){
        var statusTest = _.find(app.versions, function(version){
          // if (app.type == 'ios' || app.type == 'mac') return version.stateKey == $scope.selectedStatus;
          // Karen added to fix rdar://problem/15916297 but does not like this solution.
          // When Patrick returns, he should re-evaluate this solution.
          // The problem is that we're using the same status menu but bundles and regular apps
          // have different status's returned from the db. Bundles get "prepareForSubmission"
          // while apps get "prepareForUpload" for "Prepare for Submission."
          if ($scope.selectedType === "iOS App Bundle") {
            if ($scope.selectedStatus === "prepareForUpload") {
              $scope.selectedStatus = "prepareForSubmission";
            }
          }
          else {
            if ($scope.selectedStatus === "prepareForSubmission") {
              $scope.selectedStatus = "prepareForUpload";
            }
          }
          return version.stateKey == $scope.selectedStatus;
          // else return version.stateGroup == $scope.selectedStatus;
        });
        if (statusTest !== undefined) return true;
        else return false;
      });

      return filteredSearch;
    }

    $scope.filterDeletedApps = function(apps) {
      var filteredApps = _.reject(apps, function(app){
        if (_.findWhere(app.versions, {state: "deleted"})) return true;
      });
      return filteredApps;
    }

    $scope.loadAppData = function() {
      loadManageAppsDataService.async().then(function(response) {

        $rootScope.currentPage = $scope.headerText //text in header

        var data = response.data.data;

        $scope.apps = $scope.filterDeletedApps(data.summaries);

        $scope.canCreateAppBundles = data.canCreateAppBundles;
        $scope.canCreateIOSApps = data.canCreateIOSApps;
        $scope.canCreateMacApps = data.canCreateMacApps;
        $scope.cloudStorageEnabled = data.cloudStorageEnabled;
        $scope.macBundlesEnabled = data.macBundlesEnabled;
        $scope.showSharedSecret = data.showSharedSecret;
        $scope.gameCenterGroupLink = data.gameCenterGroupLink;
        $scope.cloudStorageLink = data.cloudStorageLink;
        $scope.sharedSecretLink = data.sharedSecretLink;
        $scope.catalogReportsLink = data.catalogReportsLink;

        // $scope.availableStatuses = $scope.getAvailableStatuses(data.summaries);

        $scope.filteredData = $scope.apps;

        $scope.filteredData = $scope.applySearchQualifications();

        $scope.loadPreviousSort();
        $scope.loadPreviousFilters();
        // $scope.loadPreviousSearch();

        $scope.updatePagination();

        $scope.setIsReady();
      },
      function(error){
        console.error("Error getting data: ", error);

        $scope.errorString = error.status + " " + error.statusText;

        $scope.setIsReady();
      });
    }

    $scope.setView = function(viewMode) {
      if (viewMode == "grid") $scope.appsViewMode = "grid";
      else if (viewMode == "list") $scope.appsViewMode = "list";
    };

    $scope.toggleView = function() {
      if ($scope.appsViewMode == "grid") {
        $scope.appsViewMode = "list";
        $cookies.appsViewMode = "list";
      }
      else if ($scope.appsViewMode == "list") {
        $scope.appsViewMode = "grid";
        $cookies.appsViewMode = "grid";
      }
    };

    $scope.setSelectedType = function(selectedType) {
      $scope.selectedType = selectedType;
      $cookies.selectedType = selectedType;

      $scope.filteredData = $scope.applySearchQualifications();

      $scope.updatePagination();
    }
    
    $scope.typeDisplay = function(type) {
      if (!$rootScope.isReady || $scope.l10n === undefined) return;
      
      switch(type) {
        case 'All Types':
          return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.alltypes');
          break;
        case 'iOS':
          return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.iosapps');
          break;
        case 'Mac':
          return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.macapps');
          break;
        case 'iOS App Bundle':
          return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.iosAppBundles');
          break;
      }
    }

    $scope.closeMenu = function(event) {
        var menuID = event.currentTarget.id;
        $scope.$emit('closepopup', menuID);
    }

    // $scope.getAvailableStatuses = function(apps) {
    //   var availableStatuses = _.pluck(apps, 'versions');

    //   availableStatuses = _.flatten(availableStatuses);

    //   availableStatuses = _.pluck(availableStatuses, 'stateKey');

    //   availableStatuses = _.sortBy(availableStatuses);

    //   availableStatuses = _.uniq(availableStatuses);

    //   return availableStatuses;
    // }

    $scope.setSelectedStatus = function(status) {
      $scope.selectedStatus = status;
      $cookies.selectedStatus = status;

      $scope.filteredData = $scope.applySearchQualifications();

      $scope.updatePagination();
    }

    $scope.updatePagination = function() {
      $scope.numberOfPages = Math.ceil($scope.filteredData.length/$scope.pageSize);

      if ($scope.currentPage > ($scope.numberOfPages-1)) {
        $scope.currentPage = $scope.numberOfPages-1;
      }

      if ($scope.currentPage < 0) $scope.currentPage = 0;
    }

    $scope.loadPreviousFilters = function() {
      if ($cookies.selectedType !== undefined) $scope.setSelectedType($cookies.selectedType);
      if ($cookies.selectedStatus !== undefined) $scope.setSelectedStatus($cookies.selectedStatus);
    }

    $scope.chanageOrder = function (appsSortOrder) {
      $cookies.appsSortOrder = appsSortOrder;
      $scope.filteredData = $filter('orderBy')($scope.filteredData, appsSortOrder, $scope.reverse);
    };

    $scope.updateSorting = function (appsSortOrder) {
      if ($scope.appsSortOrder != appsSortOrder) $scope.reverse = true;
      $scope.reverse = !$scope.reverse;
      $scope.appsSortOrder = appsSortOrder;
      $cookies.appsSort = appsSortOrder;

      $scope.chanageOrder(appsSortOrder);
    };

    $scope.loadPreviousSort = function() {
      if ($cookies.appsSortOrder != "null" && $cookies.appsSortOrder != $scope.appsSortOrder) $scope.updateSorting($cookies.appsSortOrder);    
    }

    $scope.loadPreviousSearch = function() {
      if ($cookies.appsSearchQuery) $scope.query = $cookies.appsSearchQuery;
      // else $scope.query = "";
    }

    $scope.countCalc = function(countType, string) {
      var count = 0;
      for (var i = 0; i < $scope.apps.length; i++) {
        if (countType === 'appType') {
          if ($scope.apps[i].type && $scope.apps[i].type.toLowerCase() == string.toLowerCase()) count++;
        }
        else if (countType === 'status') {
          for (var y = 0; y < $scope.apps[i].versions.length; y++) {
            if ($scope.apps[i].versions[y].stateKey.toLowerCase() == string.toLowerCase()) count++;
          }
        }
      }

      if (count === undefined) count = -1;

      return count;
    };

    $scope.numAppTypes = function() {
       var typeArray = [];
        for (var i = 0; i < $scope.apps.length; i++) {
          if ($scope.apps[i].type) typeArray.push($scope.apps[i].type.toLowerCase());
        }
        var uniqueArray = _.uniq(typeArray);
        return uniqueArray.length;
    }

    $scope.appBundleLink = function(adamId, type, version) {
      if ($scope.isBundle(type)) {
        // var baseUrl = global_itc_path + '/wa/LCAppBundlePage?adamId=';
        // return baseUrl + adamId;

        return global_itc_home_url + '/bundle/' + adamId;
      } else {
        var currentPath = $location.absUrl();
        var newPath = currentPath + '/' + adamId;
        if (version && version.stateGroup == 'readyForSale') return newPath + '/cur';
        else return newPath;
      }
    }

    // $scope.appClickHandler = function(adamId, type, version) {
    //   if ($scope.isBundle(type)) return;

    //   $cookies.appsSearchQuery = $scope.query;

    //   var currentPath = $location.path();

    //   if (version && version.stateGroup == 'readyForSale') $location.path(currentPath + '/' + adamId + '/cur');
    //   else $location.path(currentPath + '/' + adamId);
    // }

    $scope.isBundle = function(type) {
      if (type == 'iOS App Bundle' || type == 'Mac App Bundle') return true;
      else return false;
    }

    $scope.getNoResultsString = function() {
      if (!$rootScope.isReady || $scope.l10n === undefined) return;
      if (!$scope.query) return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.noresultsgeneric');
      else return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.noresults', {'query': $scope.query});
    }

    $scope.getPagesString = function() {
      if (!$rootScope.isReady || $scope.l10n === undefined) return;
      return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.pages', {'currentPage': $scope.currentPage+1, 'totalPages': $scope.numberOfPages});
    }

    $scope.getProperType = function(type) {
      switch (type) {
        case 'ios':
          return 'iOS';
          break;
        case 'mac':
          return 'Mac';
          break;
        case 'iOS App Bundle':
          return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.iosbundle');
          break;
        case 'Mac App Bundle':
          return $scope.l10n.interpolate('ITC.apps.manageyourapps.summary.macbundle');
          break;
        default:
          return 'Unknown Type';
          break;
      }
      return false;
    }

    $scope.launchCreateNewApp = function(appType) {
      $scope.modalcontent.showCreateNewAppModal = true;
      $scope.modalcontent.appType = appType;
      $scope.$emit('closepopups',true);
    }

    $scope.getIconClass = function(app) {
      if (app.type == 'ios' && $scope.appsViewMode == 'list') return 'ios7-style-icon';
      else if (app.type == 'ios' && $scope.appsViewMode != 'list') return 'ios7-style-icon-large';
    }

    $scope.init();
  }

  itcApp.register.controller('manageAppsController', ['$scope', '$rootScope', '$filter', '$http', '$cookies', 'loadManageAppsDataService', '$location', manageAppsController]);

});


