/************************************************************************************************************************/
/************************************************ snapshot_directive.js *************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

	itcApp.directive('previewZone', function($sce, $timeout) {
        return {
          restrict: 'A',
          templateUrl: getGlobalPath('/itc/views/directives/snapshot_preview_template.html'),
          scope: {
            /*show: "=",*/
            device: "@",
            gap: "=",
            error: "=",
            maxHeight: "=",
            showSlideShow: "=",
            currentIndex: "=",
            videoShowing: "=",
            saveError: "=",
            locFile: "=",
            cantPlayVideo: "=",
            processingVideo: "=",
            videoError: "=",
            videoEditable: '=',
            imagesEditable: '=',
            duError: '=',
            videoLoaded: '=',
            imagesMaxedOut: "=",
            midDrag: "=",
            videoExists: "=" //f this is a screenshot, this tells us if there's a video in first position.
          }, 
          
          link: function(scope, element, attrs) {

            //console.log("previewZone LINK");
            scope.hovered = false;
            //console.log("this is videoPreview #" + scope.$parent.$index);
            var zone = element.find(".zone");
            var img = zone.find("img");
            var playButton = element.find(".playButton");
            zone.attr("draggable", scope.imagesEditable);

            element.bind('mouseenter', function() {
                if (scope.hasError()) {
                    element.find(".errorPopUp").addClass("open");
                }
            });

            element.bind('mouseleave', function() {
                if (scope.hasError() && !scope.stayOpen) {
                    element.find(".errorPopUp").removeClass("open");
                }
            });

            scope.hasError = function() {
                return scope.saveError || scope.loadError || scope.duError;
            }

            scope.getErrorMessage = function() {
                if (scope.saveError) {
                    return scope.saveError;
                }
                else if (scope.loadError) {
                    return scope.loadError;
                }
                else if (scope.duError) {
                    return scope.duError;
                }
            };

            // returns true if there's a video error
            scope.showErrorText = function() {
                var showErrorText = scope.cantPlayVideo || scope.processingVideo || scope.videoError;
                if (showErrorText === undefined) {
                    showErrorText = false;
                }
                return showErrorText;
            };

            scope.allowDelete = function() {
                // no longer check if video is editable, as per <rdar://problem/17906747>
                //return scope.hovered && ((scope.videoType && scope.videoEditable) || (!scope.videoType && scope.imagesEditable));
                return scope.hovered && (scope.videoType || (!scope.videoType && scope.imagesEditable));
            };

            scope.showPlayButton = function() {
                return scope.videoType && scope.videoLoaded && !scope.showErrorText(); // show play button only if there's no error text
            }

            scope.showAppPreviewLoader = function() {
                return scope.videoType && !scope.videoLoaded && !scope.hasError();
            }

            scope.showImageError = function() {
                return !scope.videoType && scope.imageError;
            }

            scope.allowPosterFrameEdits = function() {
                if (scope.hovered && scope.videoType && scope.videoEditable) {
                    var hasAnError = scope.showErrorText();
                    return !hasAnError;
                } else {
                    return false;
                }
            };

            scope.$watch('cantPlayVideo',function(value){
                scope.updateVideoSelectableness();
                scope.setMask();
            });

            scope.$watch('processingVideo',function(value){
                scope.setMask();
            });

            scope.$watch('videoError',function(value){
                scope.setMask();
            });

            scope.setMask = function() {
                var imageHolder = element.find('.imageHolder');
                if (scope.showErrorText()) {
                    imageHolder.addClass("mask"); 
                }
                else {
                    imageHolder.removeClass("mask");
                }
            };

            scope.setMask();

            scope.$watch('videoType',function(value){
                scope.updateVideoSelectableness();
            });

            scope.updateVideoSelectableness = function() {
                if (scope.videoType) {
                    if (scope.showErrorText()) {
                        element.find("img.selectable").removeClass("selectable");
                    }
                    else {
                        element.find("img").addClass("selectable");
                    }
                }
            };

            scope.$watch('locFile',function(value){
                if (value !== undefined) {
                    scope.setErrorText();  
                }
            });

            scope.setErrorText = function() {
                if (scope.processingVideo) {
                    scope.titleText = scope.locFile['ITC.AppVersion.Media.ProcessingVideo']; 
                    scope.textDetail = scope.locFile['ITC.AppVersion.Media.ProcessingVideoDetail'];
                }
                else if (scope.videoError) {
                    scope.titleText = scope.locFile['ITC.AppVersion.Media.GenericVideoError']; 
                    scope.textDetail = scope.locFile['ITC.AppVersion.Media.GenericVideoErrorDetail'];
                }
                else if (scope.cantPlayVideo) {
                    scope.titleText = scope.locFile['ITC.AppVersion.Media.CantPlayVideo']; 
                    scope.textDetail = scope.locFile['ITC.AppVersion.Media.CantPlayVideoDetail'];
                }
                else {
                    scope.titleText = "";
                    scope.textDetail = "";   
                }
            };

            // After marking the last image as the last one (ie. removing it's margin-right),
            // re-calculates the image width stored in app_version_ctrl.
            scope.$on('updateLastScreenShotMargins', function(event) {
                scope.markLastImage();

                var index = scope.$parent.$index; // will be set if this is in an ng-repeat (which it is for images)
                if (scope.videoType === false) { // it may be a video if videoType is undefined
                    
                    var dataFromParent = scope.$parent.previewImages[index];
                    var w = parseInt(zone.css("width")); // note: don't use  zone.width() or zone.height() - they return floats that are slightly off.
                    var h = parseInt(zone.css("height")); 
                    var zoneWidth = Math.min(w, h); // default to vertical
                    
                    var imgW = img[0].width;
                    var imgH = img[0].height;
                    if (imgW > imgH) { // but if horizontal 
                        zoneWidth = Math.max(w, h); 
                    }

                    dataFromParent.imgWidth = zoneWidth + scope.getWidthExtras(); 
                }
            });

            // Adds a "lastOne" class to the last image
            scope.markLastImage = function() {
                var index = scope.$parent.$index; // will be set if this is in an ng-repeat (which it is for images)
                if (scope.videoType === false) { // it may be a video if videoType is undefined
                    var numImages = scope.$parent.previewImages.length;
                    if (index === (numImages-1)) {
                        zone.addClass("lastOne");
                    }
                    else {
                        zone.removeClass("lastOne");
                    }
                }
            };

            scope.$on('setImagePreview', function(event, indexInParentArray) { 
                scope.indexInParentArray = indexInParentArray;

                var index = scope.$parent.$index; // will be set if this is in an ng-repeat (which it is for images)
                if (index === indexInParentArray && !scope.videoType) {
                    
                    var dataFromParent = scope.$parent.previewImages[index];
                    
                    scope.previewImgSrc = dataFromParent.data;
                    scope.videoType = dataFromParent.videoType;

                    if(!scope.$parent.$$phase) {
                        scope.$apply();
                    }

                    // Remove animationDelay class from animate-repeat element - it is used only when 
                    // added so that the dropzone can shrink BEFORE this element appears.
                    // Without this delay, the image gets temporarily bumped to the next line until 
                    // the drop zone finishes its shrink animation.
                    var animateRepeat = element.closest(".animate-repeat");
                    $timeout(function() {
                        animateRepeat.removeClass("animationDelay"); 
                     }, 500); // 500 - just enough time for the drop zone to shrink and make way for this snapshot.
                }
                
            });

            scope.$on('setVideoPreview', function(event, indexInParentArray) { 
                scope.indexInParentArray = indexInParentArray;
                
                var index = scope.$parent.$index; // will be set if this is in an ng-repeat (which it is for videos)
                if (index === indexInParentArray && (scope.videoType === undefined || scope.videoType)) {

                    var dataFromParent = scope.$parent.previewVideos[index];
                    scope.previewImgSrc = dataFromParent.data;
                    scope.videoType = dataFromParent.videoType;

                    if(!scope.$parent.$$phase) {
                        scope.$apply();
                    }

                    zone.attr("draggable", false);

                    // Remove animationDelay class from animate-repeat element - it is used only when 
                    // added so that the dropzone can shrink BEFORE this element appears.
                    // Without this delay, the image gets temporarily bumped to the next line until 
                    // the drop zone finishes its shrink animation.
                    var animateRepeat = element.closest(".animate-repeat");
                    $timeout(function() {
                        animateRepeat.removeClass("animationDelay"); 
                    }, 500); // 500 - just enough time for the drop zone to shrink and make way for this snapshot. */
                }
            });

            element.bind('mouseenter', function() {
                    scope.hovered = true;
                    scope.$apply();

                    // uncomment to budge the zone
                    //scope.budgeTheZone(true);
            });
            element.bind('mouseleave', function() {
                    scope.hovered = false;
                    scope.$apply();

                    // uncomment to un-budge the zone
                    //scope.budgeTheZone(false);
            });

            // The things I do to get the margins right and the delete button to show up.
            scope.budgeTheZone = function(show) {
                var index = scope.$parent.$index;
                var isVideoOrIsFirstImage = (scope.videoType || (scope.imagesMaxedOut && !scope.videoExists && index===0));
                if (isVideoOrIsFirstImage) {
                    if (show) {
                        zone.addClass("marginChangeForDeleteButton");
                    }
                    else {
                        zone.removeClass("marginChangeForDeleteButton");
                    }
                }
            };

            scope.setZoneDimensions = function() {
                var index = scope.$parent.$index;

                //console.log("image loaded (w x h) (" + img.width() + " " + img.height() + ")");
                var w = parseInt(zone.css("width")); // note: don't use  zone.width() or zone.height() - they return floats that are slightly off.
                var h = parseInt(zone.css("height")); 
                var zoneWidth = Math.min(w, h); // default to vertical
                var zoneHeight = Math.max(w, h);

                var imgW = img[0].width;
                var imgH = img[0].height;
                if (imgW > imgH) { // but if horizontal 
                    zoneWidth = Math.max(w, h); 
                    zoneHeight = Math.min(w, h); 
                }
                var data = {};
                data.imgWidth = zoneWidth + scope.getWidthExtras(); 
                data.imgHeight = zoneHeight + scope.getHeightExtras(); 
                data.actualImgHeight = img[0].naturalHeight; //img.height();  
                data.actualImgWidth = img[0].naturalWidth; //img.width();             
                                    
                data.imgIndex = index;
                data.isVideo = scope.videoType;
                scope.$emit("imageLoaded", data);    // CAUSES drop zone to shrink just the right amount to make room for this snapshot!

                zone.css("height", zoneHeight + "px");
                zone.css("width", zoneWidth + "px");
                if (data.actualImgHeight === 0 || data.actualImgWidth === 0) { // happens if image cannot be loaded
                    img.css("height", "0px"); 
                    img.css("width", "0px");
                }else {
                    img.css("height", "100%");
                    img.css("width", "100%");
                }

                scope.setMarginTop();
                
                // center playbutton
                //var playButton = element.find(".playButton");
                playButton.css("top", (zoneHeight - playButton.height())/2 + "px");

                // center loader
                var loader = element.find(".appTrailerLoader");
                loader.css("top", (zoneHeight - loader.height())/2 + "px");

                // wait 1/2 a second after drop zone shrinks to show this snapshot (otherwise the drop zone hasn't shrunk yet, 
                // causing this snapshot to temporarily appear BELOW the drop zone because there isn't room for it on same row)
                $timeout(function(){
                    scope.show = true; 
                    scope.$apply();
                    // Here's where appPreviewSnapshotShowing should be set to true
                    if (scope.videoType) {
                        scope.$emit('appPreviewSnapshotIsShowing');
                    }
                }, 500); 
            };

            scope.getHeightExtras = function() {
                var borderWidth = parseInt(zone.css("border-width"));
                var paddingTop = parseInt(zone.css("padding-top"));
                var paddingBottom = parseInt(zone.css("padding-bottom"));
                var marginTop = parseInt(zone.css("margin-top"));
                var marginBottom = parseInt(zone.css("margin-bottom"));
                return paddingTop + paddingBottom + marginTop + marginBottom + (2*borderWidth); 
            };

            scope.getWidthExtras = function() {
                var borderWidth = parseInt(zone.css("border-width"));
                var paddingRt = parseInt(zone.css("padding-right"));
                var paddingLt = parseInt(zone.css("padding-left"));
                var marginRt = parseInt(zone.css("margin-right"));
                var marginLt = parseInt(zone.css("margin-left"));
                return paddingRt + paddingLt + marginRt + marginLt + (2*borderWidth); 
            }

            scope.$watch('maxHeight', function(newVal, oldVal) {
                if (newVal && img[0].width) {
                    scope.setMarginTop();
                }
            });

            scope.setMarginTop = function() {
                var w = parseInt(zone.css("width")); // note: don't use  zone.width() or zone.height() - they return floats that are slightly off.
                var h = parseInt(zone.css("height")); 
                var extras = scope.getHeightExtras();

                var imgW = img[0].width;
                var imgH = img[0].height;
                if (imgW > imgH && scope.maxHeight !== 0) { // if landscape image but there are vertical images              
                    // Set margin-top so that landscape image will be vertically centered
                    var marginTop = (scope.maxHeight - Math.min(w, h))/2;
                    zone.css("margin-top", marginTop);
                    zone.removeClass("portrait");
                    zone.addClass("landscape");
                }
                else {
                    zone.removeClass("landscape");
                    zone.addClass("portrait");
                }
               
            }

            // THIS is where we get the image width. Pass it along (emit it) to the parent scope.
            img.bind('load', function() {
                scope.imageError = false;
                scope.loadError = false;
                //zone.removeClass("loadError");
                scope.setZoneDimensions();
                scope.$apply(); //?
            });

            scope.showErrorBriefly = function() {
                // show the error for 3 seconds regardless of mouse hover.
                var errorPopup = element.find('.errorPopUp');
                errorPopup.addClass("open");
                scope.stayOpen = true;
                $timeout(function(){
                    errorPopup.removeClass("open");
                    scope.stayOpen = false;
                }, 3000);
            };

            scope.$watch('loadError',function(value){
                scope.addRemoveLoadError();
            });

            scope.$watch('duError',function(value){
                scope.addRemoveLoadError();
            });

            scope.$watch('saveError',function(value){            
                if (value) {
                    zone.addClass("saveError");
                }
            }); 

            scope.addRemoveLoadError = function() {
                if (scope.loadError || scope.duError || scope.saveError) {
                    zone.addClass("loadError"); 
                    scope.showErrorBriefly();
                }
                else {
                    zone.removeClass("loadError");
                }
            };

            img.bind('error', function(e) {
                console.log("There was some error with the image at: " + img[0].src);
                if (!scope.videoType) { // for now, ignore video image errors. will fix when have more time to work on video.
                    //scope.imageError = true;
                    scope.loadError = scope.locFile['ITC.AppVersion.Media.ErrorMessages.ImageNotLoaded']; 
                    //scope.saveError = scope.locFile['ITC.AppVersion.Media.ErrorMessages.ImageNotLoaded'];
                }
                scope.setZoneDimensions();
                scope.$apply();
            });

            element.bind('dragover', function(e) {
                if (scope.imagesEditable) {
                    e.preventDefault(); // important-- 
                    // By default, data/elements cannot be dropped in other elements. To allow a drop, prevent that default. 
                    
                    // check if already dragging over, so that this event doesn't cause this block
                    // to run over and over again. (just once per drag over is enough)
                    if (!scope.midDraggingOver) {
                        //console.log("dragOver preview #" + scope.$parent.$index);
                        scope.$emit('dragoverZone1', scope.$parent.$index);  
                        scope.midDraggingOver = true;      

                    }
                }
            });

            // index is the index of the zone that was dragged over
            scope.$on('dragoverZone2', function(event, index) { 
                if (scope.midDrag) {
                    if (!scope.videoType) { 
                        if (index <= scope.$parent.$index) {
                            element.find(".zone").addClass("afterDraggedZone");   
                        }
                        //else if ((index-1) === scope.$parent.$index) {  
                        //    element.find(".zone").addClass("beforeDraggedZone");
                        //}
                    }
                }
            });

            scope.$on('dragleaveZone2', function(event, index) { 
                if (index <= scope.$parent.$index) {
                    element.find(".zone").removeClass("afterDraggedZone");   
                }
                //else if ((index-1) === scope.$parent.$index) {
                //    element.find(".zone").removeClass("beforeDraggedZone");  
                //}
            });

            scope.$on('screenshotDragDone', function(event, index) { 
                scope.markLastImage();
            });

            // Returns true if this is a real drag event that had a drag start. Returns false if
            // an image was dragged from the outside and didn't have a real drag start
            scope.isRealDrag = function(e) {
                var fromIndex = e.originalEvent.dataTransfer.getData("fromElement");

                return fromIndex !== "";
            }

            element.bind('dragleave', function(e) {
                if (scope.imagesEditable) {
                    console.log("dragleave: preview #" + scope.$parent.$index);
                    e.preventDefault(); // important-- 
                    // By default, data/elements cannot be dropped in other elements. To allow a drop, prevent that default. 
                    if (e.originalEvent.offsetX > 0) {
                        scope.midDraggingOver = false;
                        //console.log("dragLEAVE preview #" + scope.$parent.$index);  
                        scope.$emit('dragleaveZone1', scope.$parent.$index);  
                    }
                    else { // we're in a gap! (between preview zones)      
                        scope.gap = scope.$parent.$index;
                        scope.$apply();
                    }
                } 
            });
            
            element.bind('dragenter', function(e) {
                if (scope.imagesEditable && scope.isRealDrag(e)) {
                    console.log("dragenter preview #" + scope.$parent.$index);

                    // we're now out of a gap
                    scope.gap = false;    
                    scope.$apply();
                }
            });

            var dragStartFunc = function(e) {
                if (scope.imagesEditable) {
                    console.log("------");

                    console.log("dragstart2 preview #" + scope.$parent.$index );
                    //console.info("dragstart2 event", e.originalEvent);
                    //console.log("EVENT TYPE: " + e.originalEvent.type);

                    var target = e.originalEvent.target;

                    // e.originalEvent.type should be "dragstart" and IS in most cases.
                    // The drag issue in rdar://problem/18123572 was caused by a "mousedown"
                    // event (with no dataTransfer object) sneaking in. If that happens,
                    // calling e.preventDefault() causes that event to be nicely ignored.
                    if (e.originalEvent.type === "mousedown") { // bad things happen here
                        console.info("drag quirk happened.");
                        
                        e.preventDefault();
                        

                       // scope.rebindDragStart();
                       
                        //element.unbind("dragstart"); // don't do this.
                       
                        return false;
                    }

                    scope.midDrag = true;
                    scope.$apply();

                    // if we got here, this should always be true, now that we're
                    // checking for "mousedown" events above.
                    if (e.originalEvent.dataTransfer) {
                        e.originalEvent.dataTransfer.setData("fromElement", scope.$parent.$index); 
                    } 
                }
            }

            element.bind('dragstart', dragStartFunc);

            element.bind('dragend', function(e) {
                console.log("dragend preview #" + scope.$parent.$index);
                console.log("------");
                if (scope.imagesEditable) {
                    e.preventDefault();

                    // if drag ended in a gap (between preview images)
                    if (scope.gap !== false) { 
                        var fromIndex = scope.$parent.$index;
                        scope.moveImage(fromIndex, scope.gap);
                    }

                    scope.midDrag = false;
                }
                
            }); 

            // drop happens just before dragend.
            element.bind('drop', function(e) {
                //console.log("drop preview #" + scope.$parent.$index);
                e.preventDefault();

                if (scope.imagesEditable && scope.isRealDrag(e)) {
                    var fromIndex = e.originalEvent.dataTransfer.getData("fromElement");
                    var toIndex = scope.$parent.$index;

                    scope.moveImage(fromIndex, toIndex);
                }

            });

            // Moves an image from fromIndex to toIndex.
            scope.moveImage = function(fromIndex, toIndex) {

                scope.midDraggingOver = false;

                var fromTo = {};
                fromTo.from = fromIndex;
                fromTo.to = toIndex;

                // if dragging to the right, take into account that the move 
                // needs to reduce the index by one since one space will be gone after 
                // the move (the space taken up by the dragged element)
                if (fromTo.to > fromTo.from) {
                    fromTo.to = fromTo.to - 1;
                }

                scope.$emit('dragleaveZone1', toIndex);  
                scope.$emit('insertImageAt', fromTo);

                //scope.markLastImage(); //??

            };

            var resetPreviewButton = element.find(".bottomButton");
            resetPreviewButton.bind('click', function() {
                scope.$emit('showVideoModal', true);
            });

            var deleteButton = element.find(".deleteButton");
            deleteButton.bind('click', function() {
                // note: setting scope.previewImgSrc to the empty string does not clear the src attribute as expected
                // It needs to be cleared so that if the same video is selected after deletion, the load event fires.
                scope.previewImgSrc = "ignore"; 
                var data = {};
                data.index = scope.$parent.$index;
                data.isVideo = scope.videoType;

                // save the parent scope for later use after the transition end.
                scope.savedParentScope = scope.$parent.$parent;
                // Listen for a transitionend so that only once this snapshot is DONE disappearing, we adjust the drop zone width.
                element.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', scope.deleteTransitionEnded);
                
                scope.$emit('deletePreview', data);
            });

            scope.deleteTransitionEnded = function(e) {
                // Cheating on Angular a little here. The scope no longer has a parent scope at this point, because we just deleted this element.
                // So using a saved parent scope instead, to pass the message along. An emit won't work.
                scope.savedParentScope.deleteTransitionEnded(); // deleteTransitionEnded() will cause a drop zone width change
                //scope.$emit('deletedPreviewTransitionEnd'); // won't work because this element has been deleted and no longer has a parent scope.
            }

            img.bind('click', function(e) {
                if ((scope.videoType && !scope.showErrorText()) || !scope.videoType) { // if playable video or not a video
                    scope.showSlideShow = true;
                    if (scope.videoType) {
                        scope.currentIndex = -1;
                    }
                    else {
                        scope.currentIndex = scope.$parent.$index;
                    }
                    scope.videoShowing = scope.videoType;
                    scope.$apply();
                }
            });

            // does same thing as the img.bind('click') but assumes this is a scope.videoType is true
            playButton.bind('click', function(e) {
                scope.showSlideShow = true;
                scope.currentIndex = -1;
                scope.videoShowing = true;
                scope.$apply();
            });
          },
        }
    });

}); // end define

