/**
 * Created by Administrator on 2014/6/19.
 */

define(function()
{
    var navControl = {};

    var init = function() {
        var navSaleTabTop = $("#onsale_tab").offset().top;
        var navSaleTabHeight = $("#onsale_tab").height();

        $(window).scroll(function () {
            var winTop = $(window).scrollTop();

            if (winTop > navSaleTabTop) {
                $("#onsale_tab").css({
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000
                })
            } else {
                $("#onsale_tab").css({
                    position: "relative"
                })
            }
            var onSaleHeight = $(".onsale-summary").height();
            if (winTop > navSaleTabTop + onSaleHeight - 40) {
                $("#onsale_tab").css({
                    position: "relative"
                })
            }
        });
    }

    navControl.init = init;
    return navControl;
});