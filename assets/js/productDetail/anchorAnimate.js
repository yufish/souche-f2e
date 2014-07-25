/**
 * Created by Administrator on 2014/7/10.
 */
define(function() {
    var anchorControl = {};

    var _bind = function() {
        $(".config_nav li").click(function() {
            var pointerTo = $(this).find("a").attr("anchor");

            var pointerElement = $(".config_content #" + pointerTo);
            var top = pointerElement.offset().top;
            //$(".config_nav li span").removeClass("active");
            //$(this).find("span").addClass("active");

            $('html,body').animate({
                scrollTop: top - 100 + "px"
            }, 1000);
        });

        var topList1 = [];

        var scrollFunction = function() {
            var currentTop = $(window).scrollTop();
            var height = $(".config_content").height();
            var originTop = $(".config_nav").offset().top;

            if (currentTop > (originTop) && currentTop < (height + originTop - $(".config_nav ul").height() - 200)) {
                $(".config_nav ul").css("position", "fixed").css("top", "100px");
                topList1 = [];
                for (var index = 0, len = $(".config_content table").length; index < len; index++) {
                    topList1.push($(".config_content table").eq(index).offset().top - 200);
                }
                for (var index = 0; index < topList1.length - 1; index++) {
                    if (currentTop > topList1[index] && currentTop < topList1[index + 1]) {
                        $(".config_nav li span").removeClass("active");
                        $(".config_nav li").eq(index).find("span").addClass("active");
                        return;
                    }
                }
                $(".config_nav li span").removeClass("active");
                $(".config_nav li").eq(topList1.length - 1).find("span").addClass("active");
            } else {
                $(".config_nav ul").css("position", "relative").css("top", "0px");
            }

        };

        $(window).scroll(scrollFunction);
    }

    var init = function() {
        _bind();
    }

    anchorControl.init = init;
    return anchorControl;
});