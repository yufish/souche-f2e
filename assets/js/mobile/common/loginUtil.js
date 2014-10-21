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
        //url: contextPath + "/pages/evaluateAction/isNoRegisterLogin.json",
        url: contextPath + "/pages/evaluateAction/isPhoneLogin.json",
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

//cellphone,token,time
SM.SendValidCode = function(data){
    $.ajax({
        dataType:'json',
        url:contextPath+'/pages/smsCaptchaAction/send.json',
        data:data,
        success:function(e){
            if(e.errorMessage){
                alert('发生错误,请一分钟后重试');
                return;
            }
            if(e.code && e.code =='401'){
                window.location.href = contextPath+"/pages/valid.html";
                return;
            }
        }
    })
}
//phone,yzm
SM.CheckValidLogin =function(data,cb){
    $.ajax({
        dataType:'json',
        url:contextPath+'/pages/evaluateAction/isNoRegisterLoginYzm.json',
        data:data,
        success:function(e){
            if(e.msg){
                alert(e.msg)
                return;
            }
            if(typeof cb =='function')cb();
        }
    })
}

//带验证码的弹出框
function createLoginWithValid(token,time,ValidSuccessCallback){
    var phoneNum = checkUserLocal().phoneNum;
    if(phoneNum){
        var partial='<div id="J_phone_valid" class="user-phone-num">您的手机号:'+phoneNum+'</div>'
                    + '<input id="J_phone-valid" name="cellphone" class="user-phone-num" type="hidden" value="'+phoneNum+'">'
    }else{
       var partial='<input id="J_phone-valid" name="cellphone" class="login-input phone-input" type="tel" placeholder="输入手机号">'
    }
    var html = '<div class="login-area hidden" id="login-form-valid-code">'
        +'<form id="login-form-valid">'
        +    '<div class="form-item">'
        +        partial
        +    '</div>'
        +    '<div class="form-item clearfix">'
        +        '<div class="item-1-2">'
        +        '<input id="J_valid-code" type="tel" class="valid-code-input login-input" placeholder="输入验证码">'
        +        '</div>'
        +        '<div class="item-1-2">'
        +            '<button type="button" class="valid-code-btn" name="cellphone" id="J_get-valid">获取手机验证码</button>'
        +        '</div>'
        +    '</div>'
        +    '<div class="form-item">'
        +        '<button type="submit" class="login-btn" id="J_login-valid">登录</button>'
        +    '</div>'
        +    '<input type="hidden" name="token" id="token-input" value="'+token+'">'
        +    '<input type="hidden" name="time" id="time-input" value="'+time+'">'
        +'</form>'
        +'</div>'
    $(html).appendTo('body');
    var phoneReg = /^1[3458][0-9]{9}$/;
    !function(){
        function checkPhone(){
            var phoneNum = $('#J_phone-valid').val();
            return phoneReg.test(phoneNum)
        }

        $('#J_login-valid').click(function(e){
            e.preventDefault();
            var phoneNum = $('#J_phone-valid').val();
            if(!checkPhone()){
                e.preventDefault();
                alert('请输入正确的手机号')
                return;
            }
            var validCode = $("#J_valid-code").val();

            SM.CheckValidLogin({
                phone:phoneNum,
                yzm:validCode
            },ValidSuccessCallback)
        })


        $('#J_get-valid').click(function(){
            if(!checkPhone()){
                alert('请输入正确的手机号')
                return;
            }
            SM.SendValidCode($('#login-form-valid').serialize())
            var time = 60;
            var self = $(this).text(time+'秒后可重发').prop({disabled:true});
            var handle = setInterval(function(){
                time--;
                if(time==0){
                    self.text('获取手机验证码').prop({disabled:false});
                    clearInterval(handle);
                }else{
                    self.text(time+'秒后可重发');
                }
            },1000)
        })
    }()


}

//不带验证码的弹出框