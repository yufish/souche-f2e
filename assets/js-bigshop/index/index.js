define(['index/car-god',
    'index/top-nav',
    "index/qiugou",
    'souche/custom-select',
    "index/collect",
    "lib/lazyload",
    "index/carConstrast",
    "index/record-tip",
    "souche/util/image-resize",
    "souche/time-countdown",
    "index/mod/loadCars",
    "lib/mustache"
], function(carGod,
            topNav,
            qiugou,
            customSelect,
            collect,
            lazyload,
            carConstrast,
            recordTip,
            ImageResize,
            TimeCountDown,
            loadCars,
            Mustache) {
    var config = {};
    var myAdviserPageIndex = 1,
        hotNewCarsPageIndex = 0;

//  var _bind = function() {
//      var timeout = null;
//
//      var carTemplate = $("#carTemplate").html();
//      var adviser_end = false;
//      var newcar_end = false;
//      var getMore = function(id) {
//          $("." + $("#carsNav li.active").attr("id") + ".carsMore span").html("正在获取");
//          var self = this;
//          if ($(this).hasClass("myAdviser-more") || id == "myAdviser") {
//              if (adviser_end) return;
//              myAdviserPageIndex++;
//              var url = config.getMoreUserRecommend_api + "=" + myAdviserPageIndex;
//              $(self).find("span").html("正在加载中...")
//              if (myAdviserPageIndex > 2) {
//                  $(".myAdviser-loading").removeClass("hidden")
//              }
//
//              $.ajax({
//                  url: url,
//                  type: "GET",
//                  dataType: "json"
//              }).done(function(result) {
//                  $(self).find("span").html("查看更多")
//                  $(".myAdviser-loading").addClass("hidden")
//                  $(".carsMore.myAdviser-more").remove();
//                  if (result.code == 204) {} else {
//                      var list = result.recommendCars;
//                      var list = result.recommendCars.items;
//                      var template = "";
//                      for (var idx = 0, len = list.length; idx < len; idx++) {
//                          list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
//                          list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
//                          template += Mustache.render(carTemplate,list[idx])
//                      }
//
//
//                      $(".myAdviserContent .myAdviser").eq(0).append(template);
//                      ImageResize.init($(".img",$(".myAdviserContent .myAdviser")), 240, 160);
//                      $(".myAdviserContent .myAdviser-more").remove();
//                      if (result.hasNext) {
//
//                      } else {
//                          adviser_end = true;
//                      }
//
//
//                  }
//                  isScrolling = true;
//              });
//          } else {
//              if (newcar_end) return;
//
//              hotNewCarsPageIndex++;
//              var url = config.getMoreHotCars_api + hotNewCarsPageIndex;
//              $(self).find("span").html("正在加载中...")
//              if (hotNewCarsPageIndex > 2) {
//                  $(".hotNewCars-loading").removeClass("hidden")
//              }
//
//              $.ajax({
//                  url: url,
//                  type: "GET",
//                  dataType: "json"
//              }).done(function(result) {
//                  $(self).find("span").html("查看更多")
//                  $(".hotNewCars-loading").addClass("hidden")
//                  if(hotNewCarsPageIndex>1){
//                      $(".carsMore.hotNewCars-more").remove();
//                  }
//                  if (result.code == 204) {
//
//                  } else {
//                      var list = result.newCars.items;
//                      if (list.length == 0) {
//                          newcar_end = true;
//                      } else {
//                          var template = "";
//                          for (var idx = 0, len = list.length; idx < len; idx++) {
//                              list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
//                              list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
//                              template += Mustache.render(carTemplate,list[idx])
//                          }
//                          $(".hotNewCarsContent .hotNewCars").eq(0).append(template);
//                          ImageResize.init($(".img",$(".hotNewCarsContent .hotNewCars")), 240, 160);
//
//                      }
//
//
//                  }
//                  isScrolling = true;
//              });
//          }
//      }
//
//      var isScrolling = true;
//      //查看更多
//      $(".carsMore").click(function() {
//          getMore.call(this);
//          var self = this;
//          $(window).scroll(function() {
//              if($("#hotNewCars").hasClass("active")||$("#myAdviser").hasClass("active")){
//                  if ($("." + $("#carsNav li.active").attr("id") + "Content .carsMore").length == 0) {
//                      if (($("#footer").offset().top - 600) <= ($(window).scrollTop() + $(window).height())) {
//                          if (isScrolling) {
//                              isScrolling = false;
//                              getMore($("#carsNav li.active").attr("id"));
//                          }
//                      }
//                  }
//              }
//
//          });
//      });
//      getMore("hotNewCars")
//  }


    return {
        init: function(_config) {
            $.extend(config, _config);
            $(document).ready(function() {
                $('.flexslider').flexslider({
                    animation: "slide",
                    slideshowSpeed: 5000,
                    directionNav: true,
                    controlNav: false,
                    pauseOnHover: true
                });
                $('.flexslider2').flexslider({
                    animation: "slide",
                    slideshowSpeed: 5000,
                    pauseOnHover: true,
                    slideshow:false,
                    directionNav: true,
                    controlNav: false
                });
                $(".right-slide").flexslider({
                    slideshow: false,
                    animation: "slide",
                    slideshowSpeed: 5000,
                    controlNav: true,
                    animationLoop: false,
                    randomize: false,
                    directionNav: false
                });
                $(".flexslider .flex-direction-nav").hide();
                $(".flexslider2 .flex-direction-nav").hide();
                $(".flexslider").mouseenter(function() {
                    $(".flexslider .flex-direction-nav").fadeIn("normal");
                });
                $(".flexslider").mouseleave(function() {
                    $(".flexslider .flex-direction-nav").fadeOut("normal");
                });
                $(".flexslider2").mouseenter(function() {
                    $(".flexslider2 .flex-direction-nav").fadeIn("normal");
                });
                $(".flexslider2").mouseleave(function() {
                    $(".flexslider2 .flex-direction-nav").fadeOut("normal");
                });
            });
//          _bind();
            topNav.init();





            $(".down-counter").each(function() {
                var $this = $(this);
                TimeCountDown.init($this);
            });


            collect.init(config);

            $(".carsContent img").lazyload({
                threshold: 200
            });

            $(".card-login").click(function() {
                Souche.MiniLogin.checkLogin(function() {
                    window.location.reload();
                })
            })

            $.ajax({
                url:config.api_favCounts,
                data:{
                    siteId: $.cookie("siteId"),
                    shopId:$.cookie("shopId"),
                    carIds:(function(){
                        var ids =[];
                        $(".carItem").each(function(i,item){
                            ids.push($(item).attr("data-id"))
                        })
                        return ids;
                    })().join(",")
                },
                dataType:"jsonp",
                success:function(data){
                    console.log(data)

                    if(data.code==200){
                        for(var key in data){
                            var arr = key.split("_")
                            if(arr.length>1){
                                var carId = arr[1];
                                $(".carItem[data-id="+carId+"] .fav-count").html(data[key])
                            }
                        }
                    }
                }
            })
            //提示品牌是否加入心愿单
            //闹着玩
            // Souche.Util.appear(".hotNewCars", function() {
            //     $(".hotNewCars .carItem").css({
            //         opacity: 0
            //     }).each(function(i, item) {
            //         setTimeout(function() {
            //             $(item).animate({
            //                 opacity: 1
            //             })
            //         }, i * 100)

            //     });
            // }, 300)

        }
    }

});