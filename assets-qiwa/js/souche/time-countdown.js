define(['souche/core-data'],function(CoreData) {

    var CountDown = function(selector,tpl){
        var data = this.data = CoreData({
            day:0,
            hour:0,
            minute:0,
            second:0,
            totalHour:0
        })
        if(!tpl)
        var tpl = "<span><ins>{{day}}</ins>&nbsp;<em>天</em>&nbsp;<ins>{{hour}}</ins>&nbsp;<em>时</em>&nbsp;<ins>{{minute}}</ins>&nbsp;<em>分</em>&nbsp;<ins>{{second}}</ins>&nbsp;<em>秒</em></span>"
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
                second:Math.floor(offset % (3600 * 1000)% (60 * 1000)/1000),
                totalHour:Math.floor(offset / (3600 * 1000))
            })
        }
    }
    return {
        init:function(selector,tpl){
           var down = new CountDown(selector,tpl);
           down.init()
        }

    }
});