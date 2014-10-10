!function(exports) {


    var G = {
        C_ATTRIBUTE_NODE: 'ATTRIBUTE',
        C_TEXT_NODE: 'TEXT',
        C_ELEMENT_IF: 'ELEMENT_IF'
    }
//from JavasSript 权威指南

    var isArrayLike = function (o) {
        if (o &&                                // o is not null, undefined, etc.
            typeof o === "object" &&            // o is an object
            isFinite(o.length) &&               // o.length is a finite number
            o.length >= 0 &&                    // o.length is non-negative
            o.length === Math.floor(o.length) &&  // o.length is an integer
            o.length < 4294967296)              // o.length < 2^32
            return true;                        // Then o is array-like
        else
            return false;                       // Otherwise it is not
    }
//default:overwrite
    var toString = Object.prototype.toString;
    var isArray = function (arr) {
        return toString.call(arr) === "[object Array]";
    }

    function Stack() {
        this.items = [];
    }

    Stack.prototype = {
        isEmpty: function () {
            return this.items.length == 0;
        },
        push: function (item) {
            if (isArrayLike(item)) {
                for (var i = 0; i < item.length; i++) {
                    this.items.push(item[i])
                }
            } else {
                this.items.push(item);
            }
        },
        pop: function () {
            return this.items.pop();
        },
        top: function () {
            return this.items[this.items.length - 1];
        }
    }

    var regex_placeholder = /\{\{([\w|\.]+)\}\}/g,
        regex_check = /.*\{\{[\w|\.]+\}\}.*/;
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
    function setValueSafe(data,key,value){
        var ss = key.split('.')
        var tempObj = data;
        for (var i = 0; i < ss.length-1; i++) {
            tempObj = tempObj[ss[i]] = tempObj[ss[i]]||{}
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
            if (!replaceValue) replaceValue = match;
            return replaceValue;
        })

    }
    function buildKNMap(node,origin,type,data,key2node){
        if(regex_check.test(origin)){
            var valueProp = 'nodeValue'
            if(type== G.C_ATTRIBUTE_NODE){
                valueProp = 'value';
            }
            var render_obj = renderTemplate_init(origin,data);
            var keys = render_obj.keys;
            node[valueProp]=render_obj.render_str;
            for(var i = 0;i<keys.length;i++){
                var key = keys[i]
                key2node[key] = key2node[key]||[];
                key2node[key].push({node:node,origin:origin,type:type})
            }
            return;
        }
    }

    function DdRepeat(ele,dataArr,options){
        this.$$parentNode = ele.parentNode;
        this.$$ele = ele;
        var fragment = document.createDocumentFragment();
        this.$$parentNode.removeChild(ele)
        var cloneNode;
        this.$$DdObjArr = [];
        //this.dataArr = dataArr;
        for(var i=0;i<dataArr.length;i++){
            cloneNode = ele.cloneNode(true);
            this.$$DdObjArr.push(new DdObject(cloneNode,dataArr[i]))
            fragment.appendChild(cloneNode);
        }
        this.$$parentNode.appendChild(fragment)
    }

    DdRepeat.prototype={
        //[DdObject]:{data,}]
        $insertBefore:function(index,item){
            var cloneNode = this.$$ele.cloneNode(true);
            var refNode = this.$$DdObjArr[index].$$ele;
            this.$$DdObjArr.splice(index,0,new DdObject(cloneNode,item));
            this.$$parentNode.insertBefore(cloneNode,refNode)
        },
        $push:function(item){
            //this.dataArr.push(item);
            var cloneNode = this.$$ele.cloneNode(true);
            this.$$DdObjArr.push(new DdObject(cloneNode,item));
            this.$$parentNode.appendChild(cloneNode);
        },
        $set:function(index,key,value){
            var setItem = this.$$DdObjArr[index];
            setItem.update(key,value);
            return {
                ele:setItem.$$ele,
                data:setItem.$$data
            };
        },
        //default del only one,
        __filterAction:function(filter,key,value,all,action) {
            var items = this.$$DdObjArr;
            var resultItems = [];
            if (typeof filter == 'function') {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i]
                    if (filter(item.$$ele, item.$$data)) {
                        var rItem = action.call(this, i, key, value);
                        resultItems.push(rItem)
                        if (!all)return rItem;
                    }
                }
            } else {
                //filter is HtmlElement
                for (var i = 0; i < items.length; i++) {
                    if (filter == items[i].$$ele) {
                        var rItem = action.call(this, i, key, value);
                        resultItems.push(rItem)
                        if (!all)return rItem;
                    }
                }
            }
            return resultItems
        },
        $setByFilter:function(filter,key,value,all){
            this.__filterAction(filter,key,value,all,this.$set)
        },
        $del:function(index){
            var delItem = this.$$DdObjArr[index]
            var el =  delItem.$$ele;
            this.$$DdObjArr.splice(index,1);
            this.$$parentNode.removeChild(el)
            return {
                ele:el,
                data:delItem.$$data
            }
        },
        $delByFilter:function(filter,all){
            var key ,value;
            this.__filterAction(filter,key,value,all,this.$del)
        }
    }
    function doIfDirective(ele,data,key2node){
        var expr = ele.getAttribute('z-if');
        ele.removeAttribute('z-if');
        var cond = getValue(data,expr);
        var key = expr;
        key2node[key] = key2node[key]||[];
        var comment = document.createComment('z-if comment for if-expression is false');

        key2node[key].push({node:ele,comment:comment,type: G.C_ELEMENT_IF,expr:expr,oldCond:cond,parent:ele.parentNode})
        if(!cond){
            ele.parentNode.replaceChild(comment,ele);
        }
    }
    function doRepeatDirective(ele,key){
        var dataArr =  getValue(data,key)
        if(!isArray(dataArr)){
            console.error(key+' in z-repeat should be array')
            return undefined;
        }
        return new DdRepeat(ele,dataArr);
    }
    function initDom(){
        var ele = this.$$ele;
        var data = this.$$data,
            key2node=this.$$key2node;
        var stack = new Stack();
        stack.push(ele)
        while(!stack.isEmpty()){
            var node = stack.pop();
            switch (node.nodeType) {
                case 2:
                    buildKNMap(node,node.value, G.C_ATTRIBUTE_NODE,data,key2node);
                    break;
                case 3:
                    buildKNMap(node,node.nodeValue,G.C_TEXT_NODE,data,key2node);
                    break;
                case 1:
                    if(node.hasAttribute('z-repeat')){
                        var key =  node.getAttribute('z-repeat');
                        node.removeAttribute('z-repeat')
//                    var path = key.split('.');
//                    var temp=this;
//                    for(var i = 0;i<path.length-1;i++){
//                        temp = this[path[i]] =  this[path[i]] ||{};
//                    }
//                    temp[path[i]] = doRepeatDirective(node,key);
                        setValueSafe(this,key,doRepeatDirective(node,key))
                        break;
                    }
                    if(node.hasAttribute('z-if')){
                        doIfDirective(node,data,key2node);
                    }
                    stack.push(node.childNodes);
                    stack.push(node.attributes);
                    break;
            }
        }
    }

    var updateDom=function(nodeArr,data){
        for(var i =0;i<nodeArr.length;i++){
            var nodeObj = nodeArr[i];
            var node = nodeObj.node;
            var origin =nodeObj.origin;
            switch (nodeObj.type) {
                case G.C_ATTRIBUTE_NODE:
                    node.value =renderTemplate(origin,data);
                    break;
                case G.C_TEXT_NODE:
                    node.nodeValue = renderTemplate(origin,data);
                    break;
                case G.C_ELEMENT_IF:
                    var parentNode = nodeObj.parent;
                    var newCond = getValue(data,nodeObj.expr)
                    if(newCond){
                        if(!nodeObj.oldCond) {
                            parentNode.replaceChild(node,nodeObj.comment);
                        }
                    }else{
                        if(nodeObj.oldCond){
                            parentNode.replaceChild(nodeObj.comment,node);
                        }
                    }
                    nodeObj.oldCond = newCond;
                    break;
            }
        }
    }

    function buildPath(data,paths,prefix){
        prefix = prefix ||'';
        if(prefix!='') {
            prefix = prefix + '.';
        }
        paths = paths||[];
        for(var i in data){
            if(typeof data[i] == 'object'){
                buildPath(data[i],paths,prefix+i);
            }
            else{
                paths.push(prefix+i)
            }
        }
        return paths;
    }
    var DdObject = function (ele, data,options) {
        this.$$key2node ={}
        this.$$ele = ele;
        this.$$data = data;
        this.$$DdObjArr=[];
        initDom.call(this);
    }
    DdObject.prototype = {
        update: function (key, value) {
            var data = this.$$data,
                key2node = this.$$key2node;
            if (value == undefined) {
                for (var i in key) {
                    //no need to clone deep
                    data[i] = key[i];
                }
                var paths = buildPath(key);
                for (var i = 0; i < paths.length; i++) {
                    var path = paths[i];
                    if (path in key2node) {
                        updateDom(key2node[path], data);
                    }
                }
            } else {
                setValue(this.$$data, key, value);
                if (key in key2node) {
                    updateDom(key2node[key], data);
                }
            }
        }
    }
    exports.OneWay = DdObject;
}(window,undefined)