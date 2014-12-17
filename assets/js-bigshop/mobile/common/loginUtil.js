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
        url: contextPath + "/json/logined.json",
        type: "post",
        dataType: "json",
        success: function(data) {
            if (data.toString().replace(/\s/g,'') == "true") {
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
        url: contextPath + "/json/login.json",
        type: "post",
        dataType: "json",
        data: {
            phone: phone
        },
        success: function(data) {
            if (data.errorMessage) {
                callback(false,data.errorMessage)
            } else {
                $.cookie("crmUserId",data.item.crmUserId);
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
            if(e.code && e.code =='401'){
                window.location.href = contextPath+"/pages/valid.html";
                return;
            }
            if(e.error){
                alert(e.error);
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
SM.checkPhoneNumReg=function(phoneNum){
    var phoneReg = /^1[3458][0-9]{9}$/;
    return phoneReg.test(phoneNum)
}
//带验证码的弹出框
SM.createLoginWithValid =function (token,time,isRightDefend){
    var phoneNum = checkUserLocal().phoneNum;
    if(phoneNum){
        var partial='<div id="J_phone_valid" class="user-phone-num">您的手机号:'+phoneNum+'</div>'
                    + '<input id="J_phone-valid" name="cellphone" class="user-phone-num" type="hidden" value="'+phoneNum+'">'
    }else{
       var partial='<input id="J_phone-valid" name="cellphone" class="login-input phone-input" type="tel" placeholder="输入手机号">'
    }
    var rightReason='';
    if(isRightDefend){
        rightReason = '<div class="form-item">'
            +           '<textarea id="guard-reason"  rows="6"  placeholder="请输入维权原因"></textarea>'
            +           '<input name="type" value="weiquan" type="hidden">'
            +    '</div>';
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
        +    rightReason
        +    '<div class="form-item">'
        +        '<button type="submit" class="login-btn" id="J_login-valid">确定</button>'
        +    '</div>'
        +    '<input type="hidden" name="token" id="token-input" value="'+token+'">'
        +    '<input type="hidden" name="time" id="time-input" value="'+time+'">'
        +'</form>'
        +'</div>'
    $(html).appendTo('body');

    !function(){
        $('#J_get-valid').click(function(){
            var phoneNum  =$("#J_phone-valid").val();
            if(!SM.checkPhoneNumReg(phoneNum)){
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