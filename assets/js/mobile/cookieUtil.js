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

    return {
        init: function () {
            initCookie();
        },
        getCookie: function (cName) {
            return cookieMap[cName];
        },
        setCookie: function (key, value) {
            cookie = key + '=' + value;
            (document.cookie = [
                key, '=', value,
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        },
        update: function () {
            initCookie();
        },
        removeCookie:function(key,value){
            if (this.getCookie(key) === undefined) {
                return false;
            }
            this.setCookie(key,values,{expires: -1})
        }
    }
}();
var checkUserLocal = function () {
    CookieUtil.update();
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