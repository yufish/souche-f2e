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
        var crmid=$.cookie('crmid');
        if (phoneReg.test(crmid)) {
            return {
                phoneNum: crmid
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

//带验证码的弹出框
function createLoginWithValid(){
    var html = '<div class="login-area" id="login-form-valid-code">'
        +'<form id="login-form-valid">'
        +    '<div class="form-item">'
        +        '<input id="J_phone-valid" class="login-input phone-input" type="tel" placeholder="输入手机号">'
        +    '</div>'
        +    '<div class="form-item clearfix">'
        +        '<div class="item-1-2">'
        +        '<input id="J_valid-code" type="tel" class="valid-code-input login-input" placeholder="输入验证码">'
        +        '</div>'
        +        '<div class="item-1-2">'
        +            '<button type="button" class="valid-code-btn" id="J_get-valid">获取手机验证码</button>'
        +        '</div>'
        +    '</div>'
        +    '<div class="form-item">'
        +        '<button type="submit" class="login-btn" id="J_login-valid">登录</button>'
        +    '</div>'
        +'</form>'
        +'</div>'
    $(html).appendTo('body');
    var phoneReg = /^1[3458][0-9]{9}$/;
    function checkPhone(){
        var phoneNum = $('#J_phone-valid').val();
        return phoneReg.test(phoneNum)
    }
    $('#J_login-valid').click(function(){
        var phoneNum = $('#J_phone-valid').val();
        if(!checkPhone()){
            e.preventDefault();
            alert('请输入正确的手机号')
            return;
        }
        var validCode = $("#J_valid-code").val();
    })
    $('#J_get-valid').click(function(){
        if(!checkPhone()){
            alert('请输入正确的手机号')
            return;
        }
        var time = 60;
        var self = $(this).text('xx '+time+'s xx').prop({disabled:true});
        var handle = setInterval(function(){
            time--;
            if(time==0){
                self.text('获取手机验证码').prop({disabled:false});
                clearInterval(handle);

            }else{
                self.text('xx '+time+'s xx');
            }
        },1000)
    })

}

//不带验证码的弹出框