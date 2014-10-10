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

    var regex_placeholder = /\{\{([\w|\.]+)\}\}/g;
        //regex_check = /.*\{\{[\w|\.]+\}\}.*/;
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
    function setValueSafe(data,key,value){
        var ss = key.split('.')
        var tempObj = data;
        for (var i = 0; i < ss.length-1; i++) {
            tempObj = tempObj[ss[i]] = tempObj[ss[i]]||{}
        }
        tempObj[ss[i]]=value;
    }
    function renderTemplate(str, data) {
        return str.replace(regex_placeholder, function (match, key) {
            var replaceValue = getValue(data, key);
            if (!replaceValue) replaceValue = match;
            return replaceValue;
        })

    }
    function DdRepeat(ele,dataArr){
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
    function doIfDirective(ele,data){
        var expr = ele.getAttribute('z-if');
        ele.removeAttribute('z-if');
        var cond = getValue(data,expr);
        if(!cond){
            ele.parentNode.removeChild(ele);
        }
        return cond;
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
        var data = this.$$data;
        var stack = new Stack();
        stack.push(ele)
        while(!stack.isEmpty()){
            var node = stack.pop();
            switch (node.nodeType) {
                case 2:
                    node.value = renderTemplate(node.value,data)
                    break;
                case 3:
                    node.nodeValue = renderTemplate(node.nodeValue,data)
                    break;
                case 1:
                    if(node.hasAttribute('z-repeat')){
                        var key =  node.getAttribute('z-repeat');
                        node.removeAttribute('z-repeat')
                        setValueSafe(this,key,doRepeatDirective(node,key))
                        break;
                    }
                    if(node.hasAttribute('z-if')){
                        if(!doIfDirective(node,data)){
                            break;
                        }
                    }
                    stack.push(node.childNodes);
                    stack.push(node.attributes);
                    break;
            }
        }
    }
    var DdObject = function (ele, data) {
        this.$$ele = ele;
        this.$$data = data;
        this.$$DdObjArr=[];
        initDom.call(this);
    }
    exports.OneWay = DdObject;
}(window,undefined)