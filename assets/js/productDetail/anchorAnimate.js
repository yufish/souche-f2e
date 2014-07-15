/**
 * Created by Administrator on 2014/7/10.
 */
define(function()
{
    var anchorControl = {};

    var _bind = function()
    {
        $(".config_nav li").click(function() {
            var pointerTo = $(this).find("a").attr("anchor");

            var pointerElement = $(".config_content #"+pointerTo);
            var top = pointerElement.offset().top;
            $(".config_nav li span").removeClass("active");
            $(this).find("span").addClass("active");

            $('html,body').animate(
                {
                    scrollTop: top -100 + "px"
                }
                , 1000);
        });

        var topList1 = [];

        for(var index=0 , len=$(".config_content table").length; index<len;index++) {
            topList1.push($(".config_content table").eq(index).offset().top);
        }

        var originTop = $(".config_nav").offset().top;
        var scrollFunction = function () {
            var winTop = $(window).scrollTop();
            var height = $("#productDetailInfo").height();

            if (winTop > navTabTop && winTop < (navTabTop + height)) {
                $("#productDetailInfo .nav").css({
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000
                });

                $("")
            } else {
                $("#productDetailInfo .nav").css({
                    position: "relative"
                });
            }
        };

        $(window).scroll(scrollFunction);
    }

    var init = function()
    {
        _bind();
    }

    anchorControl.init = init ;
    return anchorControl;
});