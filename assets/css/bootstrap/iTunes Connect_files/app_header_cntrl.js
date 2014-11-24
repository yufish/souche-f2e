/************************************************************************************************************************/
/************************************************* app_header_cntrl.js **************************************************/
/************************************************************************************************************************/

'use strict';
define(['app'], function (itcApp) {

    var appHeaderController = function ($scope, appDetailsService,$routeParams,$route,$rootScope,$sce,updateAppService, deleteAppService, $location) {

    	$scope.loadAppDetails = function() {
            //adding this to ensure we have all pagewrapper JSONs before loading app details...
        	appDetailsService.async($scope.adamId).then(function(data) {
                if (data.status == "500") {
                    //$scope.apploaded = true;
                    //$scope.setisReady();
                    //$scope.tempPageContent.showAdditionalError = true;
                    //$scope.tempPageContent.messageDisplaying = true;
                    //$scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.AppNotLoaded');
                    $scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.AppNotLoaded');
                    $scope.$emit("appHeaderLoaded",$scope.tempPageContent.additionalError);

                } else {
                    $scope.$parent.$watch('parentScopeLoaded',function() {
                        if ($scope.parentScopeLoaded) {
                            $rootScope.appPageHeader = data.data;
                            $scope.$emit("appHeaderLoaded",false);
                            if ($rootScope.appPageHeader.appType === "Mac OS X App") {
                                $scope.appType = "Mac";
                            } else if ($rootScope.appPageHeader.appType === "iOS App") {
                                $scope.appType = "iOS";
                            } else {
                                $scope.appType = $rootScope.appPageHeader.appType;
                            }
                            $scope.initViewBundles();
                        }
                    });
                }
			});
        }

        // Creates a link in the "more" menu, given an actionObj object that looks something like:
        // {
        //    link: "/WebObjects/iTunesConnect.woa/ra/apps/delete/691608533", 
        //    text: "ITC.apps.section.DeleteApp", 
        //    $$hashKey: "065"
        // } 
        $scope.createActionLink = function(actionObj) {
            // create an id so we can capture events
            var id = actionObj.text.replace(/\./g, ''); // remove "."s
            
            var htmlStr = "<a id='" + id + "'>" + $scope.l10n.interpolate(actionObj.text) + "</a>";
            return $sce.trustAsHtml(htmlStr); 
        }; 

        // Called when an action link from the "more" menu is clicked.
        $scope.actionLinkMenuClicked = function(e) {
            var menuItem = e.target;
            var deleteKey = "ITC.apps.section.DeleteApp";
            var transferKey = "ITC.apps.section.TransferApp";
            var deleteID = deleteKey.replace(/\./g, ''); // remove "."s
            var transferID = transferKey.replace(/\./g, ''); // remove "."s
            if (menuItem.id === deleteID) {
                $scope.appHeaderTempData.showDeleteAppModal = true;
            }
            else if (menuItem.id === transferID) {
                $scope.transferApp();
            }
            else {
                // tbd: handle another menu item.
                console.log("menu item: " + menuItem.innerHtml + " clicked.");
            }
        };

        // Called when the user clicks "Delete" on the delete modal.
        $scope.deleteApp = function () {
            var deletePageActionObj = $scope.getDeletePageAction();
            var link = deletePageActionObj.link;
            deleteAppService.delete(link).then(function(data){
                if (data.statusCode === "SUCCESS") {
                    $scope.appHeaderTempData.showDeleteAppModal = false;
                    $location.path('/app'); // redirect to MYA page
                }
                else if (data.status == "500") { // happens on apps that have in-app purchases
                    data = data.data; // weird, I know.
                    if (data.messages) {
                        $scope.deleteError = data.messages.error.join(" "); // because error is an array
                    }
                    else {
                        $scope.deleteError = $scope.l10n.interpolate('ITC.apps.deleteApp.generalError');   
                    }
                    $scope.showDeleteError = true;
                }
                else {
                    console.info("Failed to delete app: ", data);
                    if (data.messages) {
                        $scope.deleteError = data.messages.error.join(" "); // because error is an array
                    }
                    else {
                        $scope.deleteError = $scope.l10n.interpolate('ITC.apps.deleteApp.generalError');   
                    }
                    $scope.showDeleteError = true; 
                }
            });
        };

        // Called when the user clicks "Transfer App" in the "more menu".
        $scope.transferApp = function () {
            //console.log("transfer clicked.");
            var transferPageActionObj = $scope.getTransferPageAction();
            var link = transferPageActionObj.link;
            //console.log("transfer link: " + link);
            window.location.href=link;
        };

        $scope.getDeletePageAction = function() {
            return $scope.getPageAction("ITC.apps.section.DeleteApp");
        };

        $scope.getTransferPageAction = function() {
            return $scope.getPageAction("ITC.apps.section.TransferApp");
        };
        
        $scope.getPageAction = function(type) {
            var appPageHeader = $rootScope.appPageHeader;
            if (appPageHeader) {
                var appPageActionLinks = appPageHeader.appPageActionLinks;
                if (appPageActionLinks) {
                    var appPageAction;
                    for (var i = 0; i < appPageActionLinks.length; i++) {
                        appPageAction = appPageActionLinks[i];
                        if (appPageAction.text === type) {
                            return appPageAction;
                        }
                    }
                }
            }
            return null;
        };

        $scope.loadAboutAppDetails = function() {
            updateAppService.load($scope.adamId).then(function(data){
                $scope.aboutThisAppDataLoaded = true;
                $scope.AboutAppDetails = data.data;
                $scope.setUpAboutThisAppValues();
            });
        }
        $scope.setUpAboutThisAppValues = function(updatedDetails) {
            if (updatedDetails !== undefined) {
                $scope.AboutAppDetails = updatedDetails;
            }
            $scope.sortAvailableLanguages();
            if ($scope.AboutAppDetails.app.bundleId.isEditable || ($scope.AboutAppDetails.app.primaryLanguage.isEditable && $scope.languages.length > 1)) {
                $scope.aboutAppIsEditable = true;
            }
            $scope.checkBundleType();
            $scope.origAppDetails = angular.copy($scope.AboutAppDetails);
        }
        //setup languages for language dropdown in "about this app" modal
        $scope.sortAvailableLanguages = function() {
            $scope.languages = _.pairs($scope.AboutAppDetails.availableLanguages);
            $scope.languages = _.sortBy($scope.languages,function(lang){
                return lang[1];
            })
        }
        $scope.checkBundleType = function() {
            if ($scope.AboutAppDetails.app.bundleId.value !== undefined && $scope.AboutAppDetails.app.bundleId.value !== null && $scope.AboutAppDetails.app.bundleId.value !== "") {
                if ($scope.AboutAppDetails.app.bundleId.value.match(/.*\*/)) {
                    $scope.bundleIsWildcard = true;
                    //$scope.AboutAppDetails.app.bundleIdSuffix = "";
                } else {
                    $scope.bundleIsWildcard = false;
                    $scope.AboutAppDetails.app.bundleIdSuffix.value = "";
                }
            } else {
                $scope.bundleIsWildcard = false;
            }
        }
        $scope.$watch('AboutAppDetails.app.bundleIdSuffix.value',function(val){
            if ($scope.AboutAppDetails !== undefined && $scope.AboutAppDetails.app.bundleId.value !== undefined && $scope.AboutAppDetails.app.bundleId.value !== null && $scope.AboutAppDetails.app.bundleIdSuffix !== null && $scope.AboutAppDetails.app.bundleIdSuffix.value !== null) {
                $scope.bundleIdComposite = $scope.AboutAppDetails.app.bundleId.value.replace("*","") + $scope.AboutAppDetails.app.bundleIdSuffix.value;
            }
        });
        $scope.$watch('AboutAppDetails',function(val){
            if ($scope.origAppDetails !== undefined && angular.toJson($scope.origAppDetails) !== angular.toJson($scope.AboutAppDetails)) {
                $scope.modalupdated = true;
            } else {
                $scope.modalupdated = false;
            }
        },true);
        $scope.getReadOnlyBundleId = function() {
            //console.log("$scope.AboutAppDetails.app.bundleIdSuffix "+ $scope.AboutAppDetails.app.bundleIdSuffix)
            if ($scope.AboutAppDetails !== undefined && $scope.AboutAppDetails.app.bundleId.value !== undefined && $scope.AboutAppDetails.app.bundleId.value !== null && $scope.AboutAppDetails.app.bundleIdSuffix !== undefined && $scope.AboutAppDetails.app.bundleIdSuffix !== null && $scope.AboutAppDetails.app.bundleIdSuffix !== "" && $scope.AboutAppDetails.app.bundleId.value.match(/.*\*/)) {
                //combined bundle id value
                return  $scope.AboutAppDetails.app.bundleId.value.replace("*","") + $scope.AboutAppDetails.app.bundleIdSuffix.value;
            } else if ($scope.AboutAppDetails !== undefined && $scope.AboutAppDetails.app.bundleId.value !== undefined && $scope.AboutAppDetails.app.bundleId.value !== null && !$scope.AboutAppDetails.app.bundleId.value.match(/.*\*/)) {
                //non wildcard bundleid returned...
                return  $scope.AboutAppDetails.app.bundleId.value;
            } else {
                //return nothing - important values may be null
                return "";
            }
            
        }
        $scope.saveAboutThisApp = function() {
            $scope.aboutAppDataSaving = true;
            $scope.AboutAppDetails.app.appPageActionLinks = null;
            $scope.AboutAppDetails.app.appPageMoreLinks = null;
            $scope.AboutAppDetails.app.appPageSectionLinks = null;
            //console.log("SENDING DATA: ",$scope.AboutAppDetails);
            //...save $scope.AboutAppDetails
            updateAppService.save($scope.adamId,$scope.AboutAppDetails).then(function(data){
                console.log("Data in return: ",data.data)
                if (data.data.sectionErrorKeys === null || data.data.sectionErrorKeys.length <= 0) {
                    //success
                    $scope.aboutAppDataSaving = false;
                    $scope.appHeaderTempData.showAboutThisApp = false;
                    $route.reload();
                } else {
                    //issues keep modal open - load data...
                    $scope.aboutAppDataSaving = false;
                    $scope.setUpAboutThisAppValues(data.data);
                }
            });
        }

        //some data from page may require a refresh - listening for event then reloading data...
        $scope.$on('reloadappheader',function(){
            $scope.loadAppDetails();
        });

        /*$scope.returnAppIconUrl = function() {
            if ($scope.appPageHeader.liveVersion !== undefined && $scope.appPageHeader.liveVersion !== null) {
                if ($scope.appPageHeader.liveVersion.largeAppIcon.fullSizeUrl === null) {
                    return "/itc/images/layoutelements/app_icon_placeholder.png";
                } else {
                    return $scope.appPageHeader.liveVersion.largeAppIcon.fullSizeUrl;
                }
            }
        }*/

        $scope.showAboutThisApp = function() {
            if ($scope.tempPageContent !== undefined && $scope.tempPageContent.confirmLeave !== undefined && $scope.tempPageContent.confirmLeave.needToConfirm !== undefined && $scope.tempPageContent.confirmLeave.needToConfirm === true) {
                $scope.appHeaderTempData.showConfirmLeaveModal = true;
            } else {
                $scope.appHeaderTempData.showAboutThisApp = true;
                $scope.aboutThisAppDataLoaded = false;
                $scope.loadAboutAppDetails();
            }
        }
        $scope.openAboutThisApp = function() {
            $scope.appHeaderTempData.showAboutThisApp = true;
            $scope.aboutThisAppDataLoaded = false;
            $scope.appHeaderTempData.showConfirmLeaveModal = false;
            $scope.loadAboutAppDetails();
        }
        $scope.closeConfirmModal = function() {
            $scope.appHeaderTempData.showAboutThisApp = false;
            $scope.aboutThisAppDataLoaded = false;
            $scope.appHeaderTempData.showConfirmLeaveModal = false;
        }
        // Closes the closets enclosing open popover
        $scope.closePopup = function(e) {
            var popup = $(e.target).closest(".open");
            popup.removeClass("open");
        }
        $scope.saveVersionPage = function() {
            $scope.appHeaderTempData.showAboutThisApp = false;
            $scope.aboutThisAppDataLoaded = false;
            $scope.appHeaderTempData.showConfirmLeaveModal = false;
            $scope.saveVersionDetails(); //calling save function from version page
        }

        /**
         * Methods for dealing with view bundle link in More menu logic.
         * Shows a single link if only in a single bundle. Shows a table in a lightbox if in more than one. 
         */
        $scope.initViewBundles = function() {
            if ($scope.tempPageContent) $scope.tempPageContent.showAppInBundlesModal = false;

            if ($rootScope.appPageHeader.bundleSummaryInfo && $rootScope.appPageHeader.bundleSummaryInfo.length > 1) {
                $rootScope.appPageHeader.appPageMoreLinks.push({'link': '#', 'text': 'ITC.apps.section.AppBundles'});
            }
        }
        
        $scope.aboutAppIsEditable = false;
        $rootScope.appPageHeader = {};
        $scope.aboutThisAppDataLoaded = false;
        $scope.appHeaderTempData = {
            "showAboutThisApp":false
        };
        $scope.aboutAppDataSaving = false;
        if ($routeParams.adamId) {
            $scope.adamId = $routeParams.adamId;    
            $scope.loadAppDetails();
        }

    }
	itcApp.register.controller('appHeaderController', ['$scope','appDetailsService','$routeParams','$route','$rootScope','$sce', 'updateAppService', 'deleteAppService', '$location', appHeaderController]);
     
});

