define(function () {
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
            },
            update: function () {
                initCookie();
            }
        }
    }();
    return CookieUtil;
})

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
        },
        update: function () {
            initCookie();
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