/**
 * Created by zilong on 9/29/14.
 */
/**
 * Created by zilong on 9/29/14.
 */
var G = {
    d_equals:function(val1,val2){
        return val1===val2
    },
    C_ATTRIBUTE_NODE:'ATTRIBUTE',
    C_TEXT_NODE:'TEXT'
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
function Stack(){
    this.items = [];
}
Stack.prototype = {
    isEmpty :function(){
        return this.items.length==0;
    },
    push:function(item){
        if(isArrayLike(item)){
            for(var i = 0;i<item.length;i++){
                this.items.push(item[i])
            }
        }else{
            this.items.push(item);
        }
    },
    pop:function(){
        return this.items.pop();
    },
    top:function(){
        return this.items[this.items.length-1];
    }
}

var regex_placeholder = /\{\{([\w|\.]+)\}\}/g,
    regex_check = /.*\{\{[\w|\.]+\}\}.*/;

//var d_equals = G.d_equals,

//支持类似 xx.yy.zz的字符处 取值
function getValue(data, key) {
    var ss = key.split('.')
    var tempObj = data[ ss[0] ];
    for (var i = 1; i < ss.length; i++) {
        if (tempObj == undefined) {
            return undefined
        }
        tempObj = tempObj[ss[i]]
    }
    return tempObj;
}
function setValue(data,key,value){
    var ss = key.split('.')
    var tempObj = data;
    for (var i = 0; i < ss.length-1; i++) {
        tempObj = tempObj[ss[i]]
    }
    tempObj[ss[i]]=value;
}

function renderTemplate_init(str, data) {
    var keys = [];
    var render_str =  str.replace(regex_placeholder, function (match, key) {
        if(!(key in keys))keys.push(key);
        var replaceValue = getValue(data, key);
        if (!replaceValue) replaceValue = match;
        return replaceValue;
    })
    return {
        render_str:render_str,
        keys:keys
    }
}
function renderTemplate(str, data) {
    return str.replace(regex_placeholder, function (match, key) {
        var replaceValue = getValue(data, key);
        if (!replaceValue) replaceValue = d_replace;
        return replaceValue;
    })

}

function _init(ele,_data){
    var key2dom={}
    function buildKDMap(node,origin,type){
        if(regex_check.test(origin)){
            var valueProp = 'nodeValue'
            if(type== G.C_ATTRIBUTE_NODE){
                valueProp = 'value';
            }
            var render_obj = renderTemplate_init(origin,_data);
            var keys = render_obj.keys;
            node[valueProp]=render_obj.render_str;
            for(var i = 0;i<keys.length;i++){
                var key = keys[i]
                key2dom[key] = key2dom[key]||[];
                key2dom[key].push({node:node,origin:origin,type:type})
            }
        }
    }
    var stack = new Stack();
    stack.push(ele.childNodes);
    stack.push(ele.attributes);
    while(!stack.isEmpty()){
        var node = stack.pop();
        switch (node.nodeType) {
            case 2:
                buildKDMap(node,node.value, G.C_ATTRIBUTE_NODE);
                break;
            case 3:
                buildKDMap(node,node.nodeValue,G.C_TEXT_NODE);
                break;
            case 1:
                stack.push(node.childNodes);
                stack.push(node.attributes);
                break;
        }
    }
    return key2dom;
}

var DdObject = function (ele, _data) {
    return {
        _key2dom :_init(ele,data),
        init:function(){
            this._key2dom = _init(ele,data)
        },
        _updateDom:function(objArr){
            for(var i =0;i<objArr.length;i++){
                var nodeObj = objArr[i];
                var node = nodeObj.node;
                var origin =nodeObj.origin;
                if(nodeObj.type== G.C_ATTRIBUTE_NODE){
                    node.value =renderTemplate(origin,_data);
                }else{
                    node.nodeValue = renderTemplate(origin,_data);
                }

            }

        },
        update:function(key,value){
            setValue(data,key,value);
            for(var i in this._key2dom){
                if(key!=i){
                    continue;
                }
                var objArr = this._key2dom[i]
                this._updateDom(objArr);
            }
        }
    }
}
