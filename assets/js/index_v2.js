define(function() {
    var config = {};
    var myAdviserPageIndex=1 , hotNewCarsPageIndex=1;

    var _bind = function() {
        var timeout = null;

        $(".car-brand,.car-models,.car-price").mouseenter(function (event) {

            event.stopPropagation();
            var self = this;
            window.clearTimeout(timeout);

            $(".models-inner,.brand-inner,.price-inner").hide();
            timeout = window.setTimeout(function () {
                if (eval("''+/*@cc_on" + " @_jscript_version@*/-0") * 1 == 5.7) {
                    if ($(self).hasClass("car-models")) {
                        $(".car-price").css("visibility", "hidden");
                    } else {
                        $(".car-models,.car-price").css("visibility", "hidden");
                    }
                    $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", 9999).show(0);
                } else {
                    $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", 9999).show(0);
                }
            }, 200);

            return false;
        });

        $(".car-brand,.car-models,.car-price").mouseleave(function () {

            var self = this;
            window.clearTimeout(timeout);

            if (eval("''+/*@cc_on" + " @_jscript_version@*/-0") * 1 == 5.7) {
                if ($(self).hasClass("car-models")) {
                    $(".car-price").css("visibility", "");
                } else {
                    $(".car-models,.car-price").css("visibility", "");
                }
                $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", -999).hide(0);
            } else {
                $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", -999).hide(100);
            }
        });

        $(".carItem").live("mouseenter",function (event) {
            event.stopPropagation();
            var self = $(this);
            //console.log(event.target.nodeName);
            if(event.target.nodeName=="SPAN"||event.target.nodeName=="INS")
            {
                return ;
            }

            var width = self.find(".carImg img").width();

            self.find(".carImg img").stop(true).animate({
                width: width + 40 + "px",
                height: 210 + "px"
            }, 1500, function () {
            });
        });

        $(".carItem").live("mouseleave",function (event) {
            event.stopPropagation();
            var self = $(this);

            var width = self.find(".carImg").width();
            self.find(".carImg img").stop(true).animate({
                width: width + 1 + "px",
                height: 182 + "px"
            }, 1500, function () {
            });
        });


        var getMore = function () {

            $("."+$("#carsNav li.active").attr("id")+" .carsMore span").html("正在获取");

            if ($(this).hasClass("myAdviser")) {
                myAdviserPageIndex;
                var url = config.getMoreUserRecommend_api + "=" + myAdviserPageIndex;
                $.ajax(
                    {
                        url: url,
                        type: "GET",
                        dataType: "json"
                    }).done(function (result) {
                        if (result.code == 204) {
                            $("." + $("#carsNav li.active").attr("id") + " .carsMore.myAdviser").remove();
                        }
                        else {
                            var list = result.recommendCars;
                            if (!result.hasNext) {
                                $("." + $("#carsNav li.active").attr("id") + " .carsMore.myAdviser").remove();
                            }
                            var template = "";
                            for (var idx = 0, len = list.length; idx < len; idx++) {
                                template += "<div class=\"carsItem carItem\"><a href=\"#\" class=\"carImg\"><img src='http://res.souche.com/" + list[idx].carPicturesVO.pictureBig + "' height='182'><\/a><a href='#' class='car-link'>" + list[idx].carVo.carOtherAllName + "<\/a>" +
                                    "<div class='info'><span class='price'>￥" + list[idx].carVo.salePriceToString + "万<\/span><span class='shangpai'>上牌：" + list[idx].carVo.firstLicensePlateDateShow + "<\/span><\/div>" +
                                    "<div class='other'>" +
                                    "<div title='" + list[idx].recommendReasonStr + "' class='recommended'><span class='" + (list[idx].recommendReasonStr ? "" : "hidden") + "' >推荐理由：" + list[idx].recommendReasonStr + "<\/span><\/div>" +
                                    "<\/div>" +
                                    "<div class='carTail clearfix'><span class='collect' " + (list[idx].like ? "ative" : "") + ">收藏" + list[idx].collectNum + "<\/span><span class='recommendedToday'>" + list[idx].recommendTime + "<\/span><\/div>" +
                                    "<\/div>";
                            }
                            $(".myAdviserContent .myAdviser").eq(0).append(template);
                            $(".myAdviserContent .myAdviser").eq(1).remove();
                        }
                    });
            }
            else {
                var url = config.getMoreHotCars_api + hotNewCarsPageIndex;
                hotNewCarsPageIndex++;
                $.ajax(
                    {
                        url: url,
                        type: "GET",
                        dataType: "json"
                    }).done(function (result) {
                        if (result.code == 204) {
                            $("."+$("#carsNav li.active").attr("id")+" .carsMore.hotNewCars").remove();
                        }
                        else {
                            var list = result.newCars.items;

                            var template = "";
                            for (var idx = 0, len = list.length; idx < len; idx++) {
                                template += "<div class='carsItem carItem'><a href='#' class='carImg'><img src='http://res.souche.com/" + list[idx].carPicturesVO.pictureBig + "' height='182'><\/a><a href='#' class='car-link'>" + list[idx].carVo.carOtherAllName + "<\/a>" +
                                    "<div class='info'><span class='price'>￥" + (list[idx].limitSpec || list[idx].price) + "万<\/span><span class='shangpai'>上牌：" + list[idx].carVo.firstLicensePlateDateShow + "<\/span><\/div>" +
                                    "<div class='other'>" +
                                    "<div class='discount " + (list[idx].flashPurchase ? "" : "hidden") + "'>优惠：<span>" + (list[idx].flashPurchaseVO ? list[idx].flashPurchaseVO.totalMasterOutPrice : "") + "<\/span><\/div>" +
                                    "<div class='downCounter " + (list[idx].flashPurchase ? "" : "hidden") + "'><span>剩余时间<\/span><\/div>" +
                                    "<\/div>" +
                                    "<div class='carTail'><span class='collect ative'>收藏 " + list[idx].carFavoriteNum + "<\/span><span class='recommendedToday'>今日推荐<\/span><\/div>" +
                                    "<\/div>";
                            }
                            $(".hotNewCarsContent .hotNewCars").eq(0).append(template);
                            $(".hotNewCarsContent .hotNewCars").eq(1).remove();
                        }
                    });
            }
        };
        //查看更多
        $(".carsMore").click(function()
        {
            getMore.call(this);
            $(window).scroll(function()
            {
                if($("."+$("#carsNav li.active").attr("id")+".carsMore").length ==0) {
                    if (($("#footer").offset().top - 50) <= (window.scrollY + window.screen.availHeight)) {
                        getMore.call(this);
                    }
                }
            });
        });
        //

        //head 搜索框
        require(["souche/realTimeDown"], function (down) {
            down.init($(".search"), {url: config.search_api, type: "GET",dataType:"json", success: function () {
                alert(1);
            }}, 900);

        });
        //
    }

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

            container.html("<span>剩余时间：<ins>" + zeroH + counter.offHour + "</ins>&nbsp时&nbsp<ins>" + zeroM + counter.offMin + "</ins>&nbsp分&nbsp<ins>" + zeroS + counter.offSec + "." + counter.offMSec + "</ins>&nbsp秒</span>");
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

    ////
    return {
        init: function(_config) {
            $.extend(config, _config);

            _bind();

            require(["index/qiugou_v2", "index/qiugouModel", 'souche/custom-select', "index/modelSeries","index/collect","lib/lazyload"],
                function (qiugou, qiugouModel, customSelect, modelSeries,collect,lazyload) {

                    qiugou.init(config);
                    //modelSeriesModel.init(config);
                    //modelSeries.init(config);

                    var ageSelect = new customSelect("age_select", {
                        placeholder: "请选择",
                        multi: false
                    });

                    var ageSelect = new customSelect("age_select_high", {
                        placeholder: "请选择",
                        multi: false
                    });
                    var ageSelect = new customSelect("age_select1", {
                        placeholder: "请选择",
                        multi: false
                    });

                    var ageSelect = new customSelect("age_select_high1", {
                        placeholder: "请选择",
                        multi: false
                    });

                    $(".down-counter").each(function () {
                        var $this = $(this);
                        downCounter($this);
                    });





                    collect.init(config);

                    $(".carsContent img").lazyload({
                    });


                });


        }
    }
});