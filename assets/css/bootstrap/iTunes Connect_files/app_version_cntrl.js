/************************************************************************************************************************/
/************************************************* app_version_cntrl.js *************************************************/
/************************************************************************************************************************/

'use strict';
define(['app'], function (itcApp) {

    var appVersionController = function ($scope,$location, $timeout, $rootScope,$routeParams, appDetailsService, appVersionReferenceDataService, saveVersionDetailsService, saveVersionService, sharedProperties,linkManager,$sce, $upload,filterFilter, $filter, createAppVersionService, devRejectAppService, $route) {

        window.scope = $scope;

        $scope.setisReady = function() {
            if ($scope.apploaded && $scope.versionloaded) {
                $rootScope.isReady = true;
                $rootScope.wrapperclass = "nonfixedheader"; //moved this here so header isn't scrollable while page is loading...make header scroll away - so we can use fixed "action bar"
            } else {
                $rootScope.isReady = false;
            }
        }

        $scope.$on('appHeaderLoaded',function(event,data){

             //do anything needed with appHeaderInfo...


            //links should be formatted like:
            /*
            [{"link": "/page.html", "text": "page link","external":true,"current":true}, {"link": "/page2.html", "text": "page 2 link"}]
            */
            $scope.appPageHeaderBreadcrumbs =  [{"link": global_itc_home_url + "/app", "text": $scope.l10n.interpolate('ITC.HomePage.ManagePurpleSoftwareLinkText')}]
            $scope.mainNavCurrentKey = 'ITC.AppVersion.MainNav.Versions';

            //determine sub nav location...
            if ($routeParams.ver && $routeParams.ver === "cur") {
                $scope.isLiveVersion = true;
            } else if ($rootScope.appPageHeader.inFlightVersion === null) {
                $scope.isLiveVersion = true;
            } else {
                $scope.isInFlightVersion = true;
            }

            if (data) {
                //error loading app header
                $scope.tempPageContent.showAdditionalError = true;
                $scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.AppNotLoaded');
            }

            $scope.canAddNewVersion = $rootScope.appPageHeader.canAddVersion;

            $scope.apploaded = true;
            $scope.setisReady();

            //Watch for info messages (could appear on appheader reloads)
            $rootScope.$watch('appPageHeader',function(){
                $scope.appheaderInfoMessages = $rootScope.appPageHeader.sectionInfoKeys;
            });
            
        });

        // saves/displays errors if the given updatedVersionInfo has snapshot errors.
        $scope.checkForSnapshotErrors = function(updatedVersionInfo) {
            var screenshotsArr, screenshot, langErrorKeys, deviceErrorKeys, details, device, screenshotSpecificErrors, langStr;
            for (var language = 0; language < updatedVersionInfo.details.value.length; language++) {
                langStr = $scope.getLanguageString(language);
                details = updatedVersionInfo.details.value[language].screenshots.value;
                langErrorKeys = updatedVersionInfo.details.value[language].screenshots.errorKeys;

                // clear out previous language specific error
                $scope.allImages.setLanguageSpecificError(langStr, null);

                if (langErrorKeys && langErrorKeys.length>0) {
                    //console.log("LANGUAGE SNAPSHOT ERROR: (" + langErrorKeys.length + "): " + langErrorKeys.join(", "));
                    $scope.allImages.setLanguageSpecificError(langStr, langErrorKeys.join(", "));
                }

                for (var deviceIndex = 0; deviceIndex < $scope.deviceNames.length; deviceIndex++) {
                    device = $scope.deviceNames[deviceIndex];
                    deviceErrorKeys = updatedVersionInfo.details.value[language].screenshots.value[device].errorKeys;

                    // clear out previous device specific error
                    $scope.allImages.setLanguageDeviceSpecificError(langStr, device, null);

                    if (deviceErrorKeys && deviceErrorKeys.length>0) {
                        //console.log("DEVICE SNAPSHOT ERROR: (" + deviceErrorKeys.length + "): " + deviceErrorKeys.join(", "));
                        $scope.allImages.setLanguageDeviceSpecificError(langStr, device, deviceErrorKeys.join(", "));
                    }

                    screenshotsArr = updatedVersionInfo.details.value[language].screenshots.value[device].value;
                    for (var screenshotIndex = 0; screenshotIndex < screenshotsArr.length; screenshotIndex++) {
                        screenshot = screenshotsArr[screenshotIndex];

                        // clear out previous snapshot specific error
                        $scope.allImages.setError(langStr, language, device, screenshot.value.sortOrder, null);

                        if (screenshot.errorKeys) {
                            //console.log("SCREENSHOT SPECIFIC ERROR: " + screenshot.errorKeys + " at sortOrder: " + screenshot.value.sortOrder);
                            screenshotSpecificErrors = screenshot.errorKeys.join(", ");
                            $scope.allImages.setError(langStr, language, device, screenshot.value.sortOrder, screenshotSpecificErrors);
                        }
                    }
                }

            }
        };

        $scope.checkForVideoErrors = function(updatedVersionInfo) {
            if ($scope.referenceData.appPreviewEnabled) {
                var screenshotsArr, screenshot, langErrorKeys, deviceErrorKeys, details, device, screenshotSpecificErrors, langStr, detailsByDevice;
                for (var language = 0; language < updatedVersionInfo.details.value.length; language++) {
                    langStr = $scope.getLanguageString(language);
                    details = updatedVersionInfo.details.value[language].appTrailers.value;
                    langErrorKeys = updatedVersionInfo.details.value[language].appTrailers.errorKeys;
                    if (langErrorKeys && langErrorKeys.length>0) {
                        //console.log("LANGUAGE VIDEO ERROR: (" + langErrorKeys.length + "): " + langErrorKeys.join(", "));
                        //$scope.allVideos.setLanguageSpecificError(langStr, langErrorKeys.join(", ")); 
                        $scope.allVideos.setLanguageSpecificError("ALL LANGUAGES", langErrorKeys.join(", ")); 
                    }

                    for (var deviceIndex = 0; deviceIndex < $scope.deviceNames.length; deviceIndex++) {
                        device = $scope.deviceNames[deviceIndex];
                        detailsByDevice = updatedVersionInfo.details.value[language].appTrailers.value[device];
                        if (detailsByDevice) {
                            deviceErrorKeys = detailsByDevice.errorKeys;
                            if (deviceErrorKeys && deviceErrorKeys.length>0) {
                                //console.log("DEVICE VIDEO ERROR: (" + deviceErrorKeys.length + "): " + deviceErrorKeys.join(", "));
                                //$scope.allVideos.setLanguageDeviceSpecificError(langStr, device, deviceErrorKeys.join(", "));
                                $scope.allVideos.setLanguageDeviceSpecificError("ALL LANGUAGES", device, deviceErrorKeys.join(", "));
                            }
                        }
                    }
                }
            }
        };

        // returns true if the given updatedVersionInfo has section errors.
        // used for snapshots
        $scope.updatedVersionInfoHasErrors = function(updatedVersionInfo) {
            return (updatedVersionInfo && 
                updatedVersionInfo.sectionErrorKeys !== undefined && 
                updatedVersionInfo.sectionErrorKeys !== null && 
                updatedVersionInfo.sectionErrorKeys.length > 0); 
        };

        /* **************************************************
        Info Message Handling (dev reject) Functions
        ************************************************** */
        // Called when anything in a blue info message is clicked. (Little workaround for not putting ng-clicks in the loc file)
        $scope.infoPageMessageClicked = function(e) {
            var link = e.target;
            if (link.id === "devRejectID") {
                $scope.tempPageContent.showDevRejectModal = true;
            }
            else {
                // tbd: handle another menu item.
                //console.log("something else in blue info message was clicked.");
            }
        };
        // Called when the reject button is clicked on the dev reject modal.
        $scope.devRejectApp = function() {
            $scope.devRejectInProcess = true;
            devRejectAppService.reject($scope.adamId).then(function(data){
                $scope.devRejectInProcess = false;
                if (data.status == "403") {
                    console.log('dev reject error?');
                    $scope.tempPageContent.showDevRejectError = true;
                    $scope.tempPageContent.devRejectError = data.data.messages.error.join(" ");
                } else {
                    // success!
                    $scope.tempPageContent.showDevRejectError = false;
                    $scope.tempPageContent.showDevRejectModal = false;
                    $route.reload();
                }

            });
        };

        $scope.shouldShowAppReviewSection = function() {
            if($scope.versionInfo) {
                var returnVal = false;
                //check all values in appreivew - return false if all are not editable and empty or null
                angular.forEach($scope.versionInfo.appReviewInfo,function(aprItem,aprItemKey){
                    if (aprItem.value !== null && aprItem.value !== '' && aprItem.value.length > 0) {
                        returnVal=true;
                    } else if (aprItem.isEditable) {
                        returnVal=true;
                    }
                });
                return returnVal;
            }
        }

        $scope.$watch('versionInfo',function() {
            $scope.checkRatingsErrors();
            //console.log("version info updated...");
            $scope.errorCheckingLocalizations();
            $scope.shouldSaveEnabled();
            //$scope.updateDevices();
        },true);
        $scope.$watch('tempPageContent.formErrors.count',function(){
            $scope.shouldSaveEnabled();
        },true);
        $scope.$watch('tempPageContent.errorTracker',function(){
            $scope.shouldSaveEnabled();
        },true);


        /* **************************************************
        CONFIRM LEAVE FUNCTIONS
        ************************************************** */
        /* On user navigating away - check if there are changes and popup message if there are */
        $scope.$on('$locationChangeStart', function (event, next, current) {
            if (!$scope.tempPageContent.confirmLeave.showConfirmLeaveModal) { //confirmLeave modal NOT showing at the moment...
                if($scope.tempPageContent.confirmLeave.needToConfirm) {
                    //don't allow user to leave just yet - confirm with popup - store next link to allow them to continue
                    event.preventDefault();
                    var exitpath = next.split(global_itc_home_url+"/");
                    $scope.tempPageContent.confirmLeave.userIsLeavingTO = exitpath[1]; //ra/ng //$location.url(next).hash()
                    $scope.tempPageContent.confirmLeave.showConfirmLeaveModal = true;
                }
            }
        });
        $scope.confirmLeaveModalFunctions = {};
        $scope.confirmLeaveModalFunctions.leavePage = function() {
            if ($scope.tempPageContent.confirmLeave.userIsLeavingTO === null || $scope.tempPageContent.confirmLeave.userIsLeavingTO === undefined || $scope.tempPageContent.confirmLeave.userIsLeavingTO === "") {
                $scope.tempPageContent.confirmLeave.userIsLeavingTO = "/";
            }
                $scope.tempPageContent.confirmLeave.showConfirmLeaveModal = false;
                $scope.tempPageContent.confirmLeave.needToConfirm = false;
                $location.url($scope.tempPageContent.confirmLeave.userIsLeavingTO); 
        }
        $scope.confirmLeaveModalFunctions.stayOnPage = function() {
            $scope.tempPageContent.confirmLeave.userIsLeavingTO = "";
            $scope.tempPageContent.confirmLeave.showConfirmLeaveModal = false;
        }
        $scope.confirmLeaveModalFunctions.saveChanges = function() {
            $scope.tempPageContent.confirmLeave.showConfirmLeaveModal = false;
            $scope.saveVersionDetails();
        }

        /* **************************************************
        Localization / Language Functions
        ************************************************** */
        /** HIGH LEVEL ERROR CHECKING **/
        var checkLocField = function(loc,field,origField,fieldKey,maxSize) {
            if (loc[field].isRequired && (loc[field].value === "" || loc[field].value === null  || loc[field].value === undefined)) {
                return true;
            } else if (loc[field].errorKeys !== null && loc[field].errorKeys.length > 0) {
                var origLoc = _.findWhere(origField,{"language":loc.language});
                if (origLoc !== undefined && origLoc !== null) {
                    if (angular.toJson(origLoc[field]) === angular.toJson(loc[field])) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else if (maxSize !== undefined && loc[field].value !== null && loc[field].value.length > maxSize) {
                return true;
            }
            return false;
        }
        //check specific fields in localization for content and server errors...
        $scope.errorCheckingLocalizations = function() {
            if ($scope.tempPageContent !== undefined) {
                $scope.tempPageContent.errorTracker = [];
                if ($scope.versionInfo !== undefined && $scope.versionInfo.details !== undefined && $scope.orignalVersionInfo !== undefined && $scope.versionInfo.details.value !== undefined && $scope.orignalVersionInfo.details.value !== undefined) {
                    angular.forEach($scope.versionInfo.details.value,function(loc,key){
                        var thisLocsHasErrors = false;
                        if (checkLocField(loc,"description",$scope.orignalVersionInfo.details.value,$scope.referenceData.appMetaDataReference.maxAppDescriptionChars)) {
                            thisLocsHasErrors = true;
                        }
                        if (checkLocField(loc,"keywords",$scope.orignalVersionInfo.details.value)) {
                            thisLocsHasErrors = true;
                        }
                        if (checkLocField(loc,"marketingURL",$scope.orignalVersionInfo.details.value)) {
                            thisLocsHasErrors = true;
                        }
                        if (checkLocField(loc,"name",$scope.orignalVersionInfo.details.value)) {
                            thisLocsHasErrors = true;
                        }
                        if (checkLocField(loc,"privacyURL",$scope.orignalVersionInfo.details.value)) {
                            thisLocsHasErrors = true;
                        }
                        if (checkLocField(loc,"releaseNotes",$scope.orignalVersionInfo.details.value,$scope.referenceData.appMetaDataReference.maxAppReleaseNotesChars)) {
                            thisLocsHasErrors = true;
                        }
                        if (checkLocField(loc,"supportURL",$scope.orignalVersionInfo.details.value)) {
                            thisLocsHasErrors = true;
                        }
                        if (hasMediaErrorsInLoc(key)) {
                            thisLocsHasErrors = true;
                        }
                        if (thisLocsHasErrors) {
                            $scope.tempPageContent.errorTracker.push(key);
                        }
                    });
                }
            }
        }
        $scope.doesLocHaveError = function(locKey) {
            if ($scope.tempPageContent.errorTracker !== "undefined") {
                $scope.errorCheckingLocalizations();
            }
            if (_.indexOf($scope.tempPageContent.errorTracker,locKey) >= 0) {
                return true;
            } else {
                return false;
            }
        }
        //returns the "details" key of language supplied. (or false if not present)
        $scope.getLanguageKey = function(langstring) {
            var langkey = false;
            angular.forEach($scope.versionInfo.details.value, function(value, key) {
                if (value.language === langstring) {
                    langkey = key;
                }   
            });
            return langkey;
        }
        $scope.getLanguageString = function(langkey) {
            return $scope.versionInfo.details.value[langkey].language;
        }
        $scope.isCurrentPrimaryLanguage = function(langstring) {
            if ($scope.versionInfo.primaryLanguage.value == langstring) {
                return true;
            } else {
                return false;
            }
        }
        $scope.appHasLocalization = function(langstring) {
            var langexists = _.findWhere($scope.versionInfo.details.value, {language: langstring});
            if (langexists !== undefined) {
                return true;
            } else {
                return false;
            }
        }
        $scope.updateNonLocalizedList = function() { //remove existing/added localizations from the available list of localization that can be addded
            $scope.nonLocalizedList = angular.copy($scope.referenceData.detailLanguages);
            angular.forEach($scope.referenceData.detailLanguages,function(refvalue,refkey){
                angular.forEach($scope.versionInfo.details.value,function(detailvalue,detailkey){
                    if (detailvalue && refkey === detailvalue.language) {
                        delete $scope.nonLocalizedList[refkey];
                    }
                });
            });
            return $scope.nonLocalizedList;
        }
        /* Remove?
        $scope.setAsPrimary = function(langstring) {
            console.info("setAsPrimary before re-sort: ", $scope.versionInfo.details.value);
            $scope.versionInfo.primaryLanguage.value = langstring;
            $scope.versionInfo.details.value = $scope.sortDetailsByLocalization($scope.versionInfo.details.value);
            $scope.changeLocView($scope.getLanguageKey(langstring));
            console.info("setAsPrimary after re-sort: ", $scope.versionInfo.details.value);
        }*/
        $scope.changeLocView = function(key) {
            $scope.$emit('closepopups',true);

            // when a setAsPrimary changes the loc view but not the loc key (key is going from 0 to 0), 
            // need to trigger an updateSnapshotDetails(), because the watch on $scope.currentLoc won't.
            var updateMedia = ($scope.currentLoc === key); 

            $scope.currentLoc = key;

            if (updateMedia) {
                $scope.updateSnapshotDetails(true);
            }
        }
        $scope.addPageLanguageValues = function(versionDetailsObject) {
            angular.forEach(versionDetailsObject,function(detailvalue,key){
                versionDetailsObject[key].pageLanguageValue = $scope.referenceData.detailLanguages[detailvalue.language];
            });
            return versionDetailsObject;
        }
        $scope.sortDetailsByLocalization = function(versionDetailsObject) {//$scope.versionInfo.details.value
            //get primary language detail group
            var primaryLangDetail = _.findWhere(versionDetailsObject,{language: $scope.versionInfo.primaryLanguage.value});
            //now (temporarily) remove this language from list before sorting
            var sortedLocalizations = _.reject(versionDetailsObject,function(item) {
                if (item.language === $scope.versionInfo.primaryLanguage.value) {
                    return true;
                } else {
                    return false;
                }
            });
            sortedLocalizations = _.sortBy(sortedLocalizations,function(lang) { 
                return lang.pageLanguageValue; });
            //add primary language to top of list
            sortedLocalizations.unshift(primaryLangDetail);
            return sortedLocalizations;
        }
        $scope.addLocalization = function(langstring) {
            var primaryLang = $scope.versionInfo.primaryLanguage.value;
            var primaryLangCopyDetail = angular.copy(_.findWhere($scope.versionInfo.details.value,{language: primaryLang}));
            //clear out loc specific fields
            primaryLangCopyDetail.description.value = null;
            primaryLangCopyDetail.releaseNotes.value = null;
            primaryLangCopyDetail.keywords.value = null;
            primaryLangCopyDetail.language = langstring;

            // clear out app trailers from copy
            if (primaryLangCopyDetail.appTrailers && primaryLangCopyDetail.appTrailers.value) {
                primaryLangCopyDetail.appTrailers.errorKeys = null; // clear top level error keys.
                var device, deviceObj;
                var devices = Object.keys(primaryLangCopyDetail.appTrailers.value);
                for (var i=0; i<devices.length; i++) {
                    device = devices[i];
                    deviceObj = primaryLangCopyDetail.appTrailers.value[device];
                    // clear out errorKeys and value
                    deviceObj.errorKeys = null;
                    deviceObj.value = null;
                }
            }

            //add to versioninfo
            $scope.versionInfo.details.value.unshift(primaryLangCopyDetail);
            $scope.versionInfo.details.value = $scope.addPageLanguageValues($scope.versionInfo.details.value);
            $scope.versionInfo.details.value = $scope.sortDetailsByLocalization($scope.versionInfo.details.value);
            $scope.updateNonLocalizedList();
            $scope.copyMediaTempStorage(primaryLang, langstring);
            $scope.changeLocView($scope.getLanguageKey(langstring));
            $scope.tempPageContent.appLocScrollTop = true;
        }

        $scope.copyMediaTempStorage = function(originalLangStr, newLangStr) {
            var devices = $scope.allImages.getDevicesForLanguage(originalLangStr);

            var group;
            for (var i=0; i<devices.length; i++) {
                // get the group of snapshots at the primary language
                group = $scope.allImages.getGroup(originalLangStr, devices[i]).slice(0); // important to make a copy (using slice)
                
                // copy it to the new language group.
                $scope.allImages.setGroup(newLangStr, devices[i], group);
            }
        }

        $scope.removeLoc = function(key) {
            var tempcurlang = $scope.versionInfo.details.value[$scope.currentLoc].language;
            $scope.versionInfo.details.value.splice(key,1);
            if(key == $scope.currentLoc) {
                $scope.currentLoc = $scope.getLanguageKey($scope.versionInfo.primaryLanguage.value);
            } else {
                $scope.currentLoc = $scope.getLanguageKey(tempcurlang);
            }
            $scope.updateNonLocalizedList();
            $scope.tempPageContent.appLocScrollTop = true;
            $scope.tempPageContent.showConfirmRemoveLoc = false;
        }
        $scope.confirmRemoveLoc = function(key) {
            $scope.tempPageContent.confirmRemoveLocFor = key;
            $scope.tempPageContent.confirmRemoveLocHeader = $scope.l10n.interpolate('ITC.AppVersion.ConfirmLocRemoval.Header',{'localization':$scope.getLanguageString(key)});
            $scope.tempPageContent.showConfirmRemoveLoc = true;
        }
        $scope.$watch('currentLoc',function(val){
            if (val !== undefined) { // english will make val 0, so check if undefined.
                // update snapshot pics!
                $scope.updateSnapshotDetails(true);
            }
        });

        /* **************************************************
        Rating Functions
        ************************************************** */
        $scope.checkRatingsErrors = function() {
            if ($scope.modalsDisplay !== undefined) {
                $scope.showRatingsErrorIcon = false;

                if ($scope.versionInfo !== undefined  && $scope.versionInfo.ratings.errorKeys !== null && $scope.versionInfo.ratings.errorKeys.length > 0 && angular.toJson($scope.versionInfo.ratings) === angular.toJson($scope.tempRatings)) {
                    $scope.showRatingsErrorIcon = true;
                /*} else if (!$scope.modalsDisplay.ratingModal && $scope.versionInfo !== undefined  && $scope.versionInfo.ratings !== undefined && $scope.versionInfo.ratings.errorKeys !== null && $scope.versionInfo.ratings.errorKeys.length > 0 && angular.toJson($scope.versionInfo.ratings) === angular.toJson($scope.orignalVersionInfo.ratings)) {
                    $scope.showRatingsErrorIcon = true;*/
                } else {
                    //$scope.tempPageContent.additionalErrors = _.without($scope.tempPageContent.additionalErrors,"ratings");
                    $scope.showRatingsErrorIcon = false;
                }
                if ($scope.versionInfo !== undefined  && $scope.versionInfo.ratings.errorKeys !== null && $scope.versionInfo.ratings.errorKeys.length > 0 && angular.toJson($scope.versionInfo.ratings) === angular.toJson($scope.orignalVersionInfo.ratings)) {
                    $scope.showRatingErroIconOnVersionPage = true;
                } else {
                    $scope.showRatingErroIconOnVersionPage = false;
                }

            }
        }
        $scope.showRatingModal = function() {
            $scope.tempRatings = angular.copy($scope.versionInfo.ratings); //make a copy of the ratings to work in the modal
            //initialize whether made for kids is checked or not.
            if ($scope.versionInfo.ratings.ageBand != null) {
                $scope.tempPageContent.ratingDialog.madeForKidsChecked = true;
            } else {
                $scope.tempPageContent.ratingDialog.madeForKidsChecked = false;
            }
            //initialize front end logic for rating display message and agerange selection
            $scope.updateRating();
            $scope.modalsDisplay.ratingModal = true;
        };
        $scope.closeRatingModal = function(shouldSave) {
            if (shouldSave) {
                if ($scope.brazil.categoryRestriction === false && $scope.brazil.canNotBeSold === true) {
                    $scope.tempPageContent.showAdditionalRatings = false;
                } else {
                    $scope.tempPageContent.showAdditionalRatings = true;
                }

                $scope.versionInfo.ratings = $scope.tempRatings;
            } else {
                $scope.tempRatings = {};
            }
            $timeout(function(){
                $scope.updateBrazilRating();
            });
            $scope.modalsDisplay.ratingModal = false;
        };
        $scope.determinePrivacyPolicyPlaceholder = function(currentLoc) {
            if ($scope.versionInfo !== undefined && $scope.versionInfo.ratings !== undefined && currentLoc !== undefined && currentLoc !== null) {
                if (($scope.versionInfo.ratings.ageBand === undefined || $scope.versionInfo.ratings.ageBand === null) && $scope.versionInfo.details.value[currentLoc].privacyURL.isRequired === false) {
                    return $scope.l10n.interpolate('ITC.AppVersion.LocalizedSection.UrlPlaceholderOptional');
                } else {
                    return $scope.l10n.interpolate('ITC.AppVersion.LocalizedSection.UrlPlaceholder');
                }
            }
        }
        $scope.updateRating = function() {
            $scope.checkRatingsErrors();

            $scope.worldrating = {};
            $scope.brazil = {};
            $scope.korea = {};
            $scope.uae = {};
            
            $scope.worldrating.highestlevel = 0;
            $scope.worldrating.rating = "";
            $scope.worldrating.agerange = "";
            $scope.worldrating.canNotBeSold = false;

            $scope.brazil.highestlevel = 0;
            $scope.brazil.rating = "";
            $scope.brazil.categoryRestriction = false;
            $scope.brazil.canNotBeSold = false;

            $scope.uae.categoryRestriction = false;
            $scope.uae.canNotBeSold = false;

            $scope.korea.categoryRestriction = false;
            $scope.korea.canNotBeSold = false;

            $scope.allRatingsExist = true;

            $scope.tempPageContent.ratingDialog.showInfoMessage = false;
            $scope.tempPageContent.ratingDialog.showWarningMessage = false;
            $scope.tempPageContent.ratingDialog.showErrorMessage = false;
            $scope.tempPageContent.ratingDialog.enableDone = false;

            //ensure we have all the data loaded
            if ($scope.tempRatings && $scope.tempRatings.nonBooleanDescriptors != undefined && $scope.tempRatings.booleanDescriptors != undefined) {

                //loop through
                angular.forEach($scope.tempRatings.nonBooleanDescriptors,function(rating,key){
                    if(rating.level === null) {
                        $scope.allRatingsExist = false;
                        //stop looking up ratings if any of them are null
                    } else {
                        var worldkey = "(World, "+rating.name+", "+rating.level+")";
                        var brazilkey = "(Brazil, "+rating.name+", "+rating.level+")";
                        var uaekey = "(United Arab Emirates, "+rating.name+", "+rating.level+")";
                        var koreakey = "(Korea, Republic Of, "+rating.name+", "+rating.level+")";

                        /*console.log("$scope.referenceData.ratingsMap[worldkey].key " + $scope.referenceData.ratingsMap[worldkey].key);
                        console.log("$scope.referenceData.ratingsMap ",$scope.referenceData.ratingsMap);
                        console.log("World key: " + worldkey);
                        console.log("rating.name "+ rating.name);
                        console.log("rating.level "+ rating.level);*/
                        if ($scope.allRatingsExist && $scope.worldrating.highestlevel < $scope.referenceData.ratingsMap[worldkey].key) {
                            $scope.worldrating.highestlevel = $scope.referenceData.ratingsMap[worldkey].key;
                            $scope.worldrating.rating = $scope.referenceData.ratingsMap[worldkey].value;
                        }
                        if ($scope.allRatingsExist && $scope.brazil.highestlevel < $scope.referenceData.ratingsMap[brazilkey].key) {
                            $scope.brazil.highestlevel = $scope.referenceData.ratingsMap[brazilkey].key;
                            $scope.brazil.rating = $scope.referenceData.ratingsMap[brazilkey].value;
                        }
                        //check for store restrictions or removal
                        if ($scope.allRatingsExist && $scope.referenceData.disabledInStoreRatings[brazilkey] !== undefined) {
                            if ($scope.referenceData.disabledInStoreRatings[brazilkey].length > 0) {
                                $scope.brazil.categoryRestriction = true;
                            } else {
                                $scope.brazil.canNotBeSold = true;
                            }
                        }
                        if ($scope.allRatingsExist && $scope.referenceData.disabledInStoreRatings[uaekey] !== undefined) {
                            if ($scope.referenceData.disabledInStoreRatings[uaekey].length > 0) {
                                $scope.uae.categoryRestriction = true;
                            } else {
                                $scope.uae.canNotBeSold = true;
                            }
                        }
                        if ($scope.allRatingsExist && $scope.referenceData.disabledInStoreRatings[koreakey] !== undefined) {
                            if ($scope.referenceData.disabledInStoreRatings[koreakey].length > 0) {
                                $scope.korea.categoryRestriction = true;
                            } else {
                                $scope.korea.canNotBeSold = true;
                            }
                        }
                    }
                });
                angular.forEach($scope.tempRatings.booleanDescriptors,function(rating,key){
                    if(rating.level === null) {
                        $scope.allRatingsExist = false;
                        //stop looking up ratings if any of them are null
                    } else {
                        //lookup each rating in ref data 
                        var worldkey = "(World, "+rating.name+", "+rating.level+")";
                        var brazilkey = "(Brazil, "+rating.name+", "+rating.level+")";
                        var uaekey = "(United Arab Emirates, "+rating.name+", "+rating.level+")";
                        var koreakey = "(Korea, Republic Of, "+rating.name+", "+rating.level+")";
                        if ($scope.allRatingsExist && $scope.worldrating.highestlevel < $scope.referenceData.ratingsMap[worldkey].key) {
                            $scope.worldrating.highestlevel = $scope.referenceData.ratingsMap[worldkey].key;
                            $scope.worldrating.rating = $scope.referenceData.ratingsMap[worldkey].value;
                        }
                        if ($scope.allRatingsExist && $scope.brazil.highestlevel < $scope.referenceData.ratingsMap[brazilkey].key) {
                            $scope.brazil.highestlevel = $scope.referenceData.ratingsMap[brazilkey].key;
                            $scope.brazil.rating = $scope.referenceData.ratingsMap[brazilkey].value;
                        }
                        //check for store restrictions or removal
                        if ($scope.allRatingsExist && $scope.referenceData.disabledInStoreRatings[brazilkey] !== undefined) {
                            if ($scope.referenceData.disabledInStoreRatings[brazilkey].length > 0) {
                                if (!$scope.brazil.canNotBeSold) { $scope.brazil.categoryRestriction = true; }
                            } else {
                                $scope.brazil.canNotBeSold = true;
                                $scope.brazil.categoryRestriction = false;
                            }
                        }
                        if ($scope.allRatingsExist && $scope.referenceData.disabledInStoreRatings[uaekey] !== undefined) {
                            if ($scope.referenceData.disabledInStoreRatings[uaekey].length > 0) {
                                if (!$scope.uae.canNotBeSold) { $scope.uae.categoryRestriction = true; }
                            } else {
                                $scope.uae.canNotBeSold = true;
                                $scope.uae.categoryRestriction = false;
                            }
                        }
                        if ($scope.allRatingsExist && $scope.referenceData.disabledInStoreRatings[koreakey] !== undefined) {
                            if ($scope.referenceData.disabledInStoreRatings[koreakey].length > 0) {
                                if (!$scope.korea.canNotBeSold) { $scope.korea.categoryRestriction = true; }
                            } else {
                                $scope.korea.canNotBeSold = true;
                                $scope.korea.categoryRestriction = false;
                            }
                        }
                    }
                    
                });    
            }

            if ($scope.showRatingsErrorIcon) {
                $scope.tempPageContent.ratingDialog.enableDone = false;
            }

            //set raings to display
            if ($scope.allRatingsExist) {
                $scope.tempRatings.countryRatings.Brazil = $scope.brazil.rating;
                $scope.tempRatings.rating = $scope.worldrating.rating;
                //show info message if we can sell in store and there are no category or store restrictions...
                if ($scope.tempRatings.rating != "No Rating" && !$scope.korea.canNotBeSold && !$scope.korea.categoryRestriction && !$scope.uae.canNotBeSold && !$scope.uae.categoryRestriction && !$scope.brazil.canNotBeSold && !$scope.brazil.categoryRestriction) { // will be sold in all stores - no restricionts
                    $scope.tempPageContent.ratingDialog.showInfoMessage = true;
                    $scope.tempPageContent.ratingDialog.showWarningMessage = false;
                    $scope.tempPageContent.ratingDialog.showErrorMessage = false;
                    $scope.tempPageContent.ratingDialog.enableDone = true;
                //show warning message if there are category restrictions for some stores    
                } else if ($scope.tempRatings.rating != "No Rating" && ($scope.korea.canNotBeSold || $scope.korea.categoryRestriction || $scope.uae.canNotBeSold || $scope.uae.categoryRestriction || $scope.brazil.canNotBeSold || $scope.brazil.categoryRestriction)) {
                    $scope.tempPageContent.ratingDialog.showInfoMessage = false;
                    $scope.tempPageContent.ratingDialog.showWarningMessage = true;
                    $scope.tempPageContent.ratingDialog.showErrorMessage = false;
                    $scope.tempPageContent.ratingDialog.enableDone = true;

                } else {
                    $scope.tempPageContent.ratingDialog.showInfoMessage = false;
                    $scope.tempPageContent.ratingDialog.showWarningMessage = false;
                    $scope.tempPageContent.ratingDialog.showErrorMessage = true;
                    $scope.tempPageContent.ratingDialog.enableDone = true;//false;
                }

                $scope.tempPageContent.ratingDialog.ageBandRatings = [];
                if ($scope.worldrating.highestlevel === 2) {
                    angular.forEach($scope.referenceData.ageBandRatings,function(value,key){
                        if (key > 1) {
                            $scope.tempPageContent.ratingDialog.ageBandRatings.push(value);
                        }
                    });
                } else if ($scope.worldrating.highestlevel === 1) {
                    $scope.tempPageContent.ratingDialog.ageBandRatings = angular.copy($scope.referenceData.ageBandRatings);
                } else {
                    $scope.tempPageContent.ratingDialog.ageBandRatings = [];
                }

                //does our agebandselection still make sense?
                if (_.indexOf($scope.tempPageContent.ratingDialog.ageBandRatings,$scope.tempRatings.ageBand) < 0 || !$scope.tempPageContent.ratingDialog.madeForKidsChecked) {
                    $scope.tempRatings.ageBand = null;
                }

                //last check - change enableDone to false if madeforkids is shown but no value is given
                if ($scope.worldrating.highestlevel < 3 && $scope.tempPageContent.ratingDialog.madeForKidsChecked && ($scope.tempRatings.ageBand === "undefined" || $scope.tempRatings.ageBand === "null" || $scope.tempRatings.ageBand === "" || !$scope.tempRatings.ageBand)) {
                        $scope.tempPageContent.ratingDialog.enableDone = false;
                } else if ($scope.worldrating.highestlevel >= 3) {
                    $scope.tempRatings.ageBand = null;
                }
                if ($scope.tempRatings.ageBand != null && $scope.tempRatings.ageBand !== "undefined" && $scope.tempRatings.ageBand !== "") {
                    $scope.tempPageContent.ratingDialog.agebandhasvalue = true;
                } else {
                    $scope.tempPageContent.ratingDialog.agebandhasvalue = false;
                }

            }
        };
        $scope.updateBrazilRating = function() {
            $scope.brazilClass = $filter('brazilRatingClass')($scope.versionInfo.ratings.countryRatings.Brazil);
        }


        /* **************************************************
        EULA Functions
        ************************************************** */
        $scope.showEulaModal = function() {
            $scope.tempEula = angular.copy($scope.versionInfo.eula);
            $scope.tempPageContent.eulaModal.standardEula = $scope.tempPageContent.standardEula;
            $scope.tempEulaCopy = angular.copy($scope.tempEula);
            $scope.gatherTerritoriesList();
            $scope.getEulaTerritories();
            $scope.checkCanSaveEulaModal();
            $scope.modalsDisplay.eulaModal = true;
        }

        $scope.$watch('tempPageContent.eulaModal.customEula',function(newVal){
            if (newVal !== undefined) {
               $scope.changeModalHeight("eulaModal");
            }   
        });

        // Called when the Eula modal shows.
        $scope.onEulaShow = function() {
            $scope.changeModalHeight("eulaModal");
        }

        // Changes the given modal's max-height by summing it's content's heights.
        $scope.changeModalHeight = function(modalID) {
            $timeout(function() { // timeout because on first show, the hidden elements are not yet hidden
                var el = $(document).find("#" + modalID); 
                if (el.is(':visible')) {
                    var paddingTopBottom = parseInt(el.css( "paddingTop" )) + parseInt(el.css( "paddingBottom" ));
                    var h = el.height();

                    var c;
                    var total = 0;
                    for (var i=0; i<el.children().length; i++) {
                        c = el.children().eq(i);
                        total += c.outerHeight(true); // count the margin/padding/border
                    }
                    el.css("max-height", (total+paddingTopBottom) + "px");
                }
            });
        }   

        $scope.closeEulaModal = function(shouldSave) {
            if (shouldSave) {
                $scope.versionInfo.eula = $scope.tempEula;

                if($scope.tempPageContent.eulaModal.standardEula === "true") {
                    $scope.versionInfo.eula.EULAText = null;
                    $scope.versionInfo.eula.countries = [];
                }
                $scope.updateEULAInfo();
            } else {
                $scope.tempEula = {};
            }
            $scope.updateEULAInfo();
            $scope.modalsDisplay.eulaModal = false;
        }
        $scope.updateEULAInfo = function() {
            //set if using standard or custom EULA
            $scope.tempPageContent.standardEula = "true"; //will convert to boolean when needed...
            if ($scope.versionInfo.eula.EULAText != null) {
                $scope.tempPageContent.standardEula = "false"; 
            }
            $scope.checkCanSaveEulaModal();
        }
        $scope.gatherTerritoriesList = function() {
            //create object list: {'territory':'U.S.','isEnabled':'true/false'}
            $scope.territoryEulaList = []; //start empty
            angular.forEach($scope.referenceData.contactCountries,function(value,key){
                //is this territory in versionInfo?
                var isEula = false;
                if (jQuery.inArray(value, $scope.versionInfo.eula.countries) >= 0) {
                    isEula = true;
                }
               $scope.territoryEulaList.push({'territory':value,'isSelected':isEula}) 
            });
            $scope.tempPageContent.eulaModal.showSelected = false;
        }
        $scope.getEulaTerritories = function() {
            $scope.isSelectedList = _.where($scope.territoryEulaList, {"isSelected":true});
            if ($scope.isSelectedList !== undefined && $scope.isSelectedList.length > 0) {
                $scope.tempPageContent.showTerritoryList = true;
            } else {
                $scope.tempPageContent.showTerritoryList = false;
            }
        }
        $scope.$watch('isSelectedList',function(){
            if ($scope.isSelectedList != undefined) {
                $scope.tempEula.countries = [];
                angular.forEach($scope.isSelectedList,function(value,key){
                    $scope.tempEula.countries.push(value.territory);
                });
                $scope.getTerritoryCount();
                $scope.checkCanSaveEulaModal();
            }   
        });
        $scope.$watch('tempPageContent.eulaModal.standardEula',function(){
            if ($scope.tempPageContent !== undefined) {
                if ($scope.tempPageContent.eulaModal.standardEula === 'true') {
                    $scope.tempPageContent.eulaModal.customEula = false;
                } else {
                    $scope.tempPageContent.eulaModal.customEula = true;
                }
                $scope.checkCanSaveEulaModal();
            }
        });
        $scope.$watch('tempEula.EULAText',function(){
            $scope.checkCanSaveEulaModal();
        });
        $scope.getTerritoryCount = function() {
            if ($scope.tempEula.countries != undefined && $scope.referenceData.contactCountries != undefined && $scope.tempEula.countries.length > 0) {
                $scope.tempPageContent.eulaModal.territoryCount = $scope.l10n.interpolate('ITC.AppVersion.EULAModal.TerritoryLabel.TerritoryCount', {'selected':$scope.tempEula.countries.length,'total':$scope.referenceData.contactCountries.length});
            } else {
                $scope.tempPageContent.eulaModal.territoryCount = "";
            }
        }
        $scope.checkCanSaveEulaModal = function() { //$scope.tempPageContent.eulaModal.standardEula = $scope.tempPageContent.standardEula;
            if ($scope.tempPageContent !== undefined) {
                $scope.tempPageContent.canSaveEulaModal = false;
                if (angular.toJson($scope.tempEulaCopy) !== angular.toJson($scope.tempEula) || $scope.tempPageContent.standardEula !== $scope.tempPageContent.eulaModal.standardEula) {
                    if ($scope.tempPageContent.eulaModal.standardEula === "true") {
                        $scope.tempPageContent.canSaveEulaModal =  true;
                    } else if ($scope.tempEula != undefined && $scope.tempEula.EULAText != null && $scope.tempEula.EULAText != "" && $scope.tempEula.countries.length > 0) {
                        $scope.tempPageContent.canSaveEulaModal =  true;
                    }
                }
            }
        }


        /* **************************************************
        Category / Sub Category Functions
        ************************************************** */
        $scope.updateCategoryViews = function() {
            $scope.tempPageContent.showPrimarySubcats = false
            $scope.tempPageContent.showSecondarySubCats = false;
            $scope.secondaryCategoryList = [];

            $scope.primaryFirstSubCategoryList = [];
            $scope.primarySecondSubCategoryList = [];

            $scope.secondaryFirstSubCategoryList = [];
            $scope.secondarySecondSubCategoryList = [];
            

            if($scope.versionInfo.primaryCategory.value === $scope.versionInfo.secondaryCategory.value) {
                //if primary category matches secondary category - set secondary to null - they can not be the same. Primary takes precedence
                $scope.versionInfo.secondaryCategory.value = null;
            }

            if($scope.versionInfo.primaryCategory != null && $scope.versionInfo.primaryCategory.value != null) {
                //if we have a primary category value - remove it from the options for secondary catgeory
                $scope.secondaryCategoryList = _.without($scope.categoryList,$scope.versionInfo.primaryCategory.value);
            } else {
                //otherwise show the full list to both
                $scope.secondaryCategoryList = $scope.categoryList;
            }

            //check currently selected primary and secondary categories - determine if they have subcats
            if ($scope.versionInfo.primaryCategory != null && $scope.versionInfo.primaryCategory.value != null && $scope.referenceData.subGenreMap[$scope.versionInfo.primaryCategory.value].length > 0) {
                //if we have a primary category value and it has subcats - grab subcats - show primary subcats
                $scope.tempPageContent.showPrimarySubcats = true;
                $scope.primaryFirstSubCategoryList = $scope.referenceData.subGenreMap[$scope.versionInfo.primaryCategory.value];
            } else {
                //otherwise - no subcats for primary cat - hide primary subcats - and set values to null
                $scope.versionInfo.primaryFirstSubCategory.value = null;
                $scope.versionInfo.primarySecondSubCategory.value = null;
                $scope.tempPageContent.showPrimarySubcats = false;
            }

            if (!$scope.versionInfo.newsstand.isEnabled) {
                //non-newsstand logic...

                if ($scope.versionInfo.secondaryCategory != null && $scope.versionInfo.secondaryCategory.value != null && $scope.referenceData.subGenreMap[$scope.versionInfo.secondaryCategory.value].length > 0) {
                    //if we have a value for secondary cat and it has sub cats - grab subcats - show secondary sub cats
                    $scope.tempPageContent.showSecondarySubCats = true;
                    $scope.secondaryFirstSubCategoryList = $scope.referenceData.subGenreMap[$scope.versionInfo.secondaryCategory.value];
                } else {
                    //otherwise - no subcats for secondary cat - hide primary subcats - and set values to null
                    $scope.versionInfo.secondaryFirstSubCategory.value = null;
                    $scope.versionInfo.secondarySecondSubCategory.value = null;
                    $scope.tempPageContent.showSecondarySubCats = false;
                }
            } else {
                $scope.secondaryFirstSubCategoryList = $scope.referenceData.subGenreMap['MZGenre.Apps.Newsstand'];
                if($scope.versionInfo.secondaryFirstSubCategory != null && $scope.versionInfo.secondaryFirstSubCategory.value != null) {
                    //if we have a primary category value - remove it from the options for secondary catgeory
                    $scope.secondarySecondSubCategoryList = _.without($scope.secondaryFirstSubCategoryList,$scope.versionInfo.secondaryFirstSubCategory.value);
                } else {
                    //otherwise show the full list to both
                    $scope.secondarySecondSubCategoryList = $scope.secondaryFirstSubCategoryList;
                }
            }

            // **** Subcategory lists (Primary)
            if($scope.versionInfo.primaryFirstSubCategory.value === $scope.versionInfo.primarySecondSubCategory.value) {
                //if primary first sub category matches primary second sub category - set second to null - they can not be the same. first takes precedence
                $scope.versionInfo.primarySecondSubCategory.value = null;
            }
            //check if primary first sub cat has a value - and if so remove it from the list for primary second sub cat list...
            if ($scope.versionInfo.primaryFirstSubCategory != null && $scope.versionInfo.primaryFirstSubCategory.value != null) {
                $scope.primarySecondSubCategoryList = _.without($scope.primaryFirstSubCategoryList,$scope.versionInfo.primaryFirstSubCategory.value);
            } else {
                //otherwise show the full list
                $scope.primarySecondSubCategoryList = $scope.primaryFirstSubCategoryList;
            }

            // **** Subcategory lists (Secondary)
            if($scope.versionInfo.secondaryFirstSubCategory.value === $scope.versionInfo.secondarySecondSubCategory.value) {
                //if secondary first sub category matches secondary second sub category - set second to null - they can not be the same. first takes precedence
                $scope.versionInfo.secondarySecondSubCategory.value = null;
            }
            //check if secondary first sub cat has a value - and if so remove it from the list for secondary second sub cat list...
            if ($scope.versionInfo.secondaryFirstSubCategory != null && $scope.versionInfo.secondaryFirstSubCategory.value != null) {
                $scope.secondarySecondSubCategoryList = _.without($scope.secondaryFirstSubCategoryList,$scope.versionInfo.secondaryFirstSubCategory.value);
            } else {
                //otherwise show the full list
                $scope.secondarySecondSubCategoryList = $scope.secondaryFirstSubCategoryList;
            }
        }

        /* **************************************************
        Newsstand Functions
        ************************************************** */
        $scope.newsstandSwitcher = function() {
            if ($scope.versionInfo.newsstand.isEnabled) {
                if ($scope.orignalVersionInfo.newsstand.isEnabled) {
                    $scope.tempPageContent.confirmNewsstandShutOff = true;
                    return true;
                } else {
                    $scope.tempPageContent.confirmNewsstandShutOff = false;
                    $scope.versionInfo.newsstand.isEnabled = false;
                    //reset subcats
                    $scope.versionInfo.secondaryCategory.value = null;
                    $scope.versionInfo.secondaryFirstSubCategory.value = null;
                    $scope.versionInfo.secondarySecondSubCategory.value = null; 
                    $scope.tempPageContent.showSecondarySubCats = false;
                    $scope.updateCategoryViews();
                }
            } else {
                //reset subcats
                $scope.versionInfo.secondaryFirstSubCategory.value = null;
                $scope.versionInfo.secondarySecondSubCategory.value = null; 
                $scope.secondaryFirstSubCategoryList = $scope.referenceData.subGenreMap['MZGenre.Apps.Newsstand'];
                if($scope.versionInfo.secondaryFirstSubCategory != null && $scope.versionInfo.secondaryFirstSubCategory.value != null) {
                    //if we have a primary category value - remove it from the options for secondary catgeory
                    $scope.secondarySecondSubCategoryList = _.without($scope.secondaryFirstSubCategoryList,$scope.versionInfo.secondaryFirstSubCategory.value);
                } else {
                    //otherwise show the full list to both
                    $scope.secondarySecondSubCategoryList = $scope.secondaryFirstSubCategoryList;
                }
                return true;
            }             
        }
        $scope.shutOffNewsstand = function() {
            $scope.tempPageContent.confirmNewsstandShutOff = false;
            $scope.versionInfo.newsstand.isEnabled = false;
            //reset subcats
            $scope.versionInfo.secondaryCategory.value = null;
            $scope.versionInfo.secondaryFirstSubCategory.value = null;
            $scope.versionInfo.secondarySecondSubCategory.value = null; 
            $scope.tempPageContent.showSecondarySubCats = false;
            $scope.updateCategoryViews();
        }
        

        /* **************************************************
        IAP Functions
        ************************************************** */
        $scope.checkAddOns = function() {
            $scope.tempPageContent.addOns.submitNextVersion = [];
            if ($scope.versionInfo.submittableAddOns != undefined && $scope.versionInfo.submittableAddOns != null) {
                //loop through submittable addons collect list of those set to "true"
                angular.forEach($scope.versionInfo.submittableAddOns.value,function(value,key){
                    if (value.itcsubmitNextVersion) {
                        $scope.tempPageContent.addOns.submitNextVersion.push({'referenceName':value.referenceName,'vendorId':value.vendorId,'addOnType':value.addOnType});
                    }
                });
            }
            if ($scope.tempPageContent.addOns.sortorder === undefined || $scope.tempPageContent.addOns.sortorder === "")
            {
                $scope.tempPageContent.addOns.sortorder = "referenceName"; //set default sort
            }
            if ($scope.tempPageContent.addOns.reverse === undefined || $scope.tempPageContent.addOns.reverse === "")
            {
                $scope.tempPageContent.addOns.reverse = true; //set default sort
            }
            $scope.tempPageContent.addOns.reverse = !$scope.tempPageContent.addOns.reverse;
            $scope.sortIapColumns($scope.tempPageContent.addOns.sortorder);
        }
        $scope.showIapModal = function() {
            //create special list for modal
            $scope.tempPageContent.addOns.modal.tempAddOnsList = [];
            angular.forEach($scope.versionInfo.submittableAddOns.value,function(value,key){
                if (value.itcsubmitNextVersion) {
                    $scope.tempPageContent.addOns.modal.tempAddOnsList.push({'referenceName':value.referenceName,'vendorId':value.vendorId,'addOnType':value.addOnType,'isSelected':true});
                } else {
                    $scope.tempPageContent.addOns.modal.tempAddOnsList.push({'referenceName':value.referenceName,'vendorId':value.vendorId,'addOnType':value.addOnType,'isSelected':false});
                }
            });
            if ($scope.tempPageContent.addOns.modal.sortorder === undefined || $scope.tempPageContent.addOns.modal.sortorder === "")
            {
                $scope.tempPageContent.addOns.modal.sortorder = "referenceName"; //set default sort
            }
            if ($scope.tempPageContent.addOns.modal.reverse === undefined || $scope.tempPageContent.addOns.modal.reverse === "")
            {
                $scope.tempPageContent.addOns.modal.reverse = true; //set default sort
            }
            $scope.tempPageContent.addOns.modal.reverse = !$scope.tempPageContent.addOns.modal.reverse
            $scope.sortIapColumns($scope.tempPageContent.addOns.modal.sortorder,true);
            $scope.modalsDisplay.iapModal = true;
            $scope.tempPageContent.IAPmodal.doneButtonDisabled = true;
            $scope.tempPageContent.addOns.modal.tempAddOnsListOnLoad = angular.copy($scope.tempPageContent.addOns.modal.tempAddOnsList);
        }
        $scope.$watch('tempPageContent.addOns.modal.tempAddOnsList',function(){
            // console.log("running...");
            // console.log("test",$scope.tempPageContent.addOns.modal.tempAddOnsListOnLoad,$scope.tempPageContent.addOns.modal.tempAddOnsList);
            if(angular.toJson($scope.tempPageContent.addOns.modal.tempAddOnsList) !== angular.toJson($scope.tempPageContent.addOns.modal.tempAddOnsListOnLoad)) {
                $scope.tempPageContent.IAPmodal.doneButtonDisabled = false;
            } else {
                $scope.tempPageContent.IAPmodal.doneButtonDisabled = true;
            }
        },true);
        $scope.closeIapModal = function(value) {
            if (value) {
                //loopthrough special list and turn on addons where appropriate
                angular.forEach($scope.tempPageContent.addOns.modal.tempAddOnsList,function(value,key){
                    if (value.isSelected) {
                        //find twin in main version info and set to true...
                        angular.forEach($scope.versionInfo.submittableAddOns.value,function(versValue,versKey){
                            if (value.vendorId === versValue.vendorId) {
                                versValue.itcsubmitNextVersion = true;
                            }
                        });
                    } else {
                        angular.forEach($scope.versionInfo.submittableAddOns.value,function(versValue,versKey){
                            if (value.vendorId === versValue.vendorId) {
                                versValue.itcsubmitNextVersion = false;
                            }
                        });
                    }
                });
            } else {
                $scope.tempPageContent.addOns.modal.tempAddOnsList = [];
            }
            $scope.checkAddOns();
            $scope.modalsDisplay.iapModal = false;
        }
        $scope.chanageIapOrder = function (isModal) {
            isModal = typeof isModal !== 'undefined' ? isModal : false;
            if (isModal) {
                $scope.tempPageContent.addOns.modal.tempAddOnsList = $filter('orderBy')($scope.tempPageContent.addOns.modal.tempAddOnsList, $scope.tempPageContent.addOns.modal.sortorder,$scope.tempPageContent.addOns.modal.reverse); 
                $scope.tempPageContent.addOns.modal.tempAddOnsListOnLoad = $filter('orderBy')($scope.tempPageContent.addOns.modal.tempAddOnsListOnLoad, $scope.tempPageContent.addOns.modal.sortorder,$scope.tempPageContent.addOns.modal.reverse);
            } else {
                $scope.tempPageContent.addOns.submitNextVersion = $filter('orderBy')($scope.tempPageContent.addOns.submitNextVersion, $scope.tempPageContent.addOns.sortorder,$scope.tempPageContent.addOns.reverse); 
            }   
        };
        $scope.sortIapColumns = function(fieldname,isModal) {
            isModal = typeof isModal !== 'undefined' ? isModal : false;
            if (isModal) {
                $scope.tempPageContent.addOns.modal.reverse = $scope.tempPageContent.addOns.modal.sortorder!==fieldname?false:$scope.tempPageContent.addOns.modal.reverse;
                $scope.tempPageContent.addOns.modal.sortorder = fieldname;
                $scope.chanageIapOrder(true);
                $scope.tempPageContent.addOns.modal.reverse = !$scope.tempPageContent.addOns.modal.reverse;
            } else {
                $scope.tempPageContent.addOns.reverse = $scope.tempPageContent.addOns.sortorder!==fieldname?false:$scope.tempPageContent.addOns.reverse;
                $scope.tempPageContent.addOns.sortorder = fieldname;
                $scope.chanageIapOrder();
                $scope.tempPageContent.addOns.reverse = !$scope.tempPageContent.addOns.reverse;
            }
        };
        $scope.columnIapClass = function(fieldname,isModal) {
            if ($scope.tempPageContent !== undefined) {
                isModal = typeof isModal !== 'undefined' ? isModal : false;
                if (isModal) {
                    return $scope.tempPageContent.addOns.modal.sortorder===fieldname?'sorted':'';
                } else {
                    return $scope.tempPageContent.addOns.sortorder===fieldname?'sorted':'';
                }
            }
        }
        $scope.removeAddOn = function(vendorid) {
            angular.forEach($scope.versionInfo.submittableAddOns.value,function(value,key){
                if (vendorid === value.vendorId) {
                    value.itcsubmitNextVersion = false;
                }
            });
            $scope.checkAddOns();
        }

        /* **************************************************
        Mac Entitlement Functions
        ************************************************** */
        $scope.updateEntitlementsList = function() {
            //full list here: $scope.referenceData.macOSEntitlements
            $scope.tempPageContent.entitlements.requiredList = []; //_.without($scope.referenceData.macOSEntitlements,false);
            $scope.tempPageContent.entitlements.nonRequiredList = []; //_.without($scope.referenceData.macOSEntitlements,true);
            angular.forEach($scope.referenceData.macOSEntitlements,function(value,key){
                //check if exists in appversion info...
                var testHasBeenChosen = []; //_.findWhere($scope.versionInfo.appReviewInfo.entitlementUsages.value,{value:{'entitlement':key}});
                angular.forEach($scope.versionInfo.appReviewInfo.entitlementUsages.value,function(loopvalue,loopkey){
                    if (loopvalue.value.entitlement === key) {
                        testHasBeenChosen.push(key);
                    }
                });
                if (testHasBeenChosen.length < 1) {
                    if (value) {
                        $scope.tempPageContent.entitlements.requiredList.push(key);
                    } else {
                        $scope.tempPageContent.entitlements.nonRequiredList.push(key); 
                    }
                }
            });
        }
        $scope.addEntitlement = function(entitlement) {
            //get true/false is optional for this entitlement
            var entitlementToAdd = _.findWhere($scope.referenceData.macOSEntitlements,{'entitlement':entitlement});
            $scope.versionInfo.appReviewInfo.entitlementUsages.value.push({isEditable: true, value:{'entitlement':entitlement,'isOptional':entitlementToAdd,'justification':''}});
            $scope.updateEntitlementsList();
            //console.log("version info now: ",$scope.versionInfo);
        }
        $scope.removeEntitlement = function(entitlement) {
           $scope.versionInfo.appReviewInfo.entitlementUsages.value = _.reject($scope.versionInfo.appReviewInfo.entitlementUsages.value,function(ent){
                //console.log("ent.entitlement " + ent.entitlement);
                if (ent.value.entitlement === entitlement) {
                    return true;
                } else {
                    return false;
                }
           });
           $scope.updateEntitlementsList();
        }

        /* **************************************************
        Build Functions
        ************************************************** */
        $scope.showBuildPicker = function() {
            $scope.modalsDisplay.buildsModal = true;
            $scope.buildListLoaded = false;
            //load build list...
            appDetailsService.getBuildCandidates($scope.adamId).then(function(data) {
                $scope.buildListLoaded = true;
                $scope.buildList = data.data;
                //set chosen build to current build if it exists
                if ($scope.versionInfo.preReleaseBuildVersionString.value !== null && $scope.versionInfo.preReleaseBuildVersionString.value !== "") {
                    angular.forEach($scope.buildList.builds,function(value,key){
                        if (value.buildVersion === $scope.versionInfo.preReleaseBuildVersionString.value) {
                            $scope.tempPageContent.buildModal.chosenBuild = key + "";
                            return;
                        }
                    });
                } else {
                    $scope.tempPageContent.buildModal.chosenBuild = "";
                }
            });
        }
        $scope.closeBuildModal = function(saving) {
            if (saving) {
                //move copy of currently selected build to main versionInfo JSON...
                $scope.versionInfo.preReleaseBuildTrainVersionString = $scope.buildList.builds[$scope.tempPageContent.buildModal.chosenBuild].trainVersion;
                $scope.versionInfo.preReleaseBuildVersionString.value = $scope.buildList.builds[$scope.tempPageContent.buildModal.chosenBuild].buildVersion;
                $scope.versionInfo.preReleaseBuildUploadDate = $scope.buildList.builds[$scope.tempPageContent.buildModal.chosenBuild].uploadDate;
                $scope.versionInfo.preReleaseBuildIconUrl = $scope.buildList.builds[$scope.tempPageContent.buildModal.chosenBuild].iconUrl;
                $scope.versionInfo.preReleaseBuildIsLegacy = false;
                $scope.modalsDisplay.buildsModal = false;
            } else {
                $scope.modalsDisplay.buildsModal = false;
            }
        }
        $scope.removeBuild = function() {
            $scope.versionInfo.preReleaseBuildTrainVersionString = null;
            $scope.versionInfo.preReleaseBuildVersionString.value = null;
            $scope.versionInfo.preReleaseBuildUploadDate = null;
            $scope.versionInfo.preReleaseBuildIconUrl = null;
            $scope.versionInfo.preReleaseBuildIsLegacy = false;
        }

        $scope.getBuildLink = function() {
            if ($scope.versionInfo !== undefined) {
                if ($scope.versionInfo.preReleaseBuildIsLegacy) {
                    //if version is 
            /*if ($routeParams.ver && $routeParams.ver === "cur") {
                $scope.isLiveVersion = true;
            } else if ($rootScope.appPageHeader.inFlightVersion === null) {
                $scope.isLiveVersion = true;
            } else {
                $scope.isInFlightVersion = true;
            }*/
                    var versionstring="&versionString=latest";
                    if ($rootScope.appPageHeader.inFlightVersion !== null && $routeParams.ver && $routeParams.ver === "cur") {
                        versionstring = "&versionString=live"
                    }
                
                    return global_itc_path + "/wa/LCAppPage/viewBinaryDetails?adamId="+$scope.adamId+versionstring;
                } else {
                    return global_itc_home_url + "/app/"+$scope.adamId+"/pre/trains/"+$scope.versionInfo.preReleaseBuildTrainVersionString+"/build/"+$scope.versionInfo.preReleaseBuildVersionString.value+"?v=buildDetails";
                }
            }
        }
        $scope.getBuildStatus = function(buildState) {
            return $scope.l10n.interpolate('ITC.apps.betaStatus.'+buildState);
        }
        $scope.showBuildPickerIcon = function() {
            if ($scope.versionInfo !== undefined) {
                if (($scope.versionInfo.preReleaseBuildVersionString.value === null || $scope.versionInfo.preReleaseBuildVersionString.value === '') && $scope.versionInfo.preReleaseBuildVersionString.isEditable && $scope.versionInfo.preReleaseBuildsAreAvailable) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        /* **************************************************
        Screenshot Functions
        ************************************************** */
        $scope.loadAppVersionReferenceData = function() {
            appVersionReferenceDataService.async().then(function(data) {
                $scope.appVersionReferenceData = data.data;
            });
        }
        // Sets the num of videos to 0 or 1 depending on the appPreviewEnabled property.
        $scope.setNumVideos = function() {
            if ($scope.currentDevice === "iphone35" || 
                $scope.currentDevice === "desktop" || 
                !$scope.referenceData.appPreviewEnabled) {
                $scope.numVideos = 0; // show no video
            }
            else {
                $scope.numVideos = 1;   
            }
        };

        $scope.isVideoEnabled = function() {
            return $scope.numVideos > 0;
        };

        // Initializes some variables for app trailer directives
        $scope.initSnapshotDetails = function() {
            this.lastLoc = null;
            this.lastDev = null;

            $scope.appPreviewSnapshotShowing = true; 
            $scope.numImagesNotReady = 0;
            $scope.numImages = 5; // max num of images 
            $scope.numVideos = 0;   // this is updated in setNumVideos once we have referenceData
            $scope.previewImages = new Array(); // a pointer to the images at the current location/device
            $scope.previewVideos = new Array();  // a pointer to the videos at the current location/device
            $scope.imageUploadsInProgress = 0;
            
            // A generic object to hold groups of language/device combinations.
            var group = function() {

                // returns true if this group was already initialized
                this.initialized = function(language, device) {
                    return (this[language] && this[language][device] && this[language][device].arr);
                };

                this.clearGroup = function(language, device) {
                    if (this[language]) {
                        if (this[language][device]) {
                            this[language][device].arr = null;
                        }
                        this[language][device] = null;
                    }
                };

                // Initializes the group with an empty array and returns it.
                // Won't hurt to re-initialize.
                this.initializeGroup = function(language, device) {  
                    if (this[language]) {
                        if (!this[language][device]) {
                            this[language][device] = {};
                        }
                        if (!this[language][device].arr) {
                            this[language][device].arr = new Array();
                        }
                    }
                    else {
                        this[language] = {};
                        this[language][device] = {};
                        this[language][device].arr = new Array();
                    }     
                    return this[language][device].arr;
                };

                // gets the group
                this.getGroup = function(language, device) {
                    if (this[language] && this[language][device]) {
                        return this[language][device].arr;
                    }
                    else {
                        return null;
                    }    
                };

                this.setGroup = function(language, device, array) {
                    if (!this[language]) {
                        this[language] = {};
                    }
                    if (!this[language][device]) {
                        this[language][device] = {};
                    }

                    this[language][device].arr = array;
                };

                // return true if there's an error in the given group (in a specific snapshot/video)
                this.hasErrorsInGroup = function(language, device) {
                    var snapshots = this.getGroup(language, device);
                    if (snapshots) {
                        for (var i = 0; i < snapshots.length; i++) {
                            if (snapshots[i].error) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                // Returns an array of devices at the given language.
                this.getDevicesForLanguage = function(language) {
                    var deviceArr = new Array();
                    var langArr = this[language];
                    if (langArr) {
                        for (var key in langArr) {
                            if (key === 'length' || key=== 'error' || !langArr.hasOwnProperty(key)) continue;
                            deviceArr.push(key);
                        }
                    }
                    return deviceArr;
                };

                // set an error for the snapshot at the given sortOrder, for the given group (language/device)
                this.setError = function(language, locKey, device, sortOrder, error) {
                    var startSortOrderIndex = $scope.getScreenshotSortOrderStartIndex(device, locKey);

                    var group = this.getGroup(language, device);

                    if (group && (group.length > (sortOrder-startSortOrderIndex))) {
                        group[sortOrder-startSortOrderIndex].error = error;
                    } 
                };

                // set a general error at the language/device level (not for a specific snapshot as in this.setError)
                this.setLanguageDeviceSpecificError = function(language, device, error) { 
                    if (!this[language]) {
                        this[language] = {};
                    }
                    if (!this[language][device]) {
                        this[language][device] = {};
                    }
                    this[language][device].error = error;
                    
                };

                this.getLanguageDeviceSpecificError = function(language, device) {
                    if (this[language] && this[language][device]) {
                        return this[language][device].error;
                    }
                    return null;
                };

                this.hasLanguageDeviceSpecificError = function(language, device) {
                    return (this[language] && this[language][device] && this[language][device].error);
                };

                // set a general error at the lanuage level (for all devices)
                this.setLanguageSpecificError = function(language, error) {
                    if (!this[language]) {
                        this[language] = {};
                    }
                    this[language].error = error;
                };

                this.hasLanguageSpecificError = function(language) {
                    return (this[language] && this[language].error);
                };

                this.getLanguageSpecificError = function(language) {
                    if (this[language]) {
                        return this[language].error;
                    }
                    return null;
                };

                this.clearGeneralErrors = function(language, device) {
                    this.setLanguageSpecificError(language, null);
                    this.setLanguageDeviceSpecificError(language, device, null);
                };
            };

            // One object to hold all snapshots for all language/device combinations and one to
            // hold all videos for all language/device combinations
            $scope.allImages = new group();
            $scope.allVideos = new group();

            $scope.showModal = false;
            $scope.progress = -1;
            $scope.fileReaderSupported = window.FileReader != null;
            $scope.uploadRightAway = true;
            $scope.currentDevice = "iphone4"; // temporarily hardcoded. (needed for drop zone TBD: remove it)
            
            $scope.snapshotInfo = {};
            $scope.snapshotInfo.gap = false;
            $scope.snapshotInfo.error = false;
            $scope.midSnapshotUpdate = true;
        };
        // Creates a map of device names to user friendly (those that are displayed in UI), like "iphone4" to "4-inch".
        // This map is used to create the menu item pills above the snapshots.
        // This method depends on both $scope.referenceData and $scope.l10n to be set, and is therefore triggered by a change 
        // in either.
        $scope.updateDevices = function() {
            $scope.deviceNameMap = {};
            $scope.deviceNames = new Array(); // just for correct sort order.
            
            if ($scope.referenceData && $scope.l10n && $scope.versionInfo) { // these 3 pieces of info come in separately, asynchronously. make sure we have them all.

                var appType = $scope.versionInfo.appType;
                var imageFamilyMap = $scope.referenceData.imageFamilyMap;
                var device;
                for (var i = 0; i < $scope.referenceData.deviceFamilies[appType].length; i++) {
                    device = $scope.referenceData.deviceFamilies[appType][i];
                    var deviceInfo = imageFamilyMap[device];
                    var locKey = deviceInfo.locKey;
                    var userFriendlyName = $scope.l10n.interpolate(locKey);
                    $scope.deviceNameMap[device] = userFriendlyName;
                    $scope.deviceNames[i] = device; 
                    if (i === 0) {
                        $scope.currentDevice = device;
                    }
                }
            }
        };

        /*$scope.$watch('l10n', function(newVal, oldVal) {
            $scope.updateDevices();
        });*/
        $scope.$on('parentScopeLoaded',function(event,data){
            $scope.updateDevices();
        });

        /*$scope.$watch('versionInfo', function(newVal, oldVal) {
            $scope.updateDevices();
        });*/

        // Updates some variables from data received from the server for app trailer
        // Note: this method should be called first from loadAppDetails() then
        // any time $scope.currentLoc changes and 
        // anytime $scope.currentDevice changes. 
        $scope.updateSnapshotDetails = function(async) {
            $scope.snapshotInfo.dontAnimate = true; 
            $scope.snapshotInfo.error = false; // clear out any errors from previous device/lang group. 
            $scope.snapshotInfo.totalImageWidth = 0; // always start a new batch of images off with a totalImageWidth (before any are added) of 0.
            var videoWasLoading = ($scope.appPreviewSnapshotShowing === false);
            $scope.appPreviewSnapshotShowing = true; 
            $scope.appPreviewDropped = false;
            $scope.numImagesNotReady = 0;
            //$scope.midSnapshotUpdate = true; // so that drop zone doesn't show during snapshot update
            $scope.snapshotInfo.maxHeight = 0;
            $scope.snapshotInfo.showSlideShow = false;
            $scope.snapshotInfo.currentIndex = -1;
            $scope.snapshotInfo.videoShowing = false;
            $scope.snapshotInfo.cantPlayVideo = false;
            $scope.snapshotInfo.grabHasHappenedBefore = false;
            
            var that = this;
            var func = function() {        

                var timeoutDelay = 0;           
                
                var savedImgs, savedVids;
                
                // temporarily save images at previewImages before changing them, in order to clear out
                // previewImages - if not cleared out, the animation gets a little wacky. We put the images
                // right back below.
                if (that.lastLoc && that.lastDev) {    // if lastLoc and lastDev exists
                    // save images
                    savedImgs = $scope.previewImages.slice(0);  // copy the array by value!! 
                    $scope.snapshotInfo.ignoreImageLengthChange = true;
                    $scope.previewImages.length = 0; 
                    $scope.$apply();
                    $scope.snapshotInfo.ignoreImageLengthChange = false;

                    // save videos
                    if ($scope.referenceData.appPreviewEnabled) {
                        savedVids = $scope.previewVideos.slice(0);  // copy the array by value!! 
                        $scope.snapshotInfo.ignoreVideoLengthChange = true;
                        $scope.$apply(); // apply the ignoreVideoLengthChange beroe changing previewVideos
                        $scope.previewVideos.length = 0; 
                        $scope.$apply();
                        $scope.snapshotInfo.ignoreVideoLengthChange = false;
                    }
                    //$scope.$apply();

                    // if there were images or videos, they take 500ms to fade out.
                    // If there weren't, no need to wait 500 secs.
                    if (savedImgs.length > 0 || (savedVids && savedVids.length>0)) {
                        timeoutDelay = 500;
                    }
                }
                
                $timeout(function() {
                    if (savedImgs) { // put the images back.
                        $scope.allImages.setGroup(that.lastLoc, that.lastDev, savedImgs);
                    }
                    if (savedVids) { // put the videos back.
                        
                        // only setGroup if loaded the video.
                        if (videoWasLoading) {
                            $scope.allVideos.clearGroup("ALL LANGUAGES", that.lastDev);
                        }
                        else {
                            $scope.allVideos.setGroup("ALL LANGUAGES", that.lastDev, savedVids);
                        }
                    }

                    var langStr = $scope.getLanguageString($scope.currentLoc);  

                    // IMAGES
                    // if already initialized this language/device group just get the group
                    if ($scope.allImages.initialized(langStr, $scope.currentDevice)) {
                          
                        $scope.previewImages = $scope.allImages.getGroup(langStr, $scope.currentDevice);
                        $scope.$apply(); // important
                        for (var i = 0; i < $scope.previewImages.length; i++) {
                            $scope.$broadcast('setImagePreview', i);
                        }
                        
                    }
                    else { // if not, initialize the group with data from the server

                        // little fix in case sort order indices start at 1 (or more). They should start at 0!
                        //$scope.decrementScreenshotSortOrderStartIndices($scope.currentDevice, $scope.currentLoc);
                        var startSortOrderIndex = $scope.getScreenshotSortOrderStartIndex($scope.currentDevice, $scope.currentLoc);

                        // copy values from server ($scope.versionInfo.details) to this temporary data
                        // structure $scope.allImages
                        var details = $scope.versionInfo.details.value[$scope.currentLoc]; 
                        
                        /*
                        var snapshotsValue = details.screenshots.value[$scope.currentDevice];
                        var snapshotsArr;
                        if (snapshotsValue) {
                            snapshotsArr = snapshotsValue.value;
                        }
                        else {
                            snapshotsArr = new Array();
                        }*/

                        var snapshotsArr = details.screenshots.value[$scope.currentDevice].value;
                        
                        //console.info("got snapshots from json: ", snapshotsArr);
                        var snapshot;
                        $scope.previewImages = $scope.allImages.initializeGroup(langStr, $scope.currentDevice);
                        for (var i = 0; i < snapshotsArr.length; i++) {
                            snapshot = snapshotsArr[i].value; // is it possible that snapshot is null here?
                            if ((snapshot.sortOrder-startSortOrderIndex) < $scope.numImages) {    
                            //if (snapshot.sortOrder <= ($scope.numImages-1)) {
                                var dataPlusImageInfo = {};
                                dataPlusImageInfo.data = snapshot.url;
                                dataPlusImageInfo.videoType = false;
                                $scope.previewImages[snapshot.sortOrder - startSortOrderIndex] = dataPlusImageInfo;    
                                //$scope.previewImages[snapshot.sortOrder] = dataPlusImageInfo;           
                                //$scope.$apply(); // important
                                //$scope.$broadcast('setImagePreview', snapshot.sortOrder - 1);
                            }
                        }

                        $scope.$apply(); // important
                        for (var i = 0; i < $scope.previewImages.length; i++) {
                            $scope.$broadcast('setImagePreview', i);
                        }
                    }

                    // VIDEOS
                    if ($scope.referenceData.appPreviewEnabled) { // appTrailers will be null if the property com.apple.jingle.label.appPreview.enabled=false in the properties file
                        
                        // if already initialized this language/device group just get the group
                        if ($scope.allVideos.initialized("ALL LANGUAGES", $scope.currentDevice)) { // one video for ALL languages
                        //if ($scope.allVideos.initialized(langStr, $scope.currentDevice)) {    
                               
                            $scope.previewVideos = $scope.allVideos.getGroup("ALL LANGUAGES", $scope.currentDevice); // one video for ALL languages
                            //$scope.previewVideos = $scope.allVideos.getGroup(langStr, $scope.currentDevice);
                            $scope.$apply(); // important

                            if ($scope.previewVideos.length === 1) {
                                var video = $scope.previewVideos[0];
                                // THOUGHT: if video.data already exists (which it does if switching to a device that already has a video)
                                // there is no need to have setVideoURL do the copyPreview once video loads. We already have the image data!

                                // set up the object (data) to pass to setVideoURL
                                var data = {};
                                if (video.videoFile) {
                                    data.file = video.videoFile;
                                    data.previewImage = video.data; // the preview image blob!
                                    data.previewImageFromServer = false;
                                    var videoFile = URL.createObjectURL(data.file);
                                    var videoURL = $sce.trustAsResourceUrl(videoFile);   // this does seem necessary.
                                    data.url = videoURL;

                                    data.previewTimestamp = video.previewTimestamp;
                                    data.upload = false; // don't upload. it's already been uploaded (on drop)

                                    $scope.appPreviewSnapshotShowing = false;  
                                    $scope.$apply(); 
                                    $scope.$broadcast('setVideoURL', data);
                                }
                                else { // if no file (ie. if the video was from the server) 
                                    var data = {};
                                    data.data = video.data;
                                    data.previewImage = video.data; 
                                    if (data.previewImage.indexOf("data:") === 0) { // it is possible that the video will be from the server but the preview image is new
                                        data.previewImageFromServer = false;    
                                    }
                                    else {
                                        data.previewImageFromServer = true;
                                    }
                                    data.previewTimestamp = video.previewTimestamp;
                                    data.isPortrait = (video.imgHeight > video.imgWidth); 
                                    data.upload = false;
                                    //$scope.copyPreview(data, false); // NO. Need to setVideoURL in the last case below.

                                    if (video.processingVideo) { // if video is processing
                                        data.processingVideo = true;
                                        data.cantPlayVideo = true;
                                        $scope.copyPreview(data, false); 
                                    }
                                    else if (video.videoError) { // if video error
                                        data.videoError = true;
                                        data.cantPlayVideo = true;
                                        $scope.copyPreview(data, false); 
                                    }
                                    else { // if video is good and ready
                                        if (video.videoUrlFromServer) {
                                            data.videoUrlFromServer = video.videoUrlFromServer;
                                            data.processingVideo = false;
                                            $scope.appPreviewSnapshotShowing = false;  
                                            $scope.$apply(); 
                                            $scope.$broadcast('setVideoURL', data);
                                        }
                                        else { // shouldn't happen
                                            console.log("Woops - video.videoUrlFromServer was null.");
                                        }
                                    }   
                                }   
                            }         
                        }
                        else { // if not, initialize the group with data from the server
                            
                            // copy values from server ($scope.versionInfo.details) to this temporary data
                            // structure $scope.allImages
                            var details = $scope.versionInfo.details.value[$scope.currentLoc]; 
                            
                            var dataForDevice = details.appTrailers.value[$scope.currentDevice];
                            if (dataForDevice) {
                                var videoData = dataForDevice.value;
                                if (!videoData) {
                                    $scope.previewVideos = $scope.allVideos.initializeGroup("ALL LANGUAGES", $scope.currentDevice);
                                    //$scope.previewVideos = $scope.allVideos.initializeGroup(langStr, $scope.currentDevice);
                                    $scope.$apply();
                                }
                                else {
                                    console.info("***got video from json: ", videoData);
                                    /* videoData example:
                                        contentType: null
                                        descriptionXML: null
                                        fullSizedPreviewImageUrl: "https://t3.mzstatic.com/us/r38/PurpleVideo4/v4/8b/a9/c0/8ba9c0c9-a963-4286-526a-71bcdd043be9/Job28f35160-0cca-46f2-80b3-7a11dc7c02e2-62011460-PreviewImage_quicktime-Time1400885179368.png?downloadKey=1401665664_bc433c04ed9a9f4f88d3871381c05300"
                                        isPortrait: false
                                        pictureAssetToken: null
                                        previewFrameTimeCode: "00:05"
                                        previewImageStatus: "ERROR"
                                        previewImageUrl: "https://t2.mzstatic.com/us/r38/Video6/v4/86/92/97/869297e0-dcf0-92fa-cec2-5a92ad13fd6d/image230x172.jpeg"
                                        videoAssetToken: null
                                        videoStatus: "Done"
                                        videoUrl
                                    */

                                    $scope.previewVideos = $scope.allVideos.initializeGroup("ALL LANGUAGES", $scope.currentDevice);
                                    //$scope.previewVideos = $scope.allVideos.initializeGroup(langStr, $scope.currentDevice);

                                    $scope.$apply();

                                    var data = {};
                                    data.data = videoData.fullSizedPreviewImageUrl;
                                    data.previewImage = videoData.fullSizedPreviewImageUrl;
                                    data.previewImageFromServer = true;
                                    //data.file = scope.file; // need to set data.file???
                                    data.previewTimestamp = "00:00:" + videoData.previewFrameTimeCode;
                                    data.isPortrait = videoData.isPortrait;
                                    data.upload = false;
                                    // options for videoStatus: Error, Done, Running, NotFound
                                    if (videoData.videoStatus === "Done" && videoData.videoUrl) {
                                        data.videoUrlFromServer = videoData.videoUrl;
                                        data.processingVideo = false;
                                        $scope.appPreviewSnapshotShowing = false; 
                                        $scope.$apply(); 
                                        $scope.$broadcast('setVideoURL', data);
                                    }
                                    // videoUrl has not been filled yet. Video is processing
                                    else if (videoData.videoStatus === "Running" || !videoData.videoUrl) { 
                                        var data = {};
                                        data.data = videoData.fullSizedPreviewImageUrl;
                                        if (!videoData.fullSizedPreviewImageUrl) {
                                            // not sure yet how to handle this
                                            console.log("preview image url does not exist yet: " + videoData.previewImageStatus);
                                        }
                                        data.previewImage = videoData.fullSizedPreviewImageUrl;
                                        data.previewImageFromServer = true;
                                        //data.file = scope.file; // need to set data.file???
                                        data.previewTimestamp = "00:00:" + videoData.previewFrameTimeCode;
                                        data.isPortrait = videoData.isPortrait;
                                        data.upload = false;
                                        data.processingVideo = true;
                                        data.cantPlayVideo = true;
                                        $scope.copyPreview(data, false); 
                                    }
                                    else if (videoData.videoStatus === "Error") { // shouldn't happen anymore. Backend no longer returns Error.
                                        console.log("video status ERROR.");
                                        
                                        var data = {};
                                        data.data = videoData.fullSizedPreviewImageUrl;
                                        if (!videoData.fullSizedPreviewImageUrl) {
                                            // not sure yet how to handle this
                                            console.log("preview image url does not exist yet: " + videoData.previewImageStatus);
                                        }
                                        data.previewImage = videoData.fullSizedPreviewImageUrl;
                                        data.previewImageFromServer = true;
                                        //data.file = scope.file; // need to set data.file???
                                        data.previewTimestamp = "00:00:" + videoData.previewFrameTimeCode;
                                        data.isPortrait = videoData.isPortrait;
                                        data.upload = false;
                                        data.videoError = true;
                                        data.cantPlayVideo = true;
                                        $scope.copyPreview(data, false); 
                                    }
                                }
                            }
                            
                        }
                    }

                    that.lastLoc = langStr; 
                    that.lastDev = $scope.currentDevice;

                    $scope.midSnapshotUpdate = false;
                    //$scope.updatePreviewWidth(); // kinda want to comment this out. not needed here. only needed when an image loads or is deleted.

                    $scope.$broadcast('mediaUpdated'); // let the dropzone know, so it can update it's instruction text.

                }, timeoutDelay); // wait for disappearing images to animate away.
            };
            
            // Why a $timeout? Because of the important $apply call below that has to happen before the 
            // $broadcast. Without this $timeout, an exception occurs if a digest cycle is in progress. 
            // Since this method is called during a digest cycle (from $scope.loadAppDetails), 
            // an exception occurs otherwise. More info here: 
            // http://stackoverflow.com/questions/23070822/angular-scope-apply-vs-timeout-as-a-safe-apply
            if (async) {
                $timeout(func);
            }
            else {
                func();
            }
        };

        // Broadcasts a width change to the drop zone.
        $scope.updatePreviewWidth = function() {
            var data = {};

            // the margin on the last screenshot needs to change from 20px to 0px for the margin on the
            // scroll container to work right. This needs to be done before the broadcast of
            // totalPreviewWidthChanged
            $scope.$broadcast('updateLastScreenShotMargins');
  
            data.total = $scope.getTotalPreviewImagesWidth();
            $scope.setMaxImageHeight();
            data.fakeNoDropZone = false; 
            $scope.$broadcast('totalPreviewWidthChanged', data);

        };


        /* **************************************************
        New Version Function
        ************************************************** */
        $scope.closeVersionModal = function(saving) {
            $scope.tempPageContent.showSaveVerError = false;
            $scope.tempPageContent.saveVerMsg = "";
            $scope.tempPageContent.clearValidationNewVersionModal = true;
            if (saving) {
                $scope.createAppVersionSaving = true;
                //submit data to api
                var newVersionJson = { version: $scope.tempPageContent.newVersionNumber };
                createAppVersionService.create($scope.adamId,newVersionJson).then(function(data){
                    $scope.createAppVersionSaving = false;
                    if (data.status == "403") {
                        $scope.tempPageContent.showSaveVerError = true;
                        $scope.tempPageContent.saveVerMsg = data.data.messages.error[0];
                    } else if (data.status == "500") {
                        $scope.tempPageContent.showSaveVerError = true;
                        $scope.tempPageContent.saveVerMsg = $scope.l10n.interpolate('ITC.savingerror.canNotSave');
                    } else {
                        //save went through - go to (new) version page (reload page)
                        $route.reload();
                    }
                });
            } else {
                $scope.modalsDisplay.newVersion = false;
            }
        }

        /* **************************************************
        App Icon functions
        ************************************************** */
        $scope.getAppIconDisplayUrl = function() {
            if ($scope.versionInfo !== undefined && $scope.versionInfo.largeAppIcon.value && $scope.versionInfo.largeAppIcon.value.fullSizeUrl !== null) {
                return $scope.versionInfo.largeAppIcon.value.fullSizeUrl;
            } else if ($scope.tempPageContent.appIconDisplayUrl !== null) {
                return $scope.tempPageContent.appIconDisplayUrl;
            }
        }
        $scope.largeAppIconUpload = function() { 
            if ($scope.tempPageContent.LargeAppIconFile !== undefined && $scope.tempPageContent.LargeAppIconFile !== null) {
                $scope.tempPageContent.appIconInProgress = true;
                $scope.imageUploadsInProgress++;
                $scope.appIconUpload = $upload.upload({
                    url: $scope.referenceData.directUploaderUrls.appIconImageUrl, 
                    method: 'POST',
                    headers: {'Content-Type': $scope.tempPageContent.LargeAppIconFile.type,
                              'X-Apple-Upload-Referrer': window.location.href,
                              'X-Apple-Upload-AppleId': $scope.adamId,
                              'X-Apple-Upload-Correlation-Key': $scope.versionInfo.appType + ":AdamId=" + $scope.adamId + ":Version=" + $scope.versionInfo.version.value,
                              'X-Apple-Upload-itctoken': $scope.appVersionReferenceData.ssoTokenForImage,
                              'X-Apple-Upload-ContentProviderId': $scope.user.contentProviderId,
                              'X-Original-Filename': $scope.tempPageContent.LargeAppIconFile.name
                             },
                    file: $scope.tempPageContent.LargeAppIconFile
                }).progress(function(evt) {
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    //$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    //console.log("Success uploading large app icon to DU");
                    $scope.addAppIconDataToMainJson(data);
                    $scope.tempPageContent.appIconInProgress = false;
                    $scope.imageUploadsInProgress--;

                    $scope.tempPageContent.appIconDisplayUrl = URL.createObjectURL($scope.tempPageContent.LargeAppIconFile); 

                }).error(function(data, status, headers, config) {
                    //console.log("LARGE APP ICON ERROR: Status - " + status);
                    if (data) {
                       var locErrorKey = "ITC.apps.validation."+ data.suggestionCode.toLowerCase();
                        var errorToShow = $scope.l10n.interpolate(locErrorKey);
                        if ($scope.l10n.interpolate(locErrorKey) === locErrorKey) {
                            errorToShow = $scope.l10n.interpolate('ITC.AppVersion.GeneralInfoSection.AppIconErrors.ImageNotLoaded');
                        } 
                    } else {
                        var errorToShow = $scope.l10n.interpolate('ITC.AppVersion.DUGeneralErrors.FileNotLoaded');
                    }
                    
                    $scope.tempPageContent.appIconInProgress = false;
                    $scope.tempPageContent.userReadyToSave = false; //if we are in mid-save - stop
                    /*$scope.versionloaded = true;
                    $scope.setisReady();*/
                    $scope.setIsSaving(false);
                    $scope.saveInProgress = false;
                    $scope.simpleDropErrors.error = errorToShow;
                    $scope.imageUploadsInProgress--;
                });
            }
        }
        $scope.addAppIconDataToMainJson = function(data) {
            if (!$scope.versionInfo.largeAppIcon.value) {
                $scope.versionInfo.largeAppIcon.value = {};
            } 
            $scope.versionInfo.largeAppIcon.value.assetToken = data.token;
            $scope.versionInfo.largeAppIcon.value.fullSizeUrl = null;
            $scope.versionInfo.largeAppIcon.value.url = null;
        }

        /* **************************************************
        Save Function
        ************************************************** */
        $scope.saveVersionDetails = function() {
            console.log("started to save version details");
            console.log($scope.versionInfo);
            $scope.tempPageContent.userReadyToSave = true;
            $scope.saveInProgress = true;
            /*$scope.versionloaded = false;
            $scope.setisReady();*/
            $scope.setIsSaving(true);
            //only thing stopping save is any uploads in progress... will watch for them to be done then come back
            if ($scope.imageUploadsInProgress === 0) {
                if ($routeParams.ver && $routeParams.ver === "cur") {
                    $scope.saveIsLive = true;
                } else {
                    $scope.saveIsLive = false;
                }
                saveVersionService.async($scope.adamId,$scope.versionInfo,$scope.saveIsLive).then(function(data) {
                    if (data.status == "500") {
                        //console.log("We've got a server error... 500")
                        /*$scope.versionloaded = true;
                        $scope.setisReady();*/
                        $scope.setIsSaving(false);
                        $scope.saveInProgress = false;
                        $scope.tempPageContent.showAdditionalError = true;
                        //$scope.tempPageContent.messageDisplaying = true;
                        $scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.ProblemDuringSave');
                        $scope.tempPageContent.scrollnow = true;
                    } else {
                        console.log("tried to save version details");
                        console.log(data);
                        //check for errors...
                        $scope.tempPageContent.contentSaved = true; //but may not have gone through - sectionErrorKeys will indicate status
                        //section error key check done in setupPageData...
                        $scope.setupPageData(data.data);
                    }
                });
            }
        };
                //used to check to see if "save" button should be enabled
        //Also acts as a general check if there are changes on page
        $scope.shouldSaveEnabled = function() {

            if ($scope.tempPageContent !== undefined && $scope.l10n !== undefined && $scope.versionInfo !== undefined) {
                //console.log("should save enabled called..." + (angular.toJson($scope.versionInfo) !== angular.toJson($scope.orignalVersionInfo)) );
                if (angular.toJson($scope.versionInfo) !== angular.toJson($scope.orignalVersionInfo) ||  $scope.imageUploadsInProgress > 0) {
                        //there are changes now on the page - hide the "content saved" message
                        $scope.tempPageContent.contentSaved = false;
                        $scope.enableSaveButton = true;
                        $scope.tempPageContent.showSaveConfirm = false; //hide save confirm messages - and "saved" button styling
                        $scope.tempPageContent.confirmLeave.needToConfirm = true;
                        if ($scope.imageUploadsInProgress === 0) {
                            $scope.tempPageContent.confirmLeave.msgH1 = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.SaveChangesBeforeLeaving.Title'); //only used on custom confirmLeave modal
                            $scope.tempPageContent.confirmLeave.msg = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.SaveChangesBeforeLeaving.message');
                        } else {
                            $scope.tempPageContent.confirmLeave.msgH1 = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.UploadInProgressBeforeLeaving.Title'); //only used on custom confirmLeave modal
                            $scope.tempPageContent.confirmLeave.msg = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.UploadInProgressBeforeLeaving.message');
                        }
                } else if ($scope.versionInfo.isSaveError) {
                    $scope.enableSaveButton = true;
                    $scope.tempPageContent.confirmLeave.needToConfirm = true;
                    $scope.tempPageContent.contentSaved = false;
                    if ($scope.imageUploadsInProgress === 0) {
                        $scope.tempPageContent.confirmLeave.msgH1 = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.SaveChangesBeforeLeaving.Title'); //only used on custom confirmLeave modal
                        $scope.tempPageContent.confirmLeave.msg = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.SaveChangesBeforeLeaving.message');
                    } else {
                        $scope.tempPageContent.confirmLeave.msgH1 = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.UploadInProgressBeforeLeaving.Title'); //only used on custom confirmLeave modal
                        $scope.tempPageContent.confirmLeave.msg = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.UploadInProgressBeforeLeaving.message');
                    }
                } else {
                        //no new changes - nothing to save.
                        $scope.enableSaveButton = false;

                        //but is this in response to an error. if we have error keys and the issue isn't from a backend save error - save is not enabled - but we need to warn them before they leave the page.
                        if ($scope.versionInfo.sectionErrorKeys !== undefined && 
                        $scope.versionInfo.sectionErrorKeys !== null && 
                        $scope.versionInfo.sectionErrorKeys.length > 0 && $scope.versionInfo.validationError) {
                            $scope.tempPageContent.confirmLeave.needToConfirm = true;
                            if ($scope.imageUploadsInProgress === 0) {
                                $scope.tempPageContent.confirmLeave.msgH1 = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.SaveChangesBeforeLeaving.Title'); //only used on custom confirmLeave modal
                                $scope.tempPageContent.confirmLeave.msg = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.SaveChangesBeforeLeaving.message');
                            } else {
                                $scope.tempPageContent.confirmLeave.msgH1 = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.UploadInProgressBeforeLeaving.Title'); //only used on custom confirmLeave modal
                                $scope.tempPageContent.confirmLeave.msg = $scope.l10n.interpolate('ITC.AppVersion.PageLevelMessages.UploadInProgressBeforeLeaving.message');
                            }
                        } else {
                            $scope.tempPageContent.confirmLeave.needToConfirm = false;
                            $scope.tempPageContent.confirmLeave.msg = "";
                        }
                        
                       
                }
                //now check for errors on the page
                if (($scope.versionInfo.sectionErrorKeys !== undefined && 
                        $scope.versionInfo.sectionErrorKeys !== null && 
                        $scope.versionInfo.sectionErrorKeys.length > 0) ||
                    ($scope.tempPageContent.errorTracker !== undefined && 
                        $scope.tempPageContent.errorTracker.length > 0) || 
                    ($scope.tempPageContent.formErrors.count !== undefined && 
                        $scope.tempPageContent.formErrors.count > 0) || 
                    $scope.showRatingsErrorIcon) {
                        $scope.tempPageContent.thisPageHasErrors = true; 
                        $scope.tempPageContent.showSaveConfirm = false;
                } else if ($scope.tempPageContent.contentSaved) {
                    $scope.tempPageContent.thisPageHasErrors = false; 
                    $scope.tempPageContent.showSaveConfirm = true;
                }
                /*$scope.tempPageContent.showSaveError || 
                    ($scope.versionInfo.sectionErrorKeys !== undefined && 
                        $scope.versionInfo.sectionErrorKeys !== null && 
                        $scope.versionInfo.sectionErrorKeys.length > 0) ||
                    ($scope.tempPageContent.errorTracker !== undefined && 
                        $scope.tempPageContent.errorTracker.length > 0) || 
                    ($scope.tempPageContent.formErrors.count !== undefined && 
                        $scope.tempPageContent.formErrors.count > 0) || 
                    $scope.showRatingsErrorIcon*/
                
                /*console.log("$scope.versionInfo.sectionErrorKeys.length " +  $scope.versionInfo.sectionErrorKeys.length)
                console.log("$scope.tempPageContent.thisPageHasErrors " +  $scope.tempPageContent.thisPageHasErrors) 
                console.log("$scope.tempPageContent.showSaveError " +  $scope.tempPageContent.showSaveError)
                console.log("tempPageContent.formErrors.count " +  $scope.tempPageContent.formErrors.count)
                console.log("$scope.tempPageContent.errorTracker.length " + $scope.tempPageContent.errorTracker.length)*/
                $timeout(function() {//removing this will cause a crash since this function is called from within a "$watch"
                    $scope.$apply();
                });
            }
           
        }
        /*$scope.shouldShowTopMessage = function() {
            /*
            $scope.tempPageContent.showSaveError = false;
            * /
            //$scope.tempPageContent.showSaveConfirm = false;
            //$scope.tempPageContent.showPageError = false;
            //$scope.tempPageContent.messageDisplaying = false;
            $scope.tempPageContent.thisPageHasErrors = false;

            if (!$scope.tempPageContent.contentSaved && $scope.tempPageContent.showSaveError) { 
                //did we just come back from saving and are there now errors?
                //$scope.tempPageContent.messageDisplaying = true;
                $scope.tempPageContent.showSaveConfirm = false;
                $scope.tempPageContent.showPageError = false; //because we're showing a save error instead
                $scope.tempPageContent.thisPageHasErrors = true;
            } else if (($scope.tempPageContent.errorTracker !== undefined && $scope.tempPageContent.errorTracker.length > 0) || ($scope.tempPageContent.formErrors.count !== undefined && $scope.tempPageContent.formErrors.count > 0) || $scope.showRatingsErrorIcon) {
                //are there any errors on the page (not related to a recent save)
                /*$scope.tempPageContent.messageDisplaying = true;
                $scope.tempPageContent.showSaveConfirm = false;
                $scope.tempPageContent.showPageError = true;* /
                $scope.tempPageContent.thisPageHasErrors = true;
            } else if ($scope.tempPageContent.contentSaved) { //page was saved ok - so show save confirm message
                //$scope.tempPageContent.messageDisplaying = true;
                $scope.tempPageContent.showSaveConfirm = true;
                //$scope.tempPageContent.showPageError = false;
                $scope.tempPageContent.thisPageHasErrors = false;
            }
            $timeout(function() {//removing this will cause a crash since this function is called from within a "$watch"
                $scope.$apply();
            }); 
        }*/


        /* **************************************************
        Main page load / init functions
        ************************************************** */
        $scope.loadVersionDetails = function() {
            $scope.tempPageContent.scrollnow = true;
            /********** if cur is in URL - specifically look up live version *******/
            if ($routeParams.ver && $routeParams.ver === "cur") {
                //adding this to ensure we have all pagewrapper JSONs before loading app details...
                appDetailsService.versionInfo($scope.adamId,true).then(function(data) {
                    if (data.status == "500") {
                        /*$scope.versionloaded = true;
                        $scope.setisReady();
                        $scope.tempPageContent.showAdditionalError = true;*/
                        //$scope.tempPageContent.messageDisplaying = true;
                       // $scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.AppNotLoaded');
                        window.location = global_itc_path + "/wa/defaultError";
                    } else {
                        $scope.versionInfo = data.data;
                                //hold off loading the rest of the page until parentscope is loaded
                        $scope.$parent.$watch('parentScopeLoaded',function() {
                            if ($scope.parentScopeLoaded && !$scope.pageHasLoadedOnce) {
                                $scope.setupPageData(false);
                                $scope.pageHasLoadedOnce = true;
                            }
                        });
                    }
                });
            } else {
                appDetailsService.versionInfo($scope.adamId).then(function(data) {
                    if (data.status == "500") {
                        /*$scope.versionloaded = true;
                        $scope.setisReady();
                        $scope.tempPageContent.showAdditionalError = true;
                        //$scope.tempPageContent.messageDisplaying = true;
                        $scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.AppNotLoaded');*/
                        window.location = global_itc_path + "/wa/defaultError";
                    } else {
                        $scope.versionInfo = data.data;
                        //hold off loading the rest of the page until parentscope is loaded
                        $scope.$parent.$watch('parentScopeLoaded',function() {
                            if ($scope.parentScopeLoaded && !$scope.pageHasLoadedOnce) {
                                $scope.setupPageData(false);
                                $scope.pageHasLoadedOnce = true;
                            }
                        });
                    }
                });
            }
        }
        $scope.setupPageData = function(updatedVersionInfo) { //pass in updated version info after a save
                $rootScope.currentPage = $scope.l10n.interpolate('ITC.HomePage.ManagePurpleSoftwareLinkText'); //text in header
                //reset page load issues error
                $scope.tempPageContent.showAdditionalError = false;
                $scope.tempPageContent.additionalError = "";

                //reset ready to save
                $scope.tempPageContent.userReadyToSave = false;

                //reset versioninfo scope
                if (updatedVersionInfo) { //if we have updated version info - put it into main scope object..
                    //console.log("updated version info: " , updatedVersionInfo);
                    $scope.versionInfo = updatedVersionInfo;
                }

                //scroll to top if page was just saved and there's errors
                if ($scope.versionInfo.sectionErrorKeys !== undefined && $scope.versionInfo.sectionErrorKeys !== null && $scope.versionInfo.sectionErrorKeys.length > 0) {
                    $scope.tempPageContent.contentSaved = false;
                    //$scope.tempPageContent.showSaveError = true;
                    $scope.tempPageContent.scrollnow = true;
                    //console.log("$scope.tempPageContent.scrollnow "+$scope.tempPageContent.scrollnow)
                } else if ($scope.tempPageContent.contentSaved) {
                    //$scope.tempPageContent.showSaveError = false;
                    $scope.tempPageContent.scrollnow = false;
                    //refresh header...
                    $scope.$broadcast('reloadappheader');
                } else if ($scope.tempPageContent.contentReceivedUpdate) { //used for versioninfo updates unrelated to saving behavior. i.e. make app available.
                    $scope.tempPageContent.scrollnow = false;
                    $scope.$broadcast('reloadappheader');
                }

                //add language TEXT to use for sorting.
                $scope.versionInfo.details.value = $scope.addPageLanguageValues($scope.versionInfo.details.value);
                $scope.versionInfo.details.value = $scope.sortDetailsByLocalization($scope.versionInfo.details.value);
            
                //set default loc view to default loc/primary lang            
                $scope.currentLoc = $scope.primaryLangKey = $scope.getLanguageKey($scope.versionInfo.primaryLanguage.value);
                //remove used localizations from the list of localization that can be added
                $scope.updateNonLocalizedList();

                // format readonly description, release notes
                if ($scope.versionInfo.details != undefined && $scope.versionInfo.details.value[$scope.currentLoc].description.value != "" && $scope.versionInfo.details.value[$scope.currentLoc].description.value != null) {
                   $scope.currentDescriptionReadonly = $sce.trustAsHtml($scope.versionInfo.details.value[$scope.currentLoc].description.value.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />')); 
                }
                if ($scope.versionInfo.details != undefined && $scope.versionInfo.details.value[$scope.currentLoc].releaseNotes.value != "" && $scope.versionInfo.details.value[$scope.currentLoc].releaseNotes.value != null) {
                    $scope.currentRealeaseNotesReadonly = $sce.trustAsHtml($scope.versionInfo.details.value[$scope.currentLoc].releaseNotes.value.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />'));
                }

                //determine class for description textarea
                if ($scope.hideIfNullAndNotEditable($scope.versionInfo.details.value[$scope.currentLoc].releaseNotes)) {
                    $scope.tempPageContent.descriptionClass = 'tall';
                } else {
                    $scope.tempPageContent.descriptionClass = 'extraTall';
                }

                //format localized error strings:

                $scope.tempPageContent.descriptionMaxCharsExceeded = $scope.l10n.interpolate('ITC.AppVersion.LocalizedSection.DescriptionErrors.MaxCharsExceeded', {'maxchars':$scope.referenceData.appMetaDataReference.maxAppDescriptionChars});

                $scope.tempPageContent.releaseNotesMaxCharsExceeded = $scope.l10n.interpolate('ITC.AppVersion.LocalizedSection.ReleaseNotesErrors.MaxCharsExceeded',{'maxchars':$scope.referenceData.appMetaDataReference.maxAppReleaseNotesChars});

                $scope.tempPageContent.reviewNotesMaxCharsExceeded = $scope.l10n.interpolate('ITC.AppVersion.AppReviewSection.reviewNotesMaxChars',{'maxchars':$scope.referenceData.appMetaDataReference.maxReviewNotesChars});
                
                $scope.tempPageContent.entitlementMaxCharsExceeded = $scope.l10n.interpolate('ITC.AppVersion.AppSandboxInformation.EntitlementJustificationMaxChars',{'maxchars':$scope.referenceData.appMetaDataReference.maxJustificationChars});

                $scope.updateEULAInfo();

                $scope.initializeMediaErrorHolder();
                
                // if there were errors, don't clear previous values
                if (!$scope.updatedVersionInfoHasErrors($scope.versionInfo)) { // if no errors
                    $scope.initSnapshotDetails(); // clear previous values from temporary storage (groups)
                
                } else { // if had errors, keep temporary storage (groups) and save errors to them
                    $scope.checkForSnapshotErrors($scope.versionInfo);
                    $scope.checkForVideoErrors($scope.versionInfo);
                    this.lastLoc = null; // important to clear out lastLoc and lastDev
                    this.lastDev = null; // before calling updateSnapshotDetails()
                }
                $scope.updateSnapshotDetails(true); // update snapshots & video from either the server or from temp storage

                if (!$scope.versionInfo.largeAppIcon.errorKeys || $scope.versionInfo.largeAppIcon.errorKeys.length === 0) { // as long as the error wasn't with the app icon
                    $scope.simpleDropErrors.error = false; // clear clear app icon error that might be displaying
                }
                if (!$scope.versionInfo.newsstand.errorKeys || $scope.versionInfo.newsstand.errorKeys.length === 0) { // as long as the error wasn't with the app icon
                    $scope.simpleDropNewsstandErrors.error = false; // clear clear app icon error that might be displaying
                }

                //get cleaner "app type" value
                if ($scope.versionInfo.appType == "iOS App") {
                    $scope.tempPageContent.isIOS = true;
                    $scope.tempPageContent.isMac = false;
                    $scope.tempPageContent.appType = "iOS";
                } else if ($scope.versionInfo.appType == "Mac OS X App") {
                    $scope.tempPageContent.isIOS = false;
                    $scope.tempPageContent.isMac = true;
                    $scope.tempPageContent.appType = "Mac";
                }

                //setup display app icon url
                if ($scope.versionInfo.largeAppIcon.value && $scope.versionInfo.largeAppIcon.value.url !== undefined && $scope.versionInfo.largeAppIcon.value.url !== null) {
                    $scope.tempPageContent.appIconDisplayUrl = $scope.versionInfo.largeAppIcon.value.url;
                } else if ($scope.tempPageContent.appIconDisplayUrl !== undefined && $scope.tempPageContent.appIconDisplayUrl !== null) {
                    //do nothing..
                } else {
                    $scope.tempPageContent.appIconDisplayUrl = null;
                }

                if ($scope.versionInfo.newsstand.value !== null) {
                    //setup newsstand image url
                    if ($scope.versionInfo.newsstand.value.url !== undefined && $scope.versionInfo.newsstand.value.url !== null) {
                        $scope.tempPageContent.newsstandImageDisplayUrl = $scope.versionInfo.newsstand.value.url;
                    } else if ($scope.tempPageContent.newsstandImageDisplayUrl !== undefined && $scope.tempPageContent.newsstandImageDisplayUrl !== null) {
                        //do nothing..
                    } else {
                        $scope.tempPageContent.newsstandImageDisplayUrl = null;
                    }
                }

                /******* REFERENCE DATA FORMATTING ********/
                $scope.$watch('referenceData',function() {
                    if($scope.referenceData != undefined) {
                        $scope.countryList = $scope.referenceData.contactCountries;
                        $scope.countryList.sort();

                        //which list of genres do we need ios or macos
                        if ($scope.tempPageContent.isIOS) {
                            $scope.categoryList = $scope.referenceData.iosgenres;
                        } else if ($scope.tempPageContent.isMac) {
                            $scope.categoryList = $scope.referenceData.macOSGenres;
                            $scope.updateEntitlementsList();
                        }
                        $scope.updateCategoryViews();
                        $scope.updateDevices();
                        $scope.determinePreviewUploadAndPlayPermissions();
                        $scope.setNumVideos();
                    }
                });
                
                // Screenshots: sort and make consecutive before we start listening to versionInfo changes.
                $scope.makeScreenshotSortOrderConsecutive();

                $scope.orignalVersionInfo = angular.copy($scope.versionInfo);
                $scope.setupGameCenter();
                $scope.checkAddOns();
                $scope.checkRatingsErrors();
                $scope.errorCheckingLocalizations();
                $scope.shouldSaveEnabled();
                //$scope.enableSaveButton = false; //should not enable save upon dataload...
                $scope.versionloaded = true;
                $scope.setisReady();
                $scope.setIsSaving(false);
                $scope.saveInProgress = false;
                $scope.submitForReviewInProgress = false;
                //log("Version info: ", $scope.versionInfo);
        }

        // Makes screenshot sort order consecutive for all loc/device combos.
        $scope.makeScreenshotSortOrderConsecutive = function() {
            var screenshotsAtLoc, devices;
            for (var loc = 0; loc < $scope.versionInfo.details.value.length; loc++) {
                screenshotsAtLoc = $scope.versionInfo.details.value[loc].screenshots.value;
                devices = Object.keys(screenshotsAtLoc);
                for (var i=0; i<devices.length; i++) {
                    $scope.makeScreenshotSortOrderConsecutiveByLocDevice(loc, devices[i]);
                }  
            }
        }

        // Makes screenshot sort order consecutive for the given loc/device.
        $scope.makeScreenshotSortOrderConsecutiveByLocDevice = function(loc, device) {
            var details = $scope.versionInfo.details.value[loc]; 
            var snapshotsArr = details.screenshots.value[device].value;

            if (snapshotsArr.length > 0) {
                // Sort
                var sortedSnapshotsArr = _.sortBy(snapshotsArr,function(snapshot) {
                                            return snapshot.value.sortOrder;
                                        });

                // Set a new sortOrder that starts at 1
                var sortedSnapshot;
                for (var i=0; i<sortedSnapshotsArr.length; i++) {
                    sortedSnapshot = sortedSnapshotsArr[i]; 
                    sortedSnapshot.value.sortOrder = i+1;
                }
                
                // Set the newly sorted in versionInfo
                details.screenshots.value[device].value = sortedSnapshotsArr;
            } 
        }

        $scope.sendVersionLive = function() {
            $scope.setIsSaving(true);
            $scope.tempPageContent.sendingVersionLiveInProgress = true;
            saveVersionService.releaseVer($scope.adamId).then(function(data) {
                $scope.setIsSaving(false);
                if (data.status == "500") {
                    console.log("We've got a server error... 500")
                    $scope.setIsSaving(false);
                    $scope.tempPageContent.showAdditionalError = true;
                    //$scope.tempPageContent.messageDisplaying = true;
                    $scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.ErrorOnReleaseToStore');
                    $scope.tempPageContent.scrollnow = true;
                    $scope.tempPageContent.contentReceivedUpdate = false;
                    $scope.tempPageContent.sendingVersionLiveInProgress = false;
                } else {
                    console.log("tried to make app available");
                    console.log(data);
                    $scope.tempPageContent.sendingVersionLiveInProgress = false;
                    $scope.tempPageContent.contentReceivedUpdate = true;
                    //section error key check done in setupPageData...
                    /*$scope.setupPageData(data.data);
                    $scope.tempPageContent.contentReceivedUpdate = true;
                    $scope.tempPageContent.sendingVersionLiveInProgress = false;*/
                    $route.reload();
                }
            });


        }

        $scope.init = function() {
            
            $scope.apploaded = false;
            $scope.versionloaded = false;
            
            $scope.isLiveVersion = false;
            $scope.isInFlightVersion = false;

            $scope.canAddNewVersion = false;

            $rootScope.currentclass = "ManageApps"; //class to highlight the correct box...
            $rootScope.wrapperclass = ""; //reset wrapper class until page is loaded (so header doesn't scroll during loading overlay)

            $scope.saveInProgress = false;
            $scope.submitForReviewInProgress = false;
            $scope.createAppVersionSaving = false;

            $scope.modalsDisplay = {}; //holder for modal show/hide states
            $scope.modalsDisplay.ratingModal = false;
            $scope.modalsDisplay.eulaModal = false;
            $scope.modalsDisplay.iapModal = false;
            $scope.modalsDisplay.buildsModal = false;
            $scope.modalsDisplay.newVersion = false;
            $scope.modalsDisplay.leaderboardSetsModal = false;
            $scope.modalsDisplay.leaderboardsModal = false;
            $scope.modalsDisplay.leaderboardsWithSetsModal = false;
            $scope.modalsDisplay.achievementsModal = false;

            $scope.tempPageContent = {}; //storage of additional objects needed for page content display

            $scope.tempPageContent.appIconDisplayUrl = null;

            $scope.tempPageContent.contentSaved = false;
            $scope.tempPageContent.contentReceivedUpdate = false;
            //$scope.tempPageContent.showSaveError = false;
            $scope.tempPageContent.showAdditionalError = false;
            $scope.tempPageContent.additionalError = "";
            $scope.tempPageContent.sendingVersionLiveInProgress = false;

            $scope.tempPageContent.userReadyToSave = false;
            $scope.tempPageContent.scrollnow = false;

            $scope.tempPageContent.confirmLeave = {}; //storage of error messaging for user leaving page.
            $scope.tempPageContent.confirmLeave.needToConfirm = false;
            $scope.tempPageContent.confirmLeave.msg = "";

            $scope.tempPageContent.clearValidationNewVersionModal = false;

            $scope.tempPageContent.submittingForReview = false;

            /* ???????????? */
            $scope.tempPageContent.showSaveVerError = false;

            $scope.tempPageContent.confirmNewsstandShutOff = false;

            $scope.tempPageContent.showConfirmRemoveLoc = false;
            $scope.tempPageContent.confirmRemoveLocFor = "";
            $scope.tempPageContent.confirmRemoveLocHeader = "";

            $scope.tempPageContent.formErrors = {}; //object to pass to form error handling
            $scope.showRatingsErrorIcon = false;
            //$scope.tempPageContent.additionalErrors = [];
            //$scope.tempPageContent.formErrors.count will > 0 if there are ng-invalid or invalid errors on the page


            /*$scope.tempPageContent.loctextblink = {};
            $scope.tempPageContent.loctextblink.currentLoc = "";
            $scope.tempPageContent.loctextblink.primaryLanguage = "";*/
            $scope.tempPageContent.IAPmodal = {};
            $scope.tempPageContent.IAPmodal.doneButtonDisabled = true;

            $scope.tempPageContent.ratingDialog = {
                "showInfoMessage":false,
                "showWarningMessage":false,
                "showErrorMessage":false,
                "madeForKidsChecked":false,
                "ageBandRatings": []
            };
            $scope.tempRatings = {};
            $scope.tempPageContent.showAdditionalRatings = true;

            $scope.categoryList = [];
            $scope.subCategoryList = [];

            $scope.territoryEulaList = [];

            $scope.tempPageContent.eulaModal = {};

            $scope.tempPageContent.addOns = {};
            $scope.tempPageContent.addOns.submitNextVersion = [];
            $scope.tempPageContent.addOns.modal = [];

            $scope.tempPageContent.leaderboardSets = {};
            $scope.tempPageContent.leaderboardSets.modal = [];

            $scope.tempPageContent.leaderboards = {};
            $scope.tempPageContent.leaderboards.modal = []; 

            $scope.tempPageContent.leaderboardsWithSets = {};
            $scope.tempPageContent.leaderboardsWithSets.modal = []; 
            $scope.associatedLeaderboardSets = [];

            $scope.tempPageContent.achievements = {};
            $scope.tempPageContent.achievements.modal = [];           

            $scope.tempPageContent.entitlements = {};

            $scope.tempPageContent.appLocScrollTop = false;

            $scope.tempPageContent.submitForReviewFieldsRequired = false;

            $scope.buildListLoaded = false;

            $scope.tempPageContent.buildModal = {
                'chosenBuild':""
            };

            $scope.loadAppVersionReferenceData();

            if ($routeParams.adamId) {
                $scope.setisReady();
                $scope.adamId = $routeParams.adamId;
                $scope.initSnapshotDetails(); // this just initializes the vars, doesn't update from data in server yet.

                // TBD: might want to move this elsewhere.
                $scope.simpleDropErrors = {};
                $scope.simpleDropErrors.error = false;
                $scope.simpleDropNewsstandErrors = {};
                $scope.simpleDropNewsstandErrors.error = false;
                $scope.simpleFileDropErrors = {};
                $scope.simpleFileDropErrors.error = false;
                $scope.tempPageContent.transitAppFileInProgress = false; 
                $scope.tempPageContent.appIconInProgress = false;            
                //$scope.loadAppDetails();
                $scope.loadVersionDetails();
            }
            //$scope.loadAppVersionReferenceData(); // @ttn KAREN: same for this...? [karen] Hmm... 
        }
 
        $scope.init();
        
        
        /***** App Version Helper Functions *****/
        $scope.hideIfNullAndNotEditable = function(field) {
            if (field !== undefined && field !== null) {
                if (field.isEditable === false && field.value === null) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        /****** App Trailer functions ******/

        $scope.$watch('appPreviewSnapshotShowing', function(newVal, oldVal) {
            if (newVal) { // if drop zone is done with loader and app preview snap shot is showing.
                if ($scope.delayDeviceChange) {
                    $scope.deviceChanged($scope.deviceToDelayChangeTo);
                }
            }
        });

        $scope.$on('menuPillClicked', function(event, data) { 
            if (data.id === "deviceMenuItem") {
                // Delay device changes until $scope.appPreviewSnapshotShowing is true. (ie. until loader is done showing on dropzone)
                if ($scope.imagesOrAppPreviewNotLoaded()) {
                    // DO NOTHING - changed mind about delaying device change.
                    
                    //$scope.delayDeviceChange = true;
                    //$scope.deviceToDelayChangeTo = data.value;
                }
                else {
                    $scope.delayDeviceChange = false;
                    $scope.deviceChanged(data.value);
                }
            }
            // else - some other menu pill click (if we add menu pills anywhere else in the page)
        });   

        // Return true if app preview has not loaded yet. Ie if there's a loader in the drop zone because of app preview.
        $scope.appPreviewNotLoaded = function() {
            return $scope.appPreviewDropped && !$scope.appPreviewSnapshotShowing;
        };

        $scope.imagesNotLoaded = function() {
            return $scope.numImagesNotReady !== 0;
        };

        $scope.imagesOrAppPreviewNotLoaded = function() {
            return $scope.appPreviewNotLoaded() || $scope.imagesNotLoaded();
        };

        $scope.deviceChanged = function(device) { 
            $scope.currentDevice = device;
            $scope.setNumVideos();

            // update snapshot pics!
            $scope.updateSnapshotDetails(true);
        }; 

        $scope.hasUploader = function(index) {
            return $scope.upload[index] != null;
        };
        $scope.abort = function(index) {
            $scope.upload[index].abort(); 
            $scope.upload[index] = null;
        };

        /* There are a few reasons why we might not want to allow playback of a video:
            1. !$scope.previewPlayAllowed ==> This happens if the browser(s)/os(s) set in the property file (properties: com.apple.jingle.label.appPreview.playAllowedOsAndVersions
                and com.apple.jingle.label.appPreview.playAllowedBrowsersAndVersions) isn't the current browser/os.
            2. The video is processing
            3. The video format doesn't work on the current browser (previewVideos[0].cantPlayVideo will be set to true by the video snapshot directive)
        */
        $scope.cantPlayVideoForOneReasonOrAnother = function() {
            return ($scope.previewVideos.length>0 && $scope.previewVideos[0].cantPlayVideo) || !$scope.previewPlayAllowed;
        };

        // Looks at the browser and version and sets $scope.previewUploadAllowed and $scope.previewPlayAllowed to true/false.
        $scope.determinePreviewUploadAndPlayPermissions = function() {

            $scope.previewUploadAllowed = false;
            $scope.previewPlayAllowed = false;
            
            // userAgent differentces between safari and chrome
            // Note to self: it's pretty yucky getting data out of here.
            // on chrome:   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36"
            // on safari 7: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/537.75.14"

            var allowedUploadBrowserAndVersion, allowedUploadOsAndVersion, allowedPlayBrowserAndVersion, allowedPlayOsAndVersion;

            var allowedUploadBrowser,allowedUploadVersion,allowedUploadOS,allowedUploadOSVersion;
            var allowedPlayBrowser,allowedPlayVersion,allowedPlayOS,allowedPlayOSVersion;

            var ua = navigator.userAgent.toLowerCase(); 
            var partsBetweenSlashes = ua.split("/");
            var browserVersion, browser, osVersion;

            var previewUploadAllowed = false;
            var previewPlayAllowed = false; 

            if (ua.indexOf('safari') != -1) { 
                if (ua.indexOf('chrome') > -1) { // CHROME
                    browser = "chrome";
                } else { // SAFARI
                    browser = "safari"; 
                }
                browserVersion = partsBetweenSlashes[3];
                var index = browserVersion.indexOf(" safari");
                browserVersion = browserVersion.substring(0, index);

                // UPLOAD
                for (var i = 0; i < $scope.referenceData.appPreviewUploadAllowedBrowsersAndVersions.length; i++) { // loop thru browsers
                    allowedUploadBrowserAndVersion = $scope.referenceData.appPreviewUploadAllowedBrowsersAndVersions[i].split(':');

                    allowedUploadBrowser = allowedUploadBrowserAndVersion[0];
                    allowedUploadVersion = allowedUploadBrowserAndVersion[1];

                    for (var j = 0; j < $scope.referenceData.appPreviewUploadAllowedOsAndVersions.length; j++) { // loop thru os's

                        allowedUploadOsAndVersion = $scope.referenceData.appPreviewUploadAllowedOsAndVersions[j].split(':');
                        
                        allowedUploadOS = allowedUploadOsAndVersion[0].toLowerCase();
                        allowedUploadOSVersion = allowedUploadOsAndVersion[1];
                        var uploadOSindex = ua.indexOf(allowedUploadOS);

                        // upload
                        if (browser === allowedUploadBrowser && uploadOSindex != -1) {
                            osVersion = ua.substring(uploadOSindex + allowedUploadOS.length + 1, ua.indexOf(')'));
                            if (!$scope.previewUploadAllowed) { // never switch from allowed to not allowed. once you're allowed, you're allowed.
                                $scope.previewUploadAllowed = $scope.version1IsGreaterThanVersion2(browserVersion, allowedUploadVersion, '.') &&
                                                          $scope.version1IsGreaterThanVersion2(osVersion, allowedUploadOSVersion, '_'); 
                            }
                        }

                    } // end inner for
                } // end outer for  

                // PLAY
                for (var i = 0; i < $scope.referenceData.appPreviewPlayAllowedBrowsersAndVersions.length; i++) { // loop thru browsers
                    allowedPlayBrowserAndVersion = $scope.referenceData.appPreviewPlayAllowedBrowsersAndVersions[i].split(':');

                    allowedPlayBrowser = allowedPlayBrowserAndVersion[0];
                    allowedPlayVersion = allowedPlayBrowserAndVersion[1];

                    for (var j = 0; j < $scope.referenceData.appPreviewPlayAllowedOsAndVersions.length; j++) { // loop thru os's

                        allowedPlayOsAndVersion = $scope.referenceData.appPreviewPlayAllowedOsAndVersions[j].split(':');
                        
                        allowedPlayOS = allowedPlayOsAndVersion[0].toLowerCase();
                        allowedPlayOSVersion = allowedPlayOsAndVersion[1];
                        var playOSindex = ua.indexOf(allowedPlayOS);

                        if (browser === allowedPlayBrowser && playOSindex != -1) {
                            osVersion = ua.substring(playOSindex + allowedUploadOS.length + 1, ua.indexOf(')'));
                            if (!$scope.previewPlayAllowed) { // never switch from allowed to not allowed. once you're allowed, you're allowed.
                                $scope.previewPlayAllowed = $scope.version1IsGreaterThanVersion2(browserVersion, allowedPlayVersion, '.') &&
                                                          $scope.version1IsGreaterThanVersion2(osVersion, allowedPlayOSVersion, '_'); 
                            }
                        }

                    } // end inner for
                } // end outer for  

                // console.log("upload allowed: " + $scope.previewUploadAllowed);
                // console.log("play allowed: " + $scope.previewPlayAllowed);
            } 
        };

        /* Takes two versions, like 35.0.1916.153 and 35.0.1917, and returns true if the first (version1) is greater than OR equal to the second (version2)
           Some more examples: (if separator were a '.')
            greaterThan = $scope.version1IsGreaterThanVersion2("1.2.3.4.5", "1.2");         --> true
            greaterThan = $scope.version1IsGreaterThanVersion2("1", "1.2.3");               --> false
            greaterThan = $scope.version1IsGreaterThanVersion2("1.2.3", "1");               --> true
            greaterThan = $scope.version1IsGreaterThanVersion2("2", "1.2.3");               --> true
            greaterThan = $scope.version1IsGreaterThanVersion2("1.2.3.4.5", "1.2.3.4.6");   --> false
            greaterThan = $scope.version1IsGreaterThanVersion2("1.2.3.4.5", "1.2.3.4.4");   --> true
            greaterThan = $scope.version1IsGreaterThanVersion2("1.2.3.4.5", "2.8.9");       --> false
        */
        $scope.version1IsGreaterThanVersion2 = function(version1, version2, separator) {

            var parts1 = version1.split(separator);
            var parts2 = version2.split(separator);
            if (parts1.length > 0 && parts2.length > 0) {

                var greaterThan = parseInt(parts1[0]) > parseInt(parts2[0]);
                var equal = parseInt(parts1[0]) === parseInt(parts2[0]); 
                if (greaterThan) {
                    return true;
                }
                else if (equal) {
                    var i1, i2, nextPart1, nextPart2;
                    i1 = version1.indexOf(separator);
                    i2 = version2.indexOf(separator);

                    if (i1 == -1 || i2 == -1) { // if this is the last of one or the other
                        if (i1 == -1 && i2 == -1) { // if it's the last of both
                            return true;
                        }
                        else if (i1 == -1) { // if it's the last of the first one
                            return false;
                        }
                        else { // if it's the last of the 2nd
                            return true;
                        }
                    }
                    else {
                        nextPart1 = version1.substring(i1+1, version1.length);
                        nextPart2 = version2.substring(i2+1, version2.length);
                        // recurse
                        return $scope.version1IsGreaterThanVersion2(nextPart1, nextPart2, separator);
                    }
                }
                else {
                    return false;
                }
            }
            // not sure we ever get here but i'll leave it in just in case
            else if (parts1.length > 0) { // parts 2 is empty
                return true;
            }
            else { // part 1 is empty
                return false;
            }
        }

        $scope.$watch('snapshotInfo.cantPlayVideo', function(newVal, oldVal) {
            if (newVal) { // if video snapshot grab directive set cantPlayVideo to true, set previewVideos[0].cantPlayVideo to true.
                if ($scope.previewVideos.length>0) {
                    $scope.previewVideos[0].cantPlayVideo = true;
                }
            }
        });

        $scope.$on('imageLoaded', function(event, data) { 
            if (data.imgIndex !== undefined) {
                if (!data.isVideo) {    
                    $scope.previewImages[data.imgIndex].imgWidth = data.imgWidth; // save the image width
                    $scope.previewImages[data.imgIndex].imgHeight = data.imgHeight; 
                    $scope.previewImages[data.imgIndex].actualImgHeight = data.actualImgHeight; 
                    $scope.previewImages[data.imgIndex].actualImgWidth = data.actualImgWidth; 
                }
                else if ($scope.previewVideos[0]) { // video
                    $scope.previewVideos[data.imgIndex].imgWidth = data.imgWidth; // save the image width
                    $scope.previewVideos[data.imgIndex].imgHeight = data.imgHeight; 
                    $scope.previewVideos[data.imgIndex].actualImgHeight = data.actualImgHeight; 
                    $scope.previewVideos[data.imgIndex].actualImgWidth = data.actualImgWidth; 
                }
            }

            $scope.updatePreviewWidth();
        });      

        $scope.getTotalPreviewImagesWidth = function() {
            var totalWidth = 0;
            var imgWidth;
            for (var i = 0; i < $scope.previewImages.length; i++) {
                imgWidth = $scope.previewImages[i].imgWidth;
                if (imgWidth !== undefined) { // if dropping a few at a time, some will be undefined initially. 
                    totalWidth += imgWidth;
                }
            }
            for (var i = 0; i < $scope.previewVideos.length; i++) {
                imgWidth = $scope.previewVideos[i].imgWidth;
                if (imgWidth !== undefined) {
                    totalWidth += imgWidth;
                }
            }
            return totalWidth;
        },  

        // Sets $scope.snapshotInfo.maxHeight to the height of the highest (tallest) image. The drop zone 
        // watches that variable and sets its height accordingly
        $scope.setMaxImageHeight = function() {
            var maxHeight = 0;
            var imgHeight;
            for (var i = 0; i < $scope.previewImages.length; i++) {
                imgHeight = $scope.previewImages[i].imgHeight;
                if (imgHeight !== undefined) { // if dropping a few at a time, some will be undefined initially. 
                    maxHeight = Math.max(imgHeight, maxHeight);
                }
            }
            for (var i = 0; i < $scope.previewVideos.length; i++) {
                imgHeight = $scope.previewVideos[i].imgHeight;
                if (imgHeight !== undefined) { // if dropping a few at a time, some will be undefined initially. 
                    maxHeight = Math.max(imgHeight, maxHeight);
                }
            }

            $timeout(function() {
                $scope.snapshotInfo.maxHeight = maxHeight;
                $scope.$apply();
            });
        },  

        $scope.$on('insertImageAt', function(event, data) { 
            var from = parseInt(data.from); // not sure why it's a string
            var to = data.to;
            $scope.previewImages.move(from, to);
            $scope.$apply();
            var startSortOrderIndex = $scope.getScreenshotSortOrderStartIndex($scope.currentDevice, $scope.currentLoc);
            $scope.changeScreenshotSortOrderInMainJson(from+startSortOrderIndex, to+startSortOrderIndex, $scope.currentDevice, $scope.currentLoc); 
            //$scope.changeScreenshotSortOrderInMainJson(from, to, $scope.currentDevice, $scope.currentLoc); 
        
            $scope.$broadcast('screenshotDragDone');
        });

        $scope.$on('dragoverZone1', function(event, data) { 
            $scope.$broadcast('dragoverZone2', data); 
        });

        $scope.$on('dragleaveZone1', function(event, data) { 
            $scope.$broadcast('dragleaveZone2', data); 
        });

        $scope.$on('cancelFileUpload', function(event, data) { 
            $scope.showModal = false; // just hide the modal dialog 
        });

        $scope.$on('deletePreview', function(event, data) { 
            $scope.snapshotInfo.error = false; // clear any previous error

            var language = $scope.getLanguageString($scope.currentLoc);
            $scope.allImages.clearGeneralErrors(language, $scope.currentDevice);

            $scope.snapshotInfo.dontAnimate = false; // do animate.
            $scope.deletePreview(data.isVideo, data.index);
        });

        $scope.deleteTransitionEnded = function() { 
            $scope.updatePreviewWidth();
        };

        $scope.deletePreview = function(isVideo, index) {
            if (isVideo) {    
                //$scope.previewVideos.splice(index, 1);
                $scope.allVideos.getGroup("ALL LANGUAGES", $scope.currentDevice).splice(index, 1);
                $scope.deleteAppTrailerDataFromMainJson();
                if ($scope.upload) {
                    $scope.upload.abort();
                }
                // broadcast an event to video_snapshot_grab_directive
                $scope.$broadcast('videoPreviewDeleted');
            }
            else { // this is an image
                // remove the element at index data!
                $scope.previewImages.splice(index, 1); // delete the image from the array on the scope
                var startSortOrderIndex = $scope.getScreenshotSortOrderStartIndex($scope.currentDevice, $scope.currentLoc);
                
                $scope.deleteScreenshotDataFromMainJson(index + startSortOrderIndex, $scope.currentDevice, $scope.currentLoc);  
                //$scope.deleteScreenshotDataFromMainJson(index, $scope.currentDevice, $scope.currentLoc); 
            }

            $scope.snapshotInfo.deletedMediaItem = true;
            $scope.$apply(); // If drop zone was not visible (dropZoneAlreadyShowing was false), this $apply will cause the drop zone to show, and
                            // THAT will trigger an $scope.updatePreviewWidth(), unless deletedMediaItem is true.
            $scope.snapshotInfo.deletedMediaItem = false;                
        };

        $scope.$on('appPreviewSnapshotIsShowing', function(event, data) { 
            $scope.appPreviewSnapshotShowing = true;
            $scope.appPreviewDropped = false; // reset $scope.appPreviewDropped here.
        });

        $scope.copyPreview = function(dataWithFile, isNewVideo) { 
            $scope.showModal = false; // will hide the modal dialog

            var data = dataWithFile.data;
            var videoFile = dataWithFile.file;

            var dataPlusImageInfo = {};
            dataPlusImageInfo.data = data; // image jpg data
            dataPlusImageInfo.videoType = true;
            dataPlusImageInfo.videoFile = videoFile;
            dataPlusImageInfo.previewTimestamp = dataWithFile.previewTimestamp;
            dataPlusImageInfo.processingVideo = dataWithFile.processingVideo;
            dataPlusImageInfo.videoError = dataWithFile.videoError;
            dataPlusImageInfo.cantPlayVideo = dataWithFile.cantPlayVideo;
            dataPlusImageInfo.videoUrlFromServer = dataWithFile.videoUrlFromServer;

            // if there's already a video, we're just grabbing another snapshot from that video
            if ($scope.previewVideos.length === $scope.numVideos) {
                var d = $scope.previewVideos[$scope.numVideos-1];
                d.data = data; // image jpg data
                d.videoType = true; 
                d.previewTimestamp = dataWithFile.previewTimestamp;

                $scope.appPreviewSnapshotShowing = true;
                $scope.$apply(); // important

                // Note: doing the below (replacing one array element with another) does bad things to the animations. 
                // Do it the above way instead.
                //$scope.previewVideos[$scope.numVideos-1] = dataPlusImageInfo;

                $scope.$broadcast('setVideoPreview', $scope.previewVideos.length-1);
            }

            // if not, we're adding a video to previewVideos.
            else {

                // Doing totalPreviewWidthChanged broadcast ahead of time because this is what triggers
                // the drop zone to shrink. Want it to shrink FIRST, to make room for the video snapshot
                // that's about to appear in 500 ms.
                var totalWidth = $scope.getTotalPreviewImagesWidth();
                var data = {};
                data.total = totalWidth + 436; // TBD: remove hardcoding!
                data.fakeNoDropZone = ($scope.previewImages.length===$scope.numImages); // force drop zone to shrink away if it needs to (ie. if all images are filled)
                $scope.$broadcast('totalPreviewWidthChanged', data); 
                $timeout(function() {
                     $scope.previewVideos.push(dataPlusImageInfo);
                     $scope.$apply(); // important
                     $scope.$broadcast('setVideoPreview', $scope.previewVideos.length-1); 
                }, 500); // 500 - just enough time for the drop zone to shrink and make way for this snapshot.
            }

            if (dataWithFile.upload) { 
                var imageFile = $scope.createPreviewImageFile(dataWithFile.data);

                if(isNewVideo) {
                    $scope.videoUploadFile(videoFile, imageFile, dataWithFile.previewTimestamp, dataWithFile.isPortrait); // call uploadVideoPreviewImageFile from there
                }
                else {    
                    // upload video preview image 
                    var url = URL.createObjectURL(imageFile);
                    $scope.uploadVideoPreviewImageFile(imageFile, url, $scope.currentDevice, $scope.currentLoc, dataWithFile.previewTimestamp, dataWithFile.isPortrait); // not sure that sort order matters
                }
            }
            else {
                // if we don't set videoLoaded to true here, loader will show on video preview
                var language = $scope.getLanguageString($scope.currentLoc);
                var device = $scope.currentDevice;
                var loaded = $scope.mediaErrors.getErrorValue(language, device, "videoLoaded"); 
                if (loaded === undefined || loaded === null) { // if it equals FALSE, don't set it to true.
                    $scope.mediaErrors.setErrorValue(language, device, "videoLoaded", true); // otherwise loader will show on video preview
                }
            }
        };

        // So far, just for video load errors, since they need to be saved by language/device.
        $scope.initializeMediaErrorHolder = function() {
            // A generic object to hold errors for language/device combinations.
            var errorHolder = function() {

                // gets the group
                this.getErrorValue = function(language, device, key) {
                    if (this[language] && this[language][device]) {
                        return this[language][device][key];
                    }
                    else {
                        return null;
                    }    
                };

                this.setErrorValue = function(language, device, key, value) {
                    if (!this[language]) {
                        this[language] = {};
                    }
                    if (!this[language][device]) {
                        this[language][device] = {};
                    }

                    this[language][device][key] = value;
                };
            };

            // One object to hold all media errors
            $scope.mediaErrors = new errorHolder();
        };

        // This is how we pass the preview image data along from the videoSnapshotDirective to the videoPreviewDirective.
        $scope.$on('copyPreview', function(event, dataWithFile, isNewVideo) { 
            $scope.copyPreview(dataWithFile, isNewVideo);
        });

        $scope.createPreviewImageFile = function(data) {
            var blobBin = atob(data.split(',')[1]);
            var array = [];
            for(var i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
            file.name = "preview_image.jpg";
            return file;
        };

        // do the actual video upload
        $scope.videoUploadFile = function(videoFile, imageFile, timestamp, isPortrait) { 

            // get the current loc and device and use them through-out the upcoming ajax call,
            // because the loc and device can change before the progress/success/error callbacks!
            var currentLoc = $scope.currentLoc;
            var currentDevice = $scope.currentDevice;

            var details = $scope.versionInfo.details.value[currentLoc]; 
            var editable = false;
            var currentDevData = details.appTrailers.value[currentDevice];
            if (currentDevData) {
                editable = currentDevData.isEditable;
            }

            if (editable) {
                var langstr = $scope.getLanguageString(currentLoc);
                $scope.mediaErrors.setErrorValue(langstr, currentDevice, "videoLoaded", false);
                $scope.mediaErrors.setErrorValue(langstr, currentDevice, "videoLoadingError", false);
                
                var vidType = videoFile.type;

                $scope.imageUploadsInProgress++;
                
                $scope.upload = $upload.upload({
                    url: $scope.referenceData.directUploaderUrls.videoUrl, 
                    method: 'POST',
                    headers: {'Content-Type': vidType,
                              'X-Apple-Upload-Referrer': window.location.href,
                              'X-Apple-Upload-AppleId': $scope.adamId,
                              'X-Apple-Upload-Correlation-Key': $scope.versionInfo.appType + ":AdamId=" + $scope.adamId + ":Version=" + $scope.versionInfo.version.value,
                              'X-Apple-Upload-itctoken': $scope.appVersionReferenceData.ssoTokenForVideo,
                              'X-Apple-Upload-ContentProviderId': $scope.user.contentProviderId,
                              'X-Original-Filename': videoFile.name
                             },
                    // withCredentials: true,
                    //data: {myObj: scope.myModelObj},
                    file: videoFile
                }).progress(function(evt) {
                    if (evt.total > 0) {
                        var perc = parseInt(100.0 * evt.loaded / evt.total) + "%";
                    }
                    else {
                        console.log("DU progress error: evt.total: " + evt.total);
                    }

                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    //console.log("Success uploading video to DU: status - " + status);
                    //console.log(data);
                    
                    $scope.mediaErrors.setErrorValue(langstr, currentDevice, "videoLoaded", true);
                    
                    $scope.addAppTrailerDataToMainJson(data, videoFile.type, currentDevice, currentLoc);

                    var url = URL.createObjectURL(imageFile);
                    $scope.uploadVideoPreviewImageFile(imageFile, url, currentDevice, currentLoc, timestamp, isPortrait); 
                    $scope.imageUploadsInProgress--;
                    
                }).error(function(data, status, headers, config) {
                    console.log("DU ERROR: status: " + status);
                    console.info("DU ERROR: data: ", data);
                
                    var genericMessage = $scope.l10n.interpolate('ITC.AppVersion.DUGeneralErrors.FileNotLoaded');
                    if (data && data.suggestionCode) {
                        var locErrorKey = "ITC.apps.validation."+ data.suggestionCode.toLowerCase(); 
                        var unRenderedHtml = $scope.l10n.interpolate(locErrorKey);
                        var vidError = $scope.renderHtml(unRenderedHtml);
                        if (unRenderedHtml === locErrorKey) {
                            $scope.mediaErrors.setErrorValue(langstr, currentDevice, "videoLoadingError", genericMessage);
                        } 
                        else {
                            $scope.mediaErrors.setErrorValue(langstr, currentDevice, "videoLoadingError", vidError);
                        }
                    } else {
                        $scope.mediaErrors.setErrorValue(langstr, currentDevice, "videoLoadingError", genericMessage);
                    }

                    // fake out save
                    $scope.setIsSaving(false);
                    $scope.saveInProgress = false;
                    $scope.imageUploadsInProgress--;
                    
                });
            } else {
                console.log("App Previews for " + $scope.currentDevice + " in " + $scope.getLanguageString($scope.currentLoc) + " are not editable.");
            }
        };

        $scope.setGenericVideoLoadingError = function() {

            var currentLoc = $scope.currentLoc;
            var currentDevice = $scope.currentDevice;
            var langstr = $scope.getLanguageString(currentLoc);

            var genericMessage = $scope.l10n.interpolate('ITC.AppVersion.Media.GenericVideoErrorDetail');
            $scope.mediaErrors.setErrorValue(langstr, currentDevice, "videoLoadingError", genericMessage);
        };

        // Returns true if there is a video loading error at the current loc and device.
        $scope.isVideoLoaded = function() {
            if ($scope.currentLoc === undefined) {
                return false;
            }
            var language = $scope.getLanguageString($scope.currentLoc);
            var device = $scope.currentDevice;

            var loaded = $scope.mediaErrors.getErrorValue(language, device, "videoLoaded"); 
            return loaded;
        };

        $scope.doesVideoHaveDuError = function() {
            var language = $scope.getLanguageString($scope.currentLoc);
            var device = $scope.currentDevice;

            var error = $scope.mediaErrors.getErrorValue(language, device, "videoLoadingError"); 
            return error;
        };
        
        // This function is now specific to snapshots (trailer preview images now have their own function: uploadVideoPreviewImageFile)
        $scope.imageUploadFile = function(file, url, sortOrder, device, language) { 
            
            $scope.imageUploadsInProgress++;
            $scope.numImagesNotReady++;

            $scope.upload = $upload.upload({
                url: $scope.referenceData.directUploaderUrls.screenshotImageUrl, 
                method: 'POST',
                headers: {'Content-Type': file.type,
                          'X-Apple-Upload-Referrer': window.location.href,
                          'X-Apple-Upload-AppleId': $scope.adamId,
                          'X-Apple-Upload-Correlation-Key': $scope.versionInfo.appType + ":AdamId=" + $scope.adamId + ":Version=" + $scope.versionInfo.version.value,
                          'X-Apple-Upload-itctoken': $scope.appVersionReferenceData.ssoTokenForImage,
                          'X-Apple-Upload-ContentProviderId': $scope.user.contentProviderId,
                          'X-Original-Filename': file.name
                         },
                file: file
            }).progress(function(evt) {
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                //$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                //console.log("Success uploading image to DU");
                
                $scope.addScreenshotDataToMainJson(data, sortOrder, device, language);
                var dataPlusImageInfo = {};
                dataPlusImageInfo.data = url;
                dataPlusImageInfo.videoType = false;
                
                $timeout(function() { // timeout because of $apply(), because we're already in a digest loop. 
                    //console.info("about to insert an image into: ", $scope.previewImages);
                    $scope.previewImages.splice(0, 0, dataPlusImageInfo); // inserts at front
                    //$scope.previewImages.push(dataPlusImageInfo); // inserts at end
                    $scope.$apply(); // important
                    $scope.$broadcast('setImagePreview', 0); 

                    $scope.imageUploadsInProgress--;
                    $scope.numImagesNotReady--;
                });
            
            }).error(function(data, status, headers, config) {
                console.info("ERROR uploading image to DU: ", data);
                // This commented out code is just to fake things out if DU isn't working.
                /*$scope.addScreenshotDataToMainJson(data, sortOrder, device, language);
                var dataPlusImageInfo = {};
                dataPlusImageInfo.data = url;
                dataPlusImageInfo.videoType = false;
                
                $timeout(function() { // timeout because of $apply(), because we're already in a digest loop. 
                    //console.info("about to insert an image into: ", $scope.previewImages);
                    $scope.previewImages.splice(0, 0, dataPlusImageInfo); // inserts at front
                    //$scope.previewImages.push(dataPlusImageInfo); // inserts at end
                    $scope.$apply(); // important
                    $scope.$broadcast('setImagePreview', 0); 
                });
            
                $scope.imageUploadsInProgress--;
                $scope.numImagesNotReady--;
                */

                // If DU isn't working - comment out the rest here (and uncomment the above)
                if (data) {
                    var locErrorKey = "ITC.apps.validation."+ data.suggestionCode.toLowerCase(); 
                    $scope.snapshotInfo.error = $scope.renderHtml($scope.l10n.interpolate(locErrorKey));
                    if ($scope.l10n.interpolate(locErrorKey) === locErrorKey) {
                        $scope.snapshotInfo.error = $scope.l10n.interpolate('ITC.AppVersion.DUGeneralErrors.FileNotLoaded');
                    } 
                } else {
                    $scope.snapshotInfo.error = $scope.l10n.interpolate('ITC.AppVersion.DUGeneralErrors.FileNotLoaded');
                }

                $scope.setIsSaving(false);
                $scope.saveInProgress = false;
                $scope.imageUploadsInProgress--;
                $scope.numImagesNotReady--;
                
            });
        };

        // a function to upload the preview image
        $scope.uploadVideoPreviewImageFile = function(file, url, device, language, timestamp, isPortrait) { 
            $scope.imageUploadsInProgress++;
            $scope.upload = $upload.upload({
                url: $scope.referenceData.directUploaderUrls.screenshotImageUrl, 
                method: 'POST',
                headers: {'Content-Type': file.type,
                          'X-Apple-Upload-Referrer': window.location.href,
                          'X-Apple-Upload-AppleId': $scope.adamId,
                          'X-Apple-Upload-Correlation-Key': $scope.versionInfo.appType + ":AdamId=" + $scope.adamId + ":Version=" + $scope.versionInfo.version.value,
                          'X-Apple-Upload-itctoken': $scope.appVersionReferenceData.ssoTokenForImage,
                          'X-Apple-Upload-ContentProviderId': $scope.user.contentProviderId,
                          'X-Original-Filename': file.name
                         },
                file: file
            }).progress(function(evt) {
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                //$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                //console.log("Success uploading preview image to DU!");
                    
                $scope.addAppTrailerPreviewImageDataToMainJson(data, timestamp, isPortrait, device, language);
                $scope.imageUploadsInProgress--;
                
            }).error(function(data, status, headers, config) {
                console.info("ERROR uploading preview image to DU: ", data);

                $scope.setIsSaving(false);
                $scope.saveInProgress = false;
                $scope.imageUploadsInProgress--;
            });
        };

        $scope.newsstandImageUpload = function() { 
            if ($scope.tempPageContent.newsstandImageFile !== undefined && $scope.tempPageContent.newsstandImageFile !== null) {
                $scope.tempPageContent.newsstandImageInProgress = true;
                $scope.imageUploadsInProgress++;
                $scope.newsstandUpload = $upload.upload({
                    url: $scope.referenceData.directUploaderUrls.newsstandCoverArtUrl, 
                    method: 'POST',
                    headers: {'Content-Type': $scope.tempPageContent.newsstandImageFile.type,
                              'X-Apple-Upload-Referrer': window.location.href,
                              'X-Apple-Upload-AppleId': $scope.adamId,
                              'X-Apple-Upload-Correlation-Key': $scope.versionInfo.appType + ":AdamId=" + $scope.adamId + ":Version=" + $scope.versionInfo.version.value,
                              'X-Apple-Upload-itctoken': $scope.appVersionReferenceData.ssoTokenForImage,
                              'X-Apple-Upload-ContentProviderId': $scope.user.contentProviderId,
                              'X-Original-Filename': $scope.tempPageContent.newsstandImageFile.name
                             },
                    file: $scope.tempPageContent.newsstandImageFile
                }).progress(function(evt) {
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    //$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    //console.log("Success uploading large app icon to DU");
                    $scope.addNewsstandImageDataToMainJson(data);
                    $scope.tempPageContent.newsstandImageInProgress = false;
                    $scope.imageUploadsInProgress--;

                    $scope.tempPageContent.newsstandImageDisplayUrl = URL.createObjectURL($scope.tempPageContent.newsstandImageFile); 

                }).error(function(data, status, headers, config) {
                    //console.log("NEWSSTAND IMAGE ERROR: Status - " + status);
                    if (data) {
                       var locErrorKey = "ITC.apps.validation."+ data.suggestionCode.toLowerCase();
                        var errorToShow = $scope.l10n.interpolate(locErrorKey);
                        if ($scope.l10n.interpolate(locErrorKey) === locErrorKey) {
                            errorToShow = $scope.l10n.interpolate('ITC.AppVersion.GeneralInfoSection.AppIconErrors.ImageNotLoaded');
                        } 
                    } else {
                        var errorToShow = $scope.l10n.interpolate('ITC.AppVersion.DUGeneralErrors.FileNotLoaded');
                    }
                    
                    $scope.tempPageContent.newsstandImageInProgress = false;
                    $scope.tempPageContent.userReadyToSave = false; //if we are in mid-save - stop
                    /*$scope.versionloaded = true;
                    $scope.setisReady();*/
                    $scope.setIsSaving(false);
                    $scope.saveInProgress = false;
                    $scope.simpleDropNewsstandErrors.error = errorToShow;
                    $scope.imageUploadsInProgress--;
                });
            }
        }
        $scope.addNewsstandImageDataToMainJson = function(data) {
            //console.log("adding newsstand image data",data)
            $scope.versionInfo.newsstand.value = {};
            $scope.versionInfo.newsstand.value.assetToken = data.token;
            $scope.versionInfo.newsstand.value.url = null;
        }

        $scope.geoJsonUpload = function() { 
            if ($scope.tempPageContent.transitAppLoadingFile !== undefined && $scope.tempPageContent.transitAppLoadingFile !== null) {
                //console.log("We're uploading the geojson");
                $scope.tempPageContent.transitAppFileInProgress = true;
                $scope.imageUploadsInProgress++;
                //console.log("$scope.tempPageContent.transitAppLoadingFile.type "+ $scope.tempPageContent.transitAppLoadingFile.type)
                $scope.geojsonUploading = $upload.upload({
                    url: $scope.referenceData.directUploaderUrls.geoJsonFileUrl, 
                    method: 'POST',
                    headers: {'Content-Type': 'application/json',// hardcoding type $scope.tempPageContent.transitAppLoadingFile.type,
                              'X-Apple-Upload-Referrer': window.location.href,
                              'X-Apple-Upload-AppleId': $scope.adamId,
                              'X-Apple-Upload-Correlation-Key': $scope.versionInfo.appType + ":AdamId=" + $scope.adamId + ":Version=" + $scope.versionInfo.version.value,
                              'X-Apple-Upload-itctoken': $scope.appVersionReferenceData.ssoTokenForImage,
                              'X-Apple-Upload-ContentProviderId': $scope.user.contentProviderId,
                              'X-Original-Filename': $scope.tempPageContent.transitAppLoadingFile.name
                             },
                    file: $scope.tempPageContent.transitAppLoadingFile
                }).progress(function(evt) {
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    //$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log("Success uploading geojson to DU");
                    $scope.addGeoJosnDataToMainJson(data)
                    $scope.imageUploadsInProgress--;
                    $scope.tempPageContent.transitAppFileInProgress = false;                   

                }).error(function(data, status, headers, config) {
                    console.log("GEOJSON ERROR: Status - " + status);
                    if (data) {
                       var locErrorKey = "ITC.apps.validation."+ data.suggestionCode.toLowerCase();
                        var errorToShow = $scope.l10n.interpolate(locErrorKey);
                        if ($scope.l10n.interpolate(locErrorKey) === locErrorKey) {
                            errorToShow = $scope.l10n.interpolate('ITC.AppVersion.GeneralInfoSection.TransitApp.FileNotLoaded');
                        } 
                    } else {
                        var errorToShow = $scope.l10n.interpolate('ITC.AppVersion.DUGeneralErrors.FileNotLoaded');
                    }
                    $scope.tempPageContent.transitAppFileInProgress = false;
                    $scope.simpleFileDropErrors.error = errorToShow;
                    $scope.tempPageContent.userReadyToSave = false; //if we are in mid-save - stop
                    /*$scope.versionloaded = true;
                    $scope.setisReady();*/
                    $scope.setIsSaving(false);
                    $scope.saveInProgress = false;
                    $scope.imageUploadsInProgress--;
                });
            }
        }
        $scope.addGeoJosnDataToMainJson = function(data) {
            $scope.versionInfo.transitAppFile.value = {};
            $scope.versionInfo.transitAppFile.value.assetToken = data.token;
            $scope.versionInfo.transitAppFile.value.url = null;
            $scope.versionInfo.transitAppFile.value.name = $scope.tempPageContent.transitAppLoadingFile.name;
        }

        $scope.$on('imageDropped', function(event, data) { 
            //console.log("imageDropped: " + data.url);

            // NOTE: moved this to success of imageUploadFile!! But keeping it around in case things go terribly wrong

            /*var dataPlusImageInfo = {};
            dataPlusImageInfo.data = data.url;
            dataPlusImageInfo.videoType = false;
            //$scope.previewImages.push(dataPlusImageInfo); // inserts at end
            $scope.previewImages.splice(0, 0, dataPlusImageInfo); // inserts at front
            $scope.$apply(); // important
            */

            //$scope.$broadcast('setImagePreview', 0); // to broadcast insertion at front 
            
            // Upload Screenshot 
            var startSortOrderIndex = $scope.getScreenshotSortOrderStartIndex($scope.currentDevice, $scope.currentLoc);

            $scope.imageUploadFile(data.file, data.url, startSortOrderIndex, $scope.currentDevice, $scope.currentLoc);  // sortOrder starts at startSortOrderIndex.
            //$scope.imageUploadFile(data.file, data.url, 0, $scope.currentDevice, $scope.currentLoc);  // sortOrder starts at 0.
        });

        // This is how we pass the video url along from the dropDirective (which emits it), 
        // to the videoSnapshotDirective (which gets it as a result the below broadcast)
        $scope.$on('videoDropped', function(event, data) { 
            //console.log("videoDropped: " + data.url);

            if ($scope.previewVideos.length < $scope.numVideos) { 
                $scope.appPreviewSnapshotShowing = false;  
                $scope.appPreviewDropped = true;
                $scope.$apply(); // so loader appears NOW.
                data.upload = true; // do upload 
                $scope.$broadcast('setVideoURL', data);
                // upload video to direct uploader
                //$scope.videoUploadFile(data.file); // MOVING THIS TO COPYPREVIEW
            }
            else {
                $scope.snapshotInfo.error = $scope.l10n.interpolate('ITC.AppVersion.Media.ErrorMessages.AppPreviewAlreadySelected');
            }
            
        });

        $scope.$watch('snapshotInfo.error',function(val){
            if (val) { // if there's an error, don't show the loader
                $scope.appPreviewSnapshotShowing = true;   
            }
        });

        $scope.$on('showVideoModal', function(event, data) { 
            //console.log("showVideoModal: " + data);

            $scope.showModal = data; // will show or hide the modal dialog
            $scope.$apply();
        });

        // Returns true if drop element should show, false otherwise.
        // It should show if not mid snapshot update (as in when device or language changes)
        $scope.toShowDropElement = function() { 
            if (!$scope.referenceData || !$scope.versionInfo || $scope.currentLoc === undefined) {
                return false;
            }
            return !$scope.midSnapshotUpdate && 
                (($scope.isVideoEditable() && $scope.previewVideos.length<$scope.numVideos) || // videos are editable and there's room for more videos
                 ($scope.areImagesEditable() && $scope.previewImages.length<$scope.numImages)  // images are editable and there's room for more images
                );     
        };

        $scope.areImagesEditable = function() {
            if (!$scope.referenceData || !$scope.versionInfo || $scope.currentLoc === undefined) {
                return false;
            }

            return  $scope.versionInfo.details.value[$scope.currentLoc].screenshots.isEditable;
        }

        /*
            Video is only editable (uploadable) if 
            1. $scope.previewUploadAllowed (which is determined by the browser(s)/os(s) set in the property file
            (com.apple.jingle.label.appPreview.uploadAllowedOsAndVersions && com.apple.jingle.label.appPreview.uploadAllowedBrowsersAndVersions)
            and
            2. versionInfo.details.value[currentLoc].appTrailers.isEditable === true
        */
        $scope.isVideoEditable = function() {
            if (!$scope.referenceData || !$scope.versionInfo || $scope.currentLoc === undefined ||
                !$scope.versionInfo.details.value[$scope.currentLoc].appTrailers) {
                return false;
            }

            return $scope.referenceData.appPreviewEnabled  &&
                    $scope.versionInfo.details.value[$scope.currentLoc].appTrailers.isEditable;// && 
                    //$scope.previewUploadAllowed;
        }

        $scope.isVideoEditableAndUploadable = function() {
            if (!$scope.referenceData || !$scope.versionInfo || $scope.currentLoc === undefined ||
                !$scope.versionInfo.details.value[$scope.currentLoc].appTrailers) {
                return false;
            }

            return $scope.referenceData.appPreviewEnabled  &&
                    $scope.versionInfo.details.value[$scope.currentLoc].appTrailers.isEditable && 
                    $scope.previewUploadAllowed;
        }
        
        // Returns true if there are the max number of images and videos.
        $scope.areImagesMaxedOut = function() {
            if ($scope.previewImages && $scope.previewVideos) {
                return $scope.previewImages.length===$scope.numImages && $scope.previewVideos.length===$scope.numVideos;    
            }
        };

        $scope.$watch('imageUploadsInProgress',function(){
            if($scope.tempPageContent !== undefined) {
                //console.log("imageUploadsInProgress: " + $scope.imageUploadsInProgress);
                //console.log("Ready to save?? " + $scope.tempPageContent.userReadyToSave);
                $scope.shouldSaveEnabled();
                //watch for changes in image upload progress and check if we need to save page
                //userReadyToSave will be set to true once user clicks on "save" button.
                if ($scope.tempPageContent.userReadyToSave && $scope.imageUploadsInProgress === 0) {
                    $scope.saveVersionDetails();
                } 
            }
        });

        $scope.hasErrorsInGroup = function(device, loc) {
            // Note: add other error checks that should prevent save here:

            // Jenn requested I remove the check for no screenshots. Leaving this commented out as I think
            // we might change our minds later
            //var noSnapshots = $scope.hasNoScreenshot(device, loc);

            /*if (loc === undefined) {
                return false;
            }*/
            var language = $scope.getLanguageString(loc);
            var hasSaveErrors = $scope.allImages.hasErrorsInGroup(language, device);
            var hasDeviceSpecificError = $scope.allImages.hasLanguageDeviceSpecificError(language, device) ||
                                         $scope.allVideos.hasLanguageDeviceSpecificError(language, device);

            //return noSnapshots || hasSaveErrors || hasDeviceSpecificError;
            return hasSaveErrors || hasDeviceSpecificError;
        }

        //function to check localization for screenshot issues...
        var hasMediaErrorsInLoc = function(loc) {
            var dev;
            var locStr = $scope.getLanguageString(loc);
            if ($scope.allImages.hasLanguageSpecificError(locStr) || $scope.allVideos.hasLanguageSpecificError(locStr)) {
                return true;
            }
            for (var i = 0; i < $scope.deviceNames.length; i++) {
                dev = $scope.deviceNames[i];
                if ($scope.hasErrorsInGroup(dev, loc)) {
                    return true;
                }
            }
            return false;
        }

        $scope.getStrFromLoc = function(key) {
            if ($scope.l10n && $scope.l10n[key]) {
                return $scope.l10n.interpolate(key);
            }
            else {
                return key;
            }
        };

        $scope.getSectionInfoMessage = function(key) {
            //var msg = $scope.l10n[key];
            //var status = $scope.getCurrentAppStatus();


            //msg = msg.replace('@@CurrentStatus@@', status);
            //return msg;
            return $scope.l10n.interpolate(key,{'CurrentStatus':$scope.getCurrentAppStatus()});
        }

        $scope.getCurrentAppStatus = function() {
            if ($scope.versionInfo) { 
                var state = $scope.versionInfo.status;
                var key = $scope.referenceData.statusLevels[state];
                return $scope.getStrFromLoc(key.locKey);
            }
            else {
                return "";
            }
        }

        $scope.getCurrentAppState = function() {
            if ($scope.versionInfo) { 
                var state = $scope.versionInfo.status;
                return state;
            }
            else {
                return "";
            }
        }

        $scope.getDevRejectHeader = function() {
            var state = $scope.getCurrentAppState();
            var locKey = 'ITC.apps.devReject.message.confirmation.header.' + state;
            var headerStr = $scope.getStrFromLoc(locKey);
            if (headerStr === locKey) {
                headerStr = $scope.getStrFromLoc('ITC.apps.devReject.message.confirmation.header');
            }
            if ($scope.versionInfo) {
                headerStr = headerStr.replace('@@versionNumber@@', $scope.versionInfo.version.value);
            }
            return headerStr;
        }

        $scope.getDevRejectMessage = function() {
            var state = $scope.getCurrentAppState();
            var locKey = 'ITC.apps.devReject.message.confirmation.message.' + state;
            var msg = $scope.getStrFromLoc(locKey);
            if (msg === locKey) {
                msg = $scope.getStrFromLoc('ITC.apps.devReject.message.confirmation.message');
            }
            return msg;
        }

        $scope.getDevRejectOkButtonText = function() {
            var state = $scope.getCurrentAppState();
            var locKey = 'ITC.apps.devReject.message.confirmation.okButtonText.' + state;
            var msg = $scope.getStrFromLoc(locKey);
            if (msg === locKey) {
                msg = $scope.getStrFromLoc('ITC.apps.devReject.message.confirmation.okButtonText');
            }
            return msg;
        }

        $scope.getDevRejectCancelButtonText = function() {
            var state = $scope.getCurrentAppState();
            var locKey = 'ITC.apps.devReject.message.confirmation.cancelButtonText.' + state;
            var msg = $scope.getStrFromLoc(locKey);
            if (msg === locKey) {
                msg = $scope.getStrFromLoc('ITC.apps.devReject.message.confirmation.cancelButtonText');
            }
            return msg;
        }

        $scope.getGeneralErrorsInGroup = function() {
            var errorStr = "";
            if ($scope.versionInfo) {
                var language = $scope.getLanguageString($scope.currentLoc);
                var device = $scope.currentDevice;
                if ($scope.allImages) {  
                    if ($scope.allImages.hasLanguageDeviceSpecificError(language, device)) {
                        errorStr = $scope.allImages.getLanguageDeviceSpecificError(language, device);
                    }
                    if ($scope.allImages.hasLanguageSpecificError(language)) {
                        errorStr += " " + $scope.allImages.getLanguageSpecificError(language);
                    }
                }

                if ($scope.allVideos) {
                    if ($scope.allVideos.hasLanguageDeviceSpecificError(language, device)) {
                        errorStr += $scope.allVideos.getLanguageDeviceSpecificError(language, device);
                    }
                    if ($scope.allVideos.hasLanguageSpecificError(language)) {
                        errorStr += " " + $scope.allVideos.getLanguageSpecificError(language);
                    }
                }
            }

            return errorStr;
        }
        
        // Returns true if there are no screenshots at device/language
        $scope.hasNoScreenshot = function(device, language) {
            var screenshotsArr = $scope.versionInfo.details.value[language].screenshots.value[device].value;
            return screenshotsArr.length === 0;
        }

        $scope.addAppTrailerDataToMainJson = function(data, contentType, currentDevice, currentLoc) {
            //console.log("addAppTrailerDataToMainJson");

            var details = $scope.versionInfo.details.value[currentLoc]; 
            var currentDevData = details.appTrailers.value[currentDevice];

            var appTrailerData = currentDevData.value; // preview image may have been saved by user while video was uploading
            if (!appTrailerData) {
                // video may still be uploading, but we want to allow saving of preview image data
                appTrailerData = {};
            }

            appTrailerData["videoAssetToken"] = data.responses[0].token; // testing error handling
            appTrailerData["descriptionXML"] =  data.responses[0].descriptionDoc;
            appTrailerData["contentType"] = contentType;
            
            currentDevData.value = appTrailerData;
        };


        $scope.deleteAppTrailerDataFromMainJson = function() {
            if ($scope.referenceData.appPreviewEnabled) {
                // should only need to delete from current loc.. but instead, chong tells me i need to delete from all locs
                var details; // = $scope.versionInfo.details.value[$scope.currentLoc]; // this is how it should be
                var currentDevData;
                for (var loc=0; loc<$scope.versionInfo.details.value.length; loc++) {
                    details = $scope.versionInfo.details.value[loc]; 
                    currentDevData = details.appTrailers.value[$scope.currentDevice];
                    currentDevData.value = null;
                }
            }
        };

        $scope.addAppTrailerPreviewImageDataToMainJson = function(data, timestamp, isPortrait, device, loc) {
            if ($scope.referenceData.appPreviewEnabled) {
                //console.log("addAppTrailerPreviewImageDataToMainJson");

                var details = $scope.versionInfo.details.value[loc]; 
                var currentDevData = details.appTrailers.value[device];

                var appTrailerData = currentDevData.value;
                if (!appTrailerData) {
                    // video may still be uploading, but we want to allow saving of preview image data
                    appTrailerData = {};
                }
                //console.log("changing preview image token FROM " + appTrailerData["pictureAssetToken"] + " TO " + data.token);

                appTrailerData["pictureAssetToken"] = data.token; 
                appTrailerData["previewFrameTimeCode"] = timestamp; //"00:00:10:00"; 
                appTrailerData["isPortrait"] = isPortrait; 

                currentDevData.value = appTrailerData;
            }
        };

        $scope.addScreenshotDataToMainJson = function(data, sortOrder, device, language) {
            var screenshotData = {};
            screenshotData['value'] = {};
            screenshotData['value']['assetToken'] = data.token;
            screenshotData['value']['fullSizeUrl'] = null;
            screenshotData['value']['sortOrder'] = sortOrder;
            screenshotData['value']['url'] = null;

            var screenshotsArr = $scope.versionInfo.details.value[language].screenshots.value[device].value;

            // increment sortOrder of screenshots with greater or equal sortOrders
            var screenshot, currentSortOrder;
            for (var i = 0; i < screenshotsArr.length; i++) {
                screenshot = screenshotsArr[i].value;
                currentSortOrder = screenshot['sortOrder'];
                if (currentSortOrder >= sortOrder) { 
                    screenshot['sortOrder'] = currentSortOrder + 1;
                }
            }                     
            // push the new screenshot
            screenshotsArr.push(screenshotData);

            //console.info("set snapshots in json: ", screenshotsArr);
        }

        $scope.deleteScreenshotDataFromMainJson = function(sortOrder, device, language) {
            var screenshotsArr = $scope.versionInfo.details.value[language].screenshots.value[device].value;
            var screenshot, removeIndex, currentSortOrder;
            for (var i = 0; i < screenshotsArr.length; i++) {
                screenshot = screenshotsArr[i].value;
                currentSortOrder = screenshot['sortOrder'];
                if (currentSortOrder === sortOrder) { 
                    removeIndex = i;
                }
                else if (currentSortOrder > sortOrder) { // decrement sortOrder of screenshots with greater sortOrders
                    screenshot['sortOrder'] = currentSortOrder - 1;
                }
            }

            screenshotsArr.splice(removeIndex, 1);
        }

        // Returns 0 or 1 depending on what the first screenshot's sortOrder is. Need this to correct sort order start index to 0.
        $scope.getScreenshotSortOrderStartIndex = function(device, language) {
            var screenshotsArr = $scope.versionInfo.details.value[language].screenshots.value[device].value;
            /*
            var screenshotsValue = $scope.versionInfo.details.value[language].screenshots.value[device];
            var screenshotsArr;
            if (screenshotsValue) {
                screenshotsArr = screenshotsValue.value;
            }
            else {
                screenshotsArr = new Array(); // which will cause 1 to get returned
            }*/
            
            var screenshot, currentSortOrder;
            var lowestSortOrder = 999999; // start big
            for (var i = 0; i < screenshotsArr.length; i++) {
                screenshot = screenshotsArr[i].value;
                currentSortOrder = screenshot['sortOrder'];
                if (currentSortOrder < lowestSortOrder) {
                    lowestSortOrder = currentSortOrder;
                }
            }
            if (screenshotsArr.length === 0) {
                lowestSortOrder = 1;
            }
            return lowestSortOrder;
        }

        // Little workaround to change the indices of the sort orders to start at 0 if they don't.
        /*$scope.decrementScreenshotSortOrderStartIndices = function(device, language) {
            var decrementAmount = $scope.getScreenshotSortOrderStartIndex(device, language);
            if (decrementAmount === 0) {
                return; // nothing needs to change
            }

            var screenshotsArr = $scope.versionInfo.details.value[language].screenshots.value[device].value;
            var screenshot, currentSortOrder;
            for (var i = 0; i < screenshotsArr.length; i++) {
                screenshot = screenshotsArr[i].value;
                screenshot['sortOrder'] = screenshot['sortOrder'] - decrementAmount;
            }
        }*/

        // Called when moving an image from index "from" to index "to". Just modifies the sortOrder of the screenshots in the json.
        $scope.changeScreenshotSortOrderInMainJson = function(from, to, device, language) {
            var screenshotsArr = $scope.versionInfo.details.value[language].screenshots.value[device].value;
            var screenshot, fromScreenshot, currentSortOrder;
            if (from > to) {
                for (var i = 0; i < screenshotsArr.length; i++) {
                    screenshot = screenshotsArr[i].value;
                    currentSortOrder = screenshot['sortOrder'];
                    if (currentSortOrder === from) { 
                        fromScreenshot = screenshot; // save for the end of this method
                    }
                    else if (currentSortOrder >= to && currentSortOrder < from) { // increment sortOrder of screenshots between to and from.
                        screenshot['sortOrder'] = currentSortOrder + 1;
                    }
                }
                
                fromScreenshot['sortOrder'] = to;

            }
            else if (to > from) {
                 for (var i = 0; i < screenshotsArr.length; i++) {
                    screenshot = screenshotsArr[i].value;
                    currentSortOrder = screenshot['sortOrder'];
                    if (currentSortOrder === from) { 
                        fromScreenshot = screenshot; // save for the end of this method
                    }
                    else if (currentSortOrder > from && currentSortOrder <= to) { // decrement sortOrder of screenshots between to and from.
                        screenshot['sortOrder'] = currentSortOrder - 1;
                    }
                }
                
                fromScreenshot['sortOrder'] = to;
            }

            
        }

        // BEING GAME CENTER

        $scope.viewGameCenterLink = function() {
            return global_itc_path + "/wa/LCAppPage/viewGameCenter?adamId=" + $scope.adamId;
        }

        $scope.enableDoneButton = function(obj1, obj2, whichModal) {
            if (_.isEqual(angular.toJson(obj1), angular.toJson(obj2))) {
                $scope.tempPageContent[whichModal].modal.doneButtonEnabled = false;
            }
            else {
                // console.log(' ??? obj1: ', obj1);
                // console.log(' ??? obj2: ', obj2);
                $scope.tempPageContent[whichModal].modal.doneButtonEnabled = true;   
            }
        }

        // BEGIN Leaderboard Sets specific functions

        $scope.showLeaderboardSetsModal = function() {
            $scope.modalsDisplay.leaderboardSetsModal = true;

            $scope.tempPageContent.leaderboardSets.modal.tempLeaderboardSetList = angular.copy($scope.versionInfo.gameCenterSummary.displaySets.value);
            $scope.tempPageContent.leaderboardSets.modal.tempLeaderboardList = angular.copy($scope.versionInfo.gameCenterSummary.leaderboards.value);

            $scope.$watch('tempPageContent.leaderboardSets.modal.tempLeaderboardSetList', function(){
                $scope.enableDoneButton($scope.tempPageContent.leaderboardSets.modal.tempLeaderboardSetList,
                                        $scope.versionInfo.gameCenterSummary.displaySets.value, 
                                        'leaderboardSets');
            }, true);          
        }

        // $scope.updateLeaderboardAttachments = function() {
        //     var attachedLeaderboardSets = _.where($scope.tempPageContent.leaderboardSets.modal.tempLeaderboardSetList, {isAttached: true});
        //     var attachedLeaderboardIds = [];
        //     for (var i = 0; i < attachedLeaderboardSets.length; i++) {

        //         for (var x = 0; x < attachedLeaderboardSets[i].leaderboards.length; x++) {
        //             if (attachedLeaderboardSets[i].leaderboards[x].isAttached === true) {
        //                 attachedLeaderboardIds.push(attachedLeaderboardSets[i].leaderboards[x].id);
        //             }
        //         }
        //     }
        //     for (var y = 0; y < $scope.versionInfo.gameCenterSummary.leaderboards.value.length; y++) {
        //         if (_.contains(attachedLeaderboardIds, $scope.versionInfo.gameCenterSummary.leaderboards.value[y].id)) {
        //             $scope.versionInfo.gameCenterSummary.leaderboards.value[y].isAttached = true;
        //         }
        //     }
        // }

        $scope.lbToggleEvent = function(selectedLeaderboard) {
            // console.log('??? selectedLeaderboard: ', selectedLeaderboard);

            _.each($scope.tempPageContent.leaderboardSets.modal.tempLeaderboardList, function(currLeaderboard, index){
                if (currLeaderboard.id == selectedLeaderboard.id) currLeaderboard.isAttached = !currLeaderboard.isAttached;
            });
        }

        $scope.closeLeaderboardSetsModal = function(value) {
            if (value) {
                $scope.versionInfo.gameCenterSummary.displaySets.value = angular.copy($scope.tempPageContent.leaderboardSets.modal.tempLeaderboardSetList);
                $scope.versionInfo.gameCenterSummary.leaderboards.value = angular.copy($scope.tempPageContent.leaderboardSets.modal.tempLeaderboardList);
                $scope.setupGameCenter();
            } else {
                $scope.tempPageContent.leaderboardSets.modal.tempLeaderboardSetList = [];
            }

            $scope.modalsDisplay.leaderboardSetsModal = false;

            $scope.selectedLeaderboardSet = {};
        }

        $scope.showLeaderboards = function(leaderboardSet) {
            $scope.selectedLeaderboardSet = leaderboardSet;
        }

        $scope.getRemainingLBSetsAndLBsString = function() {

            //var locString = $scope.l10n['ITC.AppVersion.LeaderboardSetsModal.Remaining'];
            var maxLBSets = $scope.versionInfo.gameCenterSummary.maxLeaderboardSets;
            var maxLBs = $scope.versionInfo.gameCenterSummary.maxLeaderboards;
            var usedLBSets = $scope.versionInfo.gameCenterSummary.usedLeaderboardSets;
            var usedLBs = $scope.versionInfo.gameCenterSummary.usedLeaderboards;


            /*locString = locString.replace('@@MaxLBSets@@', maxLBSets);
            locString = locString.replace('@@MaxLBs@@', maxLBs);
            locString = locString.replace('@@UsedLBSets@@', usedLBSets);
            locString = locString.replace('@@UsedLBs@@', usedLBs);*/

            return $scope.l10n.interpolate('ITC.AppVersion.LeaderboardSetsModal.Remaining',{'MaxLBSets':maxLBSets,'MaxLBs':maxLBs,'UsedLBSets':usedLBSets,'UsedLBs':usedLBs});

            //return locString;
        }

        $scope.calcUsedLeaderboards = function() {
            var attachedLeaderboards = $scope.filterObject($scope.tempPageContent.leaderboards.modal.tempLeaderboardList, {isAttached: true});

            var used = 0;

            _.each(attachedLeaderboards, function(leaderboard){
                if (leaderboard.isAttached) used++;
            });
            
            return used;
        }

        $scope.getRemainingLBsString = function() {

            //var locString = $scope.l10n['ITC.AppVersion.LeaderboardModal.RemainingCount'];
            var used = $scope.versionInfo.gameCenterSummary.usedLeaderboards;
            var total = $scope.versionInfo.gameCenterSummary.maxLeaderboards;

            var remaining = total - (used + $scope.calcUsedLeaderboards());

            /*locString = locString.replace('@@Used@@', remaining);
            locString = locString.replace('@@Total@@', total);*/

            var locString = $scope.l10n.interpolate('ITC.AppVersion.LeaderboardModal.RemainingCount',{'Used':remaining,'Total':total});

            $scope.remainingLBsString = locString;

            return locString;
        }

        $scope.lbSetDetachedEvent = function() {
            $scope.selectedLeaderboardSet = {};
        }

        // END Leaderboard Sets specific functions

        // BEGIN Leaderboard With Sets/Alt specific functions

        $scope.showLeaderboardsWithSetsModal = function() {
            $scope.modalsDisplay.leaderboardsWithSetsModal = true;

            $scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardList = angular.copy($scope.versionInfo.gameCenterSummary.leaderboards.value);
            $scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList = angular.copy($scope.versionInfo.gameCenterSummary.displaySets.value);

            $scope.$watch('tempPageContent.leaderboardsWithSets.modal.tempLeaderboardList', function(){
                $scope.enableDoneButton($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardList,
                                        $scope.versionInfo.gameCenterSummary.leaderboards.value, 
                                        'leaderboardsWithSets');
            }, true); 

            $scope.$watch('tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList', function(){
                $scope.enableDoneButton($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList, 
                                        $scope.versionInfo.gameCenterSummary.displaySets.value, 
                                        'leaderboardsWithSets');
            }, true);   
        }

        // $scope.updateAssociatedLeaderboardSets = function() {
        //     $scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList;
        // }

        $scope.closeLeaderboardWithSetsModal = function(value) {
            if (value) {
                $scope.versionInfo.gameCenterSummary.leaderboards.value = angular.copy($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardList);
                $scope.versionInfo.gameCenterSummary.displaySets.value = angular.copy($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList);
                $scope.setupGameCenter();
            } else {
                $scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardList = [];
                $scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList = [];
            }

            $scope.associatedLeaderboardSets = [];
            $scope.modalsDisplay.leaderboardsWithSetsModal = false;
        }

        $scope.showLeaderboardSet = function(leaderboard) {
            $scope.selectedLeaderboard = leaderboard;

            var matchingLeaderboardSets = [];

            for (var x = 0; x < $scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList.length; x++) {

                var matchCheck = _.find($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList[x].leaderboards, function(currLeaderboard){
                    return currLeaderboard.id == leaderboard.id;
                });

                if (matchCheck) matchingLeaderboardSets.push($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList[x]);
            }

            $scope.associatedLeaderboardSets = matchingLeaderboardSets;
        }

        // $scope.lbSetAttachmentEvent = function(leaderboardSet) {
        //     _.each($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList, function(lbSet, index){
        //         if (lbSet.id == leaderboardSet.id) {
        //             lbSet.isAttached = !lbSet.isAttached;
        //             return;
        //         }
        //     });
        // }

        $scope.setNestedLeaderboardProperty = function(selectedLeaderboard, property, value) {
            _.each($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList, function(lbSet, index){
                _.each(lbSet.leaderboards, function(currLeaderboard, index) {
                    if (currLeaderboard.id == selectedLeaderboard.id) currLeaderboard[property] = value;
                });
            });
        }

        $scope.getLeaderboardSetsIdsAssociatedWithLeaderboardId = function(leaderboardId) {
            var leaderboardSetsIds = [];
            _.each($scope.versionInfo.gameCenterSummary.displaySets.value, function(lbSet, index){
                if (_.findWhere(lbSet.leaderboards, {id: leaderboardId})) leaderboardSetsIds.push(lbSet.id);
            });
            return leaderboardSetsIds;
        }

        $scope.getLiveLeaderboards = function(){
            var liveLeaderboards = [];
            _.each($scope.tempPageContent.leaderboardsWithSets.modal.tempLeaderboardSetList, function(lbSet){
                liveLeaderboards = liveLeaderboards.concat(_.where(lbSet.leaderboards, {isLive: true}));
            });
            return liveLeaderboards;
        }

        $scope.lbAttachedEvent = function(selectedLeaderboard) {
            $scope.setNestedLeaderboardProperty(selectedLeaderboard, 'isAttached', true);

            $scope.showLeaderboardSet(selectedLeaderboard);
        }

        $scope.lbDetachedEvent = function(selectedLeaderboard) {
            $scope.setNestedLeaderboardProperty(selectedLeaderboard, 'isAttached', false);

            $scope.associatedLeaderboardSets = {};
        }

        // END Leaderboard With Sets/Alt specific functions

        // BEGIN Leaderboard specific functions

        $scope.showLeaderboardModal = function() {
            $scope.modalsDisplay.leaderboardsModal = true;

            $scope.tempPageContent.leaderboards.modal.tempLeaderboardList = angular.copy($scope.versionInfo.gameCenterSummary.leaderboards.value);

            // $scope.nonLiveLBs = _.filter($scope.tempPageContent.leaderboards.modal.tempLeaderboardList, function(leaderboard){
            //     if (leaderboard.isLive)
            // });

            $scope.$watch('tempPageContent.leaderboards.modal.tempLeaderboardList', function(){
                $scope.enableDoneButton($scope.tempPageContent.leaderboards.modal.tempLeaderboardList,
                                        $scope.versionInfo.gameCenterSummary.leaderboards.value, 
                                        'leaderboards');
            }, true);  
        }

        $scope.closeLeaderboardModal = function(value) {
            if (value) {
                $scope.versionInfo.gameCenterSummary.leaderboards.value = angular.copy($scope.tempPageContent.leaderboards.modal.tempLeaderboardList);
                $scope.setupGameCenter();
            }

            $scope.tempPageContent.leaderboards.modal.tempLeaderboardList = [];

            $scope.modalsDisplay.leaderboardsModal = false;
        }

        // END Leaderboard specific functions

        // BEGIN Achievements specific functions

        $scope.showAchievementsModal = function() {
            $scope.modalsDisplay.achievementsModal = true;

            $scope.tempPageContent.achievements.modal.tempAchievementsList = angular.copy($scope.versionInfo.gameCenterSummary.achievements.value);

            $scope.$watch('tempPageContent.achievements.modal.tempAchievementsList', function(){
                $scope.enableDoneButton($scope.tempPageContent.achievements.modal.tempAchievementsList,
                                        $scope.versionInfo.gameCenterSummary.achievements.value, 
                                        'achievements');
            }, true);  
        }

        $scope.calcUsedAchievementPoints = function() {
            var attachedAchievements = $scope.filterObject($scope.tempPageContent.achievements.modal.tempAchievementsList, {isAttached: true});

            var pointsUsed = 0;

            _.each(attachedAchievements, function(achievement){
                pointsUsed += achievement.points;
            })

            return pointsUsed;
        }

        $scope.getRemainingAchievementPointsString = function() {
            //var locString = $scope.l10n['ITC.AppVersion.AchievementsModal.RemainingCount'];
            var maxAchievementPoints = $scope.versionInfo.gameCenterSummary.maxAchievementPoints;
            var usedAchievementPoints = $scope.versionInfo.gameCenterSummary.usedAchievementPoints;

            var newPointsUsed = $scope.calcUsedAchievementPoints();

            var remainingPoints = maxAchievementPoints - (usedAchievementPoints + newPointsUsed);

            /*locString = locString.replace('@@Total@@', maxAchievementPoints);
            locString = locString.replace('@@Used@@', remainingPoints);*/

            var locString = $scope.l10n.interpolate('ITC.AppVersion.AchievementsModal.RemainingCount',{'Total':maxAchievementPoints,'Used':remainingPoints});
            $scope.remainingAchievementPointsString = locString;

            return locString;
        }

        $scope.closeAchievementsModal = function(value) {
            if (value) {
                $scope.versionInfo.gameCenterSummary.achievements.value = angular.copy($scope.tempPageContent.achievements.modal.tempAchievementsList);
                $scope.setupGameCenter();
            }

            $scope.tempPageContent.achievements.modal.tempAchievementsList = [];
            $scope.modalsDisplay.achievementsModal = false;
        }

        // END Achievements specific functions

        $scope.getMultiplayerCompatibilityList = function() {
            var compatibleApps = [];

            var compatibleApps = _.filter($scope.versionInfo.gameCenterSummary.versionCompatibility.value, function(app){
                if (app.earliestCompatibleVersion != "") return true;
            });

            return compatibleApps;
        }

        $scope.getAppsAvailableToAddToMultiplayer = function() {
            var appsAlreadyInMultiplayer = {};

            _.each($scope.getMultiplayerCompatibilityList(), function(app) {
                appsAlreadyInMultiplayer[app.adamId] = true;
            });

            var remainingApps = _.filter($scope.versionInfo.gameCenterSummary.versionCompatibility.value, function(app){
                if (!appsAlreadyInMultiplayer[app.adamId]) return true;
            });

            return remainingApps;
        }

        // Assumes compatibleApps arg has the property compatibleVersions with descending sorted version numbers
        $scope.setEarliestCompatibleVersion = function(compatibleApps) {
            
            _.each(compatibleApps, function(app, index){
                _.find(app.compatibleVersions, function(value, key){
                    app.earliestCompatibleVersion = key;
                    if (value === false) return true;
                });
            });

            // console.log(' ??? setEarliestCompatibleVersion: compatibleApps: ', compatibleApps);
        }

        /**
         * Compares two software version numbers (e.g. "1.7.1" or "1.2b").
         *
         * This function was born in http://stackoverflow.com/a/6832721.
         *
         * @param {string} v1 The first version to be compared.
         * @param {string} v2 The second version to be compared.
         * @param {object} [options] Optional flags that affect comparison behavior:
         * <ul>
         *     <li>
         *         <tt>lexicographical: true</tt> compares each part of the version strings lexicographically instead of
         *         naturally; this allows suffixes such as "b" or "dev" but will cause "1.10" to be considered smaller than
         *         "1.2".
         *     </li>
         *     <li>
         *         <tt>zeroExtend: true</tt> changes the result if one version string has less parts than the other. In
         *         this case the shorter string will be padded with "zero" parts instead of being considered smaller.
         *     </li>
         * </ul>
         * @returns {number|NaN}
         * <ul>
         *    <li>0 if the versions are equal</li>
         *    <li>a negative integer iff v1 < v2</li>
         *    <li>a positive integer iff v1 > v2</li>
         *    <li>NaN if either version string is in the wrong format</li>
         * </ul>
         *
         * @copyright by Jon Papaioannou (["john", "papaioannou"].join(".") + "@gmail.com")
         * @license This function is in the public domain. Do what you want with it, no strings attached.
         */
        $scope.versionCompare = function(v1, v2, options) {
            var lexicographical = options && options.lexicographical,
                zeroExtend = options && options.zeroExtend,
                v1parts = v1.split('.'),
                v2parts = v2.split('.');
         
            function isValidPart(x) {
                return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
            }
         
            if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
                return NaN;
            }
         
            if (zeroExtend) {
                while (v1parts.length < v2parts.length) v1parts.push("0");
                while (v2parts.length < v1parts.length) v2parts.push("0");
            }
         
            if (!lexicographical) {
                v1parts = v1parts.map(Number);
                v2parts = v2parts.map(Number);
            }
         
            for (var i = 0; i < v1parts.length; ++i) {
                if (v2parts.length == i) {
                    return 1;
                }
         
                if (v1parts[i] == v2parts[i]) {
                    continue;
                }
                else if (v1parts[i] > v2parts[i]) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
         
            if (v1parts.length != v2parts.length) {
                return -1;
            }
         
            return 0;
        }

        $scope.updateEarliestCompatibleVersion = function() {
            var currentApp = this.app;
            var earliestCompatibleVersion = currentApp.earliestCompatibleVersion;

            _.each(currentApp.compatibleVersions, function(value, key){   
                var versionCompareResult = $scope.versionCompare(key, earliestCompatibleVersion);

                if (versionCompareResult === 0 || versionCompareResult >= 1) {
                    currentApp.compatibleVersions[key] = true;
                }
                else {
                    currentApp.compatibleVersions[key] = false;
                }
            });
        }

        $scope.addAppToMultiplayer = function(app) {
            var versionsArray = _.keys(app.compatibleVersions);
            app.earliestCompatibleVersion = versionsArray[0];

            app.compatibleVersions[versionsArray[0]] = true;

            $scope.appsAvailableToAddToMultiplayer = $scope.getAppsAvailableToAddToMultiplayer();
        }

        $scope.removeAppFromMultiplayer = function(app) {
            app.earliestCompatibleVersion = "";
            _.each(app.compatibleVersions, function(value, key, list){
                list[key] = false;
            });

            $scope.appsAvailableToAddToMultiplayer = $scope.getAppsAvailableToAddToMultiplayer();
        }

        $scope.setupGameCenter = function() {
            $scope.getRemainingAchievementPointsString();
            $scope.getRemainingLBsString();
            $scope.remainingLBSetsAndLBsString = $scope.getRemainingLBSetsAndLBsString();

            $scope.totalLiveLeaberboardSets = $scope.filterObject($scope.versionInfo.gameCenterSummary.displaySets.value, {isLive: true}).length;
            $scope.totalAttachedLeaderboardSets = $scope.filterObject($scope.versionInfo.gameCenterSummary.displaySets.value, {isAttached: true}).length;
            $scope.totalMandatoryLeaderboardSets = $scope.filterObject($scope.versionInfo.gameCenterSummary.displaySets.value, {isMandatory: true}).length;

            $scope.totalAttachedLeaderboards = $scope.filterObject($scope.versionInfo.gameCenterSummary.leaderboards.value, {isAttached: true}).length;
            $scope.totalLiveLeaderboards = $scope.filterObject($scope.versionInfo.gameCenterSummary.leaderboards.value, {isLive: true}).length;
            $scope.totalMandatoryLeaderboards = $scope.filterObject($scope.versionInfo.gameCenterSummary.leaderboards.value, {isMandatory: true}).length;

            $scope.totalAttachedAchievements = $scope.filterObject($scope.versionInfo.gameCenterSummary.achievements.value, {isAttached: true}).length;
            $scope.totalLiveAchievements = $scope.filterObject($scope.versionInfo.gameCenterSummary.achievements.value, {isLive: true}).length;
            $scope.totalMandatoryAchievements = $scope.filterObject($scope.versionInfo.gameCenterSummary.achievements.value, {isMandatory: true}).length;

            // $scope.availableLeaderboardSets = $scope.returnObjectWithValues($scope.filterObject($scope.versionInfo.gameCenterSummary.displaySets.value, {isAttached: true}), $scope.filterObject($scope.versionInfo.gameCenterSummary.displaySets.value, {isLive: true}));

            $scope.availableLeaderboardSets = $scope.listItemsToInclude($scope.versionInfo.gameCenterSummary.displaySets.value);
            
            $scope.availableLeaderboards = $scope.listItemsToInclude($scope.versionInfo.gameCenterSummary.leaderboards.value);

            // $scope.availableAchievements = $scope.returnObjectWithValues($scope.filterObject($scope.versionInfo.gameCenterSummary.achievements.value, {isAttached: true}), $scope.filterObject($scope.versionInfo.gameCenterSummary.achievements.value, {isLive: true}));

            $scope.availableAchievements = $scope.listItemsToInclude($scope.versionInfo.gameCenterSummary.achievements.value);
            
            $scope.appsAvailableToAddToMultiplayer = $scope.getAppsAvailableToAddToMultiplayer();
        }

        $scope.listItemsToInclude = function(list) {
            return _.filter(list, function(listItem) {
                if (listItem.isAttached === true || listItem.isLive === true || listItem.isMandatory === true) return true;  
            });
        }

        $scope.filterObject = function(object, expression) {
            var result = {};
            if (_.isObject(expression)) result = _.where(object, expression);
            return result;
        }

        $scope.setObjectProperty = function(object, property, value, callback) {
            if (callback) callback(object);
            return object[property] = value;
        }

        $scope.returnObjectWithValues = function(obj1, obj2) {
            if (obj1.length && !obj2.length) return obj1;
            else if (!obj1.length && obj2.length) return obj2;
            else if ((obj1.length && obj2.length) || (!obj1.length && !obj2.length)) return null;
        }

        $scope.appendObjects = function() {
            var newObj;
            for (var i = 0; i < arguments.length; i++) {
                newObj.push(arguments[i]);
            }

            return newObj;
        }

        /**** Some utility methods ****/

        // utitility method for moving an array elent from old_index to new_index
        Array.prototype.move = function (old_index, new_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this; // for testing purposes
        };
        
        $scope.$on('cancellingSubmitForReview',function(){
            $scope.submitForReviewInProgress = false;
            $scope.tempPageContent.scrollnow = true;
            $scope.tempPageContent.submittingForReview = false;
        });

        $scope.submitForReview = function() {
            $scope.setIsSaving(true);
            $scope.submitForReviewInProgress = true;
            saveVersionService.submitForReview($scope.adamId,$scope.versionInfo).then(function(data) {
                    $scope.submitForReviewInProgress = false;
                    $scope.setIsSaving(false);
                    if (data.status == "500") {
                        console.log("We've got a server error... 500")
                        $scope.setIsSaving(false);
                        $scope.submitForReviewInProgress = false;
                        $scope.tempPageContent.showAdditionalError = true;
                        //$scope.tempPageContent.messageDisplaying = true;
                        $scope.tempPageContent.additionalError = $scope.l10n.interpolate('ITC.AppVersion.PageLevelErrors.ProblemDuringSave');
                        $scope.tempPageContent.scrollnow = true;
                    } else {
                        console.log("tried to submit for review");
                        console.log(data);
                        //clear status errors...
                        //check what type of JSON we got back..
                        if (data.data.adIdInfo !== undefined) {
                            //submit for review validations went through without errors - show submit for review questions...
                            $scope.tempPageContent.submittingForReview = true;
                            $scope.createAppDataSaving = false;
                            $scope.tempPageContent.scrollnow = true;
                            $scope.submitForReviewAnswers = data.data;
                            $scope.$broadcast('submittedForReview');
                        } else {
                            //submit for review validations came in with errors - reload data with error keys...
                            $scope.setupPageData(data.data);
                            if ($scope.versionInfo.sectionErrorKeys !== undefined && $scope.versionInfo.sectionErrorKeys !== null && $scope.versionInfo.sectionErrorKeys.length > 0) {
                                //THIS SHOULD ALWAYS BE COMING IN WITH ERROR KEYS AT THIS POINT>>>>
                                //$scope.tempPageContent.messageDisplaying = true;
                                $scope.tempPageContent.contentSaved = false;
                                //$scope.tempPageContent.showSaveError = true;
                                $scope.tempPageContent.scrollnow = true;
                            
                            }
                        }
                    }
            });
        }

        $scope.go = function (path, param) {
            if (param) path += param;
            $location.path(path);
        };

    }

    itcApp.register.controller('appVersionController', ['$scope','$location','$timeout','$rootScope','$routeParams','appDetailsService','appVersionReferenceDataService','saveVersionDetailsService','saveVersionService', 'sharedProperties','linkManager','$sce', '$upload','filterFilter', '$filter','createAppVersionService', 'devRejectAppService', '$route', appVersionController]);
    
});


