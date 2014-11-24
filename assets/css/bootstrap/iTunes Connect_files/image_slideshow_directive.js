/************************************************************************************************************************/
/********************************************* image_slideshow_directive.js *********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('imageSlideshow',function($timeout, $sce){
        return {
            restrict: 'A',
            templateUrl: getGlobalPath('/itc/views/directives/image_slideshow_template.html'),
            scope: {
                show: "=",
                images: "=",
                videos: '=',
                currentIndex: "=",
                videoShowing: "=",
                cantPlayVideo: "=",
                processingVideo: "=",
                videoError: "=",
            }, 
          
            link: function(scope, element, attrs) {
                var mainImg = element.find("img");
                var arrowButtons = element.find(".slideshowArrow");
                var btnContainerRt = element.find(".slideshowButtonContainerRight");
                var btnContainerLt = element.find(".slideshowButtonContainerLeft");
                var mainContent = element.find(".slideshowMainContent");
                var mainContentParent = mainContent.parent();
                var videoHolder = element.find("#videoSlideshowHolder");
                scope.videoShowing = false;
                scope.animate = false;

                scope.hasVideoError = function() {
                    return scope.cantPlayVideo || scope.processingVideo || scope.videoError;
                };

                scope.setVideo = function() {
                    if (scope.videos.length > 0) {
                        console.info("video: ", scope.videos[0]);
                        var file = scope.videos[0].videoFile;
                        var videoUrlFromServer = scope.videos[0].videoUrlFromServer;

                        var fileType, sourceEl;
                        // if got a file
                        if (file) {
                            var videoFile = URL.createObjectURL(file);
                            var videoURL = $sce.trustAsResourceUrl(videoFile); 

                            fileType = file.type;
                            var sourceEl = '<source src="' + videoURL + '" type="' +  fileType + '">';
                            if (fileType === "video/quicktime") {
                                sourceEl += '<source src="' + videoURL + '" type="video/mp4">'; // makes .mov movie work in chrome
                            }     
                        }
                        else if (videoUrlFromServer) { // if got a url from server
                            fileType = "application/x-mpegurl";
                            sourceEl = '<source src="' + videoUrlFromServer + '" type="' +  fileType + '">';
                        }

                        // This is how we're getting video source to change - reinserting a video element altogether.
                        // This is all because of an Angular bug with setting ng-src on a video's, source's src.
                        videoHolder.html('<video class="ng-hide" controls="" id="video" name="media">' + sourceEl + '</video>');

                        var jqV = element.find('#video');
                        jqV.on("loadeddata", scope.onVideoLoadedFunc); 

                    }
                };

                // this is where we get the video height and width.
                scope.onVideoLoadedFunc = function(e) {
                    var v = e.target;

                    scope.videoWidth = v.videoWidth;
                    scope.videoHeight = v.videoHeight;

                    scope.setDimensions();
                    scope.adjustContentAndButtonMargins();

                    var jqV = element.find('#video');
                    jqV.removeClass("ng-hide");
                };
                
                // Currently does nothing. Was trying to find a way to know when video is collapsed.    
                $(document).on("webkitfullscreenchange", function (e) { 
                    //console.log("expanded!");
                    var jqV = element.find('#video');
                    var v = jqV[0];
                    
                    var fullscreen = document.webkitIsFullScreen;
                    if (fullscreen) {
                        if (document.webkitCurrentFullScreenElement === v) {
                            scope.lastFullScreenElement = document.webkitCurrentFullScreenElement;
                        }
                    }
                    else {
                        if (v === scope.lastFullScreenElement) {
                            //console.log("just collapsed!");
                        }
                    }
                });

                // set the width and height of this image_slideshow to account for the largest height image and largest width image.
                scope.setDimensions = function() {
                    var maxHeight=0;
                    var maxWidth=0; 
                    var image;
                    for (var i = 0; i < scope.images.length; i++) {
                        image = scope.images[i];
                        maxHeight = Math.max(maxHeight, image.actualImgHeight);
                        maxWidth = Math.max(maxWidth, image.actualImgWidth);
                    }
                    if (!scope.hasVideoError() && scope.videoWidth && scope.videoHeight) {
                        maxHeight = Math.max(maxHeight, scope.videoHeight);
                        maxWidth = Math.max(maxWidth, scope.videoWidth);
                    }

                    var wh = window.innerHeight; // do we care about non-modern browsers? if so, do this: http://stackoverflow.com/questions/3333329/javascript-get-browser-height
                    var ww = window.innerWidth;
                    if (wh < maxHeight) {
                        maxHeight = wh - 40;
                    }

                    if (ww < maxWidth) {
                        maxWidth = ww - 40;
                    }

                    scope.maxHeight = maxHeight;
                    scope.maxWidth = maxWidth;
                };

                mainImg.bind('load', function() {
                    scope.adjustContentAndButtonMargins();

                });

                mainImg.bind('error', function() {
                    console.log("error loading image in slideshow");

                });

                
                // Vertically centers slideshowPanel in the lightbox.
                scope.centerImageSlideshowPanel = function() {
                    var lightbox = element.closest('.full-lightbox');
                    var slideshowPanel = element.find('.imageSlideshowPanel');

                    var marginTop = (lightbox.height() - slideshowPanel.height())/2;
                    slideshowPanel.css("margin-top", marginTop);
                };

                scope.adjustContentAndButtonMargins = function() {
                    
                    // make the main content fit between the arrows.
                    //mainContent.width(scope.maxWidth - 214);
                    mainContent.height(scope.maxHeight - 40);

                    var mainContentH = mainContent.height();
                    var mainContentW = mainContent.width();
                    //console.log("mainContent w h: " + mainContentW + ", " + mainContentH);

                    var mainImgWidthOld = mainImg[0].naturalWidth; //mainImg.width();
                    var mainImgHeightOld = mainImg[0].naturalHeight; //.height();
                    mainImg.width(mainImgWidthOld);
                    mainImg.height(mainImgHeightOld);

                    if (mainImgWidthOld > mainContentW) {
                        mainImg.width(mainContentW); // shrink image width to fit content
                        mainImg.height(mainImg.width() * mainImgHeightOld/mainImgWidthOld);
                    }

                    mainImgHeightOld = mainImg.height();
                    mainImgWidthOld = mainImg.width();

                    if (mainImgHeightOld > mainContentH) {
                        mainImg.height(mainContentH);
                        mainImg.width(mainImg.height() * mainImgWidthOld/mainImgHeightOld);
                    }
                    var btn = arrowButtons.first();

                    var h = mainImg.height();
                    if (scope.videoShowing) {
                        vid = element.find("video");
                        h = scope.maxHeight - 40;
                        vid.height(h);
                    }
                    btnContainerRt.height(h);
                    btnContainerLt.height(h);

                    // center mainContent horizontally. pretty ugly but works.
                    var diff; // = mainContentParent.width() - mainContent.width() - (2*btn.width()) - 2*parseInt(btn.css("margin-left"));
                    //mainContent.css("margin-left", diff/2); // nah nevermind. unnecessary

                    // center image vertically
                    var imgMarginTop = 0;
                    if (!scope.videoShowing) {
                        diff = mainContent.height() - mainImg.height();
                        imgMarginTop = diff/2;
                        mainImg.css("margin-top", imgMarginTop);
                    }

                    var marginTop = (btnContainerRt.height() - btn.height())/2;
                    arrowButtons.css("margin-top", marginTop + imgMarginTop);

                    scope.centerImageSlideshowPanel();
                };

                // Resize this drop element if the window is resized.
                var resizeAdjustHandler = scope.adjustContentAndButtonMargins();
                $(window).on('resize',resizeAdjustHandler);
                scope.$on("$destroy",function(){
                    $(window).off('resize',resizeAdjustHandler);
                });

                scope.$watch('show', function(newVal, oldVal) {
                    if (!newVal) { // if hiding 
                        scope.stopVideo();
                    }      
                    else { // if showing
                      if (!scope.hasVideoError())  {
                        scope.setVideo();
                      }
                      scope.setDimensions();

                      //$timeout(function() {
                        scope.adjustContentAndButtonMargins();
                      //}, 300);
                    }
                });

                // does nothing
                scope.$watch('currentIndex', function(newVal, oldVal) {
                    if (newVal !== undefined) { 
                    }      
                });

                scope.$watch('videoShowing', function(newVal, oldVal) {
                    if (newVal !== undefined) { 
                        scope.adjustContentAndButtonMargins();
                    }      
                });

                scope.stopVideo = function() {
                    var v = videoHolder.find("video");
                    if (v[0]) {
                        v[0].pause();
                    }
                };

                scope.onFirstSlide = function() {
                    if (scope.show) {
                        var videoIsPrevious = scope.currentIndex === 0 && scope.videos.length>0 && !scope.hasVideoError();
                        return scope.videoShowing || (!videoIsPrevious && scope.currentIndex === 0); // if vid showing or no video showing or curr index is 0
                    }
                    else {
                        return true;
                    }
                };

                scope.onLastSlide = function() {
                    if (scope.show) {
                        if (scope.videoShowing) { // if on a video, we're only on the last slide if there are no images
                            return scope.images.length === 0; 
                        }
                        else {
                            return (scope.currentIndex === (scope.images.length-1));
                        }
                    }
                    else {
                        return true;
                    }
                };
               
                scope.slideLeft = function() {
                    var from = "toLeft";
                    var to = "toRight";

                    if (scope.animate) {
                        mainImg.addClass(to);
                        videoHolder.addClass(to);
                    }

                    $timeout(function() {
                        if (scope.videoShowing) { // if on video, go to last image
                            scope.currentIndex = scope.images.length-1;
                            scope.videoShowing = false;
                            scope.stopVideo();
                        }
                        else if (scope.currentIndex === 0 && scope.videos.length>0 && !scope.hasVideoError()) { // if on first image, go to video, if there is a video
                            //scope.currentIndex = scope.images.length-1;
                            //scope.currentIndex = VIDEO_SHOWING;
                            scope.videoShowing = true;
                        }
                        else if (scope.currentIndex === 0) { // if on first image, but no video, go to last image
                            scope.currentIndex = scope.images.length-1;
                            scope.videoShowing = false;
                        }
                        else { // go to previous image
                            scope.currentIndex--;
                            scope.videoShowing = false;
                        }

                        if (scope.animate) {
                            mainImg.addClass("removeTransition");     
                            mainImg.addClass(from);
                            mainImg.removeClass(to);

                            videoHolder.addClass("removeTransition");     
                            videoHolder.addClass(from);
                            videoHolder.removeClass(to);
                           
                            // image about to come in 
                            $timeout(function() {
                                mainImg.removeClass("removeTransition");
                                mainImg.removeClass(from);

                                videoHolder.removeClass("removeTransition");
                                videoHolder.removeClass(from);
                            });
                        }
                    }); //, 250); // uncomment 250 to see the image moving to the left before it moves out.
                };

                scope.slideRight = function() {
                    var from = "toRight";
                    var to = "toLeft";

                    if (scope.animate) {
                        mainImg.addClass(to);
                        videoHolder.addClass(to);
                    }

                    $timeout(function() {
                        if (scope.videoShowing) { // if on video, go to first image
                            scope.currentIndex = 0;
                            scope.videoShowing = false;
                            scope.stopVideo();
                        }
                        else if (scope.currentIndex === (scope.images.length-1) && scope.videos.length>0 && !scope.hasVideoError()) { // if on last image, go to video, if there is a video
                            scope.videoShowing = true;
                        }
                        else if (scope.currentIndex === (scope.images.length-1)) { // if on last image, but no video, go to first image
                            scope.currentIndex = 0;
                            scope.videoShowing = false;
                        }
                        else { // go to next image
                            scope.currentIndex++;
                            scope.videoShowing = false;
                        }

                        if (scope.animate) {
                            mainImg.addClass("removeTransition");     
                            mainImg.addClass(from);
                            mainImg.removeClass(to);
                            videoHolder.addClass("removeTransition");     
                            videoHolder.addClass(from);
                            videoHolder.removeClass(to);
                       
                        // image about to come in 
                        
                            $timeout(function() {
                                mainImg.removeClass("removeTransition");
                                mainImg.removeClass(from);
                                videoHolder.removeClass("removeTransition");
                                videoHolder.removeClass(from);
                            });
                        }
                    }); //, 250); // uncomment 250 to see the image moving to the left before it moves out.
                };

                scope.getImgSrc = function() {
                    if (scope.currentIndex !== -1 && scope.images && (scope.currentIndex<scope.images.length)) {
                        var image = scope.images[scope.currentIndex];
                        var url = image.data;
                        return url;
                    }
                };



            }, // end link

        } // end return
	}); // end itcApp.directive

}); // end define


