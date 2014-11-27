<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><%@ taglib prefix="sc" uri="http://www.souche.com/tags" %><!DOCTYPE html>
<html>
  <head>
    <title>大搜车,为我选好车-二手车交易市场_二手车评估_二手车网</title>
    <meta name="Description" content="大搜车致力于成为中国最大、最专业的二手车交易服务商；打造诚信、透明的二手车交易平台；为消费者提供最专业的二手车认证、交易及质保服务" />
    <meta name="Keywords" content="二手车网，北京二手车，二手车评估，二手车买卖，二手车门店,二手车检测,二手车交易市场" />
    <meta name="viewport" id="viewport" content="width=1340" /> 
    <meta property="wb:webmaster" content="3a4a81533042fb49" />
    <link rel="shortcut icon" href="<c:url value="/images/favicon.ico"/>"  type="image/x-icon"/>
    <link rel="bookmark" href="<c:url value="/images/favicon.ico"/>"  type="image/x-icon"/>
    <link href="<c:url value="/images/favicon.ico"/>" rel="shortcut icon" type="image/vnd.microsoft.icon"/>
    <link href="<sc:res value="/css/fed/common.css"/>" rel="stylesheet" type="text/css" />
    <link href="<sc:res value="/css/fed/member.css"/>" rel="stylesheet" type="text/css" />
    <link href="<sc:res value="/assets/css/souche/ui.css"/>" rel="stylesheet" type="text/css" />
    <link href="<sc:res value="/assets/css/minilogin.css"/>" rel="stylesheet" type="text/css" />
    <script>
      var contextPath = "<%=request.getContextPath() %>";
    </script>
    <script type="text/javascript" src="<sc:res value="/js/common/jquery-1.7.1.min.js" />"></script>
    <script type="text/javascript" src="<sc:res value="/assets/js/souche/stats.js"/>"></script>
  </head>
<body>
  <div class="mem">
    <div class="mem-feed">
       <div class="mem-head">
        <div class="mem-close" click_type="minilogin-close"></div>
        <div class="mem-title">登陆</div>
       </div>
        <form  class="mem-form" id="loginform" action="<c:url value='/pages/j_spring_security_check'/>" method="post" >
          <input type="hidden" value="ajaxUserLogin" name="j_type" />
          <input type="hidden" value="0" id="login_type" />
          <input type="hidden" value="${views.time }" id="time" />
          <input type="hidden" value="${views.token }" id="token" />
          <input type="hidden" value="" name="j_param" id="j_param" />
        <div class="mem-error" style="display:none;">您输入的密码和账户名不匹配</div>
        <div class="mem-controller clearfix" id="J-tel-controller">
          <label for="mem-tel" class="mem-label">手机号：</label>
          <input type="text" name="phone" id="mem-tel" class="mem-text-input" placeholder="请输入正确的手机号"/>
          <div class="input-error-tip hidden"><span class="error-icon"></span>请输入正确的手机号</div>
        </div>
        <div class="mem-controller clearfix" id="J-pwd-controller">
          <label for="mem-password" class="mem-label">验证码：</label>
          
                    <input type="text" id="mem-password" name="yzm" class="mem-send member-psd" value="" placeholder="请查收短信" />
          <button class="send" type="button" id="get-code">获取验证码</button>
        
        </div>
        <div class="submit-controller">
          <input type="submit" class="mem-button" click_type="minilogin-yzm" id="login_button"  value="登 录"  />
        </div>
      </form>
    </div>
    <div class="other-login">
      <h1>你也可以使用社交账号直接登陆</h1>
      <div class="social-num">
        <div class="social-item" style="margin-left:0px;">
          <a href="#" class="tenxun"></a>
          <div class="social-tit">腾讯QQ</div>
        </div>
        <div class="social-item">
          <a href="#" class="weixin"></a>
          <div class="social-tit">微信</div>
        </div>
        <div class="social-item">
          <a href="#" class="weibo"></a>
          <div class="social-tit">新浪微博</div>
        </div>
      </div>
    </div>
  </div>

  
<script type="text/javascript">

var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");

document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F14b4aac5aa4127a195c3dd1a4049180f' type='text/javascript'%3E%3C/script%3E"));
$(".mem-close").click(function(){
  window.parent.window.Souche.MiniLogin.close();
});
var nowCountIndex= 60;
   var recount60 = function(){
     if(nowCountIndex>0){
       $("#get-code").html(nowCountIndex+"秒后可重发").attr("disabled",true);
       nowCountIndex-=1;
       setTimeout(function(){
        recount60();
      },1000);
     }else{
      $("#get-code").html("发送验证码").attr("disabled",false);
    }
  }
   var phoneReg = /^1[3458][0-9]{9}$/;
$("#get-code").on("click",function(){
  if(!phoneReg.test($("#mem-tel").val())){
        $("#mem-tel").parent().find(".input-error-tip").removeClass("hidden");
        return;
      }
      $("#mem-tel").parent().find(".input-error-tip").addClass("hidden");
  nowCountIndex= 60;
  recount60();
  $.ajax({
    url:contextPath+"/pages/smsCaptchaAction/send.json",
    data:{
      cellphone:$("#mem-tel").val(),
      token:$("#token").val(),
      time:$("#time").val()
    },
    dataType:"json",
    success:function(data){
      if(data.code&&data.code==401){
      window.parent.window.location.href=contextPath+"/pages/valid.html"
      }else if (data.error){
        alert(data.error);
      }
      else{
      }
    }
  })
});
$("#loginform").on("submit",function(e){
 e.preventDefault();
 if(!phoneReg.test($("#mem-tel").val())){
     $("#mem-tel").parent().find(".input-error-tip").removeClass("hidden");
     return;
   }else{
   $("#mem-tel").parent().find(".input-error-tip").addClass("hidden");
   }
 $.ajax({
  url:contextPath+"/pages/evaluateAction/isNoRegisterLoginYzm.json",
  data:$("#loginform").serialize(),
  dataType:"json",
  success:function(data){

    if (data.msg){
      alert(data.msg);
    }else{
    window.parent.window.Souche.MiniLogin.close();
    window.parent.window.Souche.MiniLogin.callback();
    }
    }
  });
});

</script>
</body>
</html>
