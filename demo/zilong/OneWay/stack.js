/**
 * Created by zilong on 9/29/14.
 */
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

//exports.Stack=Stack;