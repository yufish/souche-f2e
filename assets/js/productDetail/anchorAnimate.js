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

            $('html,body').animate(
                {
                    scrollTop: top+50 + "px"
                }
                , 1000);
        });
    }

    var init = function()
    {
        _bind();
    }

    anchorControl.init = init ;
    return anchorControl;
});