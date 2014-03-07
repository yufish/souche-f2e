  var downCounter = function(target){
    var container = target;
    var now = new Date();
    var counter = {
      endYear: container.attr("endYear"),
      endMonth: container.attr("endMonth"),
      endDay: container.attr("endDay"),
      endHour: container.attr("endHour"),
      serverYear: now.getFullYear(),//container.attr("serverYear"),
      serverMonth: now.getMonth(),//container.attr("serverMonth"),
      serverDay: now.getDate(),//container.attr("serverDay"),
      serverHour: now.getHours(),//container.attr("serverHour"),
      serverMin: now.getMinutes(),//container.attr("serverMin"),
      serverSec: now.getSeconds(),//container.attr("serverSec"),
      offHour: 0,
      offMin: 0,
      offSec: 0,//
      offMSec: 0
    };
    var showDom = function(){
      var zeroH = "",zeroM = "",zeroS = "";

      if(counter.offHour<10) {
        zeroH = "0";
      }
      if(counter.offMin<10) {
        zeroM = "0";
      }
      if(counter.offSec<10) {
        zeroS = "0";
      }

      container.html("<span>剩余时间：&nbsp&nbsp<ins>" + zeroH + counter.offHour + "</ins>&nbsp时&nbsp<ins>" + zeroM + counter.offMin + "</ins>&nbsp分&nbsp<ins>" + zeroS + counter.offSec + "." + counter.offMSec + "</ins>&nbsp秒&nbsp</span>");
    };
    var setInitTime = function(){
      var endDate = new Date(counter.endYear, counter.endMonth, counter.endDay, counter.endHour, 0, 0);
      var serverDate = new Date(counter.serverYear, counter.serverMonth, counter.serverDay, counter.serverHour, counter.serverMin, counter.serverSec);
      var offset = Date.parse(endDate) - Date.parse(serverDate);

      if(offset < 0){
        counter.offMSec = 0;
        counter.offSec = 0;
        counter.offMin = 0;
        counter.offHour = 0;
        showDom();
        return false;
      }
      counter.offHour = Math.floor(offset/(3600*1000));
      var leave = offset%(3600*1000);
      counter.offMin = Math.floor(leave/(60*1000));
      var leave2 = leave%(60*1000);
      counter.offSec = Math.floor(leave2/1000);
      showDom();
    };
    setInitTime();//初始化
    var timer = setInterval(function(){
      --counter.offMSec;
      if(counter.offMSec < 0){
        counter.offMSec = 9;
        --counter.offSec;
        if(counter.offSec < 0){
          counter.offSec = 59;
          --counter.offMin;
          if(counter.offMin < 0){
            counter.offMin = 59;
            --counter.offHour;
            if(counter.offHour < 0){
              clearInterval(timer);
              counter.offSec = 0;
              counter.offMin = 0;
              counter.offHour = 0;  
            }
          }
        }
      }
      showDom();
    },100);
  };


var Index =(function(){
  return {
    init:function(){
      var basepath = 'http://f2e.souche.com/assets/images/girl/';
      var starMap=[
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png'
      ]

      $('.star .starli').each(function(index,el){
        $(this).click(function(){
          $('.star .detail img').attr('src',basepath+starMap[index]);
        })
      })

     
      $('.down-counter').each(function(){
        var $this = $(this);
        downCounter($this);
      });


    }
  }
})();

