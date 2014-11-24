/************************************************************************************************************************/
/*************************************************** form_elements.js ***************************************************/
/************************************************************************************************************************/

define([], function () {

    var form_elements = angular.module('form_elements', []);
    /*
    place directive on form to add placeholders for non-html5 browsers
    */
    form_elements.directive('itcPlaceholderSupport',function(){
        return {
            link: function(scope,element,attrs) {
                if(!Modernizr.input.placeholder) {
                    var placeholders = [];
                    scope.$watch(function(){  
                        if (placeholders.length <= 0) { //make sure we haven't applied this yet
                            $('.inputWrapper [placeholder]').each(function(){
                                $(this).addClass('hasStaticPlaceholder');
                                $(this).after('<span class="placeholder">'+$(this).attr('placeholder')+'</span>');
                            });
                        }
                        placeholders = $('[placeholder]');
                
                        $('.inputWrapper [placeholder]').focus(function() {
                            $(this).next('.placeholder').hide();
                        }).blur(function(){
                            if ($(this).val() !== "") {
                                $(this).next('.placeholder').hide();
                            } else {
                                $(this).next('.placeholder').show();
                            }
                        });
                        $('.inputWrapper [placeholder]').each(function(){
                            if ($(this).val() !== "") {
                                $(this).next('.placeholder').hide();
                            } else {
                                $(this).next('.placeholder').show();
                            }
                        });
                        $('.placeholder').click(function(){
                            $(this).prev('input').focus();
                        });

                    });
                }
            }
        }
    });

    /* tempPageContent.formErrors  itc-form-error-tracker */
    form_elements.directive('itcFormErrorTracker',function(){
        return {
            scope: {
                'itcFormErrorTracker':'='
            },
            link: function(scope,element,attrs) {
                //watch page for changes look for .invalid - and return count
                scope.$watch(function(){
                        if (scope.itcFormErrorTracker !== undefined) {
                            scope.itcFormErrorTracker.count = element.find('.invalid').length;
                            //console.log("element.find('.invalid').length "+element.find('.invalid').length);
                            scope.itcFormErrorTracker.count += element.find('.ng-invalid').length;
                            //console.log("element.find('.ng-invalid').length "+ element.find('.ng-invalid').length)
                            scope.itcFormErrorTracker.count += element.find('.invalid-srvr').length;
                        }
                });
            }
        }
    });

    /*
    place directive on form wrapper - fields will get "hasVisited" class after field has been clicked into. Style for ng-invalid isn't shown unless 'hasVisited' is present.
    IMPORTANT NOTE: THIS DIRECTIVE IS INCOMPAITBLE WITH NG-IF!!! It will find NOTHING on the page and not apply the "blur" action even if ng-if resolves to true!
    */
    form_elements.directive('itcValidateOnBlur',function(){
        return {
            scope: {
                'validateClear':'=?',
                'exposeRequiredFields':'=?'
            },
            link: function(scope,element,attrs) {
                /*element.on('blur',function(){
                    element.addClass('hasVisited');
                });
                if(element.is('textarea') && element.parent('.textareaWithCounter').length > 0) {
                    element.on('blur',function(){
                        element.parent('.textareaWithCounter').addClass('hasVisited');
                    });
                }*/
                element.find('input').each(function(){
                    $(this).blur(function(){
                        $(this).addClass('hasVisited');
                    });
                });
                element.find('select').each(function(){
                    $(this).blur(function(){
                        $(this).addClass('hasVisited');
                    });
                });
                element.find('textarea').each(function(){
                    $(this).blur(function(){
                        $(this).addClass('hasVisited');
                    });
                });
                scope.$watch('validateClear',function(){
                    if(scope.validateClear !== undefined) {
                        element.find('.hasVisited').removeClass('hasVisited');
                        scope.validateClear = false;
                    }
                },true);
                scope.$watch('exposeRequiredFields',function(){
                    if (scope.exposeRequiredFields !== undefined && scope.exposeRequiredFields) {
                        element.find('input').each(function(){
                                $(this).addClass('hasVisited');
                        });
                        element.find('select').each(function(){
                                $(this).addClass('hasVisited');
                        });
                        element.find('textarea').each(function(){
                                $(this).addClass('hasVisited');
                        });
                    }
                });
                /*element.find('.textareaWithCounter').each(function(){
                    $(this).find('textarea').blur(function(){
                        $(this).parent('.textareaWithCounter').addClass('hasVisited');
                    });
                });*/
                /*scope.$watch(function(){
                    if(element.find('.ng-invalid')) {
                        return true;
                    } 
                    return false;
                },function(val){
                    if (val) {
                        element.find('.ng-invalid').each(function() {
                            $(this).blur(function(){
                                $(this).addClass('hasVisited');
                            });
                        });
                    }
                });*/
            }
        }
    });

    /*
    Description: For creating start and end date date pickers
    Usage: apply as an attribute to the wrapper. Give start date field a class of "startdate", give enddate a class of "enddate"
    */
    form_elements.directive('itcDateGroup',['datePickerSerivce','$timeout',function(datePickerSerivce,$timeout){
        return {
            scope: {},
            restrict: 'A',
            require : '?ngModel',
            link: function(scope,element,attrs,ngModelCtrl) {
                $(function(){
                    var startdate =  element.find('.startdate');
                    var enddate = element.find('.enddate');
                    var today = new Date();
                    var todayFormatted = datePickerSerivce.getShortMonth(today.getMonth()) + " " + today.getDate() + ", " + today.getFullYear();
                    startdate.datepicker({
                        dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
                        dateFormat: "M d, yy",
                        minDate: new Date(),
                        maxDate: datePickerSerivce.getMaxDay(),
                        onClose: function(selectedDate) { 
                            $(this).val(datePickerSerivce.cleanDate(selectedDate));
                            
                            //determine end date
                            var minDate = new Date(Date.parse(startdate.val()));
                            minDate.setDate(minDate.getDate() + 1);
                            updatedMinDate = datePickerSerivce.getShortMonth(minDate.getMonth()) + " " + minDate.getDate() + ", " + minDate.getFullYear();
                            
                            if (startdate.val() === datePickerSerivce.getMaxDay()) {
                                scope.endDateValue = "";
                                enddate.datepicker( "option", "minDate", updatedMinDate );
                                startdate.datepicker("option","maxDate",datePickerSerivce.getMaxDay());
                                popupmessage(enddate,"<p>End date can not be set.</p>");
                                //can not set end date if start date is furthest possible
                            } else if (minDate.getTime() < today.getTime()) {
                                $(this).val(todayFormatted);
                                popupmessage($(this),"<p>Start date can not be earlier than today.</p>");
                            } else if (enddate.val() !== "" && enddate.val() !== "No End Date" && enddate.val() !== "None" && startdate.val() !== "" && !datePickerSerivce.checkRange(startdate,enddate)) {
                                //bad range - all fields filled
                                enddate.val(updatedMinDate);
                                enddate.datepicker( "option", "minDate", updatedMinDate );
                                popupmessage(enddate,"<p>End date must be after start date.</p>");
                            } else {
                                enddate.datepicker( "option", "minDate", updatedMinDate );
                            }
                        }
                    });
                    enddate.datepicker({
                        dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
                        dateFormat: "M d, yy",
                        minDate: "+1d",
                        maxDate: datePickerSerivce.getMaxDay(),
                        onClose: function(selectedDate) {
                            $(this).val(datePickerSerivce.cleanDate(selectedDate));
                            
                            //determine end date
                            var maxDate = new Date(Date.parse($(this).val()));
                            maxDate.setDate(maxDate.getDate() - 1);
                            updatedmaxDate = datePickerSerivce.getShortMonth(maxDate.getMonth()) + " " + maxDate.getDate() + ", " + maxDate.getFullYear();
                            console.log(updatedmaxDate);
                            var minDate = new Date(Date.parse(startdate.val()));
                            minDate.setDate(minDate.getDate() + 1);
                            updatedMinDate = datePickerSerivce.getShortMonth(minDate.getMonth()) + " " + minDate.getDate() + ", " + minDate.getFullYear();

                            if (startdate.val() === datePickerSerivce.getMaxDay()) {
                                //start date was set to max date - can not set end date...
                                $(this).val("");
                                $(this).datepicker( "option", "minDate", updatedMinDate );
                                popupmessage($(this),"<p>End date must be after start date.</p>");
                                //can not set end date if start date is furthest possible
                            } else if ($(this).val() !== "" && $(this).val() !== "No End Date" && $(this).val() !== "None" && startdate.val() !== "" && !datePickerSerivce.checkRange(startdate,$(this))) {
                                //bad range - all fields filled
                                $(this).val(updatedMinDate);
                                startdate.datepicker( "option", "maxDate", datePickerSerivce.getMaxDay() );
                                popupmessage(enddate,"<p>End date must be after start date.</p>");
                            } else if ($(this).val() === "" || $(this).val() === "No End Date" || $(this).val() === "None") {
                                // This field not filled - reset max day for start date
                                startdate.datepicker( "option", "maxDate", datePickerSerivce.getMaxDay() );
                            } else {
                                startdate.datepicker( "option", "maxDate", updatedmaxDate );
                            }
                        }
                    });
                });
                var popupmessage = function(el,message) {
                    var messagepopup = el.next();
                    $('.stayopen').removeClass('stayopen'); //hide other stayopen popups
                    messagepopup.html(message).addClass('stayopen');
                    $timeout(function(){
                        messagepopup.removeClass('stayopen');
                    },5000);
                }
            }
        }
    }]);

    /*
    Pass an array of errorkeys, pass copy of original value (not scope model) and current model. 
    if errorkeys passed exist and > 0 - will compare original value and current model - if the same, will add class of "invalid-srvr". if different, will remove "invalid-srvr" class

    will also seperately show/hide error bubbles on mouseover.
    html needs to be set up with these elements/classes:
        <span class="inputWrapper">
            <input type="text" ng-model="..." ng-required="...">
            <span class="errorPopUp mainError">error message here</span>
            <span class="errorPopUp srvError">Server error message here</span>
        </span>
    
    adds "invalid-srvr" to input tag. when "invalid-srvr" is in the class list - it will open up the .errorPopUp.srvError inline message.
   otherwise if element has "invalid" (ie too many characters in textarea) or ng-invalid + .hasVisisted (angular adds ng-invalid if it's required but empty - another directive adds 'hasVisited' once a user clicks into the field) - it will open up .errorPopUp.mainError 

    */
    form_elements.directive('itcFieldServerError',function(){
        return {
            scope: {
                'itcFieldServerError': '=', //an array of error keys
                'itcFieldOrigVal':'=',
                'itcFieldCurVal':'=',
                'itcFieldPopUpErrors': "@" //set to true to look for sibling ".errorPopUp" - add "open" on mouseover
            },
            link: function(scope,element,attrs) {
                var checkValues = function() {       
                    if (scope.itcFieldServerError !== undefined && scope.itcFieldServerError !== null && scope.itcFieldServerError.length > 0) {
                        if (scope.itcFieldOrigVal === scope.itcFieldCurVal) {
                            element.addClass('invalid-srvr');
                        } else {
                            element.removeClass('invalid-srvr');
                        }
                    } else {
                        element.removeClass('invalid-srvr');
                    }

                    if (scope.itcFieldPopUpErrors === "true") {
                        element.on('mouseenter', function(){
                            if (element.hasClass('invalid-srvr')) {
                                element.siblings('.errorPopUp.srvError').addClass('open');
                            } else if (element.hasClass('invalid') || (element.hasClass('ng-invalid') && element.hasClass('hasVisited') ) ) {
                                element.siblings('.errorPopUp.mainError').addClass('open');

                            }
                        });
                        element.on('mouseleave', function(){
                            element.siblings('.errorPopUp').removeClass('open');
                        });
                    }
                }
                checkValues();
                //var classnames="";
                scope.$watch('itcFieldCurVal',function(){
                    checkValues();
                    //classnames = element.attr("class");
                });
                scope.$watch('itcFieldServerError',function(){
                    checkValues();
                    //classnames = element.attr("class");
                });

                scope.$watch(function(){
                    return element.attr("class");
                },function(){
                    checkValues();
                });

                /*scope.$watch('classnames',function() {
                    if (scope.itcFieldPopUpErrors === "true") {
                        element.on('mouseenter', function(){
                            if (element.hasClass('invalid') || element.hasClass('invalid-srvr') || (element.hasClass('ng-invalid') && element.hasClass('hasVisited') ) ) {
                                element.siblings('.errorPopUp').addClass('open');
                                if (element.is("textarea") && element.parent('.textareaWithCounter').length > 0) {
                                    element.find('.errorPopUp').addClass('open');
                                }
                            }
                        });
                        element.on('mouseleave', function(){
                            element.siblings('.errorPopUp').removeClass('open');
                            if (element.is("textarea") && element.parent('.textareaWithCounter').length > 0) {
                                element.find('.errorPopUp').removeClass('open');
                            }
                        });
                    }
                });*/
                
                //watch textarea's for "ng-invalid" state when textareaWithCounter exists - and add invalid class to parent...
                /*scope.$watch(function() {
                    if (element.is("textarea") && element.parent('.textareaWithCounter').length > 0 && (element.hasClass('invalid') || element.hasClass('invalid-srvr') || (element.hasClass('ng-invalid') && element.hasClass('hasVisited') ))) {
                        return true;
                    }
                },function(val){
                    console.log("VAL CHECK"+val);
                    if (val) {
                        element.parent('.textareaWithCounter').addClass('invalid');
                    } else {
                        element.parent('.textareaWithCounter').removeClass('invalid');
                    }
                });*/
            }
        }
    });


    // Slimmer version of the 'itcFieldServerError', used for client-side errors on data-heavy pages.
    // Uses data attributes to trigger 'error' and 'warning' states, so it can be used in conjunction
    // with other directives (especially when the input element is dynamically generated)
    form_elements.directive('itcFieldError',function(){
        return {
            scope: {
                'itcFieldError': '=', //an array of error keys
                'itcFieldPopUpErrors': "@" //set to true to look for sibling ".errorPopUp" - add "open" on mouseover
            },
            link: function(scope,el,attrs) {
                
                var s = scope;
                
                s.hasError   = false;
                s.hasWarning = false;
                
                s.errorMsgs  = el.siblings('.errorPopUp');
                s.errorMsg   = el.siblings('.errorPopUp.mainError');
                s.warningMsg = el.siblings('.errorPopUp.warning');
                
                
                el.on('mouseenter', function(){
 
                    if (el.hasClass('has-error')) {
                        s.errorMsg.addClass('open');
                     
                    } else if (el.hasClass('has-warning')) {
                        s.warningMsg.addClass('open');
                    }
                    
                });
                
                el.on('mouseleave', function(){
                    s.errorMsgs.removeClass('open');
                });
            }
        }
    });



    /*
    Description: Simple directive to launch the filechooser from a link. Pass in the ID of the <input type="file"> to reference when link is clicked.
    <a href="" itc-launch-filechooser="fileselector">Upload file</a>
    <input type="file" id="fileselector">
    */
    form_elements.directive('itcLaunchFilechooser',function() {
        return {
            /*scope: {
                itcLaunchFilechooser: "@"
            },*/
            link: function(scope, element, attrs) {
                element.bind('click',function(e){
                    e.preventDefault();
                    // $('#'+scope.itcLaunchFilechooser).click();
                    element.next('input').click();
                });
            }
        }
    });

    /* use for contract interstitial - condtionally scroll content depending on length of content in modal... */
    form_elements.directive('itcConditionalScrollingBox',function($timeout){
        return function(scope,element,attrs) {
            function checkScroller() {
                element.find('.'+attrs.wrapperClass).css('maxHeight',attrs.maxHeight+"px");
                if (element.find("."+attrs.innerWrapperClass).height() > attrs.maxHeight) {
                    element.find('.'+attrs.wrapperClass).addClass('scroll-content');
                } else {
                    element.find('.'+attrs.wrapperClass).removeClass('scroll-content');
                }
            }
            checkScroller();
            if(scope.$last) {
                $timeout(function(){
                    //console.log("timeout");
                    checkScroller();
                });
            }
            scope.$watch(function(){
                return element.find("."+attrs.innerWrapperClass).height();
            },function(){
                checkScroller();
            });
            /*
            $timeout(function(){
                console.log("timeout 2");
                checkScroller();
            });*/
        }
    });

    /* 
    Description: created a checkbox that will check all checkboxes in the given object json.
    Usage: <span itc-check-all-checkbox checkboxes="filtered"></span>
    IMPORTANT: "filtered" needs a isSelected: true/false key-value!

    (where "filtered" is the json listing in scope and what is used in the ng-repeat)
    ie: <tr ng-repeat="iapInfo in filtered | startFrom:(currentPage-1)*entryLimit | limitTo:entryLimit">

    can-be-checked - optional attribute to add to itc-check-all-checkbox. Used when a checkbox in the list might not be editable. Enter the TEXT (string) for the key to check. ie. "isEditable" or "canBeDeleted"
    */
    form_elements.directive('itcCheckAllCheckbox', function() {
        return {
            replace: true,
            restrict: 'A',
            scope: { 
                checkboxes: '=',
                canBeChecked: '@' //if this is provided - use this property during iteration if item in list can be checked
            },
            template: ''+
                    '<span>'+
                    '<input type="checkbox" class="a11y" ng-model="master">' +
                    '<a href="" class="checkboxstyle" ng-class="{\'checked\':master}" ng-click="masterChange()"></a>'+
                    '</span>',
            controller: function($scope, $element, $attrs) {
                $scope.propertyToSet = "isSelected";
                if ($attrs.checkboxProperty) $scope.propertyToSet = $attrs.checkboxProperty;

                $scope.masterChange = function() {

                    if($scope.master) {
                        $scope.master = false;
                        angular.forEach($scope.checkboxes, function(cb, index){
                            if (cb.isStatic !== true) {
                                if ($scope.canBeChecked !== undefined) {
                                    if (cb[$scope.canBeChecked]) {
                                        cb[$scope.propertyToSet] = false;
                                    }
                                } else {
                                    cb[$scope.propertyToSet] = false;
                                }
                            }
                        });
                    } else {
                        $scope.master = true;
                        angular.forEach($scope.checkboxes, function(cb, index){
                            if (cb.isStatic !== true) {
                                if ($scope.canBeChecked !== undefined) {
                                    if (cb[$scope.canBeChecked]) {
                                        cb[$scope.propertyToSet] = true;
                                    }
                                } else {
                                    cb[$scope.propertyToSet] = true;
                                }
                            }
                        });
                    }
                };

            $scope.$watch('checkboxes', function() {
                var allSet = true, allClear = true;
                angular.forEach($scope.checkboxes, function(cb, index){
                    if ($scope.canBeChecked !== undefined) {
                        if (cb[$scope.canBeChecked]) {
                            if(cb[$scope.propertyToSet]) {
                                allClear = false;
                            } else {
                                allSet = false;
                            }
                        } //skip over any items that can't be checked anyway
                    } else {
                        if(cb[$scope.propertyToSet]) {
                            allClear = false;
                        } else {
                            allSet = false;
                        }
                    }
                });
                if(allSet)        { 
                  $scope.master = true; 
                  $element.prop('indeterminate', false);
                }
                else if(allClear) { 
                  $scope.master = false; 
                  $element.prop('indeterminate', false);
                }
                else { 
                  $scope.master = false;
                  $element.prop('indeterminate', true);
                }
              }, true);
            }
        };
    });


    /*
    Description: Stylized Checkbox
    Usage: <div itc-checkbox="ngmodel_variable_name"  itc-checkbox-disabled="object.trueOrFalse"></div>
    */
    form_elements.directive('itcCheckbox',['$timeout',function($timeout) {
        return {
            restrict: 'A',
            scope: {
                checkboxValue: '=itcCheckbox',
                itcCheckboxDisabled:'=?',
                itcCheckboxCallback: '&',
                checkboxLabel: '=?'
            },
            template: ''+
                '<span class="itc-checkbox">'+
                '<input type="checkbox" class="a11y" ng-model="checkboxValue">' +
                '<a href="javascript:void(0)" class="checkboxstyle" ng-class="{\'checked\':checkboxValue,\'disabled\':itcCheckboxDisabled}" ng-click="checkit()"></a>'+
                '</span>',
            link: function($scope, $element) {
                
                // Uneditable checkboxes cannot be interacted with
                if ($element.attr('force-enabled') !== undefined) {
                    $element.find('a.checkboxstyle').addClass('disabled');
                    return false;
                }
                
                $scope.checkit = function() {
                    
                    if (!$scope.itcCheckboxDisabled || $scope.itcCheckboxDisabled === undefined || $scope.itcCheckboxDisabled === null) {
                        if ($scope.checkboxValue) {
                            $scope.checkboxValue = false;
                        } else {
                            $scope.checkboxValue = true;
                        } 
                    }
                }
                
                // If label is provided, add it -- and link it to the checkbox
                if ($scope.checkboxLabel) {
                    var label = $element.find('span').append('<label>' + $scope.checkboxLabel + '</label>');
                    var uniqID = _.guid();
                    $element.find('input').attr( 'id',  uniqID );
                    $element.find('label').attr( 'for', uniqID );
                }

                $scope.$watch('checkboxValue', function(newValue, oldValue) {
                    $scope.itcCheckboxCallback();
                });
            }
        }
    }]);

    /*
    Description: Stylized Checkbox
    Usage: <div itc-checkbox="ngmodel_variable_name"  itc-checkbox-disabled="object.trueOrFalse"></div>
    */
    form_elements.directive('itcThreeStateCheckbox',['$timeout',function($timeout) {
        return {
            restrict: 'A',
            scope: {
                checkboxValue: '=itcThreeStateCheckbox',
                itcCheckboxDisabled:'=?',
                itcCheckboxCallback: '&',
                checkboxLabel: '=?'
            },
            template: ''+
                '<span class="itc-checkbox">'+
                '<input type="checkbox" class="a11y" ng-model="checkboxValue">' +
                '<a href="javascript:void(0)" class="checkboxstyle" ng-class="{\'checked\':checkboxValue,\'indeterminate\':indeterminate,\'disabled\':itcCheckboxDisabled}" ng-click="checkit()"></a>'+
                '</span>',
            link: function($scope, $element) {
                
                // Uneditable checkboxes cannot be interacted with
                if ($element.attr('force-enabled') !== undefined) {
                    $element.find('a.checkboxstyle').addClass('disabled');
                    return false;
                }
                
                $scope.checkit = function() {
                    
                    if (!$scope.itcCheckboxDisabled || $scope.itcCheckboxDisabled === undefined || $scope.itcCheckboxDisabled === null) {
                        if ($scope.checkboxValue) {
                            $scope.checkboxValue = false;
                            $scope.indeterminate = false;
                        } else {
                            $scope.checkboxValue = true;
                            $scope.indeterminate = false;
                        }
                    }
                }
                
                // If label is provided, add it -- and link it to the checkbox
                if ($scope.checkboxLabel) {
                    var label = $element.find('span').append('<label>' + $scope.checkboxLabel + '</label>');
                    var uniqID = _.guid();
                    $element.find('input').attr( 'id',  uniqID );
                    $element.find('label').attr( 'for', uniqID );
                }

                $scope.$watch('checkboxValue', function(newValue, oldValue) {
                    $scope.itcCheckboxCallback();
                    if ($scope.checkboxValue === null) {
                        $scope.indeterminate = true;
                    }
                });
            }
        }
    }]);

    /*
    Description: Stylized Radio Button
    Usage: <div itc-radio="ngmodel_name" radio-value="radio_value" radio-required="obj.valueTrueOrFalse"></div>
    */
    form_elements.directive('itcRadio',function() {
        return {
            restrict: 'A',
            scope: {
                'radioValue': '@',
                'radioGroup': '=itcRadio',
                'radioRequired': '@?', //set this as a string so it could be "evaluated" inline
                'radioDisabled': '@?'
            },
            template: ''+
                '<span>'+
                '<input type="radio" class="a11y" ng-model="radioGroup" ng-value="radioValue" ng-required="isRequired" ng-disabled="isDisabled">'+
                '<a href="" class="radiostyle" ng-class="{\'checked\':isChecked(),\'disabled\':isDisabled}" ng-click="checkit()"></a>'+
                '</span>',
            link: function(scope,element,attrs) {
                scope.checkit = function() {
                    if (!scope.isDisabled || scope.radioDisabled === undefined || scope.itcCheckboxDisabled === null) {
                        scope.radioGroup = scope.radioValue;
                    }
                }
                scope.isChecked = function() {
                    if (scope.radioGroup === scope.radioValue) {
                        return true;
                    }
                }
                if (scope.radioDisabled !== undefined) {
                    scope.$watch('radioDisabled',function(value) {
                        if (value === true || value == "true") {
                            scope.isDisabled = true;
                        } else {
                            scope.isDisabled = false;
                        }
                        
                    });
                }
                if (scope.radioRequired !== undefined) {
                    scope.$watch('radioRequired',function(value) {
                        if (value === true || value == "true") {
                            scope.isRequired = true;
                        } else {
                            scope.isRequired = false;
                        }
                        
                    });
                }
            }
        }
    });
    
    /*
     * Search input field itcSearch
     *
     * @param searchModel The model you want to search on
     * @param searchResultsTally An integer that describes the number of results left (optional)
     *
     * Usage: <div itc-search search-model="some_var" searchResultsTally="some_int"></div>
     */
    form_elements.directive('itcSearch', function() {
        return {
            restrict: 'AE',
            scope: {
                searchModel : '=',
                searchResultsTally : '='
            },
            template: '' +
                '<div class="search-input-container" ng-class="{\'has-query\': searchModel.length, \'has-focus\': searchFocus}">' +
                    '<div class="close-icon icon" ng-show="searchModel.length" ng-click="searchModel=clearSearch()"></div>' +
                    '<input ng-model="searchModel" class="search-input" ng-focus="searchFocus = true" ng-blur="searchFocus = false" ng-class="{\'no-tally\':searchResultsTally == undefined}" type="text"/>' +
                    '<div class="watermark">' +
                      '<div class="search-icon icon"></div><div class="placeholder-text">{{ $parent.l10n.interpolate(\'ITC.apps.manageyourapps.summary.search\') }}</div>' +
                    '</div>' +
                    '<div class="results-tally" ng-show="searchModel.length && searchResultsTally != undefined">{{ searchResultsTally == 1 ? $parent.l10n.interpolate(\'ITC.apps.manageyourapps.summary.result\', {\'numResults\': searchResultsTally}) : $parent.l10n.interpolate(\'ITC.apps.manageyourapps.summary.results\', {\'numResults\': searchResultsTally}) }}</div>' +
                '</div>',
            link: function(scope, element, attrs) {
                scope.clearSearch = function() {
                    scope.searchModel = '';
                }
            }
        };
    });


    /*
    Description: attribute that will add a class to element when it is in focus
    Usage: <input type="text" itc-focus-input>
    */
    form_elements.directive('itcFocusInput', function() {
      return {
        link: function(scope, element, attrs) {
          element.bind('focus', function() {
            $(element).addClass('focus');
          });
          element.bind('blur',function(){
            $(element).removeClass('focus');
          });
        }
      };
    });

    /*

    */
    form_elements.directive('itcSwitcherCheckbox',function(){
        return {
            restrict: 'A',
            scope: {
                'checkboxValue': '=itcSwitcherCheckbox',
                'checkboxName': '@',
                'checkboxLabel': '@',
                'callBackFuncForValue': '&',
                'checkboxEditable': '=',
            },
            template: ''+
                '<span class="switch" ng-class="{disabled: checkboxEditable === false}">'+
                '   <input type="checkbox" class="switchbox a11y" name="{{checkboxName}}" id="{{checkboxName}}"  ng-model="checkboxValue"  />'+
                '   <a href="" class="switcher" ng-class="{\'checked\':checkboxValue}" for="{{checkboxName}}" ng-click="switchit()">{{checkboxLabel}}<span></span></a>'+
                '</span>',
            link: function(scope,element,attrs){
                scope.switchit = function() {
                    if (attrs.checkboxEditable && attrs.checkboxEditable == false) return;
                    if (attrs.callBackFuncForValue === undefined || attrs.callBackFuncForValue === null) {
                      if (scope.checkboxValue) {
                            scope.checkboxValue = false;
                        } else {
                            scope.checkboxValue = true;
                        }
                    } else {
                        scope.checkboxValue = scope.callBackFuncForValue() || scope.checkboxValue;
                    }
                    
                }
            }
        }
    });

    /*
    Description: attribute that will show a textarea with a counter that updates on typing.
    Usage: <span ng-show="OPTIONAL_VARIABLE" text-area-with-counter="SCOPE_VAR" text-limit="350" text-area-class="tall"></span>

    more complete example:

    <span ng-show="versionInfo.appReviewInfo.reviewNotes.isEditable" 
                    text-area-with-counter="versionInfo.appReviewInfo.reviewNotes.value" 
                    text-limit="350"
                    text-area-required="versionInfo.appReviewInfo.reviewNotes.isRequired"
                    text-area-itc-field-server-error="{{ versionInfo.appReviewInfo.reviewNotes.errorKeys.length > 0 }}"
                    text-area-itc-field-orig-val="orignalVersionInfo.appReviewInfo.reviewNotes.value" 
                    text-area-itc-field-cur-val="versionInfo.appReviewInfo.reviewNotes.value"
                    text-area-itc-empty-errormsg="Provide a Review Notes for your app."
                    text-area-itc-char-exceed-errormsg="The Review Notes can not exceed 350 characters"
                    text-area-itc-field-server-error-msg="versionInfo.appReviewInfo.reviewNotes.errorKeys"
                    text-area-itc-field-pop-up-errors="true"></span>

    */
    form_elements.directive('textAreaWithCounter',function($sce){
        return {
            restrict: 'A',
            scope: {
                'text': '=textAreaWithCounter',
                'textAreaClass': '@',
                'textLimit':'@',
                'textAreaRequired':'=',
                'textAreaItcFieldServerError':'=',
                'textAreaItcFieldOrigVal': '=',
                'textAreaItcFieldCurVal': '=',
                'textAreaItcEmptyErrormsg': '@',
                'textAreaItcCharExceedErrormsg': '@',
                'textAreaItcFieldPopUpErrors': '@',
                'textAreaItcFieldServerErrorMsg':'=',
                'textAreaItcChangeCallback': '&'
            },
            template: ''+
                '<span class="textareaWithCounter inputWrapper">'+
                '   <textarea class="{{ textAreaClassUpdated }}" ng-model="text" ' +
                        'ng-required="textAreaRequired" ' +
                        'itc-field-server-error="textAreaItcFieldServerError" ' +
                        'itc-field-orig-val="textAreaItcFieldOrigVal" ' +
                        'itc-field-cur-val="textAreaItcFieldCurVal" ' +
                        'itc-field-pop-up-errors="{{ textAreaItcFieldPopUpErrors }}"></textarea>' +
                '   <span class="errorPopUp mainError"> ' +
                '       {{ errorMsg }} ' +
                '   </span>' +
                '   <span class="errorPopUp srvError">' +
                '       <p ng-repeat="msg in textAreaItcFieldServerErrorMsg" ng-bind-html="renderHtml(msg)"></p>' +
                '   </span>'  +
                '   <span class="{{ classlist }}">{{ textremaining() }}</span>' +
                '</span>',

            link: function(scope,element,attrs) {
                //console.log("Testing is textarea required: "+ scope.textAreaRequired + " " + scope.text);
                if (scope.textAreaRequired === "true") {
                     scope.textAreaRequired = true;
                } else if (scope.textAreaRequired === "false") {
                    scope.textAreaRequired = false;
                }
                if(scope.textAreaItcFieldServerError === "true") {
                    scope.textAreaItcFieldServerError = true;
                } else if(scope.textAreaItcFieldServerError === "true") {
                    scope.textAreaItcFieldServerError = false;
                }
                scope.checkErrorMsgs = function() {
                    /*
                    PRIORITY OF ERROR MESSAGES IS:
                    Highest: DISPLAY ERROR FROM SERVER FIRST (will go away once fields are different)
                    next: Characters are exceeded max #
                    next: no characters enetered
                    */
                    //console.log("scope.textAreaItcFieldServerError" + scope.textAreaItcFieldServerError);
                    if (scope.textAreaItcFieldServerError !== undefined && scope.textAreaItcFieldServerError !== null && (scope.textAreaItcFieldServerError === "true" || scope.textAreaItcFieldServerError === true)) {
                        scope.errorMsg = scope.textAreaItcFieldServerErrorMsg;
                    } else if (scope.text !== undefined && scope.textremaining() < 0) {
                        scope.errorMsg = scope.textAreaItcCharExceedErrormsg;
                    } else {
                        scope.errorMsg = scope.textAreaItcEmptyErrormsg;
                    }
                    //console.log("final error message check " + scope.errorMsg);
                }

                scope.textremaining = function() {
                    if (scope.text !== undefined && scope.text !== null) {
                        return (scope.textLimit - scope.text.length);
                    } else {
                        return scope.textLimit;
                    }
                   
                }
                scope.counterClasses = function() {
                    scope.classlist = "textCounter";
                    scope.textAreaClassUpdated = scope.textAreaClass;
                    if (scope.textremaining() < 0) {
                        scope.classlist += " overLimit";
                        //element.find('.textareaWithCounter').addClass('invalid');
                        scope.textAreaClassUpdated += " invalid";
                        //console.log("textAreaClassUpdated "+ scope.textAreaClassUpdated);
                    }
                }
                scope.textLimit = parseInt(scope.textLimit);
                scope.counterClasses();
                
                scope.$watch('text',function(){
                    scope.checkErrorMsgs();
                    scope.counterClasses();
                    if (scope.textAreaItcChangeCallback) scope.textAreaItcChangeCallback();
                    //console.log("classlist: " + scope.classlist);
                });
                scope.renderHtml = function(html_code) {
                    return $sce.trustAsHtml(html_code);
                };

            }
        }
    });

    /* 
    Auto-appends "http://" to input fields that contain URL's
    OPTIONAL ATTRIBUTES:
    url-required-error-msg="{{ l10n.interpolate('ITC.apps.validation.url_field_incorrect_format') }}"
    field-required-error-msg="{{ l10n.interpolate('ITC.AppVersion.ErrorMessages.FieldRequired') }}"

    field-required-error-msg - pass in default string when field is required but left blank. Will be added to the "errorPopUp mainError" div which SHOULD BE the very next element to the input field

    url-required-error-msg - pass in string error message when field is not blank and a non http / https value has been left in the field. Will display in "errorPopUp mainError" div on blur. (error div should be the NEXT element to the input field)
    */
    form_elements.directive('urlInputField',function() {
        return {
            restrict: 'A',
            /*scope: {
                itcLaunchFilechooser: "@"
            },*/
            link: function(scope, element, attrs) {
                
                var protocolText = "http://"
                
                element.on('focus', function() {
                    if (element.val() === "") element.val( protocolText )
                });
                
                element.on('blur', function() {
                    element.removeClass('invalid');
                    var rgx = new RegExp( element.val() )
                    var elementVal = element.val();
                    if (rgx.test( protocolText )) {
                        element.val("");
                        if (attrs.fieldRequiredErrorMsg !== undefined) {
                            element.next().html(attrs.fieldRequiredErrorMsg); 
                        }
                    } else if (elementVal.substring(0, 7) !== "http://" && elementVal.substring(0, 8) !== "https://") {
                        if (attrs.urlRequiredErrorMsg !== undefined) {
                            element.next().html(attrs.urlRequiredErrorMsg);
                            element.addClass('invalid');
                        }
                    } else {
                        if (attrs.fieldRequiredErrorMsg !== undefined) {
                            element.next().html(attrs.fieldRequiredErrorMsg); 
                        }
                    }
                });
            }
        }
    });

    /*

    attributes to include:
    passwordMatch
    fieldsMisMatchErrorMsg
    fieldRequiredErrorMsg
    */
    form_elements.directive('passwordMatchField',function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('blur',function() {
                    scope.checkFields();
                });
                
                scope.$watch(function(){
                    return attrs.passwordMatch;
                },function(val){
                    if (val) {
                        var elementVal = $(element).val();
                        //console.log(elementVal.length);
                        //console.log(attrs.passwordMatch.length);
                        if (elementVal.length <= attrs.passwordMatch.length) { //wait until field is longer than or equal to other field before checking equality
                          scope.checkFields();  
                        } else {
                            element.removeClass('invalid');
                            if (attrs.fieldRequiredErrorMsg !== undefined) {
                                element.next().html(attrs.fieldRequiredErrorMsg); 
                            }
                        }
                    }
                });

                scope.checkFields = function() {
                    element.removeClass('invalid');
                    if (attrs.passwordMatch !== '' && $(element).val() !== '' && attrs.passwordMatch !== $(element).val()) {
                        if (attrs.fieldsMisMatchErrorMsg !== undefined) {
                            element.next().html(attrs.fieldsMisMatchErrorMsg);
                            element.addClass('invalid');
                        }
                    } else {
                        if (attrs.fieldRequiredErrorMsg !== undefined) {
                            element.next().html(attrs.fieldRequiredErrorMsg); 
                        }
                    }
                }
                /*var protocolText = "http://"
                
                element.on('focus', function() {
                    if (element.val() === "") element.val( protocolText )
                });
                
                element.on('blur', function() {
                    element.removeClass('invalid');
                    var rgx = new RegExp( element.val() )
                    var elementVal = element.val();
                    if (rgx.test( protocolText )) {
                        element.val("");
                        if (attrs.fieldRequiredErrorMsg !== undefined) {
                            element.next().html(attrs.fieldRequiredErrorMsg); 
                        }
                    } else if (elementVal.substring(0, 7) !== "http://" && elementVal.substring(0, 8) !== "https://") {
                        if (attrs.urlRequiredErrorMsg !== undefined) {
                            element.next().html(attrs.urlRequiredErrorMsg);
                            element.addClass('invalid');
                        }
                    } else {
                        if (attrs.fieldRequiredErrorMsg !== undefined) {
                            element.next().html(attrs.fieldRequiredErrorMsg); 
                        }
                    }
                });*/
            }
        }
    });



        /*
    TODO - THIS DOESN"T WORK YET _ NEED TO MODIFY TO CREATE A SINGLE DATE PICKER....
    */
    form_elements.directive('itcDatepicker', function() {
        return {
            restrict: 'A',
            link : function (scope, element, attrs, ngModelCtrl) {
                $(function(){
                    element.datepicker({
                        dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
                        dateFormat: "M d, yy",
                        onSelect:function (date) {
                          //console.log(element)
                            scope.$apply(function () {
                                ngModelCtrl.$setViewValue(date);
                            });
                        }
                    });
                });
            }
        }
    });


});

