/**
 * Created by zilong on 2014/8/26.
 */
if(typeof $.cookie == "function") {
    var checkUserLocal = function () {
        var phoneReg = /^1[3458][0-9]{9}$/;
        var username = $.cookie('username')
        if (phoneReg.test(username)) {
            return {
                'phoneNum': username
            };
        }
        var noregisteruser = $.cookie('noregisteruser');
        if (phoneReg.test(noregisteruser)) {
            return {
                phoneNum: noregisteruser
            };
        }
        return {
            phoneNum: undefined
        }
    }
}
window.SM=window.SM||{};
//检查是否填过手机号
SM.checkPhoneExist = function(callback) {
    $.ajax({
        url: contextPath + "/pages/evaluateAction/isNoRegisterLogin.json",
        type: "post",
        dataType: "json",
        success: function(data) {
            if (data.result == "true") {
                callback(true)
            } else {
                callback(false)
            }
        },
        error: function() {
            callback(false)
        }
    })
};
//一步注册手机号
SM.PhoneRegister = function(phone, callback) {
    $.ajax({
        url: contextPath + "/pages/evaluateAction/noRegisterLogin.json",
        type: "post",
        dataType: "json",
        data: {
            phone: phone
        },
        success: function(data) {
            if (data.errorMessage) {
                callback(false)
            } else {
                callback(true)
            }
        },
        error: function() {
            callback(false)
        }
    })
};