var Action = (function() {
	var phoneReg = /^1[3458][0-9]{9}$/;
	return {
		init : function() {
			var hasYuyue = false;
			// true:预约; false:收藏
			var funcFlag = true;
			$("#yuyue_submit").on("click", function(e) {
				e.preventDefault();
				var self = this;
				if (hasYuyue)
					return;
				// if(confirm("需要您先登录后，才能预约；因为预约成功后，我们需要主动联系您，以确认您的到店时间。")){
				SM.checkPhoneExist(function(is_login) {
					if (is_login) {
						submitYuyue();
					} else {
						funcFlag = true;
						showPopup();
					}
				})
				/*
				 * SM.MiniLogin.checkLogin(function(){
				 * $("#yuyue_submit").html("预约中。。。") $.ajax({
				 * url:$(self).attr("href"), dataType:"json",
				 * success:function(data){ if(data.errorMessage){
				 * alert(data.errorMessage) $("#yuyue_submit").html("预约到店看车")
				 * }else{ if(data.code&&data.code=="200"){
				 * $("#contactNum").html($("#contactNum").html()*1+1) //
				 * if(!$.cookie('yuyue_alert')){
				 * alert("预约成功!\n24小时内，客服会主动联系您，\n以确认您到店试驾的时间。\n您可从“页面最底部”-“个人中心“查看您的预约记录。") //
				 * $.cookie('yuyue_alert', '1', { expires: 1, path: '/' }); // }
				 * $("#yuyue_submit").addClass("disabled").html("已预约成功")
				 * hasYuyue=true }else if(data.code&&data.code=="402"){
				 * alert("您已经预约过该车,七天之内不能重复预约!")
				 * $("#yuyue_submit").addClass("disabled").html("已预约成功")
				 * hasYuyue = true }else{ alert("预约出错，请联系客服!")
				 * $("#yuyue_submit").html("预约到店看车") } } }, error:function(){
				 * $("#yuyue_submit").html("点击预约，到店试驾") } }) },function(data){
				 * if(data.result!="true"){ //预约手机号 //return
				 * confirm("需要您先登录后，才能预约；\n因为预约成功后，我们需要主动联系您，以确认您的到店时间")
				 * SM.checkPhoneExist(function(is_login){ if(is_login){
				 * submitYuyue(); }else{ funcFlag = true; showPopup(); } })
				 * 
				 * }else{ return true; } })
				 */
				// }
			})

			var showPopup = function() {
				if (funcFlag) {
					$('#yuyue-form .tip').html('  输入您的手机号码,一键完成预约.');
					$('#yuyue-form #yuyue-sumbit-btn').html('预约');
				} else {
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
							submitYuyue();
						} else {
							submitFav();
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
					var pos = {x:0.2*width,y:height-divH-40};
				}else{
					var pos = {x:0.55*width,y:height-divH-40};
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
			
			var submitYuyue = function() {
				$("#yuyue-sumbit-btn").html('预约中...');
				$.ajax({
					url : $("#yuyue_submit").attr("href"),
					// url:config.api_saleCarOrder,//TODO
					type : "post",
					dataType : "json",
					success : function(data) {

						if (data.errorMessage) {
							alert(data.errorMessage)
							$("#yuyue_submit").html("预约到店看车")
						} else {
							if (data.code && data.code == "200") {
								$("#contactNum")
										.html(
												$("#contactNum").html() * 1 + 1)
								// if(!$.cookie('yuyue_alert')){
//								alert("预约成功!\n24小时内，客服会主动联系您，\n以确认您到店试驾的时间。\n您可从“页面最底部”-“个人中心“查看您的预约记录。")
								// $.cookie('yuyue_alert', '1', {
								// expires: 1, path: '/' });
								// }
								$("#yuyue_submit").addClass("disabled")
										.html("已预约成功")
								hasYuyue = true
							} else if (data.code && data.code == "402") {
								alert("您已经预约过该车,七天之内不能重复预约!")
								$("#yuyue_submit").addClass("disabled")
										.html("已预约成功")
								hasYuyue = true
							} else {
								alert("预约出错，请联系客服!")
								$("#yuyue_submit").html("预约到店看车")
							}
						}
						//$('#yuyue-popup').addClass('hidden');
						//$(".wrapGrayBg").hide();
						animate();
					}
				})
			};
			
			var hasFav = false;
			$("#fav_submit").on("click", function(e) {
				e.preventDefault();
				var self = this;
				if (hasFav)
					return;
				/*
				 * SM.MiniLogin.checkLogin(function(){
				 * $("#fav_submit").html("收藏中。。。") $.ajax({
				 * url:$(self).attr("href"), dataType:"json",
				 * success:function(data){ if(data.errorMessage){
				 * alert(data.errorMessage) $("#fav_submit").html("收藏") }else{
				 * 
				 * $("#fav_submit").addClass("disabled").html("已收藏") hasFav=true
				 * $("#carFavoriteNum").html($("#carFavoriteNum").html()*1+1) } },
				 * error:function(){ $("#fav_submit").html("收藏") } })
				 * },function(data){ if(data.result!="true"){ //预约手机号 //return
				 * confirm("需要您先登录后，才能预约；\n因为预约成功后，我们需要主动联系您，以确认您的到店时间")
				 * SM.checkPhoneExist(function(is_login){ if(is_login){
				 * submitFav(); }else{ funcFlag = false; showPopup() } })
				 * 
				 * }else{ return true; } })
				 */
				SM.checkPhoneExist(function(is_login) {
					if (is_login) {
						submitFav();
					} else {
						funcFlag = false;
						showPopup()
					}
				})

			})

			var submitFav = function() {
				$("#yuyue-sumbit-btn").html('收藏中...')
				$.ajax({
					url : $('#fav_submit').attr("href"),
					/*
					 * url:config.api_saleCarOrder,//TODO data:{
					 * phone:$("#yuyue-phone").val(), carId:config.carId },
					 */
					dataType : "json",
					success : function(data) {
						if (data.errorMessage) {
							alert(data.errorMessage)
							$("#fav_submit").html("收藏")
						} else {

							$("#fav_submit").addClass("disabled").html("已收藏")
							hasFav = true
							$("#carFavoriteNum").html(
									$("#carFavoriteNum").html() * 1 + 1)
						}
						//$('#yuyue-popup').addClass('hidden');
						//$(".wrapGrayBg").hide();
						animate();
					}
				})

			};
		}
	}
})();