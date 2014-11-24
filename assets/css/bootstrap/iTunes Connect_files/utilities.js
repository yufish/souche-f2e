/************************************************************************************************************************/
/***************************************************** utilities.js *****************************************************/
/************************************************************************************************************************/

// Global helper functions that aren't contained in Angular
(function() {
    
    // Shorthand for logging data to console (on non-production hosts only)    
    window.log = (!/itunesconnect.apple.com/i.test(location.host)) ? 
        console.log.bind(console) :
        function(x) { return false; }
        
    // Green log messages
    window.glog = function(msg) { log('%c' + msg, 'color: green'); }

    String.prototype.commafy = function () {
        return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
            return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
        });
    };
    
    Number.prototype.commafy = function () {
        return String(this).commafy();
    };
    
    //  Utility for safely retrieving deeply-nested items.
    //  Avoids those pesky "Cannot read property X of undefined" errors...
    //  Returns the nested item (if found), otherwise returns undefined
    //
    //  Usage:
    //      deep( objectName, 'prop1', 'prop2', 'prop3' )
    //  OR
    //      deep( objectName, 'prop1.prop2.prop3' )
    //
    window.deep = function(obj) {
        
        if (!obj) {
            return undefined;
        }
        
        // Fetch our list of arguments
        var args = Array.prototype.slice.call(arguments),
            obj = args.shift();
        
        // If no arguments supplied, return the parent object
        if (args.length < 1) {
            return obj;
        }
        
        // If arguments are supplied as a single, period-delimited string -- split them into an array
        if (args.length === 1) {
            args = args[0].split('.');
        }
            
        var len = args.length, i = 0;
        
        // Work our way down the object tree -- exiting safely if any node is undefined
        for (; i < len; i++) {
            
            // Exit if the next child doesn't exist
            if (!obj || !obj.hasOwnProperty(args[i])) return undefined;
            
            // Set `obj` to be the current child
            obj = obj[args[i]];
            
            // If we're on the last value, return it
            if (i === len - 1) return obj;
        }
    };
    
    // Generate unique string ID (for DOM elements, directives and such)
    if (_ !== undefined && _.guid === undefined) {
        _.mixin({
            guid : function(){
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }
        });
    };
    
    // Douglas Crockford's interpolate function
    // Usage: 
    //  "Build {num}".supplant({ num: 103 }) --> "Build 103"
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
    
})();

