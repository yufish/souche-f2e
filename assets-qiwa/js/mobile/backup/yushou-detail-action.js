var Action = (function () {
    var phoneReg = /^1[3458][0-9]{9}$/;
    return {
        init: function () {
            var hasYuyue = false;
            $("#yuyue_submit").on("click", function (e) {
                e.preventDefault();
                var self = this;
                if (hasYuyue)
                    return;

                if (checkUserLocal().phoneNum) {
                    submitYuyue();
                } else {
                    showPopup($('#for-yuyue'));
                }

            })
            //yuyue
            var showPopup = function ($popup) {
                var scrollTop = $(window).scrollTop();
                var top = scrollTop + 100;
                $popup.css({
                    top: top
                }).removeClass("hidden");
                $(".wrapGrayBg").removeClass('hidden');
            };

            var hasFav = false;
            $("#fav_submit").on("click", function (e) {
                e.preventDefault();
                var self = this;
                if (hasFav)
                    return;
                if (checkUserLocal().phoneNum) {
                    submitFav();
                } else {
                    showPopup($('#for-fav'))
                }
            })

            function hidePopup() {
                $('#for-yuyue').addClass('hidden');
                $('#for-fav').addClass('hidden');
                $('.wrapGrayBg').addClass('hidden');
            }
            $('.wrapGrayBg').on("click", function (e) {
                e.preventDefault();
                hidePopup();
            });

            $('#yuyue-form').on('submit', function (e) {
                e.preventDefault();
                var phoneNum = $("#phone-for-yuyue").val();
                if (!phoneReg.test(phoneNum)) {
                    $(".wrong-tip", this).removeClass("hidden");
                } else {
                    SM.PhoneRegister(phoneNum, function () {
                        submitYuyue();
                    })
                }
            });

            $('#fav-form').on('submit', function (e) {
                e.preventDefault();
                var phoneNum = $("#phone-for-fav").val();
                if (!phoneReg.test(phoneNum)) {
                    $(".wrong-tip", this).removeClass("hidden");
                } else {
                    SM.PhoneRegister(phoneNum, function () {
                        submitFav();
                    })
                }
            });

            var submitYuyue = function () {
                $("#yuyue_submit").html('预约中...');
                $("#btn-yuyue").val('预约中...');
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
                        hidePopup();
                    }
                })
            };



            var submitFav = function () {
                $("#fav_submit").html('收藏中...')
                $("#btn-fav").val('收藏中...');
                $.ajax({
                    url: $('#fav_submit').attr("href"),
                    dataType: "json",
                    data: {
                        platform : 'PLATFORM_H5'
                    },
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
                        hidePopup();
                    }
                })

            };

            $('.phone-input').focus(function () {
                $('.wrong-tip').addClass('hidden');
            })
        }
    }
})();