			
Souche.yushoudetail = (function(){
	var phoneReg =  /^1[3458][0-9]{9}$/;
				//子导航
				var paras = {
					oldClass: "",
					$lastNav: $(".activeNav"),
					$nav: $("#detail-nav"),
					$win: $(window),
					$body: $("body, html"),
					$winTop: "",
					mainTop: $("#detail_main").offset().top -50,
					paraTop: $("#detail_para").offset().top -50,
					navVisible: false,
					cNav: function(current){
						paras.$lastNav.removeClass("activeNav");
						current.addClass("activeNav");
						paras.$lastNav = current;
					}
				};

				paras.$nav.find("ul a").click(function(){
					var $this = $(this);
					paras.cNav($this);
					var target = $this.attr("href");
					paras.$body.animate({scrollTop:$(target).offset().top - 50},300);
					return false;
				});
				paras.$nav.css("opacity","0.95");
 
				paras.$win.scroll(function(){
					paras.$winTop = paras.$win.scrollTop();
					setTimeout(function(){
						if(paras.$winTop >= paras.mainTop - 40){
							paras.$nav.slideDown(500);
						}else{
							paras.$nav.slideUp(500);
						}
					},100);
					
					if(paras.$winTop >= paras.mainTop && paras.$winTop < paras.mainTop +110){
						paras.cNav($("#detail-nav a[href='#detail_main']"));
					}else if(paras.$winTop >= paras.paraTop && paras.$winTop < paras.paraTop + 110){
						paras.cNav($("#detail-nav a[href='#detail_para']"));
					}
				});
				
				var yProgress = function(){
					var plan_length = parseInt($(".apply_num").text());
					plan_length = plan_length > 5 ? 5 : plan_length;
					if(plan_length == 0){
						$(".apply_plan span").hide();
					}else{
						$(".plan_length").width(plan_length * 68);			
					}
				};
				//detail页面图片轮播
				var lastPhoto = 0;
				var photos = $(".photosWrap li");
				var photosSmall = $(".photosSmall li");
				var photoInfo = $(".photoInfo");
				var timer = null;
				photoInfo.text("1/5 " + photos.eq(0).find("img").attr("alt"));
				photosSmall.eq(0).css("border-color", "#00B0B4");
					
				var photoSlide = function(targetPhoto){
					clearTimeout(timer);
					timer = setTimeout(function(){
						if(targetPhoto == lastPhoto){
							return false;
						}
						
						var lastP = photos.eq(lastPhoto);
						var targetP = photos.eq(targetPhoto);
						
						
						photosSmall.eq(targetPhoto).css("border-color", "#00B0B4");
						photosSmall.eq(lastPhoto).css("border-color", "#fff");
						
						lastP.addClass("photoLastActive");
						targetP.css("opacity","0").addClass("photoActive").animate({"opacity":"1"},300,function(){
							lastP.removeClass();
						});
						lastPhoto = targetPhoto;
	
						var text = targetP.find("img").attr("alt");
						photoInfo.text(targetPhoto + 1 + "/5 " + text);
					},150);	
				};

				photosSmall.mouseenter(function(){
					photoSlide($(this).index());
				});
				$(".photoPre").click(function(){
					if(lastPhoto != 0){
						photoSlide(lastPhoto-1);
					}
				});
				$(".photoNext").click(function(){
					if(lastPhoto != 4){
						photoSlide(lastPhoto+1);
					}
				});
				var submitYuyue = function(){
					$.ajax({
						url:config.api_yushouForSale,
						data:{
							phone:$("#yuyue-phone").val(),
							carId:config.carId
						},
						type:"post",
						success:function(data){
								$('body').append(data);
								$(".wrapGrayBg").show();
								$(".apply_popup").show();
						}
					})
				}
				$("#yuyue-form").on("submit",function(e){
					e.preventDefault();
					if(!phoneReg.test($("#yuyue-phone").val())){
						$(".warning",this).removeClass("hidden");
					}else{
						Souche.PhoneRegister($("#yuyue-phone").val(),function(){
							submitYuyue();
						})
					}
				})
				var askForSale = function(){
					$("#J_yuyue,#J_nav_yuyue").click(function(){
						
						$(this).addClass('yuyue-loading');
						$(this).removeClass('detail-yuyue');
						
						Souche.checkPhoneExist(function(is_login){
							if(is_login){
								submitYuyue();
							}else{
								$("#yuyue-popup").removeClass("hidden");
								$(".wrapGrayBg").show();
							}
						})
					});
				};
				$('#yuyue-popup .apply_close').live('click',function(){
					$("#J_yuyue,#J_nav_yuyue").removeClass('yuyue-loading');
					$("#J_yuyue,#J_nav_yuyue").addClass('detail-yuyue');
				});
				
				var setImgHeight = function(img, wrapH, wrapW){
					if(img.height() < wrapH){
						img.height(wrapH).width("auto");
						var index = (img.width() - wrapW)/2;				
						img.css("margin-left","-" + index + "px");
					}
				};
				$(".photosSmall img").lazyload({ 
					effect : "fadeIn",
					load: function(){
						setImgHeight($(this),76,112);
					}
				}); 
				$(".detail_otherCars img").lazyload({ 
					effect : "fadeIn",
					load: function(){
						setImgHeight($(this),165,220);
					}
				}); 
				
				$('#J_yushouforsale').live('click',function(){
					if(!$(".yuyue-full").length){
						$("#J_yuyue,#J_nav_yuyue").remove();
						$('.detail-button').prepend("<div class='detail-yuyue yuyue-haved'></div>");
						$('.detail-nav-right').append("<div class='detail-nav-yuyue nav-yuyue-haved'></div>");
					}else{
						$("#J_yuyue").removeClass("yuyue-loading").addClass("detail-yuyue");
					}
					$( '.wrapGrayBg' ).hide();
					$(this).parent().addClass('hidden');
                   
				});
				$(".wrapGrayBg").css("opacity","0.5");
				$(window).scroll(function(){
					if($(window).scrollTop() >= $(document).height() - $(window).height() - 270){
						$("#quick_buy").fadeIn(200);
					}else {
						$("#quick_buy").fadeOut(200);
					}
				});
								
				var config = {
						api_isLogin:'',
						api_yushouForSale:'',
						api_jsonparams:'',
						api_detail:''
				};
				return {
					init:function(_config){
						Souche.Util.mixin(config,_config);
						yProgress();
						askForSale();
					}
				};
				
			})();