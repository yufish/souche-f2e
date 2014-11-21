/**
 * Created by Administrator on 2014/6/27.
 */
define(function()
{
    var thirdPartyControl = {};

    var submitToPhone = function() {
        $.ajax({
            url: $("#ph-form")[0].action,
            data: {
                carId: SaleDetailConfig.carId
            },
            type: "post",
            success: function(data) {
                $('body').append(data);
                $(".wrapGrayBg").show();
                $("#ph-popup").addClass("hidden")
                $("#ph-result-popup").removeClass('hidden');
            }
        })
    }

    var init = function(SaleDetailConfig)
    {
        $(".detail-share .address").mousemove(function() {
            $(".adress-open").removeClass("hidden");
        });

        $(document.body).on("click", function(e) {
            if (!$(e.target).closest(".adress-open").length) {
                $(".adress-open").addClass("hidden");
            }
        });

        var submitAddress = function() {
            $.ajax({
                url: SaleDetailConfig.api_AddressToPhone,
                data: {
                    phone: $("#address-phone").val()
                },
                type: "post",
                success: function() {

                    $(".adress-open").addClass("hidden");
                }
            })
        };

        $("#adress-from").on("submit", function(e) {
            e.preventDefault();
            if (!phoneReg.test($("#address-phone").val())) {
                alert("请输入正确手机号码");
            } else {
                submitAddress();
            }
        });

        $(".detail-share .wx").click(function(e) {
            e.stopPropagation()
            $("#wx-popup").removeClass("hidden").css({
                left: $(".detail-share .wx").offset().left - 98,
                top: $(".detail-share .wx").offset().top - 210
            })
            $("#wx-popup img").attr("src", $("#wx-popup img").attr("data-src"))
        });

        $(".detail-share .ph").click(function() {
            $("#ph-popup .popup-title").html("保存到手机")
            $("#ph-popup .apply_close").attr("click_type", SaleDetailConfig.sendCarClose)
            $("#ph-popup .ph-submit").attr("click_type", SaleDetailConfig.sendCarSubmit)
            $("#ph-popup .tip").html("车辆内容会以短信方式保存到您的手机")
            $("#ph-form")[0].action = SaleDetailConfig.api_sendCarToPhone
            Souche.checkPhoneExist(function(is_login) {
                if (is_login) {
                    submitToPhone();
                } else {
                    $("#ph-popup").removeClass("hidden")
                    $(".wrapGrayBg").show();
                }
            })
        });

        $("#ph-form").on("submit", function(e) {
            e.preventDefault();
            if (!phoneReg.test($("#ph-phone").val())) {
                $(".warning", this).removeClass("hidden");
            } else {
                Souche.PhoneRegister($("#ph-phone").val(), function() {
                    submitToPhone();
                })

            }
        });

        $("#ph-phone").blur(function(e) {
            e.preventDefault();
            if (!phoneReg.test($("#ph-phone").val())) {
                $(".warning", $("#ph-form")).removeClass("hidden");
            } else {
                $(".warning", $("#ph-form")).addClass("hidden");
                $(".phone-true").removeClass("hidden");
            }
        });

        $(document.body).click(function() {
            $("#wx-popup").addClass("hidden")
        });
    }

    thirdPartyControl.init =  init;
    return thirdPartyControl
})