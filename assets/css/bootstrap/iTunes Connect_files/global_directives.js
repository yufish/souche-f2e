/************************************************************************************************************************/
/************************************************* global_directives.js *************************************************/
/************************************************************************************************************************/

define([], function () {

    var global_directives = angular.module('global_directives', []);

    global_directives.directive('mainNavSizeFix',function(){
        return {
            scope: {
                'mainNavSizeFix': '='
            },
            link:function(scope,element,attrs) {
                scope.$watch('mainNavSizeFix',function() {
                    if (scope.mainNavSizeFix < 6) {
                        var newWidth = (125 * scope.mainNavSizeFix) + 2;
                        element.width(newWidth);
                    }
                }); 
            }
        }
    });


    /*
    This directive is placed on the body to capture clicks off a menu ("hasPopOver")
    */
    global_directives.directive('itcDocumentClick',function(){
        return {
            link: function(scope,element,attrs){
                element.bind('click',function(e){
                    if ($(e.target).parents('.hasPopOver').length <= 0) {
                        $('.open').removeClass('open');
                    }
                });
                element.find('#header').click(function(e){
                    if ($(e.target).parents('.hasPopOver').length <= 0 && $(e.target).parents('a').length <= 0) {
                        $("html,body").stop().animate({ 
                         scrollTop: 0
                        },1000);
                        return false;
                    }
                });
                scope.$on('closepopups',function(event,data){
                    if (data) {
                      $('.open').removeClass('open');  
                    }
                });

                scope.$on('closepopup',function(event,id){
                    if (id) {
                      $('#' + id + '.open').removeClass('open');  
                    }
                });

                scope.$on('$locationChangeStart', function (event, next, current) {
                   element.find('.open').removeClass('open');
                });
            }
        }
    });

    global_directives.directive('centerOnPage',['$timeout',function($timeout){
        return {
            scope: {
                centerOnPage: '='
            },
            link: function(scope,element,attrs) {
                var centerElement = function() {
                    var bodyHeight = window.innerHeight;
                    var elementHeight = element.outerHeight(true);
                    var headerHeight = $('#header').outerHeight(true);
                    // var footerHeight = $('#footer').outerHeight(true);
                    var footerHeight = 85;
                    var centerAvailable = bodyHeight - footerHeight - headerHeight - elementHeight;
                    var topVal = (centerAvailable/2) + headerHeight;
                    var marginLeftAdjustment = (element.width()/2)*-1;
                    if (topVal < 50) {
                        element.css('position','relative');
                        element.css('top','0');
                        element.css('left','50%');
                        element.css('marginLeft',marginLeftAdjustment)
                    } else {
                        element.css('position','absolute'); 
                        element.css('top',topVal);
                        element.css('left','50%');
                        element.css('marginLeft',marginLeftAdjustment)
                    }
                    $timeout( function() {
                        element.css('opacity','1');
                    }, 50)
                }
                
                centerElement();
                
                $(window).on('resize',centerElement);

                scope.$on("$destroy",function(){
                    $(window).off('resize',centerElement)
                });

                scope.$watch('centerOnPage',function(val){
                    if (val === true) {
                        centerElement();
                    }
                });
                // $timeout(function(){
                //     centerElement();
                // },1000);
            }
        }
    }]);


    /*
    apply this directive to a div you want to have fixed at the top. NOTE - this div should NOT be in a div that has relative positioning.
    (It may need to be outside of any wrappers as well)
    */
    global_directives.directive('itcFixedHeader', function($window){
        return {
            link: function(scope, element, attrs) {
   
                var isChecking = false;
                var windowEl = angular.element($window);

                var checkHeader = function() {
                    if (isChecking) return;
                    isChecking = true;
                    var positionFromTop = 0;
                    var originalOffset;
                    var placeholderid = element.attr('id') + "_placholder";

                    // get distance from top of element... if we have a placeholder - then get distance from top to placeholder..
                    if ($('#'+placeholderid).length <= 0) {
                        originalOffset = element.offset().top
                    } else {
                        originalOffset = $('#'+placeholderid).offset().top;
                    }
                    /*
                    when the window scrolls pasth the offset of the element, add placeholder (if we don't already have one.) and set it's height to the height of the original element.
                    ELSE - if we have a placeholder - remove it - and remove classname
                    */
                    if ($(window).scrollTop() > originalOffset && !element.hasClass('fixedheader')) {
                        if ($('#'+placeholderid).length <= 0) {
                           element.after('<div id="'+placeholderid+'"></div>');
                           $('#'+placeholderid).height(element.outerHeight()).width('100%'); 
                        }
                        element.addClass('fixedheader');
                        element.css('top',positionFromTop);
                    } 
                    else if ($(window).scrollTop() <= originalOffset && element.hasClass('fixedheader')) {
                        if ($('#'+placeholderid).length > 0) {
                            $('#'+placeholderid).remove();
                        } 
                        element.removeClass('fixedheader');
                    }

                    isChecking = false;
                };

                var handler = scope.$apply.bind(scope, checkHeader)
                windowEl.on('scroll', handler);

                scope.$on("$destroy",function(){
                    windowEl.off('scroll',handler)
                });

                scope.$watch(function(){
                    element.bind('click',function(e){
                        //don't scroll to top when clicking popups or buttons...                            
                        if ($(e.target).parents('.hasPopOver').length <= 0  && !$(e.target).is('button') && $(e.target).parents('button').length <= 0) {
                            if (element.hasClass('fixedheader')) {
                                $("html,body").stop().animate({ 
                                     scrollTop: 0
                                },1000);
                                return false;
                            }
                        }
                    });
                });
            }
        };
    });

    /*
    Description: Attribute that will pop up an associated menu.
    Usage: <a href="" itc-pop-up-menu="mainNav">Menu</a>
    <div id="mainNav">
    This is the popup
    </div>
    **Make sure to include the class "hasPopOver" somewhere in a parent wrapper
    */
    global_directives.directive('itcPopUpMenu',function() {
        return {
            restrict: 'A',
            scope: {
                itcPopUpMenu: "@",
                eventType: "@"
            },
            link: function(scope,element,attrs) {
                if (!scope.eventType) scope.eventType = 'click';

                element.bind(scope.eventType, function() {
                    //close other menus
                    $('.open').each(function(){
                        if ($(this).attr('id') !== scope.itcPopUpMenu) {
                            $(this).removeClass('open');
                        }
                    });
                    if ($("#"+scope.itcPopUpMenu).hasClass('open')) {
                        $("#"+scope.itcPopUpMenu).removeClass('open');
                    } else {
                        $("#"+scope.itcPopUpMenu).addClass('open');
                    }
                });

                

                /*scope.close = function() {
                    element
                }*/
            }
        };
    });

    /*
    Description: similar to itcPopUpMenu - but opens menu on hover of main element (and closes on mouseleave...)
    */
    global_directives.directive('itcHoverMenu',function(){
        return {
            restrict: 'A',
            scope: {
                'itcHoverMenu': '@',
                'closeHoverMenu': '=' //true or false
            },
            link: function(scope,element,attrs) {
                element.bind('mouseenter',function(){
                    $('#'+scope.itcHoverMenu).addClass('open');
                });
                element.bind("mouseleave",function(){
                    $('#'+scope.itcHoverMenu).removeClass('open');
                });
                if (scope.closeHoverMenu !== undefined && scope.closeHoverMenu !== null) {
                    scope.$watch('closeHoverMenu',function(val){
                        if (val) {
                            $('#'+scope.itcHoverMenu).removeClass('open');
                            scope.closeHoverMenu = false;
                            //also adding in close popups as we...
                            $('.open').removeClass('open');
                        }
                    });
                }
            }
        }
    });

    /*
    Description: Attribute that will create a list of nav items (ie. for tab nav or breadcrums)
    Usage: <div itc-list-nav="JSONofLinks" itc-list-nav-class="classname"></div>
    Where JSONofLinks is a json structured like: [{"link": "/page.html", "text": "page link","external":true,"current":true},
    {"link": "/page2.html", "text": "page 2 link"}]
    "text" is only item that is required
    */
    global_directives.directive('itcListNav',function(){
        return {
            restrict: 'A',
            replace: true,
            scope: {
                itcListNav: '=',
                itcListNavClass: '@'
            },
            template:  '<ul ng-class="itcListNavClass" role="menu">' +
                        '<li role="menuitem" ng-repeat="itcitem in itcListNav track by $index" ng-class="isCurrent(itcitem)">' +
                        '<a href="{{itcitem.link}}" ng-show="isExternal(itcitem)" target="_self">{{itcitem.text}}</a>' +
                        '<a href="{{itcitem.link}}" ng-show="hasLink(itcitem) && !isExternal(itcitem)">{{itcitem.text}}</a>' +
                        '<span ng-hide="hasLink(itcitem)">{{itcitem.text}}</span>' +
                        '</li>' +
                        '</ul>',
            link: function(scope,element,attrs) {
               scope.hasLink = function(theitem) {
                    return theitem.link !== undefined && theitem.link!==""?true:false;
                }
                scope.isExternal = function(theitem) {
                    return theitem!=='undefined'&&theitem.external !== undefined &&theitem.link!==""?true:false;
                }
                scope.isCurrent = function(theitem) {
                    return theitem!=='undefined'&&theitem.current!=='undefined'&&theitem.current?'current':'';
                }
                scope.$watch('itcListNav',function(){
                    //console.log("list nav length"+scope.itcListNav.length);
                    if (scope.itcListNav !== undefined && scope.itcListNav.length === 1) {
                        element.find('li').addClass('single');
                    }
                });
            }
        };
    });

    /*
    Applies height of mainnav to a placeholder div, creates additional div for faded background
    */
    global_directives.directive('itcFixedMainNav',['$rootScope',function($rootScope) {
        return {
            scope: true,
            link: function(scope,element,attrs) {
                    /*console.log($rootScope.wrapperclass);
                    scope.$watch('wrapperclass',function(){
                        console.log("wrapperclass: "+$rootScope.wrapperclass)
                    });*/
                    
                    function setPlaceHolderSize() {
                        if ($rootScope.wrapperclass != "nonfixedheader") {
                            var theHeight = element.outerHeight(true);
                            if ($("#headerPlaceholder").length <= 0) {
                                var placeholder = '<div id="headerPlaceholder"></div>';
                                element.after(placeholder);
                            }
                            $("#headerPlaceholder").height(theHeight);
                        } else {
                            $("#headerPlaceholder").remove();
                        }
                    }

                    setPlaceHolderSize();

                    $(window).on('resize',setPlaceHolderSize)
                    scope.$on("$destroy",function(){
                        $(window).off('resize',setPlaceHolderSize);
                    });
                    scope.$watch(function(){
                        setPlaceHolderSize();
                    });

                    
            }
        }
    }]);

    global_directives.directive('itcModal',['$timeout',function($timeout){
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: {
                show: "=show",
                onShow: "&onShow",
                onHide: "&onHide"
            },
            template:   "<div class='ng-modal' ng-show='show'>\
                           <div class='ng-modal-overlay'>\
                               <div class='ng-modal-wrapper' role='dialog'>\
                                   <div class='modal-dialog' ng-style='dialogStyle' ng-transclude></div>\
                               </div>\
                           </div>\
                        </div>",
            link: function(scope,element,attrs) {
                
                // Use a custom namespace for event handlers
                scope.namespace = '.modalListener';
                
                scope.dialogStyle = {};
                //scope.wrapperStyle = {};
                
                if (attrs.width) {
                    scope.dialogStyle.width = attrs.width;
                    var newwidth = parseInt(attrs.width);
                }
                
                // Hide the modal
                scope.hideModal = function() {
                    if (scope.show !== false) {
                        scope.show = false;
                        $timeout( function() { scope.$apply() }, 0)
                    }
                };
                
                // If desired, make the primary button show AJAX "in progress" state after clicking
                var primaryBtn = $(element).find('.modal-buttons').find('.primary');
                if (primaryBtn.length > 0) {
                    btn = $(primaryBtn[0]);
                    if (btn.attr('show-loader') !== undefined) {
                        btn.click( function() {
                            $(this).addClass('in-progress')
                        })
                    }
                }
                
                // Attach "close" handler to any button with `close-modal` attribute
                $(element).find('[close-modal]').click( function() {
                    scope.hideModal();
                })
                
                scope.$watch('show',function( isShown, wasShown ){
                    
                    if (isShown === true) {
                        $('body').css('overflow','hidden');
                        scope.bindListeners();
                        if (scope.onShow && typeof scope.onShow === 'function') {
                            scope.onShow();
                        }
                    }
                    else if (isShown === false && wasShown !== false) { // don't invoke if "false" is the starting value for show
                        $('body').css('overflow','visible');
                        scope.unbindListeners();
                        if (scope.onHide && typeof scope.onHide === 'function') {
                            scope.onHide();
                        }
                    }
                });

                scope.bindListeners = function() {
                    
                    var textFields = element.find('input[type=text],textarea,select').not(":hidden");
                    if (textFields.length > 0) $(textFields[0]).focus()
                    
                    //manage tabbing when we're showing a modal - only allow tabbing to fields in the modal
                    //and only when a modal is showing
                    $(document).bind( 'keydown' + scope.namespace, function(e) {
                        var keyCode = e.keyCode || e.which;
                        if (keyCode == 9 && scope.show === true) {
                            var textFields = element.find('input[type=text],textarea,select').not(":hidden");
                            var thisIndex = textFields.index($(":focus"));
                            if (textFields.length > 0) {
                                if (e.shiftKey) {
                                    if (thisIndex > 0) {
                                        $(textFields[thisIndex-1]).focus();
                                    } else {
                                        $(textFields[textFields.length-1]).focus();
                                    }
                                } else {
                                    if (thisIndex < (textFields.length - 1) && thisIndex >= 0) {
                                        $(textFields[thisIndex+1]).focus();
                                    } else {
                                        $(textFields[0]).focus();
                                    }
                                }
                            }
                            return false;
                        }
                    });
                    // Close the modal when we press ESC key
                    scope.keyup = $(document).bind( 'keyup' + scope.namespace, function(e) {
                        var keyCode = e.keyCode || e.which;
                        if (keyCode === 27) {
                            scope.hideModal();
                        }
                    })
                    // Close the modal if we click anywhere in the background
                    /*scope.clickToClose = $(element).find('.ng-modal-overlay').bind( 'click' + scope.namespace, function(e) {
                        var target = $(e.target).attr('class');
                        // Valid click targets: .ng-modal-overlay, .ng-modal-wrapper
                        if (/modal-overlay|modal-wrapper/i.test( target )) {
                            scope.hideModal();
                        }
                    });*/
                }
                
                // Clean up after ourselves by deleting events in this namespace
                scope.unbindListeners = function() {
                    $(document).unbind(scope.namespace)
                     $(element).unbind(scope.namespace)
                }
                
            }
        }
    }]);

    global_directives.directive('itcLightbox',['$timeout',function($timeout){
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: {
                show: "="
            },
            template:   "<div class='full-lightbox' ng-show='show' >" +
                        "   <div class='lightboxCloseButton' ng-click='close()'></div>" +
                        "   <div ng-transclude></div>" +
                        "</div>",
            link: function(scope,element,attrs){
                scope.close = function() {
                    scope.show = false;
                };

                // copying blindly from itcModal directive 
                scope.$watch('show',function(){
                    if (scope.show === true) {
                        $('body').css('overflow','hidden');
                    } else {
                        $('body').css('overflow','visible');
                    }

                });

            }
        }
    }]);

    // Directive to show first num-to-show elements of elements-array, and display the rest in a popup.
    global_directives.directive('itcShortenedList', function($timeout){
        return {
            restrict: 'A',
            scope: {
                elementsArray: "=",
                numToShow: "=",
                idForPopover: "="
            },
            template:   
                "<div><div class=\"hasPopOver\">{{elsToShow}}" + "<span ng-show=\"numInPopover>0\"> and" +
                "<a href=\"\" itc-pop-up-menu=\"shortenedList{{idForPopover}}\"> {{numInPopover}} more</a></span>" +
                "<div class=\"rightPopDown multiLevelNav\" id=\"shortenedList{{idForPopover}}\">" +       
                "<ul><li class=\"checkable-menu-item\" ng-repeat=\"extra in extras\">{{extra}}</li></ul>" +           
                "</div></div></div>",
            link: function(scope,element,attrs){
                scope.numInPopover = scope.elementsArray.length-scope.numToShow;
                var arr = scope.elementsArray.slice(0, scope.numToShow);
                scope.elsToShow = arr.join(", ");        
                scope.extras = scope.elementsArray.slice(scope.numToShow);
            }
        }
    });

    // Duplicate of itcShortenedList extended to use object, with specified value
    global_directives.directive('itcShortenedListObject', function($timeout){
        return {
            restrict: 'A',
            scope: {
                elementsObject: "=",
                numToShow: "=",
                idForPopover: "=",
                valueKey: "@",
                useValueTo: "@",
                andText: "@",
                numMoreText: "@"
            },
            template:   
                "<div>{{elsToShow}}" + 
                    "<span ng-show=\"numInPopover>0\"> {{ andText }} " +
                        "<span class=\"hasPopOver\">" +
                            "<a href=\"\" itc-pop-up-menu=\"shortenedList{{idForPopover}}\">{{displayText}}</a>" +
                            "<span class=\"centerPopUp center\" id=\"shortenedList{{idForPopover}}\">" +
                                "<span class=\"popupmenuinner\">" +    
                                    "<ul><li class=\"checkable-menu-item\" ng-repeat=\"extra in extras track by $index\">{{extra}}</li></ul>" +           
                                "</span>" +
                            "</span>" +
                        "</span>" +
                    "</span>" +
                "</div>",
            link: function(scope,element,attrs){
                //create array 
                scope.$watch('elementsObject',function(){
                    var elementsArray = [];
                    angular.forEach(scope.elementsObject,function(item){
                        if (scope.useValueTo === "true") {
                            //console.log("item[scope.valueKey].value",item[scope.valueKey].value)
                            elementsArray.push(item[scope.valueKey].value);
                        } else {
                            elementsArray.push(item[scope.valueKey]);
                        }
                        
                    });
                    scope.numInPopover = elementsArray.length - scope.numToShow;

                    scope.displayText = scope.numMoreText.replace("@@number@@",scope.numInPopover);
                    var arr = elementsArray.slice(0, scope.numToShow);
                    scope.elsToShow = arr.join(", ");        
                    scope.extras = elementsArray.slice(scope.numToShow);
                });
            }
        }
    });


    global_directives.directive('itcModalPage',['$timeout',function($timeout){
        return {
            restrict: 'A',
            transclude: true,
            template: '<div ng-transclude></div>',
            link: function(scope, element, attrs) {
                function checkpageheight() {
                    $("#headerPlaceholder").hide();

                    var availableHeight = $(window).height() - ($("#header").outerHeight(true) + $("#footer").outerHeight(true));
                    var minheight = $('.modal-dialog').height() + 20;
                    if ($('.modal-dialog')){
                        if (availableHeight < minheight) {
                            availableHeight = minheight;
                            $('.modal-dialog').addClass('fixedtop');
                        } else {
                            $('.modal-dialog').removeClass('fixedtop');
                        }
                    }
                    element.height(availableHeight);
                    //$('#pageWrapper').height(availableHeight);
                }
                $(window).resize(function(){
                    checkpageheight();
                });
                $(document).ready(function(){

                    checkpageheight();
                });
                $timeout(function(){
                    checkpageheight();
                });
            }
        }
    }]);


    /*
    Description: Use to create a link to popup a modal - pass in the path to a partial for what is shown in modal
    Usage example: <div itc-modal-include="/itc/views/shared/termsOfService.html" show-modal="false">Terms of Service</div>
    */
    global_directives.directive('itcModalInclude',function(){
        return {
            restrict: 'A',
            scope: {
                'itcModalInclude': '@',
                'showModal': '@'
            },
            transclude: true,
            template: ''+
                '<a href="" ng-click="openModal()" ng-transclude></a>' +
                '<div itc-modal show="showModal" class="moveToParent">' +
                '     <div ng-include="includepath"></div>'+
                '</div>',
            link: function(scope,element,attrs) {
                scope.includepath = scope.itcModalInclude;
                scope.show = false;
                if (scope.showModal == undefined) {
                    scope.showModal = false;
                }
                $('body').append($('.moveToParent'));
                scope.closeModal = function() {
                    scope.showModal = false;
                }
                scope.openModal = function() {
                    scope.showModal = true;
                }
            }
        }
    });

    /*
    Description: Use to watch the page for changes and display a message. Directive takes an object that holds a true/false value and message for the popup.
    $scope.confirmLeave = {}; //storage of error messaging for user leaving page.
    $scope.confirmLeave.needToConfirm = false or true;
    $scope.confirmLeave.msg = "Your message goes here...";
    */
    global_directives.directive('confirmLeave',function(){
        return {
            scope: {
                'confirmLeave': '='
            },
            link: function(scope,element,attrs) {
                var unloadfunction = function(){
                    if (scope.confirmLeave.needToConfirm) {
                        return scope.confirmLeave.msg;
                    }
                }
                $(window).bind('beforeunload', unloadfunction);
                scope.$on("$destroy",function(){
                    $(window).unbind('beforeunload', unloadfunction);
                });
            }
        }
    });

    /*
    Description: put on a div that you want to have scroll to the top when the supplied object is set to true.
    Example:
    <div itc-scroll-to-div-top="myobject.shouldScrollNow">...</div>
    in controller - set myobject.shouldScrollNow when this div needs to scroll to the top.
    */
    global_directives.directive('itcScrollToDivTop',function(){
        return {
            scope: {
                'itcScrollToDivTop': "="
            },
            link: function(scope,element,attrs) {
                scope.$watch('itcScrollToDivTop',function(){
                    if (scope.itcScrollToDivTop) {
                        element.scrollTop(0);
                        scope.itcScrollToDivTop = false;
                    }
                });
            }
        }
    });

    /*
    Description: put on a div to affect the whole page. When the object supplied is true - the page will scroll to the top.
    Example:
    <div itc-scroll-to-page-top="myobject.shouldScrollNow">...</div>
    in controller - set myobject.shouldScrollNow when the page needs to scroll to the top.
    */
    global_directives.directive('itcScrollToPageTop',function(){
        return {
            scope: {
                'itcScrollToPageTop': "="
            },
            link: function(scope,element,attrs) {
                scope.$watch('itcScrollToPageTop',function(){
                    if (scope.itcScrollToPageTop) {
                        $("html,body").stop().animate({ 
                             scrollTop: 0
                        },1000);
                        //return false;
                        scope.itcScrollToPageTop = false;
                    }
                });
            }
        }
    });



    /*
    Description: will apply a "blink" class (and then remove the class) to element when object passed to directive changes. 
    */
    global_directives.directive('itcBlinkText',['$timeout',function($timeout){
        return {
            scope: {
                'itcBlinkText': '='
            },
            link: function(scope,element,attrs) {
                element.addClass('preblink');
                scope.$watchCollection('itcBlinkText',function(value){
                    element.addClass('blink');
                    $timeout(function(){
                        element.removeClass('blink');
                    },500); 
                });
            }
        }
    }]);

    /*
    Description: Will slide element up/down based on boolean provided (use like "ng-show")
    (myobj.boolean = true)
    <div itc-scroll-up-down="myobj.boolean">This will show to begin with</div>
    when myobj.boolean = false - div will slide up/hide
    Can also take call back functions that will be called when the slide is complete.
    <div itc-scroll-up-down="myobj.boolean" itc-scroll-up-call-back="finishedSlidingUp()" itc-scroll-down-call-backk="finishedSlidingDown()">
    */
    global_directives.directive('itcScrollUpDown',function(){
        return {
            scope: {
                'itcScrollUpDown': '=',
                'itcScrollUpCallBack': '&',
                'itcScrollDownCallBack':'&'
            },
            link: function(scope,element,attrs) {
                if (scope.itcScrollUpDown) {
                    element.show();
                } else {
                    element.hide();
                }
                scope.$watch('itcScrollUpDown',function(){
                    if (scope.itcScrollUpDown) {
                        element.slideDown("slow",function(){
                            if(scope.itcScrollDownCallBack) {
                                scope.itcScrollDownCallBack();
                            }
                        });
                    } else {
                        element.slideUp("slow",function(){
                            if(scope.itcScrollUpCallBack) {
                                scope.itcScrollUpCallBack();
                            }
                        });
                    }
                });
            }
        }
    });

    /*
    Add directive to an element to have all text in that element selected upon a single click. example:
    <div selectable-text>If you click me, you’ll select me</div>
    */
    global_directives.directive('selectableText',function(){
        return {
            scope:{},
            restrict: 'A',
            link: function(scope,element,attrs) {
                element.click(function(){
                    if (document.selection) {
                        var range = document.body.createTextRange();
                        range.moveToElementText(element[0]);
                        range.select();
                    } else if (window.getSelection) {
                        var range = document.createRange();
                        range.selectNode(element[0]);
                        window.getSelection().addRange(range);
                    }
                });
            }
        }
    });

    /*
    TODO - THIS DOESN"T WORK YET _ NEED TO MODIFY TO CREATE A FIXED HEADER....
    */
    global_directives.directive('itcFixedTableHeader',function(){
        return { 
            transclude: true, //or is it transcluded: true?
            restrict: 'A',
            template: '<div>PUT HEADER TABLEHERE</div>+TRANCLUDESTUFF',
            link: function(scope,element,attrs) {
                //console.log(element.find("tr"));
                /*
                TODO: somehow make this work :/
                it works with a plain html page - angular is being difficult


                *** BONUS POINTS - get the THEAD element and clone it into a NEW element above transcluded table
                To do so - I think we need this element to be a wrapper around the table. - pass the table's div id to attribute:
                <div itc-list-table="myTableId"><table id="myTableId"><thead><tr>myheader....stuff...</table></div>
                $(document).ready(function(){
                    calculateWidths()
                    $(window).resize(function(){
                        calculateWidths();
                        getHeaderPosition();
                    });
                    $(window).scroll(function(){
                        getHeaderPosition();
                    });
                });
                var widths = [];
                var headerdivs;
                function calculateWidths() {
                    widths = []; //clear

                    $('#mytable').find('th').each(function(i){
                        widths.push($(this).width());
                    });
                    $('#tableheader th').each(function(i){
                        $(this).width(widths[i]);
                    });
                }
                function getHeaderPosition() {
                    var tablebottom = $('#mytable').offset().top + $('#mytable').height() - $('#tableheader').height();
                    if ($(window).scrollTop() > $('#mytable').offset().top && $(window).scrollTop() < tablebottom) {
                        if (!$('#tableheader').hasClass('showme')) $('#tableheader').addClass('showme');
                    } else {
                        $('#tableheader').removeClass('showme');
                    }
                }
                */
            }
        }
    });

    /*
    itc-sortable-table
    Description: Use this to make a table sortable.
    
        <table itc-sortable-table sort-object="OBJECT_TO_BE_SORTED">
            <thead>
                <th class="sortable" sort-by="KEY_TO_SORT_BY"> ... </th>
                ...
            </thead>
            ...
        </table>
       
    -= WHAT IT DOES =-
    - Adds click functionality to the <th> elements.
    - Upon click, it will update the table's styling to reflect the current sorting status.
    - It will also sort your data for you, unless you provide a custom sorting function (see [2] below) 
       
        
    -= USAGE =-
        
    [1] To use DEFAULT sorting behavior:
        - supply the "sort-object" as an attribute on the <table>. This is the object that will be sorted.  (Example: "testers")
        - for each <th>, provide a "sort-by" value, containing the key name you'd like to sort by.          (Example: "lastName")
        - This should just work! No further configuration required :-)
        
    [2] To use CUSTOM sorting behavior:
        - To override the default, simply write your own function and attach it to the <th> with "ng-click"
        - NOTE: Make sure your ng-click function actually sorts the data (!!) otherwise nothing will happen
        
        
        You can mix/match these two approaches (for instance, to apply custom sorting 
        to a single element and keep default sorting behavior for the others)
            ...
            <th class="sortable" sort-by="lastName"> Tester Name </th>
            <th class="sortable" sort-by="status"> Status </th>
            <th class="sortable" ng-click="doCustomSort( $event, 'testing')"> Is Testing? </th>
            **add "sortableOverride" class when using a custom sort via ng-click and apply a ng-class="{'sort-asc':reverse}" to handle chevron
            ...
            
    */
    
    global_directives.directive( 'itcSortableTable', ['$timeout', function($timeout){
        return {
            restrict: 'A',
            scope: {
                'itcSortableTable': '=table',
                'sortedObject': '=sortedObject',
                'initialSort': '=initialSort',
                'control': '='
            },
            link: function(scope,el,attrs) {
                
                var s = scope;
                
                s.control = s.control || {};
                
                // Storing the current sort values
                s.currentTh = undefined;
                s.currentKey = undefined;
                s.currentDirection = false;
                
                // CSS classnames used by the directive
                var SORTED = 'sorted',     // element is currently sorted
                    desc   = 'sort-desc',  // sorted, descending
                    asc    = 'sort-asc';   // sorted, ascending
                    
                // Attribute used for inverting the sort order on a column (mostly for comparing booleans)
                var INVERT_SORT = 'invert-sort';
                
                // log('initial sort', s.initialSort)
                
                // Grab the table headers so we can apply functionality
                s.headers = $(el).find("th.sortable");
                s.allHeaders = $(el).find("th");
                
                // Update the visual style of column to reflect sorting status, + return the new state
                s.updateStyles = function(th, tdsOnly) {
                    
                    var isDescending = false,
                        tdsOnly = tdsOnly || false;
                    
                    if (!th) {
                        th = s.currentTh;
                    }
                    
                    // Apply class of 'sorted' to <td>'s in the currently-sorted column
                    var indexOfSortedColumn = s.allHeaders.index(th);
                    if (indexOfSortedColumn !== undefined && indexOfSortedColumn > -1) {
                        $(el).find('tbody tr').each( function() {
                            var tds = $(this).find('td');
                            tds.removeClass(SORTED, desc, asc);
                            $(tds[indexOfSortedColumn]).addClass(SORTED);
                        });
                    }
                    if (tdsOnly === true) return false;
                    
                    // If header wasn't previously sorted, indicate that it's now sorted
                    if (! th.hasClass(SORTED)) {
                        s.headers.removeClass(SORTED);
                        if (!th.hasClass('sortableOverride')) {
                            th.addClass(SORTED +" "+ asc);
                            // log(th)
                        } else {
                            th.addClass(SORTED);
                        }
                        // isDescending = true;
                        
                    } else {
                        if (!th.hasClass('sortableOverride')) {
                            // Otherwise, switch the sort order (ascending <-> descending)
                            if (th.hasClass(asc)) {
                                th.addClass(desc).removeClass(asc);
                                isDescending = true;
                            } else {
                                th.addClass(asc).removeClass(desc);
                                isDescending = false;
                            }
                        }
                    }
                    
                    // true = descending, false = ascending
                    return isDescending;
                };
                
                // Used to prepare values for sorting (because we can't accurately compare undefined / null/ etc.)
                s.sanitizeValue = function(val) {
                    if (val === null || val === undefined || val === '') {
                        return '~~~'; // I use these characters instead of a blank string
                                      // to ensure that empty values appear AFTER any real values.
                                      // Otherwise the blanks would be sorted first (not desirable)
                    }
                    if (typeof val === 'string') {
                        return val.toLowerCase();
                    }
                    else {
                        return val;  
                    }
                };
                
                
                // Default sorting function
                s.performDefaultSort = function(obj, key, isDescending) {
                    var obj = obj || s.sortedObject,
                        key = key || s.currentKey,
                        isDescending = isDescending || s.currentDirection;
                    
                    if (obj === undefined || Object.keys(obj).length < 1 || !key) return false;
                    
                    obj.sort( function(x, y) {
                        var a = s.sanitizeValue( s.resolveKey(x, key)),
                            b = s.sanitizeValue( s.resolveKey(y, key));

                        if (a < b) return (isDescending) ? 1 : -1;
                        if (a > b) return (isDescending) ? -1 : 1;
                        return 0;
                    });
                    
                    // console.log(isDescending, obj.map( function(o){ return o[key]}).join('-'))
                    
                    $timeout( function() { scope.$apply() }, 0); // IMPORTANT: pushes the sorted object back to controller $scope  

                    return obj;
                };
                
                
                s.resolveKey = function(obj, path) {
                    if (obj.path) return obj.path;
                    return [obj || self].concat(path.split('.')).reduce(function(prev, curr) {
                        return prev[curr];
                    });
                };
                
                
                s.enableHeader = function(i, th) {
                    var th = $(th);
                    var sortKey = th.attr('sort-by'),
                        invertSort = !!(th.attr( INVERT_SORT ));
                    
                    th.click( function() {
                        
                        // Update table styling + retrieve current sorting status
                        var isDescending = s.updateStyles(th);
                        if (invertSort) isDescending = !isDescending;
                        
                        s.currentTh = th;
                        s.currentKey = sortKey;
                        s.currentDirection = isDescending;
                        
                        // Unless overriden by 'ng-click', use our default sorting behavior
                        if (s.sortedObject && sortKey && th.attr('ng-click') === undefined) {
                            s.performDefaultSort( s.sortedObject, sortKey, isDescending );
                        }
                    });
                    
                    // Initial sort (for when "sorted" is declared in the HTML for a column)
                    if (th.hasClass( SORTED )) {
                        
                        isDescending = th.hasClass(desc);
                        if (invertSort) isDescending = !isDescending;
                        
                        var removeWatcher = s.$watch( 'sortedObject', function(obj) {
                            if (obj !== undefined && Object.keys(obj).length > 0) {
                                
                                if (s.sortedObject && sortKey && th.attr('ng-click') === undefined) {
                                    s.performDefaultSort( s.sortedObject, sortKey, isDescending );
                                }
                                
                                removeWatcher();
                            }
                        })
                    }

                    return th;
                };
                    
                
                // Apply sorting functionality to each header
                s.headers.map( s.enableHeader );
                
                // Setup the interface to allow our controller to update the table
                if (s.control) {
                    
                    s.control.updateStyles = function(th, tdsOnly) {
                        s.updateStyles(th, tdsOnly);
                    };
                    
                    s.control.update = function(key, isDescending) {
                        // log('calling tableSorter.update():', key, isDescending)
                        // s.control.showVals();
                        // log('---------')
                        s.performDefaultSort( s.sortedObject, key, isDescending );
                        var th = $(el).find('th[sort-by="'+key+'"]');
                        s.updateStyles(th, false)
                    };
                    
                    s.control.showVals = function() {
                        log('currentTh:',s.currentTh)
                        log('currentKey:', s.currentKey)
                        log('currentDirection:', s.currentDirection)
                    }
                }
                
                // Sort based on whatever the initial sort is meant to be
                if (s.initialSort) {
                    // var headerToSort = $(el).find('[sort-by="'+s.initialSort+'""]');
                    // log(s.initialSort, headerToSort)
                    // if (headerToSort.length > 0) {
                        $timeout( function() {
                            s.control.update(s.initialSort, false)
                            // headerToSort.click()
                        // $timeout( function() {
                            // s.updateStyles(headerToSort, true)
                        }, 50)
                    // }
                }
            }
        }
    }]);

});


