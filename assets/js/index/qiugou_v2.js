/**
 * Created by Administrator on 2014/7/8.
 */
define(function()
{
    var qiugou = {};
    var lock=true;
    var _bind = function() {
        ///添加兴趣车 事件绑定 begin
        $(".hot div a,.brandList a,.chexiContent span").click(function () {
            $(this).addClass("active");
        });

        $(".instrestCarItem span").click(function () {
            $(this).parent().remove();
        });

        $(".addInstrestCarSubmit span").click(function () {
            var widthEnd = $(".carsItem").eq(0).width();
            var heightTilte = $(".addInstrestCarTilte").height();
            var heightEnd = $(".addInstrestCar").eq(0).height();

            $(".addInstrestCar>div").animate({
                "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                "opacity": "0",
                "filter": "alpha(opacity=0)",
                "-moz-opacity": "0"
            }, 500, function () {
                $(".addInstrestCar").animate({
                    width: widthEnd + "px"
                }, 1000, function () {
                    $(".addInstrestCar").addClass("hidden");
                    $(".addInstrestCarTilte").css("max-height", "85px");
                    $(".addInstrestCar>div").css("opacity", "1");
                    $(".addInstrestCar").css("overflow", "").css("height", "");
                });
            });

            $(".addInstrestCar").css("overflow", "hidden").css("height", heightEnd);
            $(".addInstrestCarTilte").css("max-height", heightTilte + "px");
            $(".addInstrestCar>div").css("visibility", "hidden");
        });
        ///

        ///开始选车 begin
        $(".operationItem .dataContainer .submit").click(function () {
            var option = {
                horizontal: true,
                fade: true
            };
            $(".dialogContentContainer").css("zIndex", 999).css("background");
            showDialogContent($(".dialogContent"), option);
        });
        ///

        /// 关闭选车 begin
        $(".dialogContent .submit span").click(function () {
            var option = {
                horizontal: true,
                fade: true
            };
            hideDialogContent($(".dialogContent"), option);
            window.setTimeout(function () {
                $(".dialogContentContainer").css("zIndex", -99);
            }, 1000);
        });
        ///

        ///打开添加兴趣车dialog
        $(".addCarinstrestItem").click(function () {
            var option = {
                vertical: true,
                fade: false
            };

            hideDialogContent($(".dialogContent"), option);
            $(".addInstrestCar").css("top", -455 + "px").removeClass("hidden");
            window.setTimeout(function () {
                showInstrestContent($(".addInstrestCar"), option);
            }, 500);

        });
        ///

        ///change tab
        $("#carsNav li").click(function () {
            $("#carsNav li").removeClass("active");
            $(this).addClass("active");
        });
        ///

        $(".addInstrestCar .addInstrestCarSubmit .submit ").click(function () {
            var option = {
                vertical: true,
                fade: false
            };

            hideInstrestContent($(".addInstrestCar"), option);
            window.setTimeout(function () {
                showDialogContent($(".dialogContent"), option);
            }, 500);
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
            self.find(".carImg img").animate({
                width: width+1+"px",
                height: 182 + "px",
                top: "0px",
                left: "0px"
            }, 250, function () {
            });
        });

    }

    var showDialogContent = function ($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        if (option.horizontal) {
            $element.css("overflow", "hidden").css("width", widthBegin);
            fadeOut($element.find("div,a"),0);

            $element.removeClass("hidden");
            offsetMove($element,option,widthEnd,500,function()
            {
                fadeIn($element.find("div,a"),300);
                $element.css("overflow", "");
            });
        }
        else
        {
            offsetMove($element, option, 0, 500);
        }

    }

    var showInstrestContent = function($element,option)
    {
        offsetMove($element,option,0,500);
    }

    var hideInstrestContent = function($element,option)
    {
        offsetMove($element,option,-444,500);
    }

    var hideDialogContent = function ($element, option) {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        if (option.horizontal) {
            fadeOut($element.find("div,a"), 300);

            window.setTimeout(function () {
                offsetMove($element, option, widthBegin, 500, function () {
                    $element.addClass("hidden").css("width", widthEnd);
                    fadeIn($element.find("div,a"), 300);
                });
            }, 500);
        }
        else if (option.vertical) {
            offsetMove($element, option, -444, 500);
        }
    }

    var offsetMove = function($element,direction,offset,time,callback) {
        if (direction.horizontal) {
            $element.stop(true).animate({
                width: offset + "px"
            }, time,
                function() {
                    if(callback)
                    callback();
                });
        }
        else {
            $element.stop(true).animate({
                top: offset + "px"
            }, time, function() {
                if(callback)
                    callback();
            });
        }
    }

    var fadeOut = function($element,time,callback) {

        $element.animate({
                "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                "opacity": "0",
                "filter": "alpha(opacity=0)",
                "-moz-opacity": "0"
            }, time,
            function()
            {
                if(callback)
                callback();
            });
    }

    var fadeIn = function($element,time,callback) {
        $element.animate({
                "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                "opacity": "1",
                "filter": "alpha(opacity=100)",
                "-moz-opacity": "1"
            }, time,
            function()
            {
                if(callback)
                    callback();
            });
    }

    var init = function()
    {
        _bind();
    }

    qiugou.init = init;
    return qiugou;
});