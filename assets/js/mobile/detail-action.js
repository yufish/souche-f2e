var Action = (function () {
    var phoneReg = /^1[3458][0-9]{9}$/;
    return {
        init: function () {
            var hasYuyue = false;
            // true:预约; false:收藏
            var funcFlag = true;
            $("#yuyue_submit").on("click", function (e) {
                e.preventDefault();
                var self = this;
                if (hasYuyue)
                    return;

                SM.checkPhoneExist(function (is_login) {
                    if (is_login) {
                        submitYuyue();
                    } else {
                        funcFlag = true;
                        showPopup_y();
                    }
                })
            })
            //yuyue
            var showPopup_y = function () {
                if (funcFlag) {
                    $('#yuyue-form .tip').html('  输入您的手机号码,一键完成预约.');
                    $('#yuyue-form #yuyue-sumbit-btn').html('预约');
                } else {
                    $('#yuyue-form .tip').html('  输入您的手机号码,一键完成收藏.');
                    $('#yuyue-form #yuyue-sumbit-btn').html('收藏');
                }
                $("#yuyue-popup").removeClass("hidden");
                $(".wrapGrayBg").show();
            };

            $('#yuyue-back').on("click", function (e) {
                e.preventDefault();
                $('#yuyue-popup').addClass('hidden');
                $('.wrapGrayBg').hide();
            });

            $('#yuyue-form').on('submit', function (e) {
                e.preventDefault();
                if (!phoneReg.test($("#yuyue-phone").val())) {
                    $(".warning", this).removeClass("hidden");
                } else {
                    SM.PhoneRegister($("#yuyue-phone").val(), function () {
                        if (funcFlag) {
                            submitYuyue();
                        } else {
                            submitFav();
                        }
                    })
                }
            });

            var animate = function () {
                var popup = $('#yuyue-popup');
                var width = $(window).width();
                var height = $(window).height();
                var divH = $('#actions').height();
                if (funcFlag) {
                    var pos = {
                        x: 0.2 * width,
                        y: height - divH - 40
                    };
                } else {
                    var pos = {
                        x: 0.55 * width,
                        y: height - divH - 40
                    };
                }
                popup.animate({
                        width: 0,
                        height: 0,
                        left: pos.x,
                        top: pos.y
                    },
                    350,
                    'linear',
                    function () {
                        popup.addClass('hidden');
                        popup.css({
                            width: '100%',
                            height: '100%',
                            top: '0px',
                            left: '0'
                        });
                    });

            };

            var submitYuyue = function () {
                $("#yuyue-sumbit-btn").html('预约中...');
                $.ajax({
                    url: $("#yuyue_submit").attr("href"),
                    // url:config.api_saleCarOrder,//TODO
                    type: "post",
                    dataType: "json",
                    success: function (data) {

                        if (data.errorMessage) {
                            alert(data.errorMessage)
                            $("#yuyue_submit").html("预约到店看车")
                        } else {
                            if (data.code && data.code == "200") {
                                $("#contactNum")
                                    .html($("#contactNum").html() * 1 + 1)
                                $("#yuyue_submit").addClass("disabled")
                                    .html("已预约成功")
                                hasYuyue = true
                            } else if (data.code && data.code == "402") {
                                alert("您已经预约过该车,七天之内不能重复预约!")
                                $("#yuyue_submit").addClass("disabled")
                                    .html("已预约成功")
                                hasYuyue = true
                            } else {
                                alert("预约出错，请联系客服!")
                                $("#yuyue_submit").html("预约到店看车")
                            }
                        }

                        animate();
                    }
                })
            };

            var hasFav = false;
            $("#fav_submit").on("click", function (e) {
                e.preventDefault();
                var self = this;
                if (hasFav)
                    return;
                SM.checkPhoneExist(function (is_login) {
                    if (is_login) {
                        submitFav();
                    } else {
                        funcFlag = false;
                        showPopup()
                    }
                })

            })

            var submitFav = function () {
                $("#yuyue-sumbit-btn").html('收藏中...')
                $.ajax({
                    url: $('#fav_submit').attr("href"),
                    /*
                     * url:config.api_saleCarOrder,//TODO data:{
                     * phone:$("#yuyue-phone").val(), carId:config.carId },
                     */
                    dataType: "json",
                    success: function (data) {
                        if (data.errorMessage) {
                            alert(data.errorMessage)
                            $("#fav_submit").html("收藏")
                        } else {

                            $("#fav_submit").addClass("disabled").html("已收藏")
                            hasFav = true
                            $("#carFavoriteNum").html(
                                $("#carFavoriteNum").html() * 1 + 1)
                        }
                        //$('#yuyue-popup').addClass('hidden');
                        //$(".wrapGrayBg").hide();
                        animate();
                    }
                })

            };
        }
    }
})();