(function(){

  //var wapGlobal = "http://192.168.0.217:8080/soucheweb/pages/";//
  //  var wapGlobal = require('wap-global');
      
//      $("#register-button").click(function(){
//          if(check() == true){
//              $("#all-validate").val("yes");
//          }
//
//      });
      
      function isPhoneNumber(mobile){
          if(mobile.length==0){
             return false;
          }    
          if(mobile.length!=11){
              return false;
          }
          
          var myreg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
          if(!myreg.test(mobile)){
              return false;
          }
          return true;
      }
      
      // 检查表单
      function check(){
          var errorMsg;
          var phoneNum = $('#phone').val();//电话号码
          var ver = $('#verification').val();
          var pwd = $('#pwd').val();
          var repwd = $('#repwd').val();
          var person_name = $('#person_name').val();
          if (!isPhoneNumber(phoneNum)) {              
              errorMsg = '电话号码不正确';
              alert(errorMsg);
              return false;
          };
          if (pwd.length < 6 || pwd.length > 10 ) {            
              errorMsg = '密码长度错误，请输入6~10位';
              alert(errorMsg);
              return false;
          };
//          if (pwd.length != repwd.length || pwd != repwd) {
//              errorMsg = '两次输入的密码不相符';
//              alert(errorMsg);
//              return false;   
//          };

          if (person_name.length < 1) {            
              errorMsg = '请填写姓名！';
              alert(errorMsg);
              return false;
          };
          return true;
      };
      
      //绑定获得验证码
      $('#getver').bind('click', function () {
          var phoneNum = $('#phone').val();                    
          var isMobile = isPhoneNumber(phoneNum);
          if (!isMobile) {
              $('#phone').focus();
              alert('号码格式错误');
          } else {
              starttime($(this));     
              var url = $(this).attr("data-url");
              var formdata = 'phoneNumber=' + phoneNum + '&type='+'register';
              $.ajax({
                  type: 'POST',
                  url: url,
                  data: formdata,    
                  dataType:'json',                    
                  success: function (data) {
                      if(data.msg){
                          alert( data.msg);   
                          if(t != null){                          
                              clearInterval(t);
                              Time = 60;
                              t = null;
                          }
                          $('#getver').html("获取验证码");
                          $('#getver').attr("disabled",false);
                          $('#getver').button( "refresh" );
                      }else {
                          alert('验证码已经发送,请注意接收');
                      }
                  },
                  error: function (error) {
                      console.log("验证码获取失败:"+url);
                      console.log(error);
                  }
              });
          };
      });
      
      //
      var Time = 60; //设置时间　单位：秒 
      var t=null;     
      function starttime(o){
          if(t==null) {
              o.attr('disabled',true);
              t = setInterval(function(){
                  e(o);
                  },1000);
          }
      }
      function e(o){
          Time -= 1;                  
          if (Time==0) {
              clearInterval(t);
              o.attr('disabled',false);
              o.html('获取验证码');         
              Time = 60;
              t = null;
          }else {
              o.html(Time+'秒后可重新发送...');   
          }   
      } 

      $("#register-form").on("submit",function(e){
          e.preventDefault();
          if(!check()){
              return false;
          }
          $("#repwd").val($("#pwd").val())
          $.ajax({
              url:$("#register-form").attr("action"),
              dataType:"json",
              data:$("#register-form").serialize(),
              type:"post",
              success:function(data){
                  if(data.id){
                      console.log(data.id);
                      if(data.msg != null){
                        alert(data.msg);  
                      }
                    }else{
                      alert("注册成功");
                      console.log(data);
                      var loginUrl = $('#redirectUrl').attr('data-url');
                      var loginFormdata = 'j_type=ajaxUserLogin&j_username=' + $('#phone').val() + '&j_password=' + $('#pwd').val();         
                      $.ajax({
                          type: 'POST',
                          url: loginUrl,                        
                          data: loginFormdata,     
                          dataType:'json',                   
                          success:function (data) {
                            if (data.errorMessage.length == 0) {
                              var loc = $('#redirectUrl').val();
                              if (loc) {
                                window.location.href=loc;  
                              } 
                              else {
                                window.location.href=$('#redirectUrl').attr('data-orgin');  
                              }
                            }
                            else {
                              alert(data.errorMessage);
                            }
                            
                          },
                          error:function (error) {
                            var loc = $('#redirectUrl').val();
                            if (loc) {
                              window.location.href=loc;  
                            } 
                            else {
                              window.location.href=$('#redirectUrl').attr('data-orgin');  
                            }              
                          }
                      });       
                    }
              }
          })
     
   })
})();
   