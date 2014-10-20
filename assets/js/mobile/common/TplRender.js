!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.TplRender=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
    var utils = _dereq_('./utils');
    var Stack =_dereq_('./stack')
    var regex_placeholder = /\{\{([\w|\.]+)\}\}/g;
    var regex_expr=/\{%(.*)+%\}/;
    function renderTemplate(str, data) {
        return str.replace(regex_placeholder, function (match, key) {
            var replaceValue = utils.getValue(data, key);
            if (!replaceValue) replaceValue = match;
            return replaceValue;
        })
    }
    function evalCond(str,data){
        var expr = '';
        for(var i = 0;i<str.length;){
            var ch = str.charAt(i)
            if(ch=="'"){
                expr+=ch;
                i++;
                while(str.charAt(i)!="'"){
                    if(i>=str.length){
                        throw new Error('表达式解析错误,"不匹配')
                    }
                    expr+=str.charAt(i);
                    i++;
                    continue;
                }
                expr+="'";
            }else if(ch=='_' || isAlpha(ch)){
                var variable = ch;
                i++;
                while(isWord(str.charAt(i)) && i<str.length){
                    variable+=str.charAt(i);
                    i++;
                }
                //console.log(variable)
                var realValue  = utils.getValue(data,variable);
                expr+=realValue
                //expr+=variable+str.charAt(i);
            }else{
                expr +=ch;
                i++;
            }
        }
        //console.log(expr);
        var f = new Function('return'+ expr);
        return f();
    }
    function isAlpha(ch){
        return ch>='A' && ch<='z';
    }
    function isNum(ch){
        return ch>='0' && ch<='9'
    }
    function isWord(ch){
        return isAlpha(ch)
            || ch=='_'
            ||isNum(ch)
            ||ch=='.';
    }
    function doIfDirective(ele,data){
        var expr = ele.getAttribute('z-if');
        ele.removeAttribute('z-if');
        var cond = utils.getValue(data,expr);
        if(!cond){
            ele.parentNode.removeChild(ele);
        }
        return cond;
    }
    function doRepeatDirective(data,ele,key){
        var dataArr =  utils.getValue(data,key)
        if(!utils.isArray(dataArr)){
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
//                    var locValue =  node.value;
//                    if(regex_expr.test(locValue)){
//                        var locExpr = locValue.replace('{%','').replace('%}','')
//                        node.value= evalCond(locExpr,data);
//                        break
//                    }
                    node.value = renderTemplate(node.value,data)
                    break;
//                case 3:
//                    var locValue = node.nodeValue;
//                    if(regex_expr.test(locValue)){
//                        var locExpr = locValue.replace('{%','').replace('%}','')
//                        node.nodeValue= evalCond(locExpr,data);
//                        break
//                    }
                    node.nodeValue = renderTemplate(node.nodeValue,data)
                    break;
                case 1:
                    if(node.hasAttribute('z-repeat')){
                        var key =  node.getAttribute('z-repeat');
                        node.removeAttribute('z-repeat')
                        utils.setValueSafe(this,key,doRepeatDirective(data,node,key))
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
        initDom.call(this);
    }
    function DdRepeat(ele,dataArr){
        this.$$parentNode = ele.parentNode;
        this.$$ele = ele;
        var fragment = document.createDocumentFragment();
        this.$$parentNode.removeChild(ele)
        var cloneNode;
        this.$$DdObjArr = [];
        this.dataArr = dataArr;
        for(var i=0;i<dataArr.length;i++){
            cloneNode = ele.cloneNode(true);
            this.$$DdObjArr.push(new DdObject(cloneNode,dataArr[i]))
            fragment.appendChild(cloneNode);
        }
        this.$$parentNode.appendChild(fragment)
    }

    DdRepeat.prototype={
        $insertBefore:function(index,item){
            var cloneNode = this.$$ele.cloneNode(true);
            var refNode = this.$$DdObjArr[index].$$ele;
            this.dataArr.splice(index,0,item)
            this.$$DdObjArr.splice(index,0,new DdObject(cloneNode,item));
            this.$$parentNode.insertBefore(cloneNode,refNode)
        },
        $push:function(item){
            //this.dataArr.push(item);
            var cloneNode = this.$$ele.cloneNode(true);
            this.$$DdObjArr.push(new DdObject(cloneNode,item));
            this.dataArr.push(item);
            this.$$parentNode.appendChild(cloneNode);
        },
        $remove:function(index){
            var removeItem = this.$$DdObjArr[index]
            var el =  removeItem.$$ele;
            this.dataArr.splice(index,1)
            this.$$DdObjArr.splice(index,1);
            this.$$parentNode.removeChild(el)
            return {
                ele:el,
                data:removeItem.$$data
            }
        },
        $removeByFilter:function(filter,all){
            var items = this.$$DdObjArr;
            var resultItems = [];
            if (typeof filter == 'function') {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i]
                    if (filter(item.$$ele, item.$$data)) {
                        var rItem = this.$remove.call(this, i, key, value);
                        resultItems.push(rItem)
                        if (!all)return rItem;
                    }
                }
            } else {
                //filter is HtmlElement
                for (var i = 0; i < items.length; i++) {
                    if (filter == items[i].$$ele) {
                        var rItem = this.$remove.call(this, i, key, value);
                        resultItems.push(rItem)
                        if (!all)return rItem;
                    }
                }
            }
            return resultItems
        }
    }
    module.exports = function(ele,data){
        return new DdObject(ele,data);
    }


},{"./stack":2,"./utils":3}],2:[function(_dereq_,module,exports){
    var isArrayLike = _dereq_('./utils').isArrayLike
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
        }
    }

    module.exports = Stack;
},{"./utils":3}],3:[function(_dereq_,module,exports){
    var toString = Object.prototype.toString;
    var isArray = function (arr) {
        return toString.call(arr) === "[object Array]";
    }
    var isArrayLike = function (o) {
        return isArray(o)|| (typeof o =='object'&& typeof o.length =='number')
    }
    /**
     get value from `data` by full key path(like key='a.b.c')
     */
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
    /*
     set value to `data` by key path,
     set the value in path to {} if necessary
     */
    function setValueSafe(data,key,value){
        var ss = key.split('.')
        var tempObj = data;
        for (var i = 0; i < ss.length-1; i++) {
            tempObj = tempObj[ss[i]] = tempObj[ss[i]]||{}
        }
        tempObj[ss[i]]=value;
    }
    module.exports = {
        isArray:isArray,
        isArrayLike:isArrayLike,
        getValue:getValue,
        setValueSafe:setValueSafe
    }
},{}]},{},[1])
(1)
});