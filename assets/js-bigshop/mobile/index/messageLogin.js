var msgLogin = function () {

    var phoneReg = /^1[3458][0-9]{9}$/;
    return {

        init: function () {
            var nextUrl = '';

            function showPopup() {
                $('.wrapGrayBg').removeClass('hidden');
                $('#login-popup').removeClass('hidden').css({
                    top: 50
                });
            }
            $('#login-icon').click(function () {
                nextUrl = '/pages/mobile/index.html'
                showPopup();
            });
            var seconds;
            var $btnCode = $('#btn-get-code');

            var intervalHandler;

            function wait60() {
                $btnCode.text(seconds + '秒后可点击');
                if ((seconds--) == 0) {
                    clearInterval(intervalHandler);
                    $btnCode.text('获取验证码');
                    $btnCode.removeAttr("disabled");
                }
            }
            $btnCode.click(function (e) {
                e.preventDefault();
                var phoneNum = $("#phone-for-reg").val();
                if (!phoneReg.test(phoneNum)) {
                    $('#login-popup .wrong-tip').removeClass('hidden');
                    return;
                }
                seconds = 60;
                $btnCode.attr("disabled", "disabled");
                intervalHandler = setInterval(wait60, 1000);
                $('#login-popup .wrong-tip').addClass('hidden');

                $.ajax({
                    url: contextPath + "/pages/sendMessageAction/sendMessage.json",
                    data: {
                        phoneNumber: phoneNum
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.error) {
                            alert(data.error);
                        }
                    }
                })
            });

            $('#login-form').submit(function (e) {
                e.preventDefault();
                $.ajax({
                    url: contextPath + "/pages/evaluateAction/isNoRegisterLoginYzm.json",
                    data: $("#login-form").serialize(),
                    dataType: "json",
                    success: function (data) {
                        if (data.msg) {
                            alert(data.msg);
                        } else {
                            window.location.href = contextPath + nextUrl;
                        }
                    }
                });
            })

            $('#footprint').click(function (e) {
                nextUrl = '/pages/mobile/center-fav.html'
                showPopup();
            })

            $('.wrapGrayBg').click(function () {
                $(this).addClass('hidden');
                $('.login-popup').addClass('hidden');
            })
        }
    }

}();