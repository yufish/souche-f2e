/**
 * Created by Administrator on 2014/6/19.
 */
define(function()
{
    var config={};

    var submitYuyue = function() {
        $.ajax({
            url: config.api_saleCarOrder,
            data: {
                phone: $("#yuyue-phone").val(),
                carId: config.carId
            },
            type: "post",
            success: function(data) {
                $('body').append(data);
                $(".wrapGrayBg").show();
                $("#yuyue-popup").addClass("hidden");
                $("#yuyue-result-popup").removeClass('hidden');
            }
        })
    }

    var init = function(_config) {
        $.extend(config,_config);

        $("#yuyue-form").on("submit", function (e) {
            e.preventDefault();
            if (!phoneReg.test($("#yuyue-phone").val())) {
                $(".warning", this).removeClass("hidden");
            } else {

                Souche.PhoneRegister($("#yuyue-phone").val(), function () {
                    submitYuyue();
                })
            }
        })

        $("#yuyue-phone").blur(function (e) {
            e.preventDefault();
            if (!phoneReg.test($("#yuyue-phone").val())) {
                $(".warning", $("#yuyue-form")).removeClass("hidden");
            } else {
                $(".warning", $("#yuyue-form")).addClass("hidden");
                $(".phone-true").removeClass("hidden");
            }
        })
        var flagD = false;
        $("#J_yuyue,#J_nav_yuyue").click(function (e) {
            e.preventDefault();
            if (this.id == "J_yuyue") $(this).addClass('yuyue-loading').html("预约中...");
            $(this).removeClass('detail-yuyue');
            if ($(this).hasClass('yuyue-haved') || flagD) {
                return;
            }
            //一秒内只能点一次。
            flagD = true;
            setTimeout(function () {
                flagD = false;
            }, 1000)
            Souche.checkPhoneExist(function (is_login) {
                if (is_login) {
                    submitYuyue();
                } else {
                    $("#yuyue-popup").removeClass("hidden")
                    $(".wrapGrayBg").show();
                }
                $("#login_button").attr("disabled", false);
            })
        });
        $('#yuyue-popup .apply_close').live('click', function () {
            $("#J_yuyue,#J_nav_yuyue").removeClass('yuyue-loading');
            $("#J_yuyue").html("预约看车");
            $("#J_yuyue,#J_nav_yuyue").addClass('detail-yuyue');
        });
        $('#yuyue-result-popup .apply_close').live('click', function () {

            if (!$("#yuyue-result-popup .yuyue-full").length) {
                $("#J_yuyue,#J_nav_yuyue").remove();
                $('.detail-button').prepend("<div class='detail-yuyue yuyue-haved'>已预约</div>");
                $('.detail-nav-right').append("<div class='detail-nav-yuyue nav-yuyue-haved'></div>");
            } else {
                $("#J_yuyue").removeClass("yuyue-loading").addClass("detail-yuyue").html("预约看车");
            }

            $(this).parent().addClass('hidden');
            $(".wrapGrayBg").hide();
        });
    }

    var  yuyueControl = {
        init:init
    };

    return yuyueControl;
});