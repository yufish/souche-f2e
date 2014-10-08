/**
 * Created by zilong on 9/29/14.
 */
var G = {
    d_equals:function(val1,val2){
        return val1===val2
    },
    C_ATTRIBUTE_NODE:'ATTRIBUTE',
    C_TEXT_NODE:'TEXT',
    C_ELEMENT_IF:'ELEMENT_IF'
}
//from JavasSript 权威指南
var isArrayLike =function(o){
    if (o &&                                // o is not null, undefined, etc.
        typeof o === "object" &&            // o is an object
        isFinite(o.length) &&               // o.length is a finite number
        o.length >= 0 &&                    // o.length is non-negative
        o.length===Math.floor(o.length) &&  // o.length is an integer
        o.length < 4294967296)              // o.length < 2^32
        return true;                        // Then o is array-like
    else
        return false;                       // Otherwise it is not
}
//default:overwrite
var toString = Object.prototype.toString;
var isArray = function(arr){
    return toString.call(arr) === "[object Array]";
}
var mixin = function(target,source,notOverwrite){
    if(notOverwrite){
        for(var i in source){
            if(!(i in target)){
                target[i] = source[i]
            }
        }
    }else{
        for(var i in source){
            target[i] = source[i]
        }
    }
    return target
}