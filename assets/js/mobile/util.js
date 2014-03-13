var SM = window.SM || {};

SM.LoadingTip = function(){
    var tip = null
    var timer = null;
    var tail = ".";
    return {
        show:function(text){
            
            if(!tip){
                tip=document.createElement("div")
                tip.className="loading-tip"
                tip.innerHTML="正在加载中。。。"
                document.body.appendChild(tip)
            }
            tip.innerHTML=text||"正在加载中"
            $(tip).css({
                left:$(window).width()/2-$(tip).width()/2,
                top:$(window).height()/2-$(tip).height()/2,
                display:"block"
            }).addClass("show")
//            timer = setInterval(function(){
//                tail+="."
//                    if(tail.length>6) tail="."
//                    tip.innerHTML=text+tail
//            },200)
        },
        hide:function(){
            tip&&$(tip).removeClass("show")
            setTimeout(function(){
               $(tip).css({
                   display:"none"
               }) 
            },500)
        }
    }
}();
SM.MiniLogin = SM.MiniLogin||{};
SM.MiniLogin = function(){
	var static_login_url = contextPath+"/pages/mobile/login.html?redirect="+encodeURIComponent("http://"+window.location.host+"/"+contextPath+"/pages/mobile/loginSuccess.html");
	var minilogin = null;
	var minilayer = null;
	var callback = function(){
		
	};
  var loginCallback = function(){

  }
	return {
		callback:function(){
			this.close();
			callback();

		},
		close:function(){
			if(minilogin){
				minilogin.css({
					display:"none"
				});
			}
      window.location.hash = ""
		},
		_show:function(){
			var self = this;
			window.location.hash = "#login"
      window.onhashchange = function(h){
        if(window.location.hash!="#login"){
          self.close()
        }
      }
			if(minilogin){
				minilogin.attr("src",static_login_url);
				minilogin.css({
					display:"block"
				});
//				minilayer.css({
//					display:"block"
//				});
			}else{
				minilogin = $("<iframe id='minilogin' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
				
				minilogin.attr("src",static_login_url);
				minilogin.css({
					display:"block",
					width:$(document.body).width(),
					height:$(document.body).height(),
					position:"fixed",
					top:0,
					left:0,
					zIndex:100000001
				});
				
//				minilayer = $("<div id='minilayer'></div>");
//				minilayer.css({
//					display:"block",
//					width:$(document.body).width(),
//					left:0,
//					top:0,
//					height:$(document.body).height(),
//					position:"absolute",
//					opacity:0.7,
//					background:"#111",
//					zIndex:100000000
//				});
//				$(document.body).append(minilayer);
				$(document.body).append(minilogin);
//				$(window).scroll(function(){
//					minilogin.css({
//						top:$(window).scrollTop()+100,
//						left:$(window).width()/2-300
//					})
//				})
			}
		},
		checkLogin:function(_callback,_loginCallback){
			callback = _callback;
      loginCallback = _loginCallback;
			var self = this;
			$.ajax({
				url:contextPath+"/pages/evaluateAction/isLogin.json", 
				type:"post",
				dataType:"json",
				success:function(data){
          if(loginCallback){
            if(!loginCallback(data)) return;
          }
					if(data.result=="true"){
						self.callback&&self.callback();
					}else{
						self._show();
					}
				},
				error:function(){
					self._show();
				}
			});
		}
	};
}();

//检查是否填过手机号
SM.checkPhoneExist = function(callback){
	$.ajax({
		url:contextPath+"/pages/evaluateAction/isNoRegisterLogin.json", 
		type:"post",
		dataType:"json",
		success:function(data){
			if(data.result=="true"){
				callback(true)
			}else{
				callback(false)
			}
		},
		error:function(){
			callback(false)
		}
	})
};
//一步注册手机号
SM.PhoneRegister = function(phone,callback){
	$.ajax({
		url:contextPath+"/pages/evaluateAction/noRegisterLogin.json", 
		type:"post",
		dataType:"json",
		data:{phone:phone},
		success:function(data){
			if(data.errorMessage){
				callback(false)
			}else{
				callback(true)
			}
		},
		error:function(){
			callback(false)
		}
	})
}