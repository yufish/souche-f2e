var regex_placeholder  = /{{(\w+)}}/g,
    regex_check = /.*{{\w+}}.*/;

function d_equals(val1,val2){
    return val1===val2;
}

function getValue(data,key){
    return data[key]
}
function render_template(str,data){
    return str.replace(regex_placeholder,function(match,key){
        var replaceValue = getValue(data,key);
        if(!replaceValue) replaceValue='';
        return replaceValue;
    })
}
var DdObject = function(ele,data){
    this.data = data;
    this.ele = ele;
    this.cacheOriginStrings={};
    this.init();
}
DdObject.prototype={
    init:function(){
        this.cacheOriginStrings = {};
        var ele = this.ele;
        var data =this.data;
        if(ele.nodeType!=1)return
        //update attribute a
        //cache name and original string(with {{key}}) of attribute need render
        var attrOriginStrings = {}
        var attributes = ele.attributes;
        var attr,originAttrValueStr;
        for(var i = 0;i<attributes.length;i++){
            attr = attributes[i];
            originAttrValueStr = attr.value;
            if(regex_check.test(originAttrValueStr)){
                attrOriginStrings[attr.name] = originAttrValueStr;
                attr.value = render_template(originAttrValueStr,data);
            }
        }
        //cache textContent original string if necessary
        this.cacheOriginStrings['attrOriginStrings'] = attrOriginStrings;
        var originText = ele.innerHTML;
        if(regex_check.test(originText)) {
            ele.innerHTML = render_template(originText,data)

            this.cacheOriginStrings['textContentOriginString'] = originText;
        }
    },
    update:function(key,value,equalFunc){
        equalFunc  = equalFunc|| d_equals;
        var data = this.data;
        var oldValue = getValue(data,key);
        if(! equalFunc(oldValue,value) )return;
        //update attributes
        var attrOriginStrings = this.cacheOriginStrings['attrOriginStrings']
        for(var i in attrOriginStrings){
            var attrValue = render_template(attrOriginStrings[i],data)
            this.ele.setAttribute(i,attrValue)
        }
        //update textContent
        var originText = this.cacheOriginStrings['textContentOriginString']
        if(originText){
            this.ele.innerHTML = render_template(originText,data)
        }

    }
}