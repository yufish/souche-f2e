/**
 * Created by Administrator on 2014/7/1.
 */
define(function()
{
    var navControl = {};
    var navTabTop = $("#productDetailInfo .nav").offset().top;

    var init = function() {
        $("#productDetailInfo .nav li").click(function () {
            var dataID = $(this).attr("data-id");
            $("#productDetailInfo>div").addClass("hidden");
            $("#productDetailInfo>div[data-id='" + dataID + "']").removeClass("hidden");

            $(this).addClass("active").siblings().removeClass("active");

            if ($("#productDetailInfo .nav").css("position") === "fixed") {
                $('html,body').animate(
                    {
                        scrollTop: navTabTop + "px"
                    }
                    , 1000);
            }
        });

        $(window).scroll(function () {
            var winTop = $(window).scrollTop();
            var height = $("#productDetailInfo").height();

            if (winTop > navTabTop && winTop < (navTabTop + height)) {
                $("#productDetailInfo .nav").css({
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000
                });
            } else {
                $("#productDetailInfo .nav").css({
                    position: "relative"
                });
            }
        });
    }

    navControl.init = init;
    return navControl;
});