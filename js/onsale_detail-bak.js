Souche.OnsaleDetail = (function(){
	
				var paras = {
					oldClass: "",
					$lastNav: $(".activeNav"),
					$nav: $("#onsale_nav"),
					$win: $(window),
					$body: $("body, html"),
					$winTop: "",
					sumTop: $("#onsale_sum").offset().top -80,
					dipanTop: $("#onsale_dipan").offset().top -80,
					fadongjiTop: $("#onsale_fadongji").offset().top -80,
					rideTop: $("#onsale_ride").offset().top -80,
					qimianTop: $("#onsale_qimian").offset().top -80,
					performTop: $("#onsale_perform").offset().top -80,
					paraTop: $("#detail_para").offset().top -80,
					recordTop: $("#onsale_record").offset().top -80,
					commentTop: $("#detail_comment").offset().top -80,
					navVisible: false,
					cNav: function(current){
						paras.$lastNav.removeClass("activeNav");
						current.addClass("activeNav");
						paras.$lastNav = current;
					}
				};

				$('.apply_popup .apply_close').live('click',function(){
					$('.apply_popup').hide();
					$('.wrapGrayBg').hide();
					$("#J-order-button").remove();
					$('.detail_main_info .detail_price').append('<ins class="order_button order_no">已预约</ins>');
				});
				$("#J-order-button").click(function(e){
					e.preventDefault();
					Souche.MiniLogin.checkLogin(function(){
						  //登录成功后需要执行的逻辑，此方法一开始会检查是否登录，如果登陆了会直接执行此回调，如果没登陆弹出登录窗口，登录完成后回调用此回调。
						  //相当于一个中断，等待iframe里面的成功消息再继续执行
						  //window.location.href=$('#J-order-button').attr('href');
						Bimu.ajax.submitpost(config.api_saleCarOrder,config.api_jsonparams,function(data){
							$('body').append(data);
							$(".wrapGrayBg").css("opacity","0.5");
							$(".apply_popup").show();
						});
					});
				});
				paras.$nav.find("a").click(function(){
					var $this = $(this);
					paras.cNav($this);
					var target = $this.attr("href");
					paras.$body.animate({scrollTop:$(target).offset().top - 80},300);
					return false;
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
				paras.$nav.css("opacity","0.85");

				paras.$win.scroll(function(){
					paras.$winTop = paras.$win.scrollTop();
					setTimeout(function(){
						if(paras.$winTop >= paras.sumTop - 40){
							paras.$nav.slideDown(500);
						}else{
							paras.$nav.slideUp(500);
						}
					},100);
					
					if(paras.$winTop >= paras.sumTop && paras.$winTop < paras.sumTop +110){
						paras.cNav($("#onsale_nav a[href='#onsale_sum']"));
					}else if(paras.$winTop >= paras.dipanTop && paras.$winTop < paras.dipanTop + 110){
						paras.cNav($("#onsale_nav a[href='#onsale_dipan']"));
					}else if(paras.$winTop >= paras.fadongjiTop && paras.$winTop < paras.fadongjiTop + 110){
						paras.cNav($("#onsale_nav a[href='#onsale_fadongji']"));
					}else if(paras.$winTop >= paras.rideTop && paras.$winTop < paras.rideTop + 110){
						paras.cNav($("#onsale_nav a[href='#onsale_ride']"));
					}else if(paras.$winTop >= paras.performTop && paras.$winTop < paras.performTop + 110){
						paras.cNav($("#onsale_nav a[href='#onsale_perform']"));
					}else if(paras.$winTop >= paras.recordTop - 100 && paras.$winTop < paras.recordTop + 110){
						paras.cNav($("#onsale_nav a[href='#onsale_record']"));
					}else if(paras.$winTop >= paras.qimianTop && paras.$winTop < paras.qimianTop + 110){
						paras.cNav($("#onsale_nav a[href='#onsale_qimian']"));
					}else if(paras.$winTop >= paras.paraTop && paras.$winTop < paras.paraTop + 110){
						paras.cNav($("#onsale_nav a[href='#detail_para']"));
					}else if(paras.$winTop >= paras.commentTop && paras.$winTop < paras.commentTop + 110){
						paras.cNav($("#onsale_nav a[href='#detail_comment']"));
					}
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
				var smallSlide = function(current){
					var left = "0px";
					if(current.is($(".photoSmallNext"))){
						left = "-546px";
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
							},100);
							
						}).mouseleave(function(){
							clearTimeout(timer);
							intro.fadeOut(100);
						});
					});
					$(".perform-close").click(function(){
						$(this).parent().fadeOut(100);
					});
				};
				
				var jumpPage = function(){
					
					$('#detail_comment .pages-jump a').live('click',function(){
						var carId=$('#detail_comment .comment-main').attr('carId');
						if($(this).attr('prepage')){
							var prePage=$(this).attr('prePage');
							Bimu.ajax.submitpost(config.api_pageComment,{carId:config.api_jsonparams.carId,index:prePage},function(data){
								 $('#detail_comment .comment-main').html(data);
							});	
						}
						if($(this).attr('nextpage')){
							var nextPage=$(this).attr('nextPage');
							Bimu.ajax.submitpost(config.api_pageComment,{carId:carId,index:nextPage},function(data){
								 $('#detail_comment .comment-main').html(data);
							});	
						}
					});
				};
				var replyComment = function(){
					
					$('#detail_comment .comment-click').live('click',function(){
						var content ="回复:"+$(this).parent().parent().find('.comment-user').attr('userId')+":";
						$('#detail_comment .apply-text').val(content).focus();
						$('#detail_comment .oldContent').val("//"+$(this).parent().parent().find('.comment-user').html()+":"+$(this).parent().parent().find('.comment-content').html());
					});
				};
				
				var delComment = function(){
					
					$('#detail_comment .comment-del').live('click',function(){
						var id = $(this).attr('id');
						var currentLi=$(this).parent().parent();
						Bimu.ajax.submitpost(config.api_delComment,{id:id},function(data){
							currentLi.remove();
						});	
						
						
					});
				};
				var submitComment = function(){

					////////评论异步提交1.先判断登陆，是否为空 2.提交评论
					$("#J_comment_form").submit(function(e){
						//校验 true,false
							if ($('#J_comment_form .apply-text' ).val()==""){
				            	$('#detail_comment .comment-error').html('评论不能为空').removeClass('hidden');
			                    return false ;
			              }if ($('#J_comment_form .apply-text' ).val().length>500){
				            	$('#detail_comment .comment-error').html('评论字数不能大于500').removeClass('hidden');
			                    return false ;
			              }else{
			            	  $('#detail_comment .comment-error').addClass('hidden');
			              }
						
						e.preventDefault();
						Souche.MiniLogin.checkLogin(function(){
						  //登录成功后需要执行的逻辑，此方法一开始会检查是否登录，如果登陆了会直接执行此回调，如果没登陆弹出登录窗口，登录完成后回调用此回调。
						  //相当于一个中断，等待iframe里面的成功消息再继续执行
						  

			    			  $( '.wrapGrayBg' ).hide();
					          $( '#loginInner' ).hide();
			    			  $("#J_comment_form").attr("action",config.api_submitComment);
				    		  Bimu.ajax.formPost("J_comment_form",function(data){
				    			  var li = '<li><p class="comment-user" userId="'+data.user+'">'+data.user+'<ins class="comment-time">'+data.date+'</ins></p><p class="comment-content">'+data.content+'</p><p class="comment-feed"><a href="javascript:void(0);" class="comment-click">回复</a><a href="javascript:void(0);" id="'+data.id+'" class="comment-del">删除</a></p></li>';
				    			  $('#detail_comment ul').prepend(li);
				    			  $('#J_comment_form .apply-text' ).val('');
				    			  $('#J_comment_form .oldContent' ).val('');
				    			  $("#J_comment_form").attr("action",config.api_isLogin);
				    		  });
				    		  
						});
					});
					/////
				};
				
				var config = {
						
				};
				
				//评论框字符统计
				var applyNum = $(".apply-num span");
				$(".apply-text").keyup(function(){
					var length = $(this).val().length;
					if(length <= 500){
						applyNum.text(500 - length);
					}
				});
				return {
					init: function(_config){
						Souche.Util.mixin(config,_config);
						setPerformPoint();
						submitComment();
						replyComment();
						jumpPage();
						delComment();
					}
				};
})();