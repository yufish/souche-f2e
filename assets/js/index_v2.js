define(function(){
    var config = {};
    var lock
    var _bind = function() {
        $(".car-brand,.car-models").mouseover(function (event) {
            event.stopPropagation();

            console.log(1);
            $(".models-inner,.brand-inner").hide();
            $(this).find(".models-inner,.brand-inner").show(100);
            return false;
        });
        $("body").mouseover(function () {
            $(this).find(".models-inner,.brand-inner").hide(100);
        });

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
                opacity:"0"
            },500,function()
            {
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
            showDialogContent( $(".dialogContent"));
       });
        ///

        /// 关闭选车 begin
        $(".dialogContent .submit span").click(function () {
            hideDialogContent($(".dialogContent"));
        });
        ///

        ///打开添加兴趣车dialog
        $(".addCarinstrestItem").click(function()
        {
            showDialogContent($(".dialogContent"));
        });
        ///

        ///change tab
        $("#carsNav li").click(function()
        {
            $("#carsNav li").removeClass("active");
            $(this).addClass("active");
        });
        ///
    }


    ///
    var showDialogContent = function($element)
    {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        $element.css("overflow", "hidden").css("width", widthBegin);
        $element.find("div").css("opacity", "0");
        $element.removeClass("hidden");

        $element.stop(true).animate({
            width: widthEnd+"px"
        }, 1000, function () {
            $element.find("div").stop(true).animate({
                opacity: "1"
            }, 500, function () {
                $element.css("overflow", "")
            });
        });
    }

    var hideDialogContent = function($element)
    {
        var widthBegin = $(".carsItem").eq(0).width();
        var widthEnd = $("#carsNav").width();
        var heightEnd = $element.height();

        $element.find("div").stop(true).animate({
            opacity: "0"
        }, 500, function () {
            $element.find("div").css("overflow", "hidden");
            $element.stop(true).animate({
                width: widthBegin+"px"
            }, 1000, function () {
                $element.addClass("hidden").css("width", widthEnd);
                $element.find("div").css("opacity", "1");
            });
        });
    }
    ////
    return {
        init:function(_config){
            $.extend(config,_config);

            _bind();
        }
    }
});
