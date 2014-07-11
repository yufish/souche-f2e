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

        var originTop = $(".config_nav").offset().top;
        $(window).scroll(function()
        {
            var currentTop  = $(window).scrollTop();
            var height = $(".config_content").height();

            if(currentTop>originTop&&currentTop<(height+originTop-$(".config_nav ul").height()-200))
            {
                $(".config_nav ul").css("position","fixed").css("top","100px");
            }
            else
            {
                $(".config_nav ul").css("position","relative").css("top","0px");
            }

        })
    }

    var init = function()
    {
        _bind();
    }

    anchorControl.init = init ;
    return anchorControl;
});