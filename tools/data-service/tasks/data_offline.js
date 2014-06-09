/**
 * 离线处理数据
 * 离线算出来的数据，某个页面每天的点击数，PV，UV,点击click_type数组。
 * 其他的：平均打开时间，平均
 */
require("./../rabbit/BaseInit.js");
var TrafficModel = new BaseModel("TrafficModel", "mongo");
var ClickModel = new BaseModel("ClickModel", "mongo");
var moment = require("moment");
var task = {
    run: function() {
        console.log("离线处理开始")
        var condition = {};
        condition.time = {
            $gt: moment().format("YYYY-MM-DD") + " 00:00:00",
            $lt: moment().format("YYYY-MM-DD") + " 23:59:59"
        };
        ClickModel.findAll().offset(0).limit(10).where(condition).fields(['page_x', 'page_y', 'element_id']).done(function(error, clicks) {
            if (error) console.log(error);
            console.log(clicks)

        });
    }
}

module.exports = task

task.run()