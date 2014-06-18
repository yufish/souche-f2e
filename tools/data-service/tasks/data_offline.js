/**
 * 离线处理数据
 * 离线算出来的数据，某个页面每天的点击数，PV，UV,点击click_type数组。
 * 其他的：平均打开时间，平均
 */
require("./../rabbit/BaseInit.js");
var TrafficModel = new BaseModel("TrafficModel", "mongo");
var ClickModel = new BaseModel("ClickModel", "mongo");
var TrafficOfflineModel = new BaseModel("TrafficOfflineModel", "mongo");
var ClickOfflineModel = new BaseModel("ClickOfflineModel", "mongo");
var moment = require("moment");
var task = {
    run: function() {
        console.log("离线处理开始")
        var condition = {};
        condition.time = {
            $gt: moment("2014-6-17 00:00:00").format("YYYY-MM-DD") + " 00:00:00",
            $lt: moment().format("YYYY-MM-DD") + " 23:59:59"
        };
        var self = this;
        // TrafficModel.Model.find(condition, function(error, data) {
        //     console.log(error)
        //     console.log(data)
        // })
        // ClickModel.findAll().where(condition).limit(100000).offset(0).done(function(error, clicks) {
        //     if (error) console.log(error);
        //     console.log(clicks)
        //      self.analyzeClicks(clicks);
        // });
        TrafficModel.findAll().where(condition).fields(['_id', 'url']).done(function(error, traffics) {
            if (error) console.log(error);
            self.analyzeTraffics(traffics);
        });
    },
    analyzeClicks: function(clicks) {
        var pages = {}
        clicks.forEach(function(click) {
            var url = click.page_url;
            var click_type = click.element_id;
            if (pages[url]) {
                if (click_type) {
                    if (pages[url][click_type]) {
                        pages[url][click_type] += 1;
                    } else {
                        pages[url][click_type] = 1;
                    }
                }
            } else {
                pages[url] = {}
            }
        })
        var today = new Date(moment().format("YYYY-MM-DD") + " 00:00:00");
        for (var key in pages) {
            ClickOfflineModel.add({
                url: key, //url地址
                date: today, //日期的时间戳
                data: JSON.stringify(pages[key])
            }).done(function(error) {
                if (error) console.log(error)
            })
        }

    },
    analyzeTraffics: function(traffics) {
        var pages = {};
        var today = new Date(moment().format("YYYY-MM-DD") + " 00:00:00");
        var pv = traffics.length;
        var userTags = {};
        traffics.forEach(function(t) {
            if (!t.userTag) return;
            userTags[t.userTag] = 1;
        })
        var uv = 0;
        for (var i in userTags) {
            uv += 1;
        }
        console.log({
            uv: uv,
            pv: pv
        })
    }
}
task.run();