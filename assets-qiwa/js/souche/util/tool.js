define(function(){
    var Tool = {
        getMax: function(){
            var arr = null;
            if( Array.isArray(arguments[0]) ){
                arr = arguments[0];
            }
            else{
                arr = [].slice.call(arguments);
            }
            var max = -Infinity;
            for(var i=0, j=arr.length; i<j; i++){
                if( arr[i] > max ){
                    max = arr[i];
                }
            }
            return max;
        },
        getMin: function(){
            var arr = null;
            if( Array.isArray(arguments[0]) ){
                arr = arguments[0];
            }
            else{
                arr = [].slice.call(arguments);
            }
            var min = Infinity;
            for(var i=0, j=arr.length; i<j; i++){
                if( arr[i] < min ){
                    min = arr[i];
                }
            }
            return min;
        },
        getMaxMin: function(){
            var arr = null;
            if( Array.isArray(arguments[0]) ){
                arr = arguments[0];
            }
            else{
                arr = [].slice.call(arguments);
            }
            var min = Infinity, max = -Infinity;
            for(var i=0, j=arr.length; i<j; i++){
                if( arr[i] < min ){
                    min = arr[i];
                }
                if( arr[i] > max ){
                    max = arr[i];
                }
            }
            return {
                max: max,
                min: min
            };
        },
        parseUrlParam: function(){
            var search = location.search;
            if( !search ){
                return {};
            }
            var paraString = search.substring(1,search.length).split("&");
            var params = {};
            for(var i=0; j=paraString[i]; i++){
                params[j.substring(0,j.indexOf("="))] = j.substring(j.indexOf("=")+1,j.length);
            }
            return params;
        },
        support: {
            // 是否支持transition
            tst: (function(){
                var t;
                var el = document.createElement('fakeelement');
                var transitions = {
                  'transition':'transitionend',
                  'OTransition':'oTransitionEnd',
                  'MozTransition':'transitionend',
                  'WebkitTransition':'webkitTransitionEnd'
                }
                for(t in transitions){
                    if( el.style[t] !== undefined ){
                        return transitions[t];
                    }
                }
                return false;
            })()
        }
    };

    var es5Shim = {
        isArray: function(){
            if( !Array.isArray ){
                Array.isArray = function(obj){
                    return Object.prototype.toString.call(obj) === '[object Array]';
                }
            }
        }
    };

    var pathed = pathed || false;
    if( !pathed ){
         for( var i in es5Shim ){
            if(es5Shim.hasOwnProperty(i)){
                es5Shim[i]();
            }
        }
        pathed = true;
    }
   

    return Tool;
});