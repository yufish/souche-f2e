  var downCounter = function(target){
    var container = target;
    var now = new Date();
    var counter = {
      endYear: now.getFullYear(),//container.attr("endYear"),
      endMonth:now.getMonth(),// container.attr("endMonth"),
      endDay:now.getDate(),// container.attr("endDay"),
      endHour:now.getHours()+7, //container.attr("endHour"),
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
        'star-1.png',
        'star-2.png',
        'star-3.png',
        'star-4.png',
        'star-5.png',
        'star-6.png',
        'star-7.png',
        'star-8.png',
        'star-9.png',
        'star-10.png',
        'star-11.png',
        'star-12.png'
      ]

      var imgHref=[
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-53&carPrice=0-100000000&carSeries=series-393&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-135&carPrice=0-100000000&carSeries=series-156&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-10",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-41&carPrice=0-100000000&carSeries=series-946&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-49&carPrice=0-100000000&carSeries=series-339&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-121&carPrice=0-100000000&carSeries=series-341&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-41&carPrice=0-100000000&carSeries=series-596&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-15&carPrice=0-100000000&carSeries=series-2011&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-126&carPrice=0-100000000&carSeries=series-2015&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-146&carPrice=0-100000000&carSeries=series-118&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-108&carPrice=0-100000000&carSeries=series-865&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose",
"http://souche.com/pages/onsale/sale_car_list.html?carBrand=brand-97&carPrice=0-100000000&carSeries=series-382&carModel=&carMileage=0&carYear=0&carPurpose=&sortCreate=&sortName=&sortType=#choose"
      ]

      $('.star .starli').each(function(index,el){
        var self = this 
        $(this).click(function(e){
          $(".star .starli").removeClass("active")
          $(self).addClass("active")
          $('.star-box .detail img').attr('src',basepath+starMap[index]);
          $('.detail a').attr('href',imgHref[index]);
          e.preventDefault();
        })
      })

     
      $('.down-counter').each(function(){
        var $this = $(this);
        downCounter($this);
      });


     
    }
  }
})();

