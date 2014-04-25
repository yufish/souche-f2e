var CookieUtil = function () {
    var cookieMap = {};
    ! function initCookie() {
        var cookie = document.cookie;
        cookie.split(';').forEach(function (item) {
            var kvPair = item.split('=');
            var key = kvPair[0];
            var value = kvPair[1];
            cookieMap[key.trim()] = value.trim();
        })
    }();

    return {
        init: function () {
            //not delete for old code
        },
        getCookie: function (cName) {
            return cookieMap[cName];
        },
        setCookie: function (key, value) {
            cookie = key + '=' + value;
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