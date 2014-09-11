define(['souche/core-data'],function(CoreData) {

    var CountDown = function(selector){
        var data = this.data = CoreData({
            day:0,
            hour:0,
            minute:0,
            second:0
        })
        var tpl = "<span>剩余：<ins>{{day}}</ins>&nbsp;天&nbsp;<ins>{{hour}}</ins>&nbsp;时&nbsp;<ins>{{minute}}</ins>&nbsp;分&nbsp;<ins>{{second}}</ins>&nbsp;秒</span>"
        data.bindToDOM(selector,tpl)
        var counter = this.counter = {
            endYear: $(selector).attr("endYear"),
            endMonth: $(selector).attr("endMonth"),
            endDay: $(selector).attr("endDay"),
            endHour: $(selector).attr("endHour")
        }
        this.endDate = new Date(counter.endYear, counter.endMonth, counter.endDay, counter.endHour, 0, 0);
    }
    CountDown.prototype = {
        init:function(){
            var self = this;
            setInterval(function(){
                self.check();
            },100)
        },
        check:function(){
            var offset = this.endDate.getTime() - (new Date().getTime());
            if(offset<0) offset = 0;
            this.data.setAll({
                day:Math.floor(offset / 24 / (3600 * 1000)),
                hour:Math.floor(offset / (3600 * 1000) % 24),
                minute:Math.floor(offset % (3600 * 1000) / (60 * 1000)),
                second:Math.floor(offset % (3600 * 1000)% (60 * 1000)/1000)
            })
        }
    }
    return {
        init:function(selector){
           var down = new CountDown(selector);
           down.init()
        }

    }
});