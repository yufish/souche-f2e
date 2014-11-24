/************************************************************************************************************************/
/********************************************** submit_for_review_cntrl.js **********************************************/
/************************************************************************************************************************/

'use strict';
define(['app'], function (itcApp) {

    var submitReviewController = function ($scope,$location, $timeout, $rootScope,$routeParams,$route,saveVersionService,appVersionReferenceDataService,$upload) {
    	

        $scope.cancelSubmitForReview = function() {
            //return to "version" view
            //$rootScope.tempPageContent.submittingForReview = false; 
            //$scope.submitForReviewInProgress = false;
            $scope.tempPageContent.showSubmitForReviewError = false;
            //$scope.tempPageContent.scrollnow = true; 
            $scope.$emit('cancellingSubmitForReview');
        }

        $scope.isFormForcedInvalid = function() {
            if ($scope.submitForReviewAnswers !== undefined) {
                if ($scope.submitForReviewAnswers.contentRights !== null) {
                    if ($scope.submitForReviewAnswers.contentRights.containsThirdPartyContent.value === "true" && $scope.submitForReviewAnswers.contentRights.hasRights.value === "false") {
                        return true;
                    }
                }
                if ($scope.disableSaveForCcat) {
                    return true;
                }

                /*if ($scope.submitForReviewAnswers.previousPurchaseRestrictions.significantIssue.value === 'true') {
                    var keytracker = true;
                    angular.forEach($scope.submitForReviewAnswers.previousPurchaseRestrictions.previousVersions,function(value,key) {
                        if (value.disableDownload.value === true) {
                            keytracker = false;
                        }
                    });
                    return keytracker;
                }*/

                if ($scope.submitForReviewAnswers.adIdInfo !== null && $scope.submitForReviewAnswers.adIdInfo.usesIdfa.value === "true") {
                    //idfa - must have at least one.
                    var keytracker = true;
                    if ($scope.submitForReviewAnswers.adIdInfo.servesAds.value) {
                        keytracker = false;
                    } else if ($scope.submitForReviewAnswers.adIdInfo.tracksInstall.value) {
                        keytracker = false;
                    } else if ($scope.submitForReviewAnswers.adIdInfo.tracksAction.value) {
                        keytracker = false;
                    }
                    if (!$scope.submitForReviewAnswers.adIdInfo.limitsTracking.value) {
                        keytracker = true;
                    }
                    return keytracker;
                }
                return false;
            }
        }

        $scope.fixBooleanData = function() {
            if ($scope.submitForReviewAnswers.contentRights.containsThirdPartyContent.value === true) {
                $scope.submitForReviewAnswers.contentRights.containsThirdPartyContent.value = "true";
            } else if ($scope.submitForReviewAnswers.contentRights.containsThirdPartyContent.value === false) {
                $scope.submitForReviewAnswers.contentRights.containsThirdPartyContent.value = "false";
            }

            if ($scope.submitForReviewAnswers.contentRights.hasRights && $scope.submitForReviewAnswers.contentRights.hasRights.value === true) {
                $scope.submitForReviewAnswers.contentRights.hasRights.value = "true";
            } else if ($scope.submitForReviewAnswers.contentRights.hasRights && $scope.submitForReviewAnswers.contentRights.hasRights.value === false) {
                $scope.submitForReviewAnswers.contentRights.hasRights.value = "false";
            }

            if ($scope.submitForReviewAnswers.adIdInfo.usesIdfa.value === true) {
                $scope.submitForReviewAnswers.adIdInfo.usesIdfa.value = "true";
            } else if ($scope.submitForReviewAnswers.adIdInfo.usesIdfa.value === false) {
                $scope.submitForReviewAnswers.adIdInfo.usesIdfa.value = "false";
            }

            if ($scope.submitForReviewAnswers.adIdInfo.servesAds.value === true) {
                $scope.submitForReviewAnswers.adIdInfo.servesAds.value = "true";
            } else if ($scope.submitForReviewAnswers.adIdInfo.servesAds.value === false) {
                $scope.submitForReviewAnswers.adIdInfo.servesAds.value = "false";
            }

            if ($scope.submitForReviewAnswers.adIdInfo.tracksInstall.value === true) {
                $scope.submitForReviewAnswers.adIdInfo.tracksInstall.value = "true";
            } else if ($scope.submitForReviewAnswers.adIdInfo.tracksInstall.value === false) {
                $scope.submitForReviewAnswers.adIdInfo.tracksInstall.value = "false";
            }

            if ($scope.submitForReviewAnswers.adIdInfo.tracksAction.value === true) {
                $scope.submitForReviewAnswers.adIdInfo.tracksAction.value = "true";
            } else if ($scope.submitForReviewAnswers.adIdInfo.tracksAction.value === false) {
                $scope.submitForReviewAnswers.adIdInfo.tracksAction.value = "false";
            }

            if ($scope.submitForReviewAnswers.adIdInfo.limitsTracking.value === true) {
                $scope.submitForReviewAnswers.adIdInfo.limitsTracking.value = "true";
            } else if ($scope.submitForReviewAnswers.adIdInfo.limitsTracking.value === false) {
                $scope.submitForReviewAnswers.adIdInfo.limitsTracking.value = "false";
            }
        }

        /** export compliance handling... */
        $scope.shouldShowUsesEncryption = function() {
            if ($scope.submitForReviewAnswers) {
                if ($scope.submitForReviewAnswers.exportCompliance.usesEncryption === null || !$scope.submitForReviewAnswers.exportCompliance.exportComplianceRequired) {
                    return false;
                } else {
                    if ($scope.submitForReviewAnswers.exportCompliance.encryptionUpdated !== undefined && $scope.submitForReviewAnswers.exportCompliance.encryptionUpdated !== null) {
                        if ($scope.submitForReviewAnswers.exportCompliance.encryptionUpdated.value === "true") {
                            return true;
                        } else if ($scope.submitForReviewAnswers.exportCompliance.encryptionUpdated.value === "false") {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
        $scope.shouldShowIsExempt = function() {
            if ($scope.submitForReviewAnswers) {
                if (!$scope.submitForReviewAnswers.exportCompliance.exportComplianceRequired) {
                    return false;
                } else if ($scope.submitForReviewAnswers.exportCompliance.usesEncryption === null) {
                    return true;
                } else {
                    if ($scope.submitForReviewAnswers.exportCompliance.encryptionUpdated !== undefined && $scope.submitForReviewAnswers.exportCompliance.encryptionUpdated !== null) {
                        if ($scope.submitForReviewAnswers.exportCompliance.encryptionUpdated.value === "true" && $scope.submitForReviewAnswers.exportCompliance.usesEncryption.value === "true") {
                            return true;
                        } else if ($scope.submitForReviewAnswers.exportCompliance.encryptionUpdated.value === "false" || $scope.submitForReviewAnswers.exportCompliance.usesEncryption.value === "false") {
                            return false;
                        }
                    } else {
                        if ($scope.submitForReviewAnswers.exportCompliance.usesEncryption !== undefined) {
                            if ($scope.submitForReviewAnswers.exportCompliance.usesEncryption.value === "true") {
                                return true;
                            } else if ($scope.submitForReviewAnswers.exportCompliance.usesEncryption.value === "false") {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        $scope.resetAfter = function(start) {
            switch(start) {
                case 1:
                    $scope.submitForReviewAnswers.exportCompliance.usesEncryption.value = "";
                case 2:
                    $scope.submitForReviewAnswers.exportCompliance.isExempt.value = ""
                case 3:
                    $scope.submitForReviewAnswers.exportCompliance.containsProprietaryCryptography.value = "";
                case 4:
                    $scope.submitForReviewAnswers.exportCompliance.containsThirdPartyCryptography.value = "";
                case 5:
                    $scope.submitForReviewAnswers.exportCompliance.availableOnFrenchStore.value = "";
                    $scope.showCcat(false);
            }
        }
        $scope.ccatFileUpload = function() {
            if ($scope.tempPageContent.ccatFile !== undefined && $scope.tempPageContent.ccatFile !== null) {
                $scope.tempPageContent.ccatFileInProgress = true;
                $scope.ccatFileUploading = $upload.upload({
                    url: $scope.referenceData.directUploaderUrls.arbitraryFileUrl, 
                    method: 'POST',
                    headers: {'Content-Type': $scope.tempPageContent.ccatFile.type,
                              'X-Apple-Upload-Referrer': window.location.href,
                              'X-Apple-Upload-AppleId': $scope.adamId,
                              'X-Apple-Upload-Correlation-Key': $scope.submitForReviewAnswers.exportCompliance.appType + ":AdamId=" + $scope.adamId + ":Version=" + $scope.versionInfo.preReleaseBuildVersionString.value,
                              'X-Apple-Upload-itctoken': $scope.appVersionReferenceData.ssoTokenForImage,
                              'X-Apple-Upload-ContentProviderId': $scope.user.contentProviderId,
                              'X-Original-Filename': $scope.tempPageContent.ccatFile.name
                             },
                    file: $scope.tempPageContent.ccatFile
                }).progress(function(evt) {
                    //$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    $scope.addCcatFileToJson(data)
                    $scope.tempPageContent.ccatFileInProgress = false;                   

                }).error(function(data, status, headers, config) {
                    if (data) {
                       var locErrorKey = "ITC.apps.validation."+ data.suggestionCode.toLowerCase();
                        var errorToShow = $scope.l10n[locErrorKey];
                        if ($scope.l10n[locErrorKey] === undefined) {
                            errorToShow = $scope.l10n['ITC.AppVersion.GeneralInfoSection.TransitApp.FileNotLoaded'];
                        } 
                    } else {
                        var errorToShow = $scope.l10n['ITC.AppVersion.DUGeneralErrors.FileNotLoaded'];
                    }
                    $scope.tempPageContent.ccatFileInProgress = false;
                    $scope.simpleFileDropErrors.error = errorToShow;
                    $scope.setIsSaving(false);
                    $scope.exportSaving = false;
                });
            }
        }
        $scope.addCcatFileToJson = function(data) {
            $scope.tempPageContent.iconLabel = $scope.showFileTypeForIcon($scope.tempPageContent.ccatFile.type);
            $scope.submitForReviewAnswers.exportCompliance.ccatFile.value = {};
            $scope.submitForReviewAnswers.exportCompliance.ccatFile.value.fileType = $scope.tempPageContent.ccatFile.type;
            $scope.submitForReviewAnswers.exportCompliance.ccatFile.value.assetToken = data.token;
            $scope.submitForReviewAnswers.exportCompliance.ccatFile.value.url = null;
            $scope.submitForReviewAnswers.exportCompliance.ccatFile.value.name = $scope.tempPageContent.ccatFile.name;
        }
        $scope.showFileTypeForIcon = function(thefiletype) {
            if (thefiletype !== undefined && thefiletype !== null) {
                return thefiletype.slice(thefiletype.lastIndexOf('/') + 1);
            } else {
                return "";
            }
        }

        $scope.showCcat = function(showIt) {
            if (showIt) {
                $scope.tempPageContent.showCcatUpload = true;
            } else {
                $scope.tempPageContent.showCcatUpload = false;
            }
        }


        //watch if we're showing / hiding the ccat upload
        $scope.$watch('tempPageContent.showCcatUpload',function(){
            if ($scope.tempPageContent !== undefined && $scope.submitForReviewAnswers !== undefined && $scope.tempPageContent.showCcatUpload) {
                if ($scope.submitForReviewAnswers.exportCompliance.ccatFile.value !== null && $scope.submitForReviewAnswers.exportCompliance.ccatFile.value.name !== null) {
                    $scope.disableSaveForCcat = false;
                } else {
                    $scope.disableSaveForCcat = true;
                }
            } else {
                $scope.disableSaveForCcat = false;
            }
        });
        //now watch if we've uploaded a file and modify if saving/disabled...
        $scope.$watch('submitForReviewAnswers.exportCompliance.ccatFile.value',function(){
            if ($scope.tempPageContent !== undefined && $scope.submitForReviewAnswers !== undefined && $scope.tempPageContent.showCcatUpload) {
                if ($scope.submitForReviewAnswers.exportCompliance.ccatFile.value !== null && $scope.submitForReviewAnswers.exportCompliance.ccatFile.value.name !== null) {
                    $scope.disableSaveForCcat = false;
                } else {
                    $scope.disableSaveForCcat = true;
                }
            } else {
                $scope.disableSaveForCcat = false;
            }
        });


        $scope.finalizeSubmitForReview = function() {
            $scope.setIsSaving(true);
            $scope.finalizeSubmitForReviewInProgress = true;
            saveVersionService.finalizeSubmitForReview($scope.adamId,$scope.submitForReviewAnswers).then(function(data) {
                    $scope.finalizeSubmitForReviewInProgress = false;
                    $scope.setIsSaving(false);
                    if (data.status == "500") {
                        $scope.setIsSaving(false);
                        $scope.submitForReviewInProgress = true;
                        $scope.tempPageContent.showSubmitForReviewError = true;
                        $scope.tempPageContent.scrollnow = true;
                    } else {
                        if (data.data.exportCompliance.sectionErrorKeys.length > 0 || (data.data.adIdInfo && data.data.adIdInfo.sectionErrorKeys && data.data.adIdInfo.sectionErrorKeys.length > 0)) {
                            $scope.setIsSaving(false);
                            $scope.submitForReviewAnswers = data.data;
                            $scope.fixBooleanData();
                            $scope.submitForReviewInProgress = true;
                            $scope.tempPageContent.scrollnow = true;
                        } else {
                           $route.reload(); 
                        }

                                 
                    }
                });
        }



        var init = function() {
            $scope.isMacApp = $scope.versionInfo.appType == "Mac OS X App" ? true : false;

            $scope.tempPageContent = {
                "ccatFile": "",
                "ccatFileInProgress":false,
                "exportInfoLoaded":false,
                "showCcatUpload":false,
                "showConfirmLeaveExportCompliance":false,
                "needToConfirmLeave":false,
                "confirmLeaveExportComp": {},
                "exportScrollnow":false,
                "expNoChangesMade":true,
                "submitForReviewFieldsRequired": true,
                "showSubmitForReviewError":false
            }
            $scope.simpleFileDropErrors = {
                "error":false
            }
            $scope.disableSaveForCcat = false;


            $scope.pageHasLoadedOnce = false;
            $scope.finalizeSubmitForReviewInProgress = false;

            //format IDFA block
            $scope.$parent.$watch('parentScopeLoaded',function() {
                if ($scope.parentScopeLoaded) {
                    $scope.tempPageContent.limitAdTrackingText = $scope.l10n.interpolate('ITC.AppVersion.SubmitForReview.IDFA.limitAdTracking',{'username':$scope.user.displayName});
                }
            });

            $scope.shouldShowEncryptionUpdated = true;
            if ($scope.submitForReviewAnswers.exportCompliance.encryptionUpdated === null) {
                $scope.shouldShowEncryptionUpdated = false;
            }

            if ($scope.submitForReviewAnswers.exportCompliance.ccatFile !== null && $scope.submitForReviewAnswers.exportCompliance.ccatFile.value !== null) {
                $scope.tempPageContent.iconLabel = $scope.showFileTypeForIcon($scope.submitForReviewAnswers.exportCompliance.ccatFile.value.fileType);
            }
            //do we show CCAT file?
            if ($scope.submitForReviewAnswers.exportCompliance.isExempt && $scope.submitForReviewAnswers.exportCompliance.isExempt.value === 'false' && 
                $scope.submitForReviewAnswers.exportCompliance.containsProprietaryCryptography.value != "" && (
                ($scope.submitForReviewAnswers.exportCompliance.containsThirdPartyCryptography.value === "true" && $scope.submitForReviewAnswers.exportCompliance.availableOnFrenchStore.value != "")
                || $scope.submitForReviewAnswers.exportCompliance.containsThirdPartyCryptography.value === "false")) {
                $scope.tempPageContent.showCcatUpload = true;
            } else {
                $scope.tempPageContent.showCcatUpload = false;
            }

        }
        $scope.$on('submittedForReview',function() {
            appVersionReferenceDataService.async().then(function(data) {
                $scope.appVersionReferenceData = data.data;
                init();
            });
            
        });



    }

    itcApp.register.controller('submitReviewController', ['$scope','$location','$timeout','$rootScope','$routeParams','$route','saveVersionService','appVersionReferenceDataService','$upload', submitReviewController]);
    
});

