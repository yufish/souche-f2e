define(function(){
    var config = {};

    var _bind = function() {
        $(".car-brand,.car-models").mouseover(function (event) {
            event.stopPropagation();

            $(".models-inner,.brand-inner").css("display", "none");
            $(this).find(".models-inner,.brand-inner").css("display", "block");
            return false;
        });
        $("body").mouseover(function () {
            $(this).find(".models-inner,.brand-inner").css("display", "none");
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
        ///添加兴趣车 事件绑定 end

        ///开始选车 begin
        $(".operationItem .dataContainer .submit").click(function () {
            var widthBegin = $(".carsItem").eq(0).width();
            var widthEnd = $("#carsNav").width();
            var heightEnd = $(".dialogContent").height();

            $(".dialogContent").removeClass("hidden").css("overflow", "hidden").css("width", widthBegin);
            $(".dialogContent>div").css("opacity", "0");

            $(".dialogContent").animate({
                width: "98%"
            }, 1000, function () {
                $(".dialogContent>div").animate({
                    opacity: "1"
                }, 500, function () {
                    $(".dialogContent").css("overflow", "")
                });
            });
        });
        ///开始选车 end

        /// 关闭选车 begin
        $(".dialogContent .submit span").click(function () {

        });
        /// 关闭选车 begin
    }

    return {
        init:function(_config){
            $.extend(config,_config);

            _bind();
        }
    }
});
