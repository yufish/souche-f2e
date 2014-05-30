define(function() {
    var downCounter = function(target, fakeTime) {
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
            offMSec: 0
        };
        var showDom = function() {
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

            container.html("<span>剩余时间：&nbsp&nbsp<ins>" + zeroH + counter.offHour + "</ins>&nbsp时&nbsp<ins>" + zeroM + counter.offMin + "</ins>&nbsp分&nbsp<ins>" + zeroS + counter.offSec + "." + counter.offMSec + "</ins>&nbsp秒&nbsp</span>");
        };
        var setInitTime = function() {
            var endDate = new Date(counter.endYear, counter.endMonth, counter.endDay, counter.endHour, 0, 0);
            var serverDate = new Date(counter.serverYear, counter.serverMonth, counter.serverDay, counter.serverHour, counter.serverMin, counter.serverSec);
            if (fakeTime) {
                endDate = fakeTime.endDate;
                serverDate = fakeTime.startDate;
            }
            var offset = Date.parse(endDate) - Date.parse(serverDate);

            if (offset < 0) {
                counter.offMSec = 0;
                counter.offSec = 0;
                counter.offMin = 0;
                counter.offHour = 0;
                showDom();
                return false;
            }
            counter.offHour = Math.floor(offset / (3600 * 1000));
            var leave = offset % (3600 * 1000);
            counter.offMin = Math.floor(leave / (60 * 1000));
            var leave2 = leave % (60 * 1000);
            counter.offSec = Math.floor(leave2 / 1000);
            showDom();
        };
        setInitTime(); //初始化
        var timer = setInterval(function() {
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
        }, 100);
    };

    return downCounter;
});
/*
  var beginCount = function(counters){
    counters.each(function(){
      var $this = $(this);
      downCounter($this);
    });
  };


  <div class="down-counter" start="false" endyear="2014" endmonth="2" endday="5" endhour="22"
          serveryear="2014" servermonth="2" serverday="4" serverhour="11" servermin="13" serversec="3">
  </div>
  */