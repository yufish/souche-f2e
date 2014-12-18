(function(){
	
	$(".apply_close, .popup-sure").live("click",function(){
		$(".apply_popup").addClass("hidden");
		$('.wrapGrayBg').hide();
	});
	
	
	
	
	
	$("#link-to-fenqi").click(function(){
		$("#fenqi-popup").removeClass("hidden");
		$(".wrapGrayBg").show();
		return false;
	});
	
	$("#detailDoor .tab-item").mouseenter(function(){
		var $this = $(this);
		var index = $this.index();
		var target = null;
		var active = $(".tab-content-active");

		$(".tab-item-active").removeClass("tab-item-active");
		$this.addClass("tab-item-active");
		switch(index){
			case 0: target = $("#J_tabService");break;
			case 1: target = $("#J_tabCqi");break;
			default: target = $("#J_tabAddr");
		}
		if(target.attr("class").indexOf("tab-content-active")==-1){
			target.addClass("tab-content-active");
			active.removeClass("tab-content-active");
		}
	});
	//分期付款
	var phoneReg = /^1[3458][0-9]{9}$/;
	var $arrowTime = $("#arrow-time"),
		$mortgage = $("#arrow-mortgage"),
		$arrowrate = $("#arrow-rate"),
		$fenqiList = $("#fenqi_list"),
		$fenqiTime = $("#fenqi_list li"),
		$fenqiTimeWrap = $("#fenqi-wrap");
		$fenqiMort = $("#fenqi-mort")

	var changeArrow = function(time){
		var timeArrow, mortArrow,
			str = "fenqi-arrow arrow";
		switch(time){
			case "12":timeArrow = "1";mortArrow = "3";break;
			case "24":timeArrow = "2";mortArrow = "2";break;
			case "36":timeArrow = "3";mortArrow = "1";break;
		}
		$arrowTime.attr("class", str + timeArrow);
		$mortgage.attr("class", str + mortArrow);
	};

	$("#fenqi_select").click(function(event){
		$fenqiList.show();
		event.stopPropagation();
	});
	$("body, html").click(function(){
		$fenqiList.hide();
	});
	$fenqiTime.click(function(){
		var $this = $(this),
			time = $this.attr("time"),
			mortgage = $this.attr("mortpay"),
			rate = $this.attr("rate"),
			text = $this.text();

		$fenqiTimeWrap.text(text);
		$arrowrate.text(rate);
		$fenqiMort.text(mortgage);
		changeArrow(time);
	});
	//在线咨询
	var dialogGetMes = $("#dialog-getMes"),
		afterSubmit = $("#dialog-showMes, #dialog-apply2"),
		dialogLoginRemind = $("#dialog-login").find(".dialog-user-remind"),
		dialogRegRemind = $("#dialog-reg").find(".dialog-user-remind"),
		showPrice = $("#dialog-showPrice"),
		showText = $("#dialog-showText"),
		priceVal = $("#dialog-priceVal"),
		salePrice = $("#dialog-apply1").attr("price"),
		textVal = $("#dialog-textVal");
	
	//取得用户填写的信息
	var showMes = function(){
		showPrice.text(priceVal.val());
		showText.text(textVal.val());
		afterSubmit.removeClass("hidden");
	};
		
	//是否超过字数
	var mesNum = $("#dialog-mes-num");
	$("#dialog-textVal").keyup(function(){
		
		var length = $(this).val().length;
		mesNum.text(length);
		if(length >= 250){
			//$(this).attr("disabled",true);
		}
	})
	$(".detail-share .wx").click(function(){
		$("#wx-popup").removeClass("hidden")
		$(".wrapGrayBg").show();
		$("#wx-popup img").attr("src",$("#wx-popup img").attr("data-src"))
	})
	var submitToPhone = function(){
		$.ajax({
			url:$("#ph-form")[0].action,
			data:{
				carId:SaleDetailConfig.carId
			},
			type:"post",
			success:function(data){
					$('body').append(data);
					$(".wrapGrayBg").show();
					$("#ph-popup").addClass("hidden")
					$("#ph-result-popup").removeClass('hidden');
			}
		})
	}
	$(".detail-share .ph").click(function(){
		$("#ph-popup .popup-title").html("保存到手机")
		$("#ph-popup .apply_close").attr("click_type",SaleDetailConfig.sendCarClose)
		$("#ph-popup .ph-submit").attr("click_type",SaleDetailConfig.sendCarSubmit)
		$("#ph-popup .tip").html("车辆内容会以短信方式保存到您的手机")
		$("#ph-form")[0].action=SaleDetailConfig.api_sendCarToPhone
		Souche.checkPhoneExist(function(is_login){
			if(is_login){
				submitToPhone();
			}else{
				$("#ph-popup").removeClass("hidden")
				$(".wrapGrayBg").show();
			}
		})
	})
	$("#ph-form").on("submit",function(e){
		e.preventDefault();
		if(!phoneReg.test($("#ph-phone").val())){
			$(".warning",this).removeClass("hidden");
		}else{
			Souche.PhoneRegister($("#ph-phone").val(),function(){
				submitToPhone();
			})
			
		}
	})
	$(".send_addr_tophone").click(function(){
		$("#ph-popup .popup-title").html("发地址到手机")
		$("#ph-popup .tip").html("输入手机号码，即可发送")
		$("#ph-popup .apply_close").attr("click_type",SaleDetailConfig.sendAddressClose)
		$("#ph-popup .ph-submit").attr("click_type",SaleDetailConfig.sendAddressSubmit)
		$("#ph-form")[0].action=SaleDetailConfig.api_sendAddressToPhone
		Souche.checkPhoneExist(function(is_login){
			if(is_login){
				submitToPhone();
			}else{
				$("#ph-popup").removeClass("hidden")
				$(".wrapGrayBg").show();
			}
		})
	})
	var submitJiangjia = function(){
		$.ajax({
			url:$("#jiangjia-form").attr('action'),
			data:$("#jiangjia-form").serialize(),
			success:function(data){
				if(data.errorMessage){
					alert(data.errorMessage)
				}else{
					$("#jiangjia-popup").addClass("hidden");
					$("#jiangjia-success-popup").removeClass("hidden");
					$(".wrapGrayBg").show();
				}
			}
	})
	}
	//降价通知提交
	$("#jiangjia-form").submit(function(e){
		e.preventDefault();
		if(!phoneReg.test($("#jiangjia-phone").val())){
			$(".warning",this).removeClass("hidden");
			return;
		}
		Souche.PhoneRegister($("#jiangjia-phone").val(),function(){
			$('#expectedPrice').val(window.nowPrice);
			submitJiangjia();	
		})
	})
	$("#J_jiangjia").click(function(){
		Souche.checkPhoneExist(function(is_login){
//			if(is_login){
//				submitJiangjia();
//			}else{
				$("#jiangjia-popup").removeClass("hidden");
				$(".wrapGrayBg").show();
//			}
		})
	});
	Bimu.form.selfValidate("J_dialogForm","dialog-sendMes",function(){
		if(!(/^\+?[1-9][0-9]*$/.test(priceVal.val()))){
			$("#price-valid").show();
			return false;
		}
		
		if(parseInt(priceVal.val())>=parseInt(salePrice)){
			$("#price-illegal").show();
			return false;
		}
		var content = $("#dialog-textVal").val();
		if(content&&content.length>250){
			$("#content-valid").show();
			return false;
		}
		$("#content-valid").hide();
		$("#price-illegal").hide();
		$("#price-valid").hide();
		//是否登录
		$.ajax({
			url:contextPath+"/pages/evaluateAction/isLogin.json", 
			type:"post",
			dataType:"json",
			async:false,
			success:function(data){
				if(data.result=="true"){
					
					///
					Bimu.ajax.formPost("J_dialogForm",function(){
				          showMes();
				          afterSubmit.removeClass("hidden");
				          dialogGetMes.removeClass("dialog-error").addClass("hidden");
				          $(".zixun-main").scrollTop($(".zixun-main").height())
				         });
					///
					return true;
				}else{
					dialogGetMes.addClass("dialog-error");
					$(".zixun-main").scrollTop($(".zixun-main").height())
					return false;
				}
			},
			error:function(){
				dialogGetMes.addClass("dialog-error");
				$(".zixun-main").scrollTop($(".zixun-main").height())
				return false;
			}
		});
	})
	var doubleClickFlag=false;
	var submitFav = function(){
		$.ajax({
			url:SaleDetailConfig.api_saveFavorite,
			data:{
				phone:$("#fav-phone").val(),
				carType:SaleDetailConfig.carType,
				carId:SaleDetailConfig.carId
			},
			dataType:"json",
			type:"post",
			success:function(data){
				if(data.errorMessage){
					alert(data.errorMessage)
				}else{
					//$('#shoucang-popup').removeClass('hidden');
					var favPos = $("#J_shoucang").offset();
						$("<div class='icon-fei'></div>").css({left:favPos.left+7,top:favPos.top+7})
						.appendTo(document.body)
						.animate({left:$(".sidebar").offset().left+10,top:$(".sidebar").offset().top+10,opacity:0},700,function(){
							$(".collectside").addClass("flash")
							setTimeout(function(){
								$(".collectside").removeClass("flash")
							},500)
						})
					  $("#fav-popup").addClass("hidden")
					  $(".wrapGrayBg").hide();
					  $("#J_shoucang label").html('已收藏')
					  $("#J_shoucang").attr('value','1').addClass("faved");
					  var num = $('#J_car_favorite').html();
					  $('#J_car_favorite').html(parseInt(num)+1);
					  doubleClickFlag=false;
				}
			}
		})
	}
	$("#J_shoucang").live('click',function(e){
		
		e.preventDefault();
		 
		if($(this).hasClass("faved")){
			return;
		}
		Souche.checkPhoneExist(function(is_login){
			if(is_login){
				
				submitFav();
			}else{
				$("#fav-popup").removeClass("hidden")
				$(".wrapGrayBg").show();
			}
		})
		
	});
	$("#fav-form").on("submit",function(e){
		e.preventDefault();
		if(!phoneReg.test($("#fav-phone").val())){
			$(".warning",this).removeClass("hidden");//("请填写正确的手机号码")
		}else{
			
			Souche.PhoneRegister($("#fav-phone").val(),function(){
				submitFav();
			})
		}
	})
	$('#shoucang-popup .apply_close').click(function(){
		
		$(this).parent().addClass('hidden');
		$(".wrapGrayBg").hide();
	});
	
	Bimu.form.selfValidate("dialog-login","dialog-loginBtn",function(){
		
		//登录验证
		if (!$('#user-phone' ).val()){
			dialogLoginRemind.html("请输入手机号");
	        return false ;
	    }
		if (!$('#user-psd' ).val()){
			dialogLoginRemind.html("请输入密码");
	        return false ;
	    }
		$("#dialog-loginBtn").val("登陆中...");
					
		return true;
	},function (data){ 
	    if(data.errorMessage==""){
	          Bimu.ajax.formPost("J_dialogForm",function(){
	          showMes();
	          afterSubmit.removeClass("hidden");
	          dialogGetMes.removeClass("dialog-error").addClass("hidden");
	         });
	    }else{
	         dialogLoginRemind.html(data.errorMessage);
	    }
	    $(".zixun-main").scrollTop($(".zixun-main").height())
	});
	$("#user-phone").blur(function(){
		var phoneT = $(this).val();
		if(!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phoneT) && phoneT.length==11)){
			dialogLoginRemind.html("请正确填写手机号码！");
    	 }else{
    		 dialogLoginRemind.html("");
    	 }
	});
			
			//注册	    	 	
    	 	var uuid = guid();
    	 	$("#uuid").val(uuid);
    	 	
			Bimu.form.validate("dialog-reg","dialog-regBtn",function(data){
				
				if(data.id){
					if(data.msg){
						dialogRegRemind.html(data.msg);
					}
					
					return;
				}else{
					dialogRegRemind.html("");
					$("#user-phone").val($("#user-regPhone").val());
					$("#user-psd").val($("#user-regPsd").val());
					Bimu.ajax.loginForm("dialog-login",function(data){
						if(data.errorMessage==""){
				               //登陆       
							  Bimu.ajax.formPost("J_dialogForm",function(){
								  showMes();
		            			  afterSubmit.removeClass("hidden");
		            			  dialogGetMes.removeClass("dialog-error dialog-register").addClass("hidden");
		            		  });
			            }
					},null);
				}
				
			},function(){},{noclear:true});
    	 	
			$("#user-regPhone").blur(function(){
				var phoneT = $(this).val();
				if(!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phoneT) && phoneT.length==11)){
					dialogRegRemind.html("请正确填写手机号码");
		    	 }else{
		    		dialogRegRemind.html("");
		    	 }
			});
		     
     function setButtonValue(obj){
    	 var interVal = null;
    	 var phone = $("#user-regPhone").val();
    	 if(!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phone) && phone.length==11)){
    		 dialogRegRemind.html("请正确填写手机号码");
				if(interVal != null)
					clearInterval(interVal);
				
				obj.attr("disabled",false);
				obj.val("获取验证码");
				return ;
    	 }
			var it = 0;
			
			obj.attr("disabled",true);
			
			setTimeout(function(){
				obj.attr("disabled",false);
				if(interVal != null){
					clearInterval(interVal);
				}
				obj.val("获取验证码");
			},60000);
			
			interVal = setInterval(function(){
				
				if(it<60){
					obj.val((60-it)+"秒后可重发");
					it++;
				}
				
			},1000);
			
			var uuid = $("#user-test").val();
			
			Bimu.ajax.post("sendMessageAction","sendMessage",{phoneNumber:phone,type:"register",uuid:uuid},function(data){
				if(data.id){
					dialogRegRemind.html("该手机号码已经注册");
					if(interVal != null){
						
						clearInterval(interVal);
					}
					obj.val("获取验证码");
					obj.attr("disabled",false);
				}else{
					dialogRegRemind.html("");
				}
			},function(){});
		}	
		     
		function s4() {
    	  	return Math.floor((1 + Math.random()) * 0x10000)
    	             .toString(16)
    	             .substring(1);
    	};

    	function guid() {
    	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    	         s4() + '-' + s4() + s4() + s4();
    	}
    	$(".dialog-get-yz").click(function(){
    		setButtonValue($(this));
    	})
    	
	$("#J_zixunPrice").click(function(){
		$("#dialog-apply1,#dialog-getMes").removeClass("hidden").slideDown(200);
		afterSubmit.addClass('hidden');
		$('#dialog-priceVal').val('');
		$("#dialog-textVal").val('');
		$(".zixun-main").scrollTop($(".zixun-main").height())
	});
//	$(".J_linkShangqiao").click(function(){
//		$("#bridgehead").trigger("click");
//	});
	$(".J_linkShangqiao").mouseenter(function(){
		$(".shangqiao-remind",this.parentNode).show();
	}).mouseleave(function(){
		$(".shangqiao-remind",this.parentNode).hide();
	});
	$("#link-reg").click(function(){
		$("#dialog-getMes").addClass("dialog-register");
		return false;
	});
	$("#link-login").click(function(){
		$("#dialog-getMes").removeClass("dialog-register");
		return false;
	});
})();
//查看大图
(function(){
	var bigImages = null;
	var iframe = null;
	var index = 0;
	var appendIframe = function(index){
		if(bigImages){
			iframe.Slider.setCurrent(index);
			bigImages.css("display","block");
		}else{
			bigImages = $("<iframe name='bigImages' id='bigImages' allowtransparency='true' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
			bigImages.attr("src", SaleDetailConfig.api_bigImg);
			bigImages.css({
				display: "none",
				position: "fixed",
				top: 0,
				left: 0,
				background:"#000",
				width: "100%",
				height: $(document.body).height(),
				zIndex: 1000000000000
			})
			$(document.body).append(bigImages);
			iframe = window.frames['bigImages'];
			$(iframe).load(function(){
				iframe.Slider.init({viewHeight:$(window).height()});
				iframe.Slider.setCurrent(index);
				bigImages.css("display","block");
			})
		}
	}
	$("#onsale_detail .photosWrap").click(function(event){
		var target = event.target;
		if(target.nodeName == "IMG"){
			index = $(target).parent().index();
			appendIframe(index);
		}
	});
	$("#onsale_detail .showBig").click(function(){
		appendIframe(0);
	});
})()