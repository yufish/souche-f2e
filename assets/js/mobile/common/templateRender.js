!function(exports) {
    var regex_placeholder = /\{\{([\w|\.]+)\}\}/g,
        regex_check = /.*\{\{[\w|\.]+\}\}.*/;

    function d_equals(val1, val2) {
        return val1 === val2;
    }
    //支持类似 xx.yy.zz的字符处 取值
    function getValue(data, str) {
        var ss = str.split('.')
        var tempObj = data[ ss[0] ];
        for (var i = 1; i < ss.length; i++) {
            if (tempObj == undefined) {
                //error
                return undefined
            }
            tempObj = tempObj[ss[i]]
        }
        return tempObj;
    }

//function getValue(data,key){
//    return data[key]
//}
    var replaceDefault = ''

    function render_template(str, data) {
        return str.replace(regex_placeholder, function (match, key) {
            var replaceValue = getValue(data, key);
            if (!replaceValue) replaceValue = replaceDefault;
            return replaceValue;
        })
    }

    var DdObject = function (ele, data) {
        this.data = data;
        this.ele = ele;
        this.cacheOriginStrings = {};
        this.init();
    }
    DdObject.prototype = {
        init: function () {
            this.cacheOriginStrings = {};
            var ele = this.ele;
            var data = this.data;
            if (ele.nodeType != 1)return
            //update attribute a
            //cache name and original string(with {{key}}) of attribute need render
            var attrOriginStrings = {}
            var attributes = ele.attributes;
            var attr, originAttrValueStr;
            for (var i = 0; i < attributes.length; i++) {
                attr = attributes[i];
                originAttrValueStr = attr.value;
                if (regex_check.test(originAttrValueStr)) {
                    attrOriginStrings[attr.name] = originAttrValueStr;
                    attr.value = render_template(originAttrValueStr, data);
                }
            }
            //cache textContent original string if necessary
            this.cacheOriginStrings['attrOriginStrings'] = attrOriginStrings;
            var originText = ele.innerHTML;
            if (regex_check.test(originText)) {
                ele.innerHTML = render_template(originText, data)

                this.cacheOriginStrings['textContentOriginString'] = originText;
            }
        },
        update: function (key, value, equalFunc) {
            equalFunc = equalFunc || d_equals;
            var data = this.data;
            var oldValue = getValue(data, key);
            if (!equalFunc(oldValue, value))return;
            //update attributes
            var attrOriginStrings = this.cacheOriginStrings['attrOriginStrings']
            for (var i in attrOriginStrings) {
                var attrValue = render_template(attrOriginStrings[i], data)
                this.ele.setAttribute(i, attrValue)
            }
            //update textContent
            var originText = this.cacheOriginStrings['textContentOriginString']
            if (originText) {
                this.ele.innerHTML = render_template(originText, data)
            }

        }
    }


    function defaultFilter(obj1,obj2){
        return obj1 === obj2;
    }
    function DdArray(ele,dataArr){
        this.dataArr = dataArr;
        this.ele = ele;
        this.init();
    }
    DdArray.prototype = {
        init:function(){
            var ele = this.ele,
                dataArr = this.dataArr;
            var origin_innerHTML = ele.innerHTML;
            this.cache_innerHTML = origin_innerHTML;
            var replace_innerHTML='';
            for(var i = 0;i<dataArr.length;i++){
                replace_innerHTML +=render_template(origin_innerHTML,dataArr[i]);
            }
            ele.innerHTML = replace_innerHTML;
        },
        $push:function(obj){
            this.dataArr.push(obj)
            var new_innerHTML = render_template(this.cache_innerHTML,obj);
            this.ele.insertAdjacentHTML('beforeend', new_innerHTML);
        },
        $del:function(filter){

        },
        $set:function(){

        }
    }
    exports.DdObject = DdObject;
    exports.DdArray = DdArray
}(window,undefined)