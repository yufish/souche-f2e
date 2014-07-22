/**
 * Created by Administrator on 2014/7/8.
 */
define(['souche/util/load-info'], function(LoadInfo) {
    var config = {};
    var qiugou = {};
    var lock = true;
    var _bind = function() {
        var tabID = config.tabID || "hotNewCars";

        ///添加兴趣车 事件绑定 begin
        $(".hot div a,.brandList a,.chexiContent span").click(function() {
            $(this).addClass("active");
        });

        $(".brandList a,.chexiContent span,.chexiTitle").live("click", function(event) {

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
                    $(".chexiContent span").removeClass("active");
                    $(this).addClass("active");

                    var seriesCode = $(this).attr("code");
                    var name = event.target.tagName == "SPAN" ? $(this).html() : $(".brandList a[class='active']").html();
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
        });

        $(".instrestCarItem span").live("click", function() {
            $(this).parent().remove();
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
                    min: $(".carBudget .dataContainer .leftContainer input").val() * 10000,
                    max: $(".carBudget .dataContainer .rightContainer input").val() * 10000
                });

                qiugouModel.ModifyAdviserYear({
                    min: $(".caryear .dataContainer #age_select_input").val(),
                    max: $(".caryear .dataContainer #age_select_high_input").val()
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
            $("." + tabID).find(".addInstrestCar").css("top", -555 + "px").removeClass("hidden");
            window.setTimeout(function() {
                showInstrestContent($("." + tabID).find(".addInstrestCar"), option);
            }, 500);

        });
        ///

        ///change tab
        $("#carsNav li").click(function() {
            $("#carsNav li").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("id");
            tabID = id;

            $("#carsContent>div").addClass("hidden");
            $("#carsContent").find("." + id).removeClass("hidden");
        });
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

        $(".carItem").mouseenter(function(event) {
            event.stopPropagation();
            var self = $(this);

            var width = self.find(".carImg img").width();

            self.find(".carImg img").stop(true).animate({
                width: width + 12 + "px",
                height: 194 + "px",
                top: "-3px",
                left: "-3px"
            }, 250, function() {});
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

        $(".carItem").mouseleave(function(event) {
            event.stopPropagation();
            var self = $(this);

            var width = self.find(".carImg").width();
            self.find(".carImg img").stop(true).animate({
                width: width + 1 + "px",
                height: 182 + "px",
                top: "0px",
                left: "0px"
            }, 250, function() {});
        });

        /////订阅

        require(["index/qiugouModel"], function(qiugouModel) {
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
                        $(".carsItem .yusuan div").html(parseInt(this.maxBudget) / 10000 + "以下");
                    }
                    if (!this.maxBudget) {
                        $(".carsItem .yusuan div").html(parseInt(this.minBudget) / 10000 + "以上");
                    } else {
                        $(".carsItem .yusuan div").html(parseInt(this.minBudget) / 10000 + "-" + parseInt(this.maxBudget) / 10000 + "万元");
                    }
                } else {
                    $(".carsItem .yusuan div").html("不限");
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
        });

    }

    var showDialogContent = function($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        if (option.horizontal) {
            $element.css("overflow", "hidden").css("width", widthBegin);
            fadeOut($element.find("div,a"), 0);

            $element.removeClass("hidden");
            offsetMove($element, option, widthEnd, 500, function() {
                // fadeIn($element.find("div,a"),300);
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
            html += "<a>" + zimu[i] + "</a>"
        }
        $(".brandNav").html(html)
        // $(".brandNav a").click(function() {
        //     var word = $(this).html();
        //     if ($(".brandList li[data-word='" + word + "']").length) {
        //         $(".brandList").animate({
        //             scrollTop: $(".brandList li[data-word='" + word + "']").attr("data-height")
        //         })
        //     }
        //     $(".brandNav a").removeClass("active")
        //     $(this).addClass("active")

        // })
        // LoadInfo.loadBrands(function(data) {
        //     var html = "";
        //     var nowHeight = 0;
        //     data = brandSort(data.items);
        //     for (var i in data) {
        //         var b = data[i];
        //         var name = i;
        //         html += "<li data-word='" + name + "'><span>" + name + "</span>"
        //         for (var n = 0; n < b.length; n++) {
        //             var brand = b[n]
        //             html += ('<a class="brand-item">' + brand.name + '</a>');
        //         }
        //         html += "</li>"
        //         html = $(html);
        //         html.attr("data-height", nowHeight)


        //         $(".brandList ul").append(html)
        //         nowHeight += html.height() + 10;
        //     }

        // })
        // LoadInfo.loadSeries(brandCode, function(data) {
        //     var html = "";

        //     for (var i in data.codes) {
        //         var b = data.codes[i];
        //         var name = i;
        //         html += "<div data-name='" + name + "' data-brandid='" + brandCode + "' class='clearfix word-container'><div class='brand-title'>" + name + "</div>"
        //         for (var n = 0; n < b.length; n++) {
        //             var series = b[n]
        //             html += ('<a href="#" data-value="' + series.code + '" class="option"><input type="checkbox" class="hidden"/><span class="value">' + series.name + '</span></a>');
        //         }
        //         html += "</div>"

        //     }
        //     seriesSelect.addOptions(html)
        // })
    }

    var hideInstrestContent = function($element, option) {
        offsetMove($element, option, -532, 500);
    }

    var hideDialogContent = function($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        if (option.horizontal) {
            fadeOut($element.find("div,a"), 300);

            window.setTimeout(function() {
                offsetMove($element, option, widthBegin, 500, function() {
                    $element.addClass("hidden").css("width", widthEnd);
                    fadeIn($element.find("div,a"), 300);
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

    var fadeOut = function($element, time, callback) {

        // $element.animate({
        //         "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
        //         "opacity": "0",
        //         "filter": "alpha(opacity=0)",
        //         "-moz-opacity": "0"
        //     }, time,
        //     function() {
        //         if (callback)
        //             callback();
        //     });
    }

    var fadeIn = function($element, time, callback) {
        $element.animate({
                "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                "opacity": "1",
                "filter": "alpha(opacity=100)",
                "-moz-opacity": "1"
            }, time,
            function() {
                if (callback)
                    callback();
            });
    }
    var brandSort = function(data) {
        var zimu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var obj = {}
        for (var i in data) {
            var brand = data[i]
            var firstword = brand.name.charAt(0).toUpperCase();
            if (!obj[firstword]) {
                obj[firstword] = []
            }
            brand.name = brand.name.substr(2, brand.name.length)
            obj[firstword].push(brand);
        }

        return obj;
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