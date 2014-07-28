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

        $(".carItem").mouseenter(function (event) {
            event.stopPropagation();
            var self = $(this);

            var width = self.find(".carImg img").width();

            self.find(".carImg img").stop(true).animate({
                width: width + 12 + "px",
                height: 194 + "px",
                top: "-3px",
                left: "-3px"
            }, 250, function () {
            });
        });

        $(".carItem").mouseleave(function (event) {
            event.stopPropagation();
            var self = $(this);

            var width = self.find(".carImg").width();
            self.find(".carImg img").stop(true).animate({
                width: width + 1 + "px",
                height: 182 + "px",
                top: "0px",
                left: "0px"
            }, 250, function () {
            });
        });

        //查看更多
        $(".carsMore").click(function () {
            $("#carsMore span").html("正在获取");

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
                            $(".carsMore.myAdviser").remove();
                        }
                        else {
                            var list = result.recommendCars;
                            if (!result.hasNext) {
                                $(".carsMore.myAdviser").remove();
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
                            $("#carsContent .myAdviser").append(template);
                            $("#carsMore span").html("查看更多");
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
                            $(".carsMore.hotNewCars").remove();
                        }
                        else {
                            var list = result.newCars.items;

                            var template = "";
                            for (var idx = 0, len = list.length; idx < len; idx++) {
                                template += "<div class='carsItem carItem'><a href='#' class='carImg'><img src='http://res.souche.com/" + list[idx].carPicturesVO.pictureBig + "' height='182'><\/a><a href='#' class='car-link'>" + list[idx].carVo.carOtherAllName + "<\/a>" +
                                    "<div class='info'><span class='price'>￥$" + (list[idx].limitSpec || list[idx].price) + "万<\/span><span class='shangpai'>上牌：" + list[idx].carVo.firstLicensePlateDateShow + "<\/span><\/div>" +
                                    "<div class='other'>" +
                                    "<div class='discount " + (list[idx].flashPurchase ? "" : "hidden") + "'>优惠：<span>" + (list[idx].flashPurchaseVO ? list[idx].flashPurchaseVO.totalMasterOutPrice : "") + "<\/span><\/div>" +
                                    "<div class='downCounter " + (list[idx].flashPurchase ? "" : "hidden") + "'><span>剩余时间<\/span><\/div>" +
                                    "<\/div>" +
                                    "<div class='carTail'><span class='collect ative'>收藏 " + list[idx].carFavoriteNum + "<\/span><span class='recommendedToday'>今日推荐<\/span><\/div>" +
                                    "<\/div>";

                            }
                            $("#carsContent .hotNewCars").append(template);
                        }
                    });
            }
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

    ////
    return {
        init: function(_config) {
            $.extend(config, _config);

            _bind();

            require(["index/qiugou_v2", "index/qiugouModel", 'souche/custom-select', "index/modelSeries", "souche/down-counter"],
                function (qiugou, qiugouModel, customSelect, modelSeries, downCounter) {

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

                });


        }
    }
});