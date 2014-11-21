/**
 * Created by Administrator on 2014/6/19.
 */
define(function() {
    var downCounter = {};
    var config = {};

    var container = target;
    var counter = {
        endYear: container.attr("endYear"),
        endMonth: container.attr("endMonth"),
        endDay: container.attr("endDay"),
        endHour: container.attr("endHour"),
        serverYear: container.attr("serverYear"),
        serverMonth: container.attr("serverMonth"),
        serverDay: container.attr("serverDay"),
        serverHour: container.attr("serverHour"),
        serverMin: container.attr("serverMin"),
        serverSec: container.attr("serverSec"),
        offHour: 0,
        offMin: 0,
        offSec: 0,
        offMSec: 1,
        offset: 0
    }
    var showDom = function () {
        var zeroH = "",
            zeroM = "",
            zeroS = "";

        if (counter.offHour < 10) {
            zeroH = "0";
        }
        if (counter.offMin < 10) {
            zeroM = "0";
        }
        if (counter.offSec < 10) {
            zeroS = "0";
        }

        container.html("<ins>" + zeroH + counter.offHour + "</ins>时<ins>" + zeroM + counter.offMin + "</ins>分<ins>" + zeroS + counter.offSec + "</ins>" + "." + "<ins class='offMSec'>" + counter.offMSec + "</ins>秒");
    }

    var setInitTime = function () {
        var endDate = new Date(counter.endYear, counter.endMonth, counter.endDay, counter.endHour, 0, 0);
        var serverDate = new Date(counter.serverYear, counter.serverMonth, counter.serverDay, counter.serverHour, counter.serverMin, counter.serverSec);
        counter.offset = Date.parse(endDate) - Date.parse(serverDate);

        if (counter.offset < 0) {
            counter.offMSec = 0;
            counter.offSec = 0;
            counter.offMin = 0;
            counter.offHour = 0;
            showDom();
            console.info(counter.offMSec);
            return false;
        }
        counter.offHour = Math.floor(counter.offset / (3600 * 1000));
        var leave = counter.offset % (3600 * 1000);
        counter.offMin = Math.floor(leave / (60 * 1000));
        var leave2 = leave % (60 * 1000);
        counter.offSec = Math.floor(leave2 / 1000);
        showDom();
    }
    setInitTime(); //初始化

    var init = function (_config) {
        $.extend(config, _config);

        setInitTime(); //初始化
        if (counter.offset > 0) {
            var timer = setInterval(function () {
                --counter.offMSec;
                if (counter.offMSec < 0) {
                    counter.offMSec = 9;
                    --counter.offSec;
                    if (counter.offSec < 0) {
                        counter.offSec = 59;
                        --counter.offMin;
                        if (counter.offMin < 0) {
                            counter.offMin = 59;
                            --counter.offHour;
                            if (counter.offHour < 0) {
                                clearInterval(timer);
                                counter.offSec = 0;
                                counter.offMin = 0;
                                counter.offHour = 0;
                            }
                        }
                    }
                }
                showDom();
            }, 100)
        }
    }

    downCounter.init = init;

    return downCounter;
});