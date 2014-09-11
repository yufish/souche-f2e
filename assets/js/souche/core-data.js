/**
 * Created by tianqi on 14-9-11.
 */
define(['lib/mustache'],function(Mustache){

    var CoreData = function(struct){
        this.data = $.extend({},struct);
        this.binds = [];
        var self = this;
        $(this).on("change",function(){
            for(var i=0;i<self.binds.length;i++){
                var item = self.binds[i];
                $(item.selector).html(Mustache.render(item.tpl,self.data))
            }
        })
    }
    CoreData.prototype = {
        set:function(key,value) {
            if(this.data[key]!=value){
                this.data[key] = value;
                $(this).trigger("change")
            }
        },
        setAll:function(obj){
            $.extend(this.data,obj)
            $(this).trigger("change")
        },
        get:function(key){
            return this.data[key];
        },
        bindToDOM:function(selector,tpl){
            this.binds.push({
                selector:selector,
                tpl:tpl
            })
        }
    }
    return function(struct){
        var data = new CoreData(struct)
        return data;
    }
})


//var data = CoreData({
//    id:0,
//    time:100,
//    date:new Date()
//})
//
//data.set
//data.get
//data.data
//$(data).on("change",function(){})
//data.bindToDOM("#id",tpl);