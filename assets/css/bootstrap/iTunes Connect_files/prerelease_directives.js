/************************************************************************************************************************/
/*********************************************** prerelease_directives.js ***********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {
    
    // Controls the <input> elements on the "Add Beta Testers" page (huge list of testers with: email, first, last)
    itcApp.directive( 'betaTesterInputGroup', ['$timeout', function($timeout) {
        return {
            
            transclude: true,
            
            restrict: 'A',
            
            scope: {
                testerIndex: '@',
                tester: '=testerObject'
            },
            
            // ITC.global.text.optional
            
            template:
            
               '<td class="tester-index">{{ testerIndex }}</td>\
                <td>\
                    <span class="inputWrapper">\
                        <input type="text" class="input-email tableinput" tabindex="{{ testerIndex }}" name="email{{$index + 1}}" ng-model="tester.emailAddress.value" itc-field-server-error="tester.emailAddress.errorKeys" itc-field-pop-up-errors="true" autocomplete="off">\
                        <span class="errorPopUp srvError">\
                            <span ng-repeat="error in tester.emailAddress.errorKeys">{{ error }}</span>\
                        </span>\
                        <span class="errorPopUp mainError">{{ clientErrors.invalidEmail }}</span>\
                        <span class="errorPopUp warning">{{ clientErrors.testerExists }}</span>\
                    </span>\
                </td>\
                <td>\
                    <input type="text" class="input-first" tabindex="{{ testerIndex }}" name="firstName{{$index + 1}}" placeholder="{{ l10n.interpolate(\'ITC.global.text.optional\') }}" ng-model="tester.firstName.value" autocomplete="off">\
                </td>\
                <td>\
                    <input type="text" class="input-last"  tabindex="{{ testerIndex }}" name="lastName{{$index + 1}}"  placeholder="{{ l10n.interpolate(\'ITC.global.text.optional\') }}" ng-model="tester.lastName.value" autocomplete="off">\
                </td>\
                <td>\
                    <a href="javascript:void(0)" class="deleteIcon" ng-click="removeTester(tester)"></a>\
                </td>',
                
            link: function(scope, el, attrs) {
                
                var s = scope;
                var controller = scope.$parent.$parent; // controller = parent $scope
                s.testerIndex = parseInt(s.testerIndex, 10);
                
                s.clientErrors = {};
                var unwatchLocaleStrings = controller.$watch('l10n', function(l10n) {
                    if (l10n) {
                        s.l10n = l10n;
                        if (l10n['ITC.apps.testers.fieldErrors.invalidEmail'] && l10n['ITC.apps.testers.fieldErrors.invalidEmail']) {
                            s.clientErrors.invalidEmail = controller.l10n['ITC.apps.testers.fieldErrors.invalidEmail'];
                            s.clientErrors.testerExists = controller.l10n['ITC.apps.testers.fieldErrors.testerExists'];
                            unwatchLocaleStrings();
                        }
                    }
                })
                
                var BACKSPACE_KEY = 8,
                    DELETE_KEY    = 46,
                    TAB_KEY       = 9,
                    RETURN_KEY    = 13;
                    
                var ERROR_CLASS   = 'has-error',
                    WARNING_CLASS = 'has-warning';
                    
                var emailValidator  = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                    hasEnteredEmail = false;
                
                s.attachFieldListeners = function(fields) {
                    
                    var firstField      = $( fields[0] ),
                        allButFirstField= $( fields.slice(1) ),
                        allButLastField = $( fields.slice(0,-1) ),
                        lastField       = $( fields.slice(-1) );
                        
                    var emailField = firstField,
                        firstNameField = $( fields[1] ).
                        lastNameField = lastField;
                    
                    
                    $(fields).on('change:reCount', function(e) {
                        $$.getAvailableTesters();
                    });
                    
                    // Pressing delete while inside the first field will delete the row,
                    // but only if all of the fields are empty.
                    firstField.on('keydown', function(e) {
                        var code = e.keyCode || e.which,
                            val = $(this).val();
                        
                        function isRowEmpty() {
                            return _.every( fields, function(field) {
                                return ($(field).val() === '')
                            })
                        }

                        if (  
                            isRowEmpty() 
                            && (code === BACKSPACE_KEY || code === DELETE_KEY) 
                            && scope.tester.index > 1 // do not delete the first row
                        ) {
                            e.preventDefault()
                            controller.removeTester( scope.tester )
                            
                            nextIndex = (s.testerIndex >= controller.newTesters.length) ? s.testerIndex - 1 : s.testerIndex;
                            
                            $timeout( function() {
                                s.selectRow( nextIndex, el );
                            }, 25);
                        }
                    });
                    
                    
                    // Pressing 'Tab' or 'Return' on the final field of a row ("Last Name")
                    // either goes to next row, or inserts a new one if needed
                    lastField.on('keydown', function(e) {

                        var code = e.keyCode || e.which;
                        
                        if (code === TAB_KEY || code === RETURN_KEY) {
                            
                            // Create new row if we're the last child
                            if (s.isLastChild()) {
                                if (code === TAB_KEY) e.preventDefault(); // otherwise we'll jump one field too far
                                
                                s.createNewRow()
                                controller.$apply();
                            
                            // Otherwise put cursor in the next row
                            } else {
                                e.preventDefault()
                                s.selectRow( parseInt(s.testerIndex,10) + 1 )
                            }
                        }
                    })
                    
                    // Pressing ENTER on any field inserts a new row at bottom
                    allButLastField.on('keydown', function(e) {
                        var code = e.keyCode || e.which;
                        
                        if (code === RETURN_KEY) {
                            if (el.hasClass('last-empty-item')) {
                                s.createNewRow()
                                controller.$apply();
                            } else {
                                e.preventDefault()
                                s.selectRow( parseInt(s.testerIndex,10) + 1 )
                            }
                        }
                    })
                    
                    // Go to previous field when you press DELETE on an empty field
                    allButFirstField.on('keydown', function(e) {
                        var code = e.keyCode || e.which,
                            field = $(this),
                            isEmpty = (field.val() === '');
                            
                        if (isEmpty && (code === BACKSPACE_KEY || code === DELETE_KEY)) {
                            
                            e.preventDefault();
                            
                            if (field.hasClass('input-last')) 
                                el.find('.input-first').focus()
                            
                            else if (field.hasClass('input-first')) 
                                el.find('.input-email').focus()
                        }
                    })
                    
                    // Email address validation
                    firstField.on('keyup', function(e) {
                        
                        var field = $(this);
                        
                        if (!hasEnteredEmail) { 
                            return false;
                        } else {
                            controller.hasEmailErrors = !s.validateEmail( field );
                            controller.$apply();
                            // log('errorKeys', tester.errorKeys)
                        }
                    })
                    .on('blur', function() {
                        
                        var field = $(this),
                            val = field.val();
                            
                        if (!val || val === '') {
                            s.removeWarningStates(field);
                            return false;
                        }
                        
                        if (!controller.isInternalTester(s.tester)) {
                            s.tester.emailAddress.errorKeys = [];
                        }
                        
                        if (hasEnteredEmail === false) {
                            
                            var field = $(this),
                                val   = field.val();
                                
                            if (val.trim() !== '') { hasEnteredEmail = true; }
                            
                            controller.hasEmailErrors = !s.validateEmail( field );
                            s.tester.errorKeys = ["That's not an email address."]
                            controller.$apply();
                        }
                    })
                    // .on('click', function() {
                    //     log(s.isLastChild())
                    // });
                    
                    // Place text cursor in first field of last row
                    if (s.isLastChild()) {
                        $(firstField).focus();
                        controller.getAvailableTesters();
                    }
                }
                
                
                
                //
                //  HELPER FUNCTIONS
                //
                
                s.validateEmail = function(field) {
                    var val = field.val(),
                        rgx = emailValidator;
                        
                    field.siblings('.errorPopUp').removeClass('open');
                            
                    // Add ERROR STATE if email is invalid
                    if ( !rgx.test(val) && field.hasClass( ERROR_CLASS ) === false) {
                        field.addClass( ERROR_CLASS )
                        field.off('mouseenter.testerExists');
                        field.on('mouseenter.invalidEmail', function(){
                            // field.siblings('.errorPopUp.mainError').html(controller.fieldErrors.invalidEmail);
                            field.siblings('.errorPopUp.mainError').addClass('open');
                        });
                        return false;
                    } else {
                        field.off('mouseenter.invalidEmail');
                        field.removeClass( ERROR_CLASS );
                    }
                    
                    // Add WARNING STATE if the email matches an existing Beta Tester
                    if ( controller.testerExists(val) ) {
                        field.addClass( WARNING_CLASS );
                        field.off('mouseenter.invalidEmail');
                        field.on('mouseenter.testerExists', function(){
                            // field.siblings('.errorPopUp.warning').html(controller.fieldErrors.testerExists);
                            field.siblings('.errorPopUp.warning').addClass('open');
                        });
                        return true; // allowing us to update existing Testers (previously we denied this action)
                    } else {
                        field.off('mouseenter.testerExists');
                        field.removeClass( WARNING_CLASS );
                    }
                    
                    // Remove error state
                    if ((rgx.test(val) === true && !controller.testerExists(val) )|| val === '') {
                        s.removeWarningStates(field);
                        // field.removeClass( ERROR_CLASS );
                        // field.removeClass( WARNING_CLASS );
                        return true;
                    }
                    
                    return false;
                };
                
                s.removeTester = function(t) {
                    var index = parseInt(s.testerIndex, 10);
                    controller.removeTester(t);
                    // If the sole remaining row is deleted, add a blank one in its place
                    if (index === 1 && controller.newTesters.length < 2) {
                        controller.addNewTester();
                    }
                    $timeout( function() { 
                        controller.$apply();
                        $timeout( function() { s.fixIndices(); });
                    })
                }
                
                s.removeWarningStates = function(field) {
                    field.removeClass( ERROR_CLASS );
                    field.removeClass( WARNING_CLASS );
                    field.off('mouseenter.invalidEmail');
                    field.off('mouseenter.testerExists');
                };
                
                
                // Moves the cursor to specified row
                s.selectRow = function(index) {
                    $('.table-inputs').find('#tester'+index).find('.input-email').focus()
                };
                
                // Inserts a new row of fields at bottom. 
                // Ignored if we're not currently on the final row.
                s.createNewRow = function() {
                    log('directive: createNewRow()')
                    if (el.hasClass('last-empty-item')) {
                        controller.addNewTester();
                    }
                }
                
                // Indexes get outta wack when we remove testers. This re-maps them
                s.fixIndices = function() {
                    var index = 1;
                    _.each( controller.newTesters, function(tester) {
                        tester['index'] = index;
                        index++;
                    })
                }
                
                // Let us create a new row from the controller, if needed
                controller.createNewRow = function() {
                    log('controller: createNewRow()')
                    s.createNewRow();
                }
                
                s.isLastChild = function() {
                    return el.hasClass('last-empty-item');  
                };
                
                
                controller.$watch('userErrors', function(errors) {
                    if(errors) console.error(errors)
                })
                
                //
                // INITIALIZE
                //
                
                $timeout( function() {
                    var fields = $(el).find('input[type="text"]');
                    s.attachFieldListeners( fields );
                }, 0);
            }
        }
    }]);

});

