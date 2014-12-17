	Souche.OnsaleDetail = function(){
		var phoneReg =  /^1[3458][0-9]{9}$/;
		var paras = {
				oldClass: "",
				$lastNav: $(".activeNav"),
				$nav: $("#detail-nav"),
				$win: $(window),
				$body: $("body, html"),
				$winTop: "",
				mainTop: $("#detail_main").offset().top -50,
				sumTop: $("#onsale_sum").offset().top -50,
				paraTop: $("#detail_para").offset().top -50,
				recordTop: $("#onsale_record").offset().top -50,
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
			}else if(paras.$winTop >= paras.sumTop && paras.$winTop < paras.sumTop +110){
				paras.cNav($("#detail-nav a[href='#onsale_sum']"));
			}else if(paras.$winTop >= paras.recordTop && paras.$winTop < paras.recordTop + 110){
				paras.cNav($("#detail-nav a[href='#onsale_record']"));
			}else if(paras.$winTop >= paras.paraTop && paras.$winTop < paras.paraTop + 110){
				paras.cNav($("#detail-nav a[href='#detail_para']"));
			}
		});
				var submitYuyue = function(){
					$.ajax({
						url:config.api_saleCarOrder,
						data:{
							phone:$("#yuyue-phone").val(),
							carId:config.carId
						},
						type:"post",
						success:function(data){
								$('body').append(data);
								$(".wrapGrayBg").show();
								$("#yuyue-popup").addClass("hidden");
								$("#yuyue-result-popup").removeClass('hidden');
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
				var flagD=false;
				$("#J_yuyue,#J_nav_yuyue").click(function(e){
					e.preventDefault();
					$(this).addClass('yuyue-loading');
					$(this).removeClass('detail-yuyue');
					if($(this).hasClass('yuyue-haved')||flagD){
						return ;
					}
					//一秒内只能点一次。
					flagD=true;
					setTimeout(function(){
						flagD=false;
					},1000)
					Souche.checkPhoneExist(function(is_login){
						if(is_login){
							submitYuyue();
						}else{
							$("#yuyue-popup").removeClass("hidden")
							$(".wrapGrayBg").show();
						}
						$("#login_button").attr("disabled",false);
					})
				});
				$('#yuyue-popup .apply_close').live('click',function(){
					$("#J_yuyue,#J_nav_yuyue").removeClass('yuyue-loading');
					$("#J_yuyue,#J_nav_yuyue").addClass('detail-yuyue');
				});
				$('#yuyue-result-popup .apply_close').live('click',function(){
					
					if(!$("#yuyue-result-popup .yuyue-full").length){
						$("#J_yuyue,#J_nav_yuyue").remove();
						$('.detail-button').prepend("<div class='detail-yuyue yuyue-haved'></div>");
						$('.detail-nav-right').append("<div class='detail-nav-yuyue nav-yuyue-haved'></div>");
					}else{
						$("#J_yuyue").removeClass("yuyue-loading").addClass("detail-yuyue");
					}
					
					$(this).parent().addClass('hidden');
					$(".wrapGrayBg").hide();
				});
				
				
				$(".detail_photosGallary img").lazyload({ 
					effect : "fadeIn"
				}); 
				$(".fadongji_rule img").lazyload({ 
					effect : "fadeIn"
				});
				$(".detail_otherCars img").lazyload({ 
					effect : "fadeIn"
				});
				$(".qimian_img img").lazyload({ 
					effect : "fadeIn"
				});
				$(".perform_img img").lazyload({ 
					effect : "fadeIn"
				});
				$(".perform_img img").lazyload({ 
					effect : "fadeIn"
				});
				$(".perform-intro img").lazyload({ 
					effect : "fadeIn"
				});
				
				//detail页面图片轮播
				var lastPhoto = 0;
				var photos = $(".photosWrap li");
				var photoInfo = $(".photoInfo");
				var photoSmall = $(".photosSmallWrap li");
				var length = photoSmall.length;
				var timer = null;
				photoInfo.text("1/" + length + " " + photos.eq(0).find("img").attr("alt"));
				photoSmall.eq(0).find("span").show();

				var photoSlide = function(targetPhoto){
					clearTimeout(timer);
					timer = setTimeout(function(){
						if(targetPhoto == lastPhoto){
							return false;
						}
						
						var lastP = photos.eq(lastPhoto);
						var targetP = photos.eq(targetPhoto);
						var lastSmallP = photoSmall.eq(lastPhoto);
						var targetSmallP = photoSmall.eq(targetPhoto);
						var imgSrc = targetP.attr("imgSrc");
						var img = targetP.find("img");
						if(img.attr("src") == ""){
							targetP.find("img").attr("src",imgSrc);
						}
						
						targetSmallP.find("span").show();
						lastSmallP.find("span").hide();
						lastP.addClass("photoLastActive");
						targetP.css("opacity","0").addClass("photoActive").animate({"opacity":"1"},300,function(){
							lastP.removeClass();
						});
	
						if(targetPhoto == 11){
							smallSlide($(".photoSmallPre"));
						} 
						if(targetPhoto == 12){
							smallSlide($(".photoSmallNext"));
						} 
						lastPhoto = targetPhoto;
	
						var text = targetP.find("img").attr("alt");
						photoInfo.text(targetPhoto + 1 + "/" + length + " " + text);	

					},150);	
				};
				photoSmall.mouseenter(function(){
					$this = $(this);
					var index = $this.index();
					if($this.parent().is(".photosSmall2")){
						index += 12;
					}
					photoSlide(index);
				});
				
				$(".photoPre").click(function(){
					if(lastPhoto != 0){
						photoSlide(lastPhoto-1);
					}
				});
				$(".photoNext").click(function(){
					if(lastPhoto != length-1){
						photoSlide(lastPhoto+1);
					}
				});
				var wrapWidth = $(".wrap").width();
				if(wrapWidth == 1200){
					smallSlideWidth = "-546px";
				}else{
					smallSlideWidth = "-504px";
				}
				var smallSlide = function(current){
					var left = "0px";
					if(current.is($(".photoSmallNext"))){
						left = smallSlideWidth;
						current.addClass("photoActiveNext");
						$(".photoSmallPre").removeClass("photoActivePre");
					}else{
						current.addClass("photoActivePre");
						$(".photoSmallNext").removeClass("photoActiveNext");
					}
					$(".photosSmallWrap div").animate({"margin-left":left},300);
				};
				$(".photoSmallNext").click(function(){
					smallSlide($(this));
				});
				$(".photoSmallPre").click(function(){
					smallSlide($(this));
				});
				
				var oldImg = null;
				var oldSrc = "";
				$(".fadongji_viewImg img").mouseenter(function(){
					var currentSrc = $(this).attr("src");
					oldImg = $(this).closest(".fadongji_view").find(".fadongji_rule img");
					oldSrc = oldImg.attr("src");
					oldImg.attr("src",currentSrc);
				}).mouseleave(function(){
					oldImg.attr("src",oldSrc);
				});
				
				$(window).scroll(function(){
					if($(window).scrollTop() >= $(document).height() - $(window).height() - 270){
						$("#quick_buy").fadeIn(200);
					}else {
						$("#quick_buy").fadeOut(200);
					}
				});
				$("body,html").click(function(){
					$(".perform-intro").fadeOut(100);
				});
				var setPerformPoint = function(){
					var points = $(".perform-point");
					var neishi = $(".perform_neishi");
					points.each(function(){
						var $this = $(this);
						var intro = $this.parent().find(".perform-intro");
						var x = parseInt($this.attr("x"));
						var y = parseInt($this.attr("y"));
						var introX = parseInt(intro.css("left"));
						var timer = null;
						$this.css({left:x+"px",top:y+"px"});
						intro.css({left:introX + (x + 80) +"px",top:(y - 217) + "px"});
						$this.mouseenter(function(){
							timer = setTimeout(function(){
								intro.fadeIn(300);
								if(introX != 0){
									neishi.css("z-index",100);
								}else{
									neishi.css("z-index",10);
								}
							},100)
							
						}).mouseleave(function(){
							clearTimeout(timer);
							intro.fadeOut(100);
						});
					});
					$(".perform-close").click(function(){
						$(this).parent().fadeOut(100);
					});
				};

				var downCounter = function(target){
				var container = target;
				var counter = {
					endYear: container.attr("endYear"),
					endMonth: container.attr("endMonth"),
					endDay: container.attr("endDay"),
					endHour: container.attr("endHour"),
					serverYear: container.attr("serverYear"),
					serverMonth: container.attr("serverMonth"),
					serverDay: container.attr("serverDay"),
					serverHour: container.attr("serverHour"),
					serverMin: container.attr("serverMin"),
					serverSec: container.attr("serverSec"),
					offHour: 0,
					offMin: 0,
					offSec: 0,
					offMSec: 1,
					offset: 0
				}
				var showDom = function(){
					var zeroH = "",zeroM = "",zeroS = "";

					if(counter.offHour<10) {
						zeroH = "0";
					}
					if(counter.offMin<10) {
						zeroM = "0";
					}
					if(counter.offSec<10) {
						zeroS = "0";
					}

					container.html("<ins>" + zeroH + counter.offHour + "</ins>时<ins>" + zeroM + counter.offMin + "</ins>分<ins>" + zeroS + counter.offSec + "</ins>" + "." + "<ins class='offMSec'>" + counter.offMSec + "</ins>秒");
			 	}
				var setInitTime = function(){
					var endDate = new Date(counter.endYear, counter.endMonth, counter.endDay, counter.endHour, 0, 0);
					var serverDate = new Date(counter.serverYear, counter.serverMonth, counter.serverDay, counter.serverHour, counter.serverMin, counter.serverSec);
					counter.offset = Date.parse(endDate) - Date.parse(serverDate);

					if(counter.offset < 0){
						counter.offMSec = 0;
						counter.offSec = 0;
						counter.offMin = 0;
						counter.offHour = 0;
						showDom();
						console.info(counter.offMSec);
						return false;
					}
					counter.offHour = Math.floor(counter.offset/(3600*1000));
					var leave = counter.offset%(3600*1000);
					counter.offMin = Math.floor(leave/(60*1000));
					var leave2 = leave%(60*1000);
					counter.offSec = Math.floor(leave2/1000);
					showDom();
				}
				setInitTime();//初始化
				if(counter.offset > 0){
					var timer = setInterval(function(){
						--counter.offMSec;
						if(counter.offMSec < 0){
							counter.offMSec = 9;
							--counter.offSec;
							if(counter.offSec < 0){
								counter.offSec = 59;
								--counter.offMin;
								if(counter.offMin < 0){
									counter.offMin = 59;
									--counter.offHour;
									if(counter.offHour < 0){
										clearInterval(timer);
										counter.offSec = 0;
										counter.offMin = 0;
										counter.offHour = 0;	
									}
								}
							}
						}
						showDom();
					},100)
				}
				
			};
			var config = {
					
			};
			var beginCount = function(){
				var counters = $(".downCounter");
				counters.each(function(){
					var $this = $(this);
					downCounter($this);
				})
			}
				return {
					init: function(_config){
						Souche.Util.mixin(config,_config);
						setPerformPoint();
						beginCount();
					}
				};
			}();
			
