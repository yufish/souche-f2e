/**
 * Created by Administrator on 2014/7/8.
 */
define(['souche/util/load-info', "index/qiugouModel"], function(LoadInfo, qiugouModel) {
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
                var name;
                if ($(this).attr("data-name")) {
                    name = $(this).attr("data-name")
                } else {
                    name = $(this).html()
                }
                require(["index/modelSeries"], function(modelSeries) {
                    modelSeries.GetSeries(code, name);
                });
            } else {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");

                    var seriesCode = $(this).attr("code");

                    var name;
                    if ($(this).attr("data-name")) {
                        name = $(this).attr("data-name")
                    } else {
                        name = $(this).html()
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
                    var name;
                    if ($(this).attr("data-name")) {
                        name = $(this).attr("data-name")
                    } else {
                        name = $(this).html()
                    }
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

        $(".instrestCarItem").live("click", function(event) {
            //alert(1);

            var seriesCode = $(this).attr("seriescode");
            var name = $(this).find("a").html();
            var type = $(this).attr("type");

            require(["index/qiugouModel"], function(qiugouModel) {
                qiugouModel.DeleteAdviserInstrest({
                    seriesCode: seriesCode,
                    name: name,
                    type: type
                });
            });
            $(this).remove();

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

            return false;
        });
        ///开始选车 begin
        $(".operationItem .dataContainer .submit,.bindunLoginInfo .modify .submit").click(function() {
            var option = {
                horizontal: true,
                fade: true
            };
            $("." + tabID).find(".dialogContentContainer").css("zIndex", 999).css("background");
            showDialogContent($("." + tabID).find(".dialogContent"), option);
            if ($("." + tabID + " .operationItem .low-price").val()) {
                $("." + tabID + " .dialogContentContainer .low-price").val($("." + tabID + " .operationItem .low-price").val());
            }
            if ($("." + tabID + " .operationItem .high-price").val()) {
                $("." + tabID + " .dialogContentContainer .high-price").val($("." + tabID + " .operationItem .high-price").val());
            }

            return false;
        });
        /// 关闭选车 确定 begin
        $(".dialogContent .submit").click(function() {
            var option = {
                horizontal: true,
                fade: true
            };


            require(["index/qiugouModel"], function(qiugouModel) {

                var minBudget = $("." + tabID + " .carBudget .dataContainer .leftContainer input").val();
                var maxBudget = $("." + tabID + " .carBudget .dataContainer .rightContainer input").val();

                var regx = new RegExp(/(^\d[\d|.]*\d$)|(^\d+$)/);
                if (regx.test(minBudget) && regx.test(maxBudget)) {
                    if (parseInt(minBudget) > parseInt(maxBudget)) {
                        $("." + tabID + " .warning").html("预算输入有错误").removeClass("hidden");
                        window.setTimeout(function() {
                            $("." + tabID + " .warning").addClass("hidden");
                        }, 2000);
                        return false;
                    }
                } else {
                    if (minBudget != "" && maxBudget != "") {
                        return false;
                    }
                }

                qiugouModel.ModifyAdviserBudget({
                    min: parseInt(minBudget) * 10000,
                    max: parseInt(maxBudget) * 10000
                });

                var minYear = $("." + tabID + " .caryear .dataContainer .age-left .selected_values").val();
                var maxYear = $("." + tabID + " .caryear .dataContainer .age-right .selected_values").val();
                if (minYear > maxYear) {
                    $("." + tabID + " .warning").html("年份选择有错误").removeClass("hidden");
                    window.setTimeout(function() {
                        $("." + tabID + " .warning").addClass("hidden");
                    }, 2000);
                    return;
                }

                qiugouModel.ModifyAdviserYear({
                    min: $("." + tabID + " .caryear .dataContainer .age-left .selected_values").val(),
                    max: $("." + tabID + " .caryear .dataContainer .age-right .selected_values").val()
                });

                var instrest = qiugouModel.GetAdviserInstrest();
                var series = [];
                var brand = [];

                for (var idx = 0, len = instrest.length; idx < len; idx++) {
                    var type = instrest[idx].type;
                    if (type == "brand") {
                        brand.push(instrest[idx].seriesCode);
                    } else {
                        series.push(instrest[idx].seriesCode);
                    }
                }

                var url = config.submit_api;
                url += "?minPrice=" + $("." + tabID + " .carBudget .dataContainer .leftContainer input").val();
                url += "&maxPrice=" + $("." + tabID + " .carBudget .dataContainer .rightContainer input").val()
                url += "&minYear=" + ($("." + tabID + " .caryear .dataContainer .age-left .selected_values").val() || "");
                url += "&maxYear=" + ($("." + tabID + " .caryear .dataContainer .age-right .selected_values").val() || "");
                url += "&brands=" + brand.join();
                url += "&series=" + series.join();

                Souche.NoRegLogin.checkLogin(function() {
                    $(".dialogContent .submit").html("提交中...").addClass("loading").attr("disabled", "true");
                    $.ajax({
                        url: url,
                        dataType: "json",
                        success: function() {
                            // hideDialogContent($("." + tabID).find(".dialogContent"), option);
                            // window.setTimeout(function() {
                            //     $("." + tabID).find(".dialogContentContainer").css("zIndex", -99);
                            // }, 1000);
                            window.location.reload();
                            $(".dialogContent .submit").html("提交").removeClass("loading").attr("disabled", false);
                        },
                        error: function() {
                            $(".dialogContent .submit").html("提交").removeClass("loading").attr("disabled", false);
                        }
                    });
                })


            });
            return false;
        });

        $(".dialogContent .cancel").click(function(event) {
            rollbackOpertion(event);
        });
        ///

        /// body click 去掉dialog 显示
        var rollbackOpertion = function(event) {
                var dialogContentElement = "." + tabID + " .dialogContent";
                var dialogInstrestContentElement = "." + tabID + " .addInstrestCar";
                if (!$(dialogContentElement).hasClass("hidden")) {
                    var option = {
                        horizontal: true,
                        fade: true
                    };
                    hideDialogContent($("." + tabID).find(".dialogContent"), option);
                    window.setTimeout(function() {
                        $("." + tabID).find(".dialogContentContainer").css("zIndex", -99);
                    }, 1000);
                } else if (!$(dialogInstrestContentElement).hasClass("hidden")) {
                    var option = {
                        vertical: true,
                        fade: false
                    };

                    hideInstrestContent($("." + tabID).find(".addInstrestCar"), option);
                    window.setTimeout(function() {
                        showDialogContent($("." + tabID).find(".dialogContent"), option);
                    }, 500);
                    qiugouModel.Rollback();
                }
            }
            ///打开添加兴趣车dialog
        $(".addCarinstrestItem").live("click", function(event) {
            event.preventDefault();
            var option = {
                vertical: true,
                fade: false
            };

            hideDialogContent($("." + tabID).find(".dialogContent"), option);
            $("." + tabID).find(".addInstrestCar").css("top", -900 + "px").removeClass("hidden");
            window.setTimeout(function() {
                showInstrestContent($("." + tabID).find(".addInstrestCar"), option);
            }, 500);
            event.stopPropagation();
            return false;
        });

        ///change tab
        $("#carsNav li").click(function() {
            $("#carsNav li").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("id");
            tabID = id;
            $(window).trigger("tab_change", id)
            if (id === "myAdviser") {
                initAnimate();
            } else if (id == "hotNewCars") {
                $(".hotNewCars img").each(function(i, img) {
                    $(img).attr("src", $(img).attr("data-original"));
                })
            }
            $(".carsContent").addClass("hidden");
            $(".carsContent." + tabID + "Content").removeClass("hidden");
            return false;
        });
        ///
        ///动画 顾问初始化显示的时候
        var initAnimate = function() {
            if ($(".adviserInitAnimate").length != 0) {

                $(".adviserInitAnimate .bg").animate({
                    "left": ""
                }, 500);
                $(".adviserInitAnimate .road").animate({
                    "left": ""
                }, 600, function() {

                    $(".adviserInitAnimate .boy").animate({
                        "left": "0px"
                    }, 500, function() {
                        $(".adviserInitAnimate .boytalk").animate({
                            "left": ""
                        }, 500, function() {
                            $(".adviserInitAnimate .girl").animate({
                                "left": ""
                            }, 500, function() {
                                $(".adviserInitAnimate .girltalk").animate({
                                    "left": ""
                                }, 500);
                            });
                        });
                    });
                });

            }
        }

        /// brandlist nav
        $(".brandNav a").live("click", function() {
            var id = $(this).attr("data-id");
            var tabID = $("#carsNav ul li.active").attr("id");
            if (!$("." + tabID + " .brandList span[data-id='" + id + "']").offset())
                return false;
            var top = $("." + tabID + " .brandList span[data-id='" + id + "']").offset().top - $("." + tabID + " .brandList span").eq(0).offset().top;

            $("." + tabID + " .brandList").scrollTop(top);
            return false;
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
            return false;
        });
        ///取消
        $(".addInstrestCar .addInstrestCarSubmit .cancel ").click(function(event) {
            rollbackOpertion(event)
            return false;
        });

        $(".carinstrestItem").live("click", function() {
            var ele = $(this);
            require(["index/qiugouModel"], function(qiugouModel) {
                qiugouModel.DeleteAdviserInstrest({
                    seriesCode: $(ele).attr("seriescode"),
                    name: $(ele).find("a").html(),
                    type: $(ele).attr("type")
                });
            });
            return false;
        });

        /////订阅
        require(["index/qiugouModel", "index/modelSeries"], function(qiugouModel, modelSeries) {
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
                if (!!this.minBudget)
                    $(".carBudget .dataContainer .leftContainer input").val(parseInt(this.minBudget) / 10000);

                if (!!this.maxBudget)
                    $(".carBudget .dataContainer .rightContainer input").val(parseInt(this.maxBudget) / 10000);

                if (this.minBudget || this.maxBudget) {
                    if (!this.minBudget) {
                        $(".carsItem .yusuan  span").html(parseInt(this.maxBudget) / 10000 + "万以内");
                    } else if (!this.maxBudget) {
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
                if ($(".interestCar span[seriesCode='" + this.seriesCode + "']").length == 0) {
                    if ($(".interestCar span").eq(0).html() === "不限") {
                        $(".interestCar span").eq(0).remove();
                    }
                    $(".interestCar").append("<span seriesCode='" + this.seriesCode + "' type='" + this.type + "'>" + this.name + "<\/span>");

                }
            });

            qiugouModel.AddSubscribe("deleteInstrest", function() {
                //var template = "<span class=\"instrestCarItem\" seriesCode='" + this.seriesCode + "'><a>" + this.name + "<\/a><span><\/span><\/span>";
                $(".addInstrestCarTilte span[seriesCode='" + this.seriesCode + "']").remove();
                $(".carinstrest span[seriesCode='" + this.seriesCode + "']").remove();
                $(".interestCar span[seriesCode='" + this.seriesCode + "']").remove();
                if ($(".interestCar span").length === 0) {
                    $(".interestCar .interestCarContainer").append("<span>不限<\/span>");
                }
            });

            qiugouModel.init(config);
            modelSeries.init(config);
        });
    }

    var showDialogContent = function($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();
        $element.removeClass("hidden");

        if (option.horizontal) {
            $element.css("overflow", "hidden").css("width", widthBegin);

            $element.find("div,a").fadeTo(0, 0);
            $element.removeClass("hidden");
            offsetMove($element, option, widthEnd, 500, function() {
                // fadeIn($element.find("div,a"),300);
                $element.find("div,a").fadeTo("fast", 1);
                $element.css("overflow", "");
            });
        } else {
            $element.css("width", widthEnd);
            offsetMove($element, option, 0, 500);
        }
        var tabID = $("#carsNav ul li.active").attr("id");

        if ($(".carsContent." + tabID + "Content").height() < 500) {
            $(".carsContent." + tabID + "Content").css("overflow", "visible");
            $(".carsContent." + tabID + "Content" + " ." + tabID).eq(0).css("minHeight", "402px");
        } else {
            $(".carsContent." + tabID + "Content").css("overflow", "auto");
        }
    }

    var showInstrestContent = function($element, option) {
        $element.css("width", $("#carsNav").width());
        offsetMove($element, option, 0, 500);
        $element.removeClass("hidden");

        var zimu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var html = "";
        for (var i = 0; i < zimu.length; i++) {
            html += "<a data-id='" + zimu[i] + "'>" + zimu[i] + "</a>";
        }
        $(".brandNav").html(html);

        var tabID = $("#carsNav ul li.active").attr("id");

        if ($(".carsContent." + tabID + "Content").height() < 500) {
            $(".carsContent." + tabID + "Content").css("overflow", "visible");
            $(".carsContent." + tabID + "Content" + " ." + tabID).eq(0).css("minHeight", "490px");
        } else {
            $(".carsContent." + tabID + "Content").css("overflow", "auto");
        }

        $element.find(".brandList ul li").eq(0).find("a").click();
    }

    var hideInstrestContent = function($element, option) {
        offsetMove($element, option, -532, 500, function() {
            $element.addClass("hidden");
        });
        var tabID = $("#carsNav ul li.active").attr("id");
        $(".carsContent." + tabID + "Content").css({
            "overflow": "visible"
        });
        $(".carsContent." + tabID + "Content" + " ." + tabID).eq(0).css("minHeight", "402px");
    }

    var hideDialogContent = function($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        if (option.horizontal) {
            //fadeOut($element.find("div,a"), 300);
            $element.find("div,a").fadeTo("fast", 0);
            window.setTimeout(function() {
                offsetMove($element, option, widthBegin, 500, function() {
                    $element.addClass("hidden").css("width", widthEnd);
                    //fadeIn($element.find("div,a"), 300);
                    $element.find("div,a").fadeTo("fast", "1");
                });
            }, 500);
        } else if (option.vertical) {
            $element.css("width", widthEnd);
            offsetMove($element, option, -532, 500, function() {
                $element.addClass("hidden");
            });
        }

        var tabID = $("#carsNav ul li.active").attr("id");
        $(".carsContent." + tabID + "Content").css({
            "overflow": "auto"
        });
        $(".carsContent." + tabID + "Content" + " ." + tabID).eq(0).css("minHeight", "");
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
    }

    qiugou.init = init;
    return qiugou;
});