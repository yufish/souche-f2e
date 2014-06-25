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
var allTraffics = [];
var getTrafficModel = function(condition, offset, callback) {
    TrafficModel.findAll().where(condition).limit(9999).offset(offset).fields(['_id', 'url', 'userTag']).done(function(error, traffics) {
        if (error) {
            console.log(error);
            callback(error);
            return;
        }
        if (traffics.length != 0) {
            allTraffics = allTraffics.concat(traffics);
            getTrafficModel(condition, offset + 9999, callback);
        } else {

            callback(null, allTraffics);
        }
    });
}
var allClicks = [];
var getClickModel = function(condition, offset, callback) {
    ClickModel.findAll().where(condition).limit(9999).offset(offset).fields(['_id', 'page_url', 'element_id']).done(function(error, clicks) {
        if (error) {
            console.log(error);
            callback(error);
            return;
        }
        console.log("clicks.length:" + clicks.length)
        if (clicks.length != 0) {
            allClicks = allClicks.concat(clicks);
            getClickModel(condition, offset + 9999, callback);
        } else {

            callback(null, allClicks);
        }
    });
}
var task = {
    run: function(day) {
        console.log("离线处理开始")
        var condition = {};
        condition.time = {
            $gt: moment().format("YYYY-MM-DD") + " 00:00:00",
            $lt: moment().format("YYYY-MM-DD") + " 23:59:59"
        };
        if (day) {
            condition.time = {
                $gt: day + " 00:00:00",
                $lt: day + " 23:59:59"
            };
        }
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
        // allTraffics = [];
        // getTrafficModel(condition, 0, function(error, data) {
        //     if (error) console.log(error)
        //     console.log(data.length)
        //     self.analyzeTraffics(data, day);
        // })
        allClicks = [];
        getClickModel(condition, 0, function(error, data) {
            if (error) console.log(error)
            console.log(data.length)
            self.analyzeClicks(data, day);

        })
    },

    analyzeClicks: function(clicks, day) {
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
        if (day) {
            today = new Date(day + " 00:00:00")
        }
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
    analyzeTraffics: function(traffics, day) {
        var pages = {};
        var today = new Date(moment().format("YYYY-MM-DD") + " 00:00:00");
        if (day) {
            today = new Date(day + " 00:00:00")
        }
        var pv = traffics.length;
        var pages = {};
        traffics.forEach(function(t) {
            var url = t.url;

            if (!t.userTag) t.userTag = "undefined";

            if (pages[url]) {
                pages[url].userTags[t.userTag] = 1;
                pages[url].pv += 1;
            } else {
                pages[url] = {
                    userTags: {},
                    pv: 1
                }
                pages[url].userTags[t.userTag] = 1;
            }

        })
        for (var i in pages) {
            var uv = 0;
            for (var n in pages[i].userTags) {
                uv += 1;
            }
            pages[i].uv = uv;
            pages[i].userTags = null;

            TrafficOfflineModel.add({
                data: JSON.stringify(pages[i]),
                url: i,
                date: today
            }).done(function(error) {
                if (error) {
                    console.log(error)
                }
            })
        }


    },
    drawMap: function(clicks) {

    }
}

task.run();