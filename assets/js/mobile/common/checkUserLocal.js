//see ../cookieUtil.js
define(['mobile/common/cookieUtil'], function (CookieUtil) {
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
    return checkUserLocal;
})