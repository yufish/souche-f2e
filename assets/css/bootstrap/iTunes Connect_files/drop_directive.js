/************************************************************************************************************************/
/************************************************** drop_directive.js ***************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

    // The purpose of this is to allow setting image src's to blobs. Without this, snapshots in appTrailer don't show because angular inserts 
    // "unsafe:" into the image src.
    // Probably a better place to put this config block but wasn't sure where, and didn't seem to work in the other places I tried.
    itcApp.config( [
        '$compileProvider', function( $compileProvider) {   
            
            // necessary for image src values that are blobs
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|blob|ftp|file):|data:image\//); // "blob" is the critical part here
            
            // uncomment in case we need to whitelist some type of href
            //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|blob):/);
        }
    ]);

	itcApp.directive('dropElement',function($sce, $http, $timeout){
		return {
            restrict: 'A',
            templateUrl: getGlobalPath('/itc/views/directives/drop_template.html'),
            scope: {
                show: "=",
                imagesMaxedOut: "=",
                maxNumImages: "@",
                maxNumPreviews: "@",
                device: "@",
                appPreviewSnapshotShowing: "@",
                numImagesNotReady: "@",
                error: "=",
                totalImageWidth: "=",
                maxHeight: "=", // keeps track of the height of the heighest image (important for desktop)
                images: "=", 
                videos: "=",
                ignoreImageLengthChange: "=",
                ignoreVideoLengthChange: "=",
                imageValidationData: "=",
                videoValidationData: "=",
                locFile: '=',
                videoEditable: '=',
                videoEditableAndUploadable: '=',
                imagesEditable: '=',
                dontAnimate: '=',
                updateDropWidthFunc: "&",
                deletedMediaItem: "="
            }, 
			
            link: function(scope, element, attrs) {
                scope.error = false;

                var zone = element.find(".zone");
                var smallestWidth; 
                var startMargin = parseInt(zone.css("margin-right")) + parseInt(zone.css("margin-left")); 
                
                var isImage = function(item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }

                var isVideo = function(item) {
                    itemType = item.type.slice(item.type.lastIndexOf('/') + 1);
                    var type = '|' + itemType + '|';

                    // little test to see if this file type can be played in this browser
                    var elem = document.createElement("video");
                    //console.log("Can this browser play a movie of type " + itemType + "? " + elem.canPlayType(item.type));
                    elem.remove();

                    return '|mp4|quicktime|x-m4v|'.indexOf(type) !== -1;
                }

                // Sets drop zone height to whatever the height of the highest screenshot/video.
                scope.$watch('maxHeight', function(newVal, oldVal) {
                    if (newVal) {
                        var extras = scope.getHeightExtras();
                        zone.css("height", (newVal - extras) + "px");
                    }
                });

                // wait for locFile to exist before setting initial drop zone text
                scope.$watch('locFile', function(newVal, oldVal) {
                    if (newVal) { 
                        scope.updateText();

                        scope.loadingTrailerText = newVal['ITC.AppVersion.Media.Dropzone.LoadingAppPreview'];
                        scope.validatingText = newVal['ITC.AppVersion.Media.Dropzone.ValidatingText'];
                        scope.chooseFileText = newVal['ITC.AppVersion.Media.Dropzone.ChooseFile'];
                        scope.instructionDetails = newVal['ITC.AppVersion.Media.Dropzone.OptionalText'];
                    }
                });

                /*
                scope.initDropWidth = function() {
                    scope.totalImageWidth = 0;
                    var data = {};
                    data.imgWidth = 0;
                    scope.$emit("imageLoaded", data); 
                    //scope.initializingDropWidth = true;
                   // scope.updateDropWidthFunc();
                };
                */

                // If going from a drop zone width of 0 to anything, hide the drop zone content until the width transition ends.
                scope.transitionEnded = function(e) {
                    if (e.originalEvent.propertyName === "width") { // only look at width changing events.
                        if (scope.previousZoneWidth === 0) {
                            scope.hideDropZoneContent = false;
                            scope.$apply();
                        }
                    }
                };

                // Listen for a transitionend so that only once this snapshot is DONE disappearing, we adjust the drop zone width.
                zone.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', scope.transitionEnded);

                scope.$watch('imageValidationData', function(newVal, oldVal) {
                    //console.log("imageValidationData changed to ", newVal);
                });

                scope.$watch('device', function(newVal, oldVal) {
                    if (newVal && newVal.length > 0) {
                        smallestWidth = parseInt(zone.css("min-height")); // don't ask. min-height doesn't change. that's why i'm using it.  
                        zone.css("height", ""); // clear height

                        scope.hideDropZoneContent = false;
                    }
                });

                scope.$watch('show', function(newVal, oldVal) {
                    if (newVal && !scope.deletedMediaItem) { 
                        scope.updateDropWidthFunc(); // calls updatePreviewWidth on appVersionCntrl.
                    }
                });

                scope.$on('mediaUpdated', function(event) {
                    if (scope.images.length === 0 && scope.videos.length === 0) {
                        scope.updateText(); 
                        scope.updateDropWidthFunc(); // calls updatePreviewWidth on appVersionCntrl. // added this here only so that drop zone width is updated if there are no images or video
                    }
                });

                scope.readyForDrop = function() {
                   return scope.imagesReady() && scope.videoReady();
                };

                scope.imagesReady = function() {
                    return parseInt(scope.numImagesNotReady)===0;
                };

                // Returns true once the video snapshot is showing, which happens before the video is loaded.
                // So by "ready", we mean "showing" by the drop zone.
                scope.videoReady = function() {
                    return scope.appPreviewSnapshotShowing === "true";
                };

                // Whenever images/trailer are added or deleted, this is triggered, with total being the total width
                // those images take up. This method changes the min-width of the parent container (so that the scroll bar 
                // appears as necessary) and sets the width on this drop zone.
                //  
                scope.$on('totalPreviewWidthChanged', function(event, data) {
                    if (scope.dontAnimate) {
                        zone.addClass("dontAnimate");
                    }
                    else {
                        zone.removeClass("dontAnimate");
                    }

                    var total = data.total;

                    var fakeNoDropZone = data.fakeNoDropZone;

                    var change = total - scope.totalImageWidth;

                    //console.log("CHANGE: " + change + ", new total: " + total + ", old total: " + scope.totalImageWidth);
                    scope.totalImageWidth = total;
                    //console.log("****totalPreviewWidthChanged to: " + total);
                    var parent = zone.closest('.appTrailersContainer');

                    // calculate min-width on container:
                    var thisWidth;
                    var margin = startMargin; 
                    var minWidth, zoneMinWidth;
                    if (!scope.imagesMaxedOut && !fakeNoDropZone && scope.show) {   // probably not the best way of putting it. but this means: if (the drop zone is showing) 
                        thisWidth = smallestWidth; 
                        minWidth = total + thisWidth + margin; 
                        zoneMinWidth = smallestWidth;
                    }
                    else { // if the drop zone isn't showing, don't add an extra (thisWidth + margin) for it.
                        thisWidth = 0;
                        minWidth = total;  
                        zoneMinWidth = 0;
                    }

                    var scroll = zone.closest('.appTrailerScroll');
                    //scroll.scrollLeft(50); // started working on <rdar://problem/17669900> but then had higher priority radars.
                    var parentWidth = scroll.width() + margin;
                    
                    var zoneWidth = Math.max(thisWidth, parentWidth-total - (2*margin));

                    //console.log("setting dropzone width to: " + zoneWidth);
                    if (thisWidth === 0) {
                        zoneWidth = 0;
                    }

                    // Hide drop zone content while transitioning (if animating) from 0 to something. (Otherwise text rearranges itself in the growing drop zone)
                    scope.previousZoneWidth = parseInt(zone.css("width"));
                    if (scope.previousZoneWidth === 0 && !scope.dontAnimate) {
                        $timeout(function() { // timeout because of $apply(), because we're already in a digest loop. 
                            scope.hideDropZoneContent = true;
                            scope.$apply();
                        });
                    }

                    zone.css("width", zoneWidth + "px");
                    parent.css("min-width", (minWidth+(margin/2)) + "px"); 
                    zone.css("min-width", zoneMinWidth + "px");
                    //console.log("changing zone width to: " + zoneWidth + ", scroll min width to: " + (minWidth+margin));
                    if (zoneWidth === 0) {
                        zone.addClass("clearMarginBorder");
                    }
                    else {
                        zone.removeClass("clearMarginBorder");
                    }
                });

                var resizeHandler = function () { 
                    var parent = zone.closest('.appTrailersContainer');
                    var margin = parseInt(zone.css("margin-right")) + parseInt(zone.css("margin-left")); 
                    var parentWidth = parent.width() - margin; 
                    zone.css("width", parentWidth - scope.totalImageWidth + "px");
                }

                // Resize this drop element if the window is resized.
                $(window).on('resize',resizeHandler);

                scope.$on("$destroy",function(){
                    $(window).off('resize',resizeHandler)
                });

                /*** prevent default drop behavior ***/
                $(document.body).bind("dragover", function(e) {
                    e.preventDefault();
                    return false;
                });

                $(document.body).bind("drop", function(e){
                    e.preventDefault();
                    return false;
                });

                scope.getHeightExtras = function() {
                    var borderWidth = parseInt(zone.css("border-width"));
                    var paddingTop = parseInt(zone.css("padding-top"));
                    var paddingBottom = parseInt(zone.css("padding-bottom"));
                    var marginTop = parseInt(zone.css("margin-top"));
                    var marginBottom = parseInt(zone.css("margin-bottom"));
                    return paddingTop + paddingBottom + marginTop + marginBottom + (2*borderWidth); 
                };

                scope.$watch('images.length', function(newVal, oldVal) {
                    if (!scope.ignoreImageLengthChange) {
                        scope.updateText();
                    }
                });

                scope.$watch('videos.length', function(newVal, oldVal) {
                    if (!scope.ignoreVideoLengthChange) {
                        scope.updateText();
                    }
                });
                
                // can add video (if allowing video and there's no a video uploaded yet)
                var canAddVideo = function() {
                    return parseInt(scope.maxNumPreviews) !== 0 && scope.videos.length === 0 && scope.videoEditable;
                }

                // updates the text depending how many images/video have been dropped.
                scope.updateText = function () {
                    if (scope.locFile) { // if no locFile yet, this method will be called again once there is.
                        scope.instructionDetails = scope.locFile['ITC.AppVersion.Media.Dropzone.OptionalText'];
                        scope.videoInstructionsInDetails = false;

                        // handle video text
                        if (canAddVideo()) {
                            if (!scope.videoEditableAndUploadable) {
                                scope.instructionDetails = scope.locFile['ITC.AppVersion.Media.CantUploadVideoDetail'];
                                scope.videoInstructionsInDetails = true;
                            }
                            else {
                                scope.instructionDetails = scope.locFile['ITC.AppVersion.Media.Dropzone.OptionalText'];
                                scope.videoInstructionsInDetails = false;
                            }
                        }
                    }
                };

                scope.getInstructionHeader = function() {
                    var instructionHeader = "";
                    if (scope.locFile && scope.images && scope.videos && scope.locFile.interpolate) {
                        var numImages = scope.images.length;
                        var numImagesLeft = parseInt(scope.maxNumImages) - numImages;
                        var canAddVideoForPreview = canAddVideo();
                        
                        if(canAddVideoForPreview && numImagesLeft > 1) {
                            // video & multiple images
                            instructionHeader = scope.locFile.interpolate('ITC.AppVersion.Media.Dropzone.DragText.VideoAndImages', {'imageNumber': numImagesLeft});
                        } else if(canAddVideoForPreview && numImagesLeft === 1) {
                            // video & single image
                            instructionHeader = scope.locFile.interpolate('ITC.AppVersion.Media.Dropzone.DragText.VideoAndImage', {'imageNumber': numImagesLeft});
                        } else if(canAddVideoForPreview && numImagesLeft === 0) {
                            // video only
                            instructionHeader = scope.locFile.interpolate('ITC.AppVersion.Media.Dropzone.DragText.Video');                        
                        } else if(!canAddVideoForPreview && numImagesLeft > 1) {
                            // multiple images only       
                            instructionHeader = scope.locFile.interpolate('ITC.AppVersion.Media.Dropzone.DragText.Images', {'imageNumber': numImagesLeft});                 
                        } else if(!canAddVideoForPreview && numImagesLeft === 1) {
                            // single image only
                            instructionHeader = scope.locFile.interpolate('ITC.AppVersion.Media.Dropzone.DragText.Image', {'imageNumber': numImagesLeft});                 
                        }

                        if ((scope.videos.length < parseInt(scope.maxNumPreviews)) && // if there's room for a video
                             scope.videoEditable &&                                     // and it's editable
                             !scope.videoEditableAndUploadable &&                       // but not uploadable
                             numImagesLeft === 0   ) {                                  // and there's no room left for more images
                                instructionHeader = scope.locFile['ITC.AppVersion.Media.CantPlayVideo'];
                        }
                    }
                    
                    return instructionHeader;
                }

                scope.showInstructionDetails = function() {
                    var show = 
                        (scope.images.length !== 0 || scope.videoInstructionsInDetails)
                        && scope.readyForDrop();
                    //console.log("returning: " + show);
                    return show;
                };

                // Called when files are dragged in or selected via the file chooser.
                scope.onFileSelect = function($files) {

                    // if the drop zone has a loader, don't accept additional drops.
                    if (!scope.readyForDrop()) {
                        //console.log("not ready for drop.");
                        return;
                    }

                    scope.error = false; // clear previous errors
                    scope.dontAnimate = false; // do animate.
                    
                    var file;
                    // get number of image files
                    var numImageFiles = 0;
                    var imageFiles = new Array();
                    var videoFiles = new Array();
                    var maxNumVids = parseInt(scope.maxNumPreviews);
                    var vidNotUploadable = false;
                    for (var i = 0; i < $files.length; i++) {
                        file = $files[i];
                        if (isVideo(file) && maxNumVids>0 && scope.videoEditable) { 
                            if (scope.videoEditableAndUploadable) {
                                videoFiles.push(file);
                            }
                            else {
                                videoFiles.push(file); // just push it. 
                                vidNotUploadable = true;
                                //scope.error = scope.locFile['ITC.AppVersion.Media.CantUploadVideoDetail']; 
                            }
                        }
                        else if(isImage(file) && scope.imagesEditable) {
                            imageFiles.push(file);
                        } 
                        else {
                            scope.error = scope.locFile.interpolate('ITC.AppVersion.Media.ErrorMessages.WrongFileType'); // to cancel other file uploads if one is a wrong file type?
                        }
                      
                    }   
                   
                    var vidError = false;
                    if (videoFiles.length > maxNumVids && !vidNotUploadable) {
                        scope.error = scope.locFile.interpolate('ITC.AppVersion.Media.ErrorMessages.TooManyVideosSelected',{'maxNumVideos': maxNumVids});
                        vidError = true;
                    }
                    else if (scope.videos.length>0 && ((scope.videos.length+videoFiles.length) > maxNumVids)) { // AppPreviewAlreadySelected error msg takes precedence over CantUploadVideoDetail
                        scope.error = scope.locFile.interpolate('ITC.AppVersion.Media.ErrorMessages.AppPreviewAlreadySelected');
                        vidError = true;
                    }
                    else if (vidNotUploadable) {
                        scope.error = scope.locFile.interpolate('ITC.AppVersion.Media.CantUploadVideoDetail');
                        vidError = true;
                    }
                    else {
                        for (var i = 0; i < videoFiles.length; i++) {
                            file = videoFiles[i];
                            scope.videoFileSelectedForUpload(file);
                        }
                    }

                    var numImagesToAdd = imageFiles.length;
                    var max = parseInt(scope.maxNumImages);

                    // if there's a video error, don't upload images.
                    var tooManyImages = ((scope.images.length+imageFiles.length) > max);
                    if (vidError || tooManyImages) { 
                        var numLeftToAdd = max - scope.images.length;

                        // get the right tooManyImagesError
                        var tooManyImagesError = scope.locFile.interpolate('ITC.AppVersion.Media.ErrorMessages.TooManyImagesSelected',{'maxNumImages': numLeftToAdd});
                        if (numLeftToAdd === 0) {
                            tooManyImagesError = scope.locFile.interpolate('ITC.AppVersion.Media.ErrorMessages.ImagesAlreadySelected',{'maxNumImages': max});
                        }
                        else if (numLeftToAdd === 1) {
                            tooManyImagesError = scope.locFile.interpolate('ITC.AppVersion.Media.ErrorMessages.TooManyImagesSelectedSingular');
                        }

                        if (vidError && tooManyImages) { // include both messages
                            scope.error += " " + tooManyImagesError;
                        }
                        else if (tooManyImages) { // no video error
                            scope.error = tooManyImagesError;
                        }
                    }
                    else {
                        for (var i = 0; i < numImagesToAdd; i++) {
                            file = imageFiles[i];
                            scope.imageFileSelectedForUpload(file);
                        }
                    }
                };

                scope.imageFileSelectedForUpload = function(file) { 
                    var imgFile = URL.createObjectURL(file);
                    //imgFile = $sce.trustAsResourceUrl(imgFile);  // necessary? doesn't seem so

                    scope.validateImageFileSize(file, imgFile);
                    //scope.dontValidateFileSize(file, imgFile); // temporary to test uploader errors
                };

                scope.videoFileSelectedForUpload = function(file) {

                    // validate file size here.
                    if (scope.validateVideoFileSize(file)) {
                        var videoFile = URL.createObjectURL(file);
                        var videoURL = $sce.trustAsResourceUrl(videoFile);   // this does seem necessary.

                        scope.validateVideoFileDimensions(file, videoURL); // calls continueWithUpload if it passes validation.
                        //scope.continueWithUpload(file, videoURL, 'videoDropped');
                    }
                    else {
                        scope.error = scope.locFile['ITC.AppVersion.Media.ErrorMessages.FileTooLarge'];
                    }
                    
                };

                scope.continueWithUpload = function(file, url, eventToEmit) {
                    var data = {};
                    data.url = url;
                    data.file = file;

                    scope.$emit(eventToEmit, data);
                    //scope.error = false; // don't clear error here
                };

                scope.$watch('error', function(newVal, oldVal) {
                    if (newVal) {
                        scope.showError(newVal);
                    }
                    else {
                        scope.clearError();
                    }
                });

                scope.showError = function(msg) {
                    zone.addClass("error");

                    // show the error for 3 seconds regardless of mouse hover.
                    var errorPopup = element.find('.errorPopUp');
                    errorPopup.addClass("open");
                    scope.stayOpen = true;
                    $timeout(function(){
                        errorPopup.removeClass("open");
                        scope.stayOpen = false;
                    },3000);
                };

                scope.clearError = function() {
                    zone.removeClass("error");
                    //scope.error = false;
                };

                element.bind('mouseenter', function() {
                    if (scope.error) {
                        element.find(".errorPopUp").addClass("open");
                    }
                });

                element.bind('mouseleave', function() {
                    if (scope.error && !scope.stayOpen) {
                        element.find(".errorPopUp").removeClass("open");
                    }
                });

                // Checks if file size is under 500mb.
                scope.validateVideoFileSize = function(file) {
                    var megabytes = file.size/1000000;
                    return megabytes <= 500; // valid if less than or equal to 500 MB
                };  

                scope.validateImageFileSize = function(file, url) {
                    if (scope.imageValidationData) {
                        var ret;
                        var validSizesForDevice = scope.imageValidationData[scope.device];

                        var loadFunc = function() {
                            //console.log("dummy image loaded");
                            var width = this.width;
                            var height = this.height;

                            var dimensionsArr = new Array();
                            var expectedW, expectedH, expectedDimensionsArr;
                            for (var i = 0; i < validSizesForDevice.length; i++) {
                                expectedDimensionsArr = validSizesForDevice[i].split("x");
                                expectedW = parseInt(expectedDimensionsArr[0]); 
                                expectedH = parseInt(expectedDimensionsArr[1]); 
                                if (expectedW === width && expectedH === height) {
                                    scope.continueWithUpload(file, url, 'imageDropped');
                                    return;
                                }
                            }

                            // if got here, the height/width do not match the expected heights/widths.
                            scope.error = $sce.trustAsHtml(scope.locFile.interpolate('ITC.AppVersion.Media.ErrorMessages.WrongImageDimensions'));

                            scope.$apply();

                            // remove dummy element from the dom here? it's not attached to anything in the dom, so 
                            // I *think* it gets garbage collected.
                        };

                        var loadErrorFunc = function() {
                            console.log("some error happened getting image dimensions on the client. letting the server handle it.");
                            scope.continueWithUpload(file, url, 'imageDropped');
                        };

                        // create a dummy element just to get the width and height of the image.
                        var img = document.createElement('img');
                        var jqImg = $(img);
                        jqImg.bind('load', loadFunc);
                        jqImg.bind('error', loadErrorFunc);
                        img.src = url;
                    }
                };

                scope.validateVideoFileDimensions = function(file, url) {
                    if (scope.videoValidationData) {
                        //console.log("validateVideoFileDimensions");
                        var validSizesForDevice = scope.videoValidationData[scope.device];

                        var loadFunc = function() {
                            //console.log("dummy video loaded");
                            var width = this.videoWidth;
                            var height = this.videoHeight;

                            var dimensionsArr = new Array();
                            var expectedW, expectedH, expectedDimensionsArr;
                            for (var i = 0; i < validSizesForDevice.length; i++) {
                                expectedDimensionsArr = validSizesForDevice[i].split("x");
                                expectedW = parseInt(expectedDimensionsArr[0]); 
                                expectedH = parseInt(expectedDimensionsArr[1]); 
                                if (expectedW === width && expectedH === height) {
                                    scope.continueWithUpload(file, url, 'videoDropped');
                                    return;
                                }
                            }

                            // if got here, the height/width do not match the expected heights/widths.
                            //scope.error = "The image dimensions should be: " + validSizesForDevice.join(", ");
                            scope.error = scope.locFile['ITC.AppVersion.Media.ErrorMessages.WrongVideoDimensions'];
                            scope.error = scope.error.replace('@@validDimensions@@', validSizesForDevice.join(", "));

                            scope.$apply();

                            // remove dummy element from the dom here? it's not attached to anything in the dom, so 
                            // I *think* it gets garbage collected.
                        };

                        var loadErrorFunc = function() {
                            console.log("some error happened getting video dimensions on the client. letting the server handle it.");
                            scope.continueWithUpload(file, url, 'videoDropped');
                        };

                        // create a dummy element just to get the width and height of the video.
                        var vid = document.createElement("video");
                        var jqVid = $(vid);
                        jqVid.on("loadeddata", loadFunc); 
                        jqVid.on('error', loadErrorFunc);
                        vid.src = url;
                    }
               
                };

                scope.dontValidateFileSize = function(file, url) {
                    scope.continueWithUpload(file, url, 'imageDropped');
                };

                scope.updateText();

            } // end link

		} // end return
	}); // end itcApp.directive

}); // end define

