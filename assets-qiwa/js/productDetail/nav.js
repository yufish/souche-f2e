/**
 * Created by Administrator on 2014/7/1.
 */
define(function() {
    var navControl = {};
    var navTabTop = $("#productDetailInfo .nav").offset().top;

    var init = function() {
        $("#productDetailInfo .nav li").live("click", function() {

            var dataID = $(this).attr("data-id");

            $("#productDetailInfo .contents>div").addClass("hidden");
            $("#productDetailInfo .contents>div[data-id='" + dataID + "']").removeClass("hidden");

            $("#productDetailInfo .nav [data-id='" + dataID + "']").addClass("active").siblings().removeClass("active");

            if ($("#productDetailInfo .nav").css("position") === "fixed") {
                $('html,body').animate({
                    scrollTop: navTabTop + "px"
                }, 1000);
            }
            $(window).trigger("nav_change", dataID)
        });

        var cloneElement;

        // $(window).scroll(function () {
        //     var winTop = $(window).scrollTop();
        //     var height = $("#productDetailInfo").height();

        //     if (winTop > navTabTop && winTop < (navTabTop + height)) {
        //         if(!cloneElement) {
        //             cloneElement = $("#productDetailInfo .nav").clone();
        //             cloneElement.css({
        //                 position: "fixed",
        //                 top: 0,
        //                 width: "100%",
        //                 zIndex: 1000
        //             });

        //             $("#productDetailInfo").append(cloneElement);
        //         }
        //     } else {
        //         /*$("#productDetailInfo .nav").css({
        //             position: "relative",
        //             top:0
        //         });*/
        //         if(cloneElement) {
        //             cloneElement.remove();
        //             cloneElement = undefined;
        //         }
        //     }
        // });
    }

    navControl.init = init;
    return navControl;
});