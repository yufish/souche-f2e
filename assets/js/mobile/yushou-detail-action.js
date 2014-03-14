var Action = (function(){
	var phoneReg = /^1[3458][0-9]{9}$/;
	return {
		init:function(){
			var hasYuyue = false;
			// funcFlag-> true:yuyue;false:fav
			var funcFlag = true;
			$("#yushou_submit").on("click",function(e){
				e.preventDefault();
				var self = this;
				if(hasYuyue) return;
			    SM.checkPhoneExist(function(is_login){
						if(is_login){
							submitYushouYuyue();
						}else{
					    	funcFlag = true;
					    	showPopup();
						}
				});
				// if(confirm("需要您先登录后，才能预约；\n因为预约成功后，我们需要主动联系您，以通知您什么时候可以到店试驾")){
				/*
				 * SM.MiniLogin.checkLogin(function(){
				 * $("#yushou_submit").html("预约中。。。") $.ajax({
				 * url:$(self).attr("href"), dataType:"json",
				 * success:function(data){ if(data.errorMessage){
				 * alert(data.errorMessage) $("#yushou_submit").html("预约,开售通知我")
				 * }else{ if(data.code&&data.code=="200"){
				 * $("#contactNum").html($("#contactNum").html()*1+1) //
				 * if(!$.cookie('yushou_alert')){
				 * 
				 * alert("预约成功！\n售后客服会主动联系您，\n以通知您什么时候可以到店试驾。\n您可从“页面最底部”-“个人中心“查看您的预约记录。") //
				 * $.cookie('yushou_alert', '1', { expires: 1, path: '/' }); // }
				 * 
				 * $("#yushou_submit").addClass("disabled").html("已预约成功")
				 * hasYuyue=true
				 * 
				 * }else if(data.code&&data.code=="400"){
				 * alert("您已经预约过该车,七天之内不能重复预约!")
				 * $("#yushou_submit").addClass("disabled").html("已预约成功")
				 * hasYuyue = true
				 * 
				 * }else{ alert("预约出错，请联系客服!")
				 * $("#yushou_submit").html("预约,开售通知我") } } }, error:function(){
				 * $("#yushou_submit").html("预约,开售通知我") } }) },function(data){
				 * if(data.result!="true"){ return
				 * confirm("需要您先登录后，才能预约；\n因为预约成功后，我们需要主动联系您，以通知您什么时候可以到店试驾")
				 * }else{ return true; } });
				 */
// }
			})
			
			 var showPopup=function(){
		    	if(funcFlag){
		    		$('#yuyue-form .tip').html('  输入您的手机号码,一键完成预约.');
		    		$('#yuyue-form #yuyue-sumbit-btn').html('预约');
		    	}else{
		    		$('#yuyue-form .tip').html('  输入您的手机号码,一键完成收藏.');
		    		$('#yuyue-form #yuyue-sumbit-btn').html('收藏');
		    	}
				$("#yuyue-popup").removeClass("hidden");
				$(".wrapGrayBg").show();
		    };
			
			$('#yuyue-back').on("click", function(e) {
				e.preventDefault();
				$('#yuyue-popup').addClass('hidden');
				$('.wrapGrayBg').hide();
			});

			$('#yuyue-form').on('submit', function(e) {
				e.preventDefault();
				if (!phoneReg.test($("#yuyue-phone").val())) {
					$(".warning", this).removeClass("hidden");
				} else {
					SM.PhoneRegister($("#yuyue-phone").val(), function() {
						if (funcFlag) {
							submitYushouYuyue();
						} else {
							sumbitYushouFav();
						}
					})
				}
			});
			
			var animate = function(){
				var popup = $('#yuyue-popup');
				var width = $(window).width();
				var height = $(window).height();
				var divH = $('#actions').height();
				if(funcFlag){
					var pos = {x:0.2*width,y:height-divH-30};
				}else{
					var pos = {x:0.55*width,y:height-divH-30};
				}
				popup.animate({width:0,height:0,left:pos.x,top:pos.y},
										350,
										'linear',
										function(){
											popup.addClass('hidden');
											popup.css({
												width:'100%',
												height:'100%',
												top:'0px',
												left:'0'
											});
										});
			};
			
		    var submitYushouYuyue=function(){
		    	$("#yuyue-sumbit-btn").html('预约中...');
		    	$.ajax({
					url:$('#yushou_submit').attr("href"),
					dataType:"json",
					success:function(data){
						if(data.errorMessage){
							alert(data.errorMessage)
							$("#yushou_submit").html("预约,开售通知我")
						}else{
							if(data.code&&data.code=="200"){
								$("#contactNum").html($("#contactNum").html()*1+1)
								// if(!$.cookie('yushou_alert')){

//									alert("预约成功！\n售后客服会主动联系您，\n以通知您什么时候可以到店试驾。\n您可从“页面最底部”-“个人中心“查看您的预约记录。")
									// $.cookie('yushou_alert', '1', { expires:
									// 1, path: '/' });
								// }

								$("#yushou_submit").addClass("disabled").html("已预约成功")
								hasYuyue=true

							}else if(data.code&&data.code=="400"){
								alert("您已经预约过该车,七天之内不能重复预约!")
								$("#yushou_submit").addClass("disabled").html("已预约成功")
								hasYuyue = true

							}else{
								alert("预约出错，请联系客服!")
								$("#yushou_submit").html("预约,开售通知我")
							}
						}
						//$('#yuyue-popup').addClass('hidden');
						//$(".wrapGrayBg").hide();
						animate();
					}
		    	});
		    };
		    
			var hasFav = false;
			$("#fav_submit").on("click",function(e){
				e.preventDefault();
				var self = this;
				if(hasFav) return;
				
				SM.checkPhoneExist(function(is_login){
					if(is_login){
						sumbitYushouFav();
					}else{
				    	funcFlag = false;
				    	showPopup();
					}
				});
				/*
				 * SM.MiniLogin.checkLogin(function(){
				 * $("#fav_submit").html("收藏中。。。") $.ajax({
				 * url:$(self).attr("href"), dataType:"json",
				 * success:function(data){ if(data.errorMessage){
				 * alert(data.errorMessage) $("#fav_submit").html("收藏") }else{
				 * 
				 * $("#fav_submit").addClass("disabled").html("已收藏") hasFav=true
				 * $("#carFavoriteNum").html($("#carFavoriteNum").html()*1+1) } },
				 * error:function(){ $("#fav_submit").html("收藏") } }) });
				 */
			});
			
			
			var sumbitYushouFav =function(){
				$("#yuyue-sumbit-btn").html("收藏中...")
				$.ajax({
					url:$('#fav_submit').attr("href"),
					dataType:"json",
					success:function(data){
						if(data.errorMessage){
							alert(data.errorMessage)
							$("#fav_submit").html("收藏")
						}else{

							$("#fav_submit").addClass("disabled").html("已收藏")
							hasFav=true
							$("#carFavoriteNum").html($("#carFavoriteNum").html()*1+1)
						}
						//$('#yuyue-popup').addClass('hidden');
						//$(".wrapGrayBg").hide();
						animate();
					}
				});
			}
		}
	}
})();