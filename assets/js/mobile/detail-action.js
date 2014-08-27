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
                SM.checkPhoneExist(function(is_login) {
                    if (is_login) {
                        submitYuyue();
                    } else {
                        showPopup($('#for-yuyue'));
                    }
                })
            })
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
            var submitYuyue = function () {
                $("#yuyue_submit").html('预约中...');
                $("#btn-yuyue").val('预约中...');
                $.ajax({
                    url: $("#yuyue_submit").attr("href"),
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
            $("#fav_submit").on("click", function (e) {
                e.preventDefault();
                SM.checkPhoneExist(function(is_login) {
                    if (is_login) {
                        submitFav();;
                    } else {
                        showPopup($('#for-fav'))
                    }
                })
            })
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
            var submitFav = function () {
                if($("#fav_submit").hasClass("active")){
                    delFav()
                }else{
                    saveFav();
                }

            };
            var favUrl = {
                fav: contextPath + '/pages/saleDetailAction/savaCarFavorite.json',
                unfav: contextPath + '/pages/saleDetailAction/delCarFavorite.json'
            };
            function saveFav(){
                $("#fav_submit .fav-text").html('收藏中...')
                $.ajax({
                    url: favUrl.fav,
                    dataType: "json",
                    data: {
                        platform : 'PLATFORM_H5'
                    },
                    success: function (data) {
                        $("#fav_submit .fav-text").html("已收藏")
                        $("#fav_submit").addClass('active');
                        hidePopup();
                    }
                })
            }
            function delFav(){
                $("#fav_submit .fav-text").html('取消中...')
                $.ajax({
                    url: favUrl.unfav,
                    dataType: "json",
                    data: {
                        platform : 'PLATFORM_H5'
                    },
                    success: function (data) {
                        $("#fav_submit .fav-text").html("收藏")
                        $("#fav_submit").removeClass('active');
                        hidePopup();
                    }
                })
            }
            var showPopup = function ($popup) {
                var scrollTop = $(window).scrollTop();
                var top = scrollTop + 100;
                $popup.css({
                    top: top
                }).removeClass("hidden");
                $(".wrapGrayBg").removeClass('hidden');
            };
            function hidePopup() {
                $('#for-yuyue').addClass('hidden');
                $('#for-fav').addClass('hidden');
                $('.wrapGrayBg').addClass('hidden');
            }
            $('.phone-input').focus(function () {
                $('.wrong-tip').addClass('hidden');
            });


            $("#show_stantard").on("click",function(){
                $("#standard").css({
                    left:"2.5%",
                    top:30
                }).removeClass("hidden")
                $(".wrapGrayBg").removeClass('hidden');
            })
            $('#hide_standard').click(function(){
                $('.wrapGrayBg').addClass('hidden');
                $("#standard").addClass('hidden')
            })

        }
    }
})();