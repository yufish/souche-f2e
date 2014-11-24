/************************************************************************************************************************/
/******************************************* video_snapshot_grab_directive.js *******************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('videoSnapshot',function($timeout){
        return {
            restrict: 'A',
            templateUrl: getGlobalPath('/itc/views/directives/video_snapshot_template.html'),
            scope: {
                show: "=",
                error: "=",
                locFile: "=",
                imageValidationData: "=",
                device: "@",
                cantPlayVideo: "=", // for example, this will be true if on chrome playing a saved video.
                previewPlayAllowed: "@",
                setVideoLoadingErrorFunc: "&", // removed use of this but keeping it around just in case
                grabHasHappenedBefore: "=" // gets reset to false every time screenshots/video are refreshed
            }, 
          
            link: function(scope, element, attrs) {
                var v; // Set this once the video element is created.
                var c = element.find('canvas')[0];
                var hiddenCanvas;
                scope.noChange = true;
                
                scope.$watch('show', function(newVal, oldVal) {
                    if (!newVal) { // if hiding 
                        scope.stopVideo();

                        // reset time to start for next opening of this dialog.
                        if (v) {
                            v.currentTime = 0;
                        }
                    }      
                    else { // if showing
                      //c.style.marginTop = (c.parentNode.offsetHeight - c.height)/2 + "px";
                      scope.noChange = true;
                      scope.copyPosterFrameToCanvas(0);
                    }
                });

                // get poster frame dimensions that will pass DU
                scope.getGoodPosterFrameDimensions = function(width, height) {
                    var dimensions = {};
                    dimensions.width = 0;
                    dimensions.height = 0;
                    if (scope.imageValidationData) {
                        var isPortrait = (height>width);
                        var validSizesForDevice = scope.imageValidationData[scope.device];
                        if (validSizesForDevice.indexOf(width + 'x' + height) > -1) {
                            dimensions.width = width;
                            dimensions.height = height;
                        }
                        else {
                            var expectedW, expectedH, expectedDimensionsArr;
                            var smallestW = 10000000;
                            var smallestH = 10000000;
                            for (var i = 0; i < validSizesForDevice.length; i++) {
                                expectedDimensionsArr = validSizesForDevice[i].split("x");
                                expectedW = parseInt(expectedDimensionsArr[0]); 
                                expectedH = parseInt(expectedDimensionsArr[1]); 
                                // get the first width/height at the same orientation that we can scale down to.
                                if ((width > height && expectedW > expectedH) || (width < height && expectedW < expectedH)) { // if landscape or portrait
                                    smallestW = Math.min(smallestW, expectedW);
                                    smallestH = Math.min(smallestH, expectedH);
                                    if (expectedW < width && expectedH < height) { // if scaling down
                                        dimensions.width = expectedW;
                                        dimensions.height = expectedH;
                                        break;
                                    }
                                }
                            }

                            if (dimensions.width === 0 && dimensions.height === 0) {
                                dimensions.width = smallestW;
                                dimensions.height = smallestH;
                            }
                        }
                    }
                    else {
                        console.log("UH OH. imageValidationData not set yet!");
                    }
                    //console.log("SCALED preview image: " + width + ", " + height + " to " + dimensions.width + ", " + dimensions.height)
                    return dimensions;
                };

                scope.$on('setVideoURL', function(event, data) { 
                    //console.info('setVideoURL: ', data);
                    scope.videoURL = data.url; // so that videoSnapshotTemplate.html gets the right value. 
                    var fileType, sourceEl;
                    // if got a file
                    if (data.file) {
                        scope.file = data.file; // save for later

                        fileType = data.file.type;
                        sourceEl = '<source type="' +  fileType + '">';
                        if (fileType === "video/quicktime") {
                            sourceEl += '<source type="video/mp4">'; // makes .mov movie work in chrome
                        }     
                    }
                    else if (data.videoUrlFromServer) { // if got a url from server
                        fileType = "application/x-mpegurl";
                        sourceEl = '<source type="' +  fileType + '">'; // add src in ajax call
                    }

                    // This is how we're getting video source to change - reinserting a video element altogether.
                    // This is all because of an Angular bug with setting ng-src on a video's, source's src.
                    element.find("#videoHolder").html('<video crossorigin="anonymous" controls="" id="video" name="media">' + sourceEl + '</video>'); 

                    jqV = element.find("#videoHolder video");
                    v = jqV[0]; 

                    var canPlayIt = false;
                    if ( v.canPlayType ) {
                        canPlayIt = "" !== v.canPlayType(fileType);
                        if (fileType === "video/quicktime" && !canPlayIt) {
                            canPlayIt = "" !== v.canPlayType("video/mp4"); // for chrome
                        }
                    }
                    //console.log("Can play " + fileType + "? " + canPlayIt);
                    if (!scope.cantPlayVideo) { // only change scope.cantPlayVideo if it was previously set to false (if it was playable according to the properties)
                                                // if the properties say we can't play it, don't override the properties. 
                        scope.cantPlayVideo = !canPlayIt; 
                    }
                    if (scope.previewPlayAllowed === "false") {
                        canPlayIt = false;
                    } 
                    if (!canPlayIt) {
                        // just copy the preview image to the snapshot zone
                        scope.copyPreviewExistingImage(data.previewImage, data.previewTimestamp, data.videoUrlFromServer);
                    }
                    else {

                        // set up listeners before we add the source url to the src attribute
                        jqV.on("loadeddata", 
                            {data: data},
                            scope.onVideoLoadedFunc); 
                        jqV.on("error", 
                            {data: data},
                            scope.onVideoLoadingErrorFunc);
                        jqV.on("seeked", 
                            {data: data},
                            scope.onVideoSeekedFunc);
                        jqV.on("ended", 
                            {data: data},
                            scope.onVideoEndedFunc);

                        /*
                        jqV.on("canplaythrough", function() {
                            console.log("CAN PLAY THRU NOW");
                        });
                        */

                        if (data.file) {
                            jqV.find("source").attr("src", data.url);
                            v.load();
                        }
                        // if we have a video url from the server, we need to tweak the source url so that
                        // it's not from a different domain, or we end up tainting the canvas and getting 
                        // DOM security errors when we try to save a new poster frame.
                        else if (data.videoUrlFromServer) { // if got a url from server
                            $.ajax({
                                type: 'get',
                                url : data.videoUrlFromServer,
                                crossDomain: 'true',
                                success: function(vidData) {
                                    // get a base64 version of the video!
                                    var base64 = window.btoa(vidData);
                                    // get a new url!
                                    var newURL = 'data:' + 'application/x-mpegurl' + ';base64,' + base64; // holy crap this works

                                    jqV.find("source").attr("src", newURL);
                                    v.load();
                                },
                                error: function(vidData) { 
                                    console.log('Error: failed to get video data: ' + vidData.responseText);
                                    scope.upload = false;
                                    scope.grabExistingImage(data.previewImage, data.previewImageFromServer);
                                    scope.copyPreviewExistingImage(data.previewImage, data.previewTimestamp, data.videoUrlFromServer, true);

                                    // To get the error in a red bubble instead:
                                    //scope.setVideoLoadingErrorFunc(); // calls setGenericVideoLoadingError in app_version_ctrl
                                }
                            });
                    
                        }
                    }   
                   
                });

                scope.onVideoLoadingErrorFunc = function() {
                    console.log("loading error");
                };

                // Called on this modal showing. Just copies the already saved poster frame to teh canvas (not the hidden canvas).
                scope.copyPosterFrameToCanvas = function(indexInParentArray) {
                    var dataFromParent = scope.$parent.previewVideos[indexInParentArray]; //scope.$parent.previewVideo;
                    var previewImgSrc = dataFromParent.data;

                    /* Would call grabExistingImage but that copies the image to the hidden canvas, which
                    is unneccessary here.
                    var previewImageFromServer = true;
                    if (previewImgSrc.indexOf("data:") === 0) {
                        previewImageFromServer = false; 
                    }
                    scope.grabExistingImage(previewImgSrc, previewImageFromServer); 
                    */

                    // create a temporary dummy image element just to draw it on the canvas
                    var img = new Image;      // First create the image...
                    img.onload = function(){  // ...then set the onload handler...
                        var context = c.getContext('2d');   
                        context.drawImage(img, 0, 0, c.width, c.height);
                        // No need to copy to the hidden canvas. This is just for show, not for saving. In fact the 'done'
                        // button is disabled at this point.
                        //var hiddenContext = hiddenCanvas.getContext('2d');
                        //hiddenContext.drawImage(img, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
                    };
                    img.onerror = function() { // shouldn't happen.
                        console.log("copyPosterFrameToCanvas image loading error.");
                    };
                    img.src = previewImgSrc;
                };
                    
                scope.cancel = function() {
                  scope.$emit('cancelFileUpload');
                };

                scope.copyPreview = function(event) {
                    var isNewVideo = true;
                    if (event && event.data && event.data.userGrab) {
                        isNewVideo = false;
                        scope.upload = true; // if it's a user grab, we'll need to upload the new poster frame.
                    }

                    var data = {};

                    // getting this here: [Error] SecurityError: DOM Exception 18: An attempt was made to break through the security policy of the user agent.
                    data.data = hiddenCanvas.toDataURL("image/jpeg"); // grabbing the bigger image from the hiddenCanvas

                    data.file = scope.file;
                    data.previewTimestamp = scope.formatTime(v.currentTime);
                    data.isPortrait = (c.height > c.width);

                    if (scope.upload === undefined) { 
                        scope.upload = true; // default is to upload
                    }
                    data.upload = scope.upload;

                    scope.$emit('copyPreview', data, isNewVideo);
                };

                // Given a float, seconds, returns a string of the format "hh:mm:ss:ms".
                scope.formatTime = function(seconds) {
                    var origSeconds = seconds;
                    var prefix = "00:";
                    var minutes = Math.floor(seconds / 60);
                    minutes = (minutes >= 10) ? minutes : "0" + minutes;
                    var seconds = Math.floor(seconds % 60);

                    var remainingMs = (origSeconds - seconds) * 1000 * 100; // * 100 to get rid of the decimal point
                    var ms = Math.round(remainingMs / 3600);

                    seconds = (seconds >= 10) ? seconds : "0" + seconds;
                    ms = (ms >= 10) ? ms : "0" + ms;

                    return prefix + minutes + ":" + seconds + ":" + ms;
                };

                scope.forward = function() {
                    v.pause();
                    v.currentTime += 1; //1/30; 
                };

                scope.back = function() {
                    v.pause(); // first pause the video, then advance the frame.
                    v.currentTime -= 1; //1/30; 
                };

                // Does the grab. If fakeIt param is true, just draw onto the hidden canvas.
                scope.grab = function (fakeIt) {

                    // grab a smaller version for display
                    var context = c.getContext('2d');       

                    if (!fakeIt) { // to fake it, skip this. to really do a grab (ie. not fake it), do drawImage onto c.
                        context.drawImage(v, 0, 0, c.width, c.height);
                    }
                    
                    // and a bigger version (from a hidden canvas) for file creation later in scope.copyPreview
                    var hiddenContext = hiddenCanvas.getContext('2d');
                    hiddenContext.drawImage(v, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
                };

                scope.grabExistingImage = function (dataURL, imageIsFromServer) {
                    var img = new Image;      // First create the image...
                    img.onload = function(){  // ...then set the onload handler...
                        // grab a smaller version for display
                        var context = c.getContext('2d');              
                        context.drawImage(img, 0, 0, c.width, c.height);

                        // and a bigger version (from a hidden canvas) for file creation later in scope.copyPreview
                        var hiddenContext = hiddenCanvas.getContext('2d');
                        hiddenContext.drawImage(img, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
                    };

                    img.onerror = function(e, a, b) {
                        console.info("error loading poster frame! ", e);
                    }

                    // THIS WAS TAINTING THE CANVAS!!!
                    //img.src = dataURL;   

                    if (imageIsFromServer) {
                        $.ajax({
                            type: 'get',
                            url : dataURL,
                            crossDomain: 'true',
                            //dataType: "image/jpeg",
                            success: function(data) {
                                // simple as this:
                                img.src = data;          
                            },
                            error: function() {
                                console.log('Error: failed to ajax GET image.');
                            }
                        });
                    }
                    else {
                        img.src = dataURL;
                    }
                };

                // Grabs an image twice, 700 ms apart. Why? Because safari doesn't grab the image the first time around.
                // A weird workaround for safari not grabbing the image the first time around. 
                // Grab it twice, a slight delay apart. Doesn't hurt anything.
                scope.grab2x = function() {
                    var wasPaused = v.paused;

                    if (!scope.grabHasHappenedBefore) { // if we need to do a fake grab
                        v.pause(); // Another weird Safari quirk. Need to pause video to do the grab.
                        //console.log("fake grab");
                        scope.grab(true); // fake grab
                        $timeout(function() {
                            //console.log("real grab");
                            scope.grab(); // real grab
                            if (!wasPaused) { // if was previously playing, play it again.
                                v.play();
                            }
                            scope.grabHasHappenedBefore = true;
                            scope.noChange = false;
                        }, 700);  // a 500 ms delay. doesn't work without it. Actually the restore default needs 700. Grrr.
                    }
                    else { // real grab
                        scope.grab(); // real grab
                        scope.noChange = false;
                    }
                };

                scope.restoreDefault = function() {
                    scope.grabHasHappenedBefore = false;
                    v.pause();
                    v.currentTime = 5; 
                    scope.grab2x();
                }

                scope.stopVideo = function(){

                    if (v) {
                        v.pause();
                        var context = c.getContext('2d');
                        context.clearRect (0, 0, c.width, c.height);
                    }
                };

                scope.validateVideo = function() {
                    //console.info("validation here! ", v);

                    if (v.videoHeight === 0 && v.videoWidth === 0) { // happens for prores videos in chrome
                        scope.error = scope.locFile['ITC.AppVersion.Media.ErrorMessages.GenericVideoLoadingError'];
                    }
                    else if (v.duration < 14.5) {
                        scope.error = scope.locFile['ITC.AppVersion.Media.ErrorMessages.VideoTooShort'];
                    }
                    else if (v.duration > 30.5) {
                        scope.error = scope.locFile['ITC.AppVersion.Media.ErrorMessages.VideoTooLong'];
                    }

                    if (scope.error) {
                        scope.$apply();
                        return false;
                    }
                    else {
                        return true;
                    }
                };


                /* A good way to tell what's supported in the current browser. Keeping for possible later use.
                if ( v.canPlayType ) {
                    // Check for MPEG-4 support
                    mpeg4 = "" !== v.canPlayType( 'video/mp4; codecs="mp4v.20.8"' );

                    // Check for h264 support
                    h264 = "" !== ( v.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )
                        || v.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) );

                    // Check for Ogg support
                    ogg = "" !== v.canPlayType( 'video/ogg; codecs="theora"' );

                    // Check for Webm support
                    webm = "" !== v.canPlayType( 'video/webm; codecs="vp8, vorbis"' );
                }
                */

                // Clear the hiddenCanvas if the video is deleted
                scope.$on('videoPreviewDeleted', function(event, data) { 
                    hiddenCanvas = null; 
                    // If we don't clear it, if a video has been processed, deleted, and a new video added, we get the mysterious: 
                    // SecurityError: DOM Exception 18: An attempt was made to break through the security policy of the user agent.
                    // This may only be an issue on localhost
                });

                scope.onVideoSeekedFunc = function(e) {
                    //console.log("SEEKED");
                    var forward = element.find(".stepperForward");
                    var back = element.find(".stepperBackward");
                    var lastSecond = Math.floor(v.duration);
                    var currentTimeFloored = Math.floor(v.currentTime);

                    forward.removeClass("inactive");
                    back.removeClass("inactive");
                    if (v.ended || currentTimeFloored === lastSecond) { // disable right scrubber
                        forward.addClass("inactive");
                    }
                    else if (v.currentTime === 0) { // disable left scrubber
                        back.addClass("inactive");
                    }
                };

                scope.onVideoEndedFunc = function(e) {
                    var forward = element.find(".stepperForward");
                    forward.addClass("inactive");
                };

                // video height and with become available here... unless it's a prores file.
                scope.onVideoLoadedFunc = function(e) {
                        //console.log(v);
                        //console.log("ONLOADEDDATA video height: " + v.videoHeight + ", width: " + v.videoWidth);

                        if (scope.validateVideo()) { // comment this out to test DU error handling.

                            v.crossOrigin = "Anonymous"; // just in case!!!

                            // create a dummy canvas (only once) for a real sized poster frame image
                            if (!hiddenCanvas) {
                                hiddenCanvas = document.createElement("canvas");
                            }
                            hiddenCanvas.width = v.videoWidth;
                            hiddenCanvas.height = v.videoHeight;

                            // SCALE DOWN HERE! 
                            var goodDimensions = scope.getGoodPosterFrameDimensions(v.videoWidth, v.videoHeight);
                            hiddenCanvas.width = goodDimensions.width;
                            hiddenCanvas.height = goodDimensions.height;
            
                            //console.log("video width: " + $(v).width());
                            var vidShrunkWidth = $(v).width();
                            var shrinkRatio = vidShrunkWidth/v.videoWidth;
                            var shrunkHeight = shrinkRatio * v.videoHeight;

                            v.parentElement.style.height = shrunkHeight + "px";
                            v.style.height = shrunkHeight  + "px";
                            c.parentElement.style.height = shrunkHeight  + "px";

                            c.width = vidShrunkWidth;
                            c.height = shrunkHeight;

                            scope.upload = true; // default is to upload
                            if (e.data && e.data.data && e.data.data.previewImage && e.data.data.previewTimestamp) {
                                scope.grabExistingImage(e.data.data.previewImage, e.data.data.previewImageFromServer);
                                scope.copyPreviewExistingImage(e.data.data.previewImage, e.data.data.previewTimestamp, e.data.data.videoUrlFromServer);
                            }
                            else {
                                // get a snapshot 5 seconds in, or however many seconds in we previously set it to.
                                v.currentTime = 5; 
                                if (e.data && e.data.data) {
                                    if (e.data.data.previewTimestamp !== undefined) {
                                        v.currentTime = e.data.data.previewTimestamp;
                                    }
                                    if (e.data.data.upload !== undefined && !e.data.data.upload) {
                                        scope.upload = false;
                                    } 
                                }
                                scope.grab(); // workaround for safari - see comment on grab2x function.
                                $timeout(function() {
                                    scope.grab(); 
                                    scope.copyPreview();
                                    v.currentTime = 0; 
                                }, 500);  // a 500 ms delay after metadata is loaded allows us to actually grab a screen shot. doesn't work without delay.
                            } 
                        }        
                };

                scope.copyPreviewExistingImage = function(previewImageURL, timestamp, videoUrlFromServer, hasError) {
                    var isNewVideo = false;
                    
                    var data = {};
                    data.data = previewImageURL; //hiddenCanvas.toDataURL("image/jpeg"); // grabbing the bigger image from the hiddenCanvas
                    data.file = scope.file;
                    data.previewTimestamp = timestamp;
                    data.isPortrait = (c.height > c.width);
                    data.videoUrlFromServer = videoUrlFromServer;
                    data.videoError = hasError;

                    scope.upload = false;
                    data.upload = scope.upload;

                    scope.$emit('copyPreview', data, isNewVideo); 
                };

                // using click instead of ng-click because i want to manually call $apply in app.js
                // right before broadcasting "setPreview"
                element.find(".doneButton").bind("click", {userGrab: true}, scope.copyPreview);


            }, // end link
        } // end return
	}); // end itcApp.directive

}); // end define


