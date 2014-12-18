Souche.Inside = (function(){
	var config = {
	fav_api:""
}
		$(document).ready(function(){
//			var setImgHeight = function(img, wrapH, wrapW){
//				if(img.height() < wrapH){
//					img.height(wrapH).width("auto");
//					var index = (img.width() - wrapW)/2;				
//					img.css("margin-left","-" + index + "px");
//				}
//			};
//			$(".recommend img").each(function(){ 	
//				setImgHeight($(this),150,216);
//			}); 
			
			$(".list_items img").lazyload({ 
				effect : "fadeIn",
				threshold : 250
				
			}); 
			$(".recommend img").lazyload({ 
				effect : "fadeIn",
				threshold : 250
			});  
			
			if($("#choose").length != 0){
				var chooseTop = $("#choose").offset().top;
			}
			var isIE = !!$.browser.msie;
			$(window).scroll(function(){
				var targetTop = $(window).scrollTop();
				//列表页条件栏固定
				if(targetTop >= chooseTop){
					$("#choose").addClass("choose_fixed");
					!isIE&&$("#choose_blank").removeClass("hidden");
				}else{
					$("#choose").removeClass("choose_fixed");
					!isIE&&$("#choose_blank").addClass("hidden");
				};
			});		
			
			//列表页查看更多品牌
			var listBrand = true;
			var listTimer = null;
			var listBrandHover = function(){
				clearTimeout(listTimer);
				if(listBrand == true){
					listTimer = setTimeout(function(){
						$(".nav_brand").addClass("nav_brand_active");
						$(".list_allBrand").show().animate({"width":"710px"},300);
					},100);
				}else{
					clearTimeout(listBrand);
					listBrand = setTimeout(function(){	
						$(".list_allBrand").animate({"width":"0px"},300,function(){
							$(".list_allBrand").hide();
							$(".nav_brand").removeClass("nav_brand_active");
						});
					},100);
				}
				
			};
			$(".nav_list_more").mouseenter(function(){
				listBrand = true;
				listBrandHover();
			}).mouseleave(function(){
				$(".nav_brand").mouseenter(function(){
					listBrandHover();
				}).mouseleave(function(){
					listBrand = false;
					listBrandHover();
					$(".nav_brand").unbind("mouseenter").unbind("mouseleave");
				});
			});
					
			//快速求购位置
			if($(".list_noResult").length == 0){
				$(window).scroll(function(){
					if($(window).scrollTop() >= $(document).height() - $(window).height() - 270){
						$("#quick_buy").fadeIn(200);
					}else {
						$("#quick_buy").fadeOut(200);
					}
				});
			}
			
		});		
		
	return {
		init: function(_c){	
			for(var i in _c){
				config[i]=_c[i]
			}
			this._bind()
		},
		_bind:function(){
			
				var phoneReg = /^1[3458][0-9]{9}$/;
				var fav_carId = null;
				var favSubmit = function(){
					$.ajax({
						url:config.fav_api,
						data:{
							carId:fav_carId//$(self).attr("data-carid")
						},
						dataType:"json",
						type:"post",
						success:function(data){
							if(data.errorMessage){ 
								alert(data.errorMessage)
							}else{
								$(".fav[data-carid="+fav_carId+"]").addClass("faved")
								$("span",$(".fav[data-carid="+fav_carId+"]")).html("已收藏")
								var favPos = $(".fav[data-carid="+fav_carId+"]").offset();
						$("<div class='icon-fei'></div>").css({left:favPos.left+7,top:favPos.top+7})
						.appendTo(document.body)
						.animate({left:$(".sidebar").offset().left+10,top:$(".sidebar").offset().top+10,opacity:0},700,function(){
							$(".collectside").addClass("flash")
							setTimeout(function(){
								$(".collectside").removeClass("flash")
							},500)
						})
							}
						}
					})
				}
				
				var cancelFavSubmit = function(){
					$.ajax({
						url:config.cancelfav_api,
						data:{
							carId:fav_carId//$(self).attr("data-carid")
						},
						dataType:"json",
						type:"post",
						success:function(data){
							if(data.errorMessage){
								alert(data.errorMessage)
							}else{
								$(".fav[data-carid="+fav_carId+"]").removeClass("faved")
								$("span",$(".fav[data-carid="+fav_carId+"]")).html("收藏")
							}
						}
					})
				}
				
				//降价通知提交
					$("#fav-form").submit(function(e){
						e.preventDefault();
						if(!phoneReg.test($("#fav-phone").val())){
							$(".warning",this).removeClass("hidden");
							return;
						}else{
							$("#fav-popup").addClass("hidden");
							$(".fav-wrapGrayBg").hide();
							Souche.PhoneRegister($("#fav-phone").val(),function(){
								favSubmit()
							})
						}
					})
					$("#fav-popup .apply_close").click(function(){
						$("#fav-popup").addClass("hidden");
								$(".fav-wrapGrayBg").hide();
					});
				$(".fav").click(function(e){
					e.preventDefault();
					if($(this).hasClass("faved")) return;
					e.preventDefault();
					fav_carId = $(this).attr("data-carid")
					Souche.checkPhoneExist(function(is_login){
							if(is_login){
								favSubmit()
							}else{
								$("#fav-popup").removeClass("hidden");
								$(".fav-wrapGrayBg").show();
							}
						})
					
				})

		}
	};
})();