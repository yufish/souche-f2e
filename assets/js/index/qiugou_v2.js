/**
 * Created by Administrator on 2014/7/8.
 */
define(['souche/util/load-info'], function(LoadInfo) {
    var config = {};
    var qiugou = {};
    var lock = true;
    var _bind = function() {
        var tabID = config.tabID || $("#carsNav li[class='active']").attr("id")

        ///添加兴趣车 事件绑定 begin

        $(".brandList a,.chexiContent span,.chexiTitle span").live("click", function(event) {

            if (event.target.tagName == "A") {
                $(".brandList a").removeClass("active");
                $(this).addClass("active");
                var code = $(this).attr("code");
                var name = $(this).html();
                require(["index/modelSeries"], function(modelSeries) {
                    modelSeries.GetSeries(code, name);
                });
            } else {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");

                    var seriesCode = $(this).attr("code");

                    var name = event.target.tagName == "SPAN" ? $(this).html() : $(".brandList a[class='active']").html();
                    if($(this).parent().hasClass("chexiTitle")) {
                        name = name.substr(0, name.length - 4);
                    }
                    var type = event.target.tagName == "SPAN" ? "serie" : "brand";

                    require(["index/qiugouModel"], function(qiugouModel) {
                        qiugouModel.AddAdviserInstrest({
                            seriesCode: seriesCode,
                            name: name,
                            type: type
                        });
                    });
                } else {
                    $(this).removeClass("active");
                    var seriesCode = $(this).attr("code");
                    var name = event.target.tagName == "SPAN" ? $(this).html() : $(".brandList a[class='active']").html();
                    var type = event.target.tagName == "SPAN" ? "serie" : "brand";

                    require(["index/qiugouModel"], function(qiugouModel) {
                        qiugouModel.DeleteAdviserInstrest({
                            seriesCode: seriesCode,
                            name: name,
                            type: type
                        });
                    });
                }
            }

            return false;
        });

        $(".instrestCarItem span").live("click", function(event) {
            //alert(1);

            var seriesCode =$(this).parent().attr("seriescode");
            var name = $(this).prev().html();
            var type = $(this).parent().attr("type");

            require(["index/qiugouModel"], function(qiugouModel) {
                qiugouModel.DeleteAdviserInstrest({
                    seriesCode: seriesCode,
                    name: name,
                    type: type
                });
            });
            $(this).parent().remove();

            return false;
        });

        $(".addInstrestCarSubmit span").click(function() {
            var widthEnd = $(".carsItem").eq(0).width();
            var heightTilte = $(".addInstrestCarTilte").height();
            var heightEnd = $("." + tabID).find(".addInstrestCar").eq(0).height();

            var option = {
                vertical: true,
                fade: false
            };

            hideInstrestContent($("." + tabID).find(".addInstrestCar"), option);
        });
        ///
        ///开始选车 begin
        $(".operationItem .dataContainer .submit,.bindunLoginInfo .modify .submit").click(function() {
            var option = {
                horizontal: true,
                fade: true
            };
            $("." + tabID).find(".dialogContentContainer").css("zIndex", 999).css("background");
            showDialogContent($("." + tabID).find(".dialogContent"), option);
        });
        ///
        /// 关闭选车 begin
        $(".dialogContent .submit span").click(function() {
            var option = {
                horizontal: true,
                fade: true
            };
            hideDialogContent($("." + tabID).find(".dialogContent"), option);
            window.setTimeout(function() {
                $("." + tabID).find(".dialogContentContainer").css("zIndex", -99);
            }, 1000);

            require(["index/qiugouModel"], function(qiugouModel) {
                qiugouModel.ModifyAdviserBudget({
                    min: $("." + tabID + " .carBudget .dataContainer .leftContainer input").val() * 10000,
                    max: $("." + tabID + " .carBudget .dataContainer .rightContainer input").val() * 10000
                });

                qiugouModel.ModifyAdviserYear({
                    min: $("." + tabID + " .caryear .dataContainer input#age_select").val(),
                    max:  $("." + tabID + " .caryear .dataContainer input#age_select_high").val()
                });

                var instrest = qiugouModel.GetAdviserInstrest();
                var series =[];
                var brand=[];

                for(var idx= 0,len=instrest.length;idx<len;idx++) {
                    var type = instrest[idx].type;
                    if(type=="brand")
                    {
                        brand.push(instrest[idx].seriesCode);
                    }
                    else
                    {
                        series.push(instrest[idx].seriesCode);
                    }
                }

                var url = config.submit_api;
                url += "?minPrice=" + $("." + tabID + " .carBudget .dataContainer .leftContainer input").val();
                url += "&maxPrice=" + $("." + tabID + " .carBudget .dataContainer .rightContainer input").val()
                url += "&minYear=" + ($("." + tabID + " .caryear .dataContainer input#age_select").val()||"");
                url += "&maxYear=" + ($("." + tabID + " .caryear .dataContainer input#age_select_high").val()||"");
                url+="&brands="+brand.join();
                url+="&series="+series.join();

                $.ajax({
                    url:url,
                    dataType:"json"
                }).done(function()
                {
                    window.location.reload();
                });
            });
        });
        ///
        ///打开添加兴趣车dialog
        $(".addCarinstrestItem").click(function() {
            var option = {
                vertical: true,
                fade: false
            };

            hideDialogContent($("." + tabID).find(".dialogContent"), option);
           $("." + tabID).find(".addInstrestCar").css("top", -800 + "px").removeClass("hidden");
            window.setTimeout(function() {
                showInstrestContent($("." + tabID).find(".addInstrestCar"), option);
            }, 500);

        });

        /// brandlist nav
            $(".brandNav a").live("click",function() {
                var id = $(this).attr("data-id");
                var tabID=$("#carsNav ul li.active").attr("id");
                if(!$("."+tabID+" .brandList span[data-id='" + id + "']").offset())
                    return false;
                var top = $("."+tabID+" .brandList span[data-id='" + id + "']").offset().top - $("."+tabID+" .brandList span").eq(0).offset().top;

                $("."+tabID+" .brandList").scrollTop(top);
            });
        ///
        ///
        $(".addInstrestCar .addInstrestCarSubmit .submit ").click(function() {
            var option = {
                vertical: true,
                fade: false
            };

            hideInstrestContent($("." + tabID).find(".addInstrestCar"), option);
            window.setTimeout(function() {
                showDialogContent($("." + tabID).find(".dialogContent"), option);
            }, 500);
        });

        $(".carinstrestItem span").live("click", function() {
            var ele = $(this).parent();
            require(["index/qiugouModel"], function(qiugouModel) {
                qiugouModel.DeleteAdviserInstrest({
                    seriesCode: $(ele).attr("seriescode"),
                    name: $(ele).find("a").html(),
                    type: $(ele).attr("type")
                });
            });
        });

        /////订阅
        require(["index/qiugouModel","index/modelSeries"], function(qiugouModel,modelSeries) {
            //alert(qiugouModel);
            qiugouModel.AddSubscribe("year", function() {
                if (this.minYear || this.maxYear) {
                    $(".carsItem .year span").html(this.minYear + "-" + this.maxYear);
                    $(".caryear .dataContainer .age_select .sc-select-content").html(this.minYear);
                    $(".caryear .dataContainer .age_select_high .sc-select-content").html(this.maxYear);
                    $(".caryear .dataContainer .age_select .selected_values").val(this.minYear);
                    $(".caryear .dataContainer .age_select_high .selected_values").val(this.minYear);
                } else {
                    $(".carsItem .year span").html("不限");
                    $(".caryear .dataContainer .age_select .sc-select-content").html("请选择");
                    $(".caryear .dataContainer .age_select_high .sc-select-content").html("请选择");
                    $(".caryear .dataContainer .age_select .selected_values").val("");
                    $(".caryear .dataContainer .age_select_high .selected_values").val("");
                }
            });

            qiugouModel.AddSubscribe("budget", function() {
                if ( !! this.minBudget)
                    $(".carBudget .dataContainer .leftContainer input").val(parseInt(this.minBudget) / 10000);

                if ( !! this.maxBudget)
                    $(".carBudget .dataContainer .rightContainer input").val(parseInt(this.maxBudget) / 10000);

                if (this.minBudget || this.maxBudget) {
                    if (!this.minBudget) {
                        $(".carsItem .yusuan  span").html(parseInt(this.maxBudget) / 10000 + "万以内");
                    }
                    else if (!this.maxBudget) {
                        $(".carsItem .yusuan span").html(parseInt(this.minBudget) / 10000 + "万以上");
                    } else {
                        $(".carsItem .yusuan span").html(parseInt(this.minBudget) / 10000 + "-" + parseInt(this.maxBudget) / 10000 + "万元");
                    }
                } else {
                    $(".carsItem .yusuan span").html("不限");
                }
            });

            qiugouModel.AddSubscribe("addInstrest", function() {
                var template = "<span class=\"instrestCarItem\" seriesCode='" + this.seriesCode + "' type='" + this.type + "'><a>" + this.name + "<\/a><span><\/span><\/span>";
                $(".addInstrestCarTilte").append(template);
                $("<span class=\"carinstrestItem\" seriesCode='" + this.seriesCode + "' type='" + this.type + "'><a>" + this.name + "<\/a><span><\/span><\/span>").insertBefore($(".addCarinstrestItem"));
                if ($(".interestCar span [seriesCode='" + this.seriesCode + "']").length == 0)
                    $(".interestCar").append("<span seriesCode='" + this.seriesCode + "' type='" + this.type + "'>" + this.name + "<\/span>");
            });

            qiugouModel.AddSubscribe("deleteInstrest", function() {
                //var template = "<span class=\"instrestCarItem\" seriesCode='" + this.seriesCode + "'><a>" + this.name + "<\/a><span><\/span><\/span>";
                $(".addInstrestCarTilte span[seriesCode='" + this.seriesCode + "']").remove();
                $(".carinstrest span[seriesCode='" + this.seriesCode + "']").remove();
                $(".interestCar span[seriesCode='" + this.seriesCode + "']").remove();
            });

            qiugouModel.init(config);
            modelSeries.init(config);
        });

    }

    var showDialogContent = function($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        if (option.horizontal) {
            $element.css("overflow", "hidden").css("width", widthBegin);

            $element.find("div,a").fadeTo(0,0);
            $element.removeClass("hidden");
            offsetMove($element, option, widthEnd, 500, function() {
                // fadeIn($element.find("div,a"),300);
                $element.find("div,a").fadeTo("fast",1);
                $element.css("overflow", "");
            });
        } else {
            $element.css("width", widthEnd);
            offsetMove($element, option, 0, 500);
        }

    }

    var showInstrestContent = function($element, option) {
        $element.css("width", $("#carsNav").width());
        offsetMove($element, option, 0, 500);
        var zimu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var html = "";
        for (var i = 0; i < zimu.length; i++) {
            html += "<a data-id='" + zimu[i] + "'>" + zimu[i] + "</a>";
        }
        $(".brandNav").html(html);
    }

    var hideInstrestContent = function($element, option) {
        offsetMove($element, option, -532, 500);
    }

    var hideDialogContent = function($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        if (option.horizontal) {
            //fadeOut($element.find("div,a"), 300);
            $element.find("div,a").fadeTo("fast",0);
            window.setTimeout(function() {
                offsetMove($element, option, widthBegin, 500, function() {
                    $element.addClass("hidden").css("width", widthEnd);
                    //fadeIn($element.find("div,a"), 300);
                    $element.find("div,a").fadeTo("fast","1");
                });
            }, 500);
        } else if (option.vertical) {
            $element.css("width", widthEnd);
            offsetMove($element, option, -532, 500);
        }
    }

    var offsetMove = function($element, direction, offset, time, callback) {
        if (direction.horizontal) {
            $element.stop(true).animate({
                    width: offset + "px"
                }, time,
                function() {
                    if (callback)
                        callback();
                    $element.css("width", $("#carsNav").width());
                });
        } else {
            $element.stop(true).animate({
                top: offset + "px"
            }, time, function() {
                if (callback)
                    callback();
                $element.css("width", $("#carsNav").width());
            });
        }
    }


    var init = function(_config) {
        config = _config;
        _bind();

        var data = config.userRequementJson;

        //初始化 dialog数据

    }

    qiugou.init = init;
    return qiugou;
});