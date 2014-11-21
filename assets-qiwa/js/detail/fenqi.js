/**
 * Created by Administrator on 2014/6/25.
 */
define(function()
{
    var fenqiControl = {};

    var init = function()
    {
        var phoneReg = /^1[3458][0-9]{9}$/;
        var $arrowTime = $("#arrow-time"),
            $mortgage = $("#arrow-mortgage"),
            $arrowrate = $("#arrow-rate"),
            $interest = $("#arrow-rate").attr('interest'),
            $fenqiList = $("#fenqi_list"),
            $fenqiTime = $("#fenqi_list li"),
            $fenqiTimeWrap = $("#fenqi-wrap");
        $fenqiMort = $("#fenqi-mort");

        $("#link-to-fenqi").click(function() {
            $("#fenqi-popup").removeClass("hidden");
            $(".wrapGrayBg").show();
            return false;
        });

        var changeArrow = function(time) {
            var timeArrow, mortArrow,
                str = "fenqi-arrow arrow";
            if ($interest == "1") {
                switch (time) {
                    case "6":
                        timeArrow = "0";
                        mortArrow = "3";
                        break;
                    case "12":
                        timeArrow = "1";
                        mortArrow = "2";
                        break;
                    case "24":
                        timeArrow = "2";
                        mortArrow = "1";
                        break;
                    case "36":
                        timeArrow = "3";
                        mortArrow = "4";
                        break;
                }
            } else {
                switch (time) {
                    case "12":
                        timeArrow = "1";
                        mortArrow = "3";
                        break;
                    case "24":
                        timeArrow = "2";
                        mortArrow = "2";
                        break;
                    case "36":
                        timeArrow = "3";
                        mortArrow = "1";
                        break;
                }
            }

            $arrowTime.attr("class", str + timeArrow);
            $mortgage.attr("class", str + mortArrow);
        };

        $("#fenqi_select").click(function(event) {
            $fenqiList.show();
            event.stopPropagation();
        });
        $("body, html").click(function() {
            $fenqiList.hide();
        });
        $fenqiTime.click(function() {
            var $this = $(this),
                time = $this.attr("time"),
                mortgage = $this.attr("mortpay"),
                rate = $this.attr("rate"),
                text = $this.text();

            $fenqiTimeWrap.text(text);
            $arrowrate.text(rate);
            $fenqiMort.text(mortgage);
            changeArrow(time);
        });
    }

    fenqiControl.init = init;
    return fenqiControl;
});