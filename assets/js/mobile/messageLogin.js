var msgLogin = function () {

    var phoneReg = /^1[3458][0-9]{9}$/;
    return {
        init: function () {
            $('#login-icon').click(function () {
                $('#login-popup').removeClass('hidden');
            });

            $('#btn-get-code').click(function (e) {
                e.preventDefault();
                var phoneNum = $("#phone-for-reg").val();
                if (!phoneReg.test(phoneNum)) {
                    $('#login-popup .wrong-tip').removeClass('hidden');
                    return;
                }
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

                        }
                    }
                });
            })
        }
    }

}();