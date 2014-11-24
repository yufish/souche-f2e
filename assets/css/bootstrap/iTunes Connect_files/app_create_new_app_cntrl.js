/************************************************************************************************************************/
/********************************************* app_create_new_app_cntrl.js **********************************************/
/************************************************************************************************************************/

'use strict';
define(['app'], function (itcApp) {

    var createAppController = function ($scope, createAppService, $location) {

      	$scope.createAppDataLoaded = false;
      	$scope.bundleIsWildcard = false;
        $scope.createAppDataSaving = false;
        $scope.createAppModal = {
          'clearValidation': false
        }


      	$scope.loadCreateAppDetails = function() {
          $scope.createAppDataLoaded = false;
          $scope.createAppDetails = {};
          $scope.createAppModal.clearValidation = true;
          $scope.errorText = "";
          $scope.showError = false;
          $scope.bundleIsWildcard = false;
          $scope.bundleIdComposite = "";
      		createAppService.load($scope.modalcontent.appType).then(function(data){
      			$scope.createAppDetails = data.data;
      			$scope.setUpModalValues();
      		});
      	}
      	$scope.setUpModalValues = function(updatedNewAppInfo) {
      		if (updatedNewAppInfo) {
      			$scope.createAppDetails = updatedNewAppInfo;
      		}

          //confirm we have bundle ids!
          if (Object.keys($scope.createAppDetails.bundleIds).length <= 0) {
            $scope.noBundleIdsAvailable = true;
            $scope.modalcontent.showCreateNewAppModal = false;
            $scope.modalcontent.showCreateNewAppModalNoIds = true;
          } else {
            $scope.noBundleIdsAvailable = false;
          }

          //which string type?
          if ($scope.createAppDetails.newApp.appType === "iOS App") {
            $scope.createBundleIdText = $scope.l10n.interpolate('ITC.apps.createNewApp.bundleId.InfoText');
            $scope.noBundleIdText = $scope.l10n.interpolate('ITC.apps.createNewApp.noBundleIdiOS');
          } else if ($scope.createAppDetails.newApp.appType === "Mac OS X App") {
            $scope.createBundleIdText = $scope.l10n.interpolate('ITC.apps.createNewApp.bundleId.InfoTextMac');
            $scope.noBundleIdText = $scope.l10n.interpolate('ITC.apps.createNewApp.noBundleIdMac');
          }

    			$scope.origAppDetails = angular.copy($scope.createAppDetails);
    			$scope.createAppDataLoaded = true;
      	}
      	$scope.$watch('referenceData',function() {
      		if ($scope.referenceData !== undefined && $scope.referenceData !== null) {
                $scope.languages = _.pairs($scope.referenceData.detailLanguages);
                $scope.languages = _.sortBy($scope.languages,function(lang){
                    return lang[1];
                })
      		}
      	});

      	$scope.$watch('modalcontent.showCreateNewAppModal',function(val){
        	if (val && $scope.modalcontent.appType !== undefined && $scope.modalcontent.appType !== null) {
                if ($scope.modalcontent.appType == "ios") {
                    $scope.modalTitle = $scope.l10n['ITC.apps.createNewApp.modalTitle'];
                } else {
                    $scope.modalTitle = $scope.l10n['ITC.apps.createNewApp.modalTitleMac'];
                }
        		$scope.loadCreateAppDetails();
        	}
        });

    	$scope.checkBundleType = function() {
    		if ($scope.createAppDetails.newApp.bundleId.value !== undefined && $scope.createAppDetails.newApp.bundleId.value !== null && $scope.createAppDetails.newApp.bundleId.value !== "") {
    			if ($scope.createAppDetails.newApp.bundleId.value.match(/.*\*/)) {
    				$scope.bundleIsWildcard = true;
    				$scope.createAppDetails.newApp.bundleIdSuffix.value = "";
    			} else {
    				$scope.bundleIsWildcard = false;
    			}
    		} else {
    			$scope.bundleIsWildcard = false;
    		}
    	}

    	$scope.$watch('createAppDetails.newApp.bundleIdSuffix.value',function(val){
    		if ($scope.createAppDetails !== undefined && $scope.createAppDetails.newApp !== undefined && $scope.createAppDetails.newApp.bundleId.value !== undefined && $scope.createAppDetails.newApp.bundleId.value !== null && $scope.createAppDetails.newApp.bundleIdSuffix !== null && $scope.createAppDetails.newApp.bundleIdSuffix.value !== undefined && $scope.createAppDetails.newApp.bundleIdSuffix.value !== null) {
  	      		$scope.bundleIdComposite = $scope.createAppDetails.newApp.bundleId.value.replace("*","") + $scope.createAppDetails.newApp.bundleIdSuffix.value;
  	      	} else {
              $scope.bundleIdComposite = "";
  	      	}
    	});

        $scope.saveApp = function() {
            $scope.createAppDataSaving = true;
            createAppService.create($scope.modalcontent.appType,$scope.createAppDetails).then(function(data){
                if (data.status == "500") {
                    $scope.createAppDataSaving = false;
                    $scope.showError = true;
                    $scope.errorText = [];
                    $scope.errorText.push($scope.l10n.interpolate("ITC.apps.createNewApp.problemCreatingApp"));
                } else {
                    if(data.data.newApp.adamId === null) {
                        $scope.setUpModalValues(data.data);
                        $scope.createAppDataSaving = false;
                        $scope.showError = true;
                        $scope.errorText = $scope.createAppDetails.sectionErrorKeys;
                    } else {
                        $scope.createAppDataSaving = false;
                        $location.path('/app/'+data.data.newApp.adamId);
                    }

                    
                }
            });
        };
        
    }
	itcApp.register.controller('createAppController', ['$scope','createAppService','$location', createAppController]);
    
});

