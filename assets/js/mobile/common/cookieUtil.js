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