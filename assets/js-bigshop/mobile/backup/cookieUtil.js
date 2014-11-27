var CookieUtil = function () {
    var cookieMap = {};

    function initCookie() {
        cookieMap = {};
        var cookie = document.cookie;
        cookie.split(';').forEach(function (item) {
            var kvPair = item.split('=');
            var key = kvPair[0];
            var value = kvPair[1];
            cookieMap[key.trim()] = value.trim();
        })
    };
    initCookie();

    return {
        init: function () {
            initCookie();
        },
        getCookie: function (cName) {
            return cookieMap[cName];
        },
        setCookie: function (key, value,options) {
            document.cookie=key+'='+value;
        },
        update: function () {
            initCookie();
        },
        removeCookie:function(key,value){
            if (cookieMap[key] === undefined) {
                return false;
            }
            document.cookie = name + '='+value+'; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        }
    }
}();
var checkUserLocal = function () {
    var phoneReg = /^1[3458][0-9]{9}$/;
    var username = CookieUtil.getCookie('username')
    if (phoneReg.test(username)) {
        return {
            'phoneNum': username
        };
    }
    var noregisteruser = CookieUtil.getCookie('noregisteruser');
    if (phoneReg.test(noregisteruser)) {
        return {
            phoneNum: noregisteruser
        };
    }
    return {
        phoneNum: undefined
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