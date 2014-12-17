(function(){
	$(document).ready(function(){
		var Q_Buy_active = false;
		$(window).scroll(function(){
			if($(window).scrollTop() > $(window).height()){
				$("#toTop").show();
			}else{
				$("#toTop").hide();
			}
		});
		$("#toTop").click(function(){
			$("html,body").animate({scrollTop:0});
		});
		$(".wrapGrayBg").css("opacity","0.5");
		$("#quick_buy").css("opacity","0.9");
		
		$(".footer_service li").mouseenter(function(){
			$(this).find("ins").addClass("ins_hover");
		}).mouseleave(function(){
			$(this).find("ins").removeClass("ins_hover");
		});
		$("#toTop").mouseenter(function(){
			$(this).addClass("toTopActive");
		}).mouseleave(function(){
			$(this).removeClass("toTopActive");
		});
		$("#erweima").mouseenter(function(){
			$(".erweima-small").addClass("erweima-active");
			$(".erweima-big").fadeIn(300);
		}).mouseleave(function(){
			$(".erweima-small").removeClass("erweima-active");
			$(".erweima-big").hide();
		});
		//建议
		$("#suggest").mouseenter(function(){
			$('.suggest-tag').addClass("suggest-tag-active");
		}).mouseleave(function(){
			$('.suggest-tag').removeClass("suggest-tag-active");
		});
		$(".suggest-tag").click(function(){
			$(".suggest-area").val('在这里输入您的建议，感谢您对大搜车的帮助！');
			if(!$('.suggest-remind').hasClass('hidden')){
				$('.suggest-remind').addClass('hidden');
			}
			$('.suggest-popup').removeClass("hidden");
			$('.wrapGrayBg').show();
		});

		$(".suggest-close").click(function(){
			$(".suggest-popup").addClass("hidden");
			$('.wrapGrayBg').hide();
		});
		var oldVal = $(".suggest-area").val();
		var numLen = parseInt($(".suggest-num ins").text());
		$(".suggest-area").focus(function(){
			var $this = $(this);
			$this.addClass('suggest-area-active');
			if($this.val() == oldVal){
				$this.val('');
			}
		}).blur(function(){
			var $this = $(this);
			$this.removeClass('suggest-area-active');
			if($this.val() == ''){
				$this.val(oldVal);
			}
		}).keyup(function(){
			if(!$('.suggest-remind').hasClass('hidden')){
				$('.suggest-remind').addClass('hidden');
			}
			var $this = $(this);
			var length = $this.val().length;
			if(length > numLen){
				$(".suggest-num").html("您已超过<ins>"+(length-numLen)+"</ins>字");
				$(".suggest-submit").addClass("hidden");
				$(".suggest-no").removeClass("hidden");
			}else{
				$(".suggest-num").html("您还可以输入<ins>"+(numLen - length)+"</ins>字");
				$(".suggest-no").addClass("hidden");
				$(".suggest-submit").removeClass("hidden");
			}
		});
		$("#J_suggest_form").submit(function(event){
			event.preventDefault();
			if($('.suggest-area').val()==''||$('.suggest-area').val()==$('.suggest-area').attr('default')){
				$('.suggest-remind').removeClass("hidden");
				return ;
			}
			
			Bimu.ajax.formPost("J_suggest_form",function(data){
				$(".suggest-popup").addClass("hidden");
				$(".suggest-result").removeClass("hidden");
				setTimeout(function(){
					$(".suggest-result").addClass("hidden");
					$('.wrapGrayBg').hide();
				},1000);
			});
		});
		
		
		
		//car_list鼠标hover和click效果
		var borderColor = null;
		$(".car_list li, .list_content").mouseenter(function(){
			borderColor = $(this).css("border-color");
			if($(this).find(".car_price").length != 0){
				targetColor = $(this).find(".car_price").css("color");
			}
			if($(this).find(".list_content_price_new").length != 0){
				targetColor = $(this).find(".list_content_price_new").css("background-color");
			}
			$(this).css({"border-color": targetColor});
		}).mouseleave(function(){
			
			$(this).css({"border-color": borderColor});
		});
		$(".car_list li, .list_content, .carBox li, .service-contain").live("click",function(){
			var a = $(this).find("a");
			if(a.length!=0){
				var href = a.attr("href");
				window.open(href,"_blank");
			}
		});
		$(".car_list li a, .list_content a, .carBox li a, .service-contain a").live("click", function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;
			}
		});

		//查看更多
		$(".moreCar").mouseenter(function(){
			$(this).find("span").animate({"margin-right":"17px"},300);
		}).mouseleave(function(){
			$(this).find("span").animate({"margin-right":"37px"},300);
		});
		
		//快速求购弹窗
		if($("body").attr("id")!="onsale_detail" && $("body").attr("id")!="yushou_list" && $("body").attr("id")!="list" && $("body").attr("id")!="yushou_detail"){
			$(window).scroll(function(){
				var scrollT = $(window).scrollTop();
				var winH = $(window).height();
				var htmlH = $(document).height();
				if(scrollT >= winH * 2 || scrollT >= htmlH - winH){
					$("#quick_buy").fadeIn(200);
				}else {
					$("#quick_buy").fadeOut(200);
				}
			});
		}
		$("#quick_buy .quick_buy_remind").click(function(){
			if(!Q_Buy_active){
				Bimu.select.init(['Q_buybrand','Q_buyset',''],"car-subdivision",['','',''],function(){});
				Q_Buy_active=true;
			}
			$(this).animate({height: "0px"},300,function(){
				$(this).hide();
			});		
			$("#quick_buy .quick_buy_info").show().height(0).animate({height: "307px"},300);

		});
		$("#quick_buy .quick_buy_info .quick_buy_p").click(function(){
			var parent = $(this).closest(".quick_buy_info");
			
			parent.animate({height: "0px"},300,function(){
				parent.hide();
			});		
			$("#quick_buy .quick_buy_remind").show().height(0).animate({height: "47px"},300);

		});

	});

var bdTimer = setInterval(function(){
	if($("#BDBridgeMess").length != 0){
		clearInterval(bdTimer);
		$("#BdBPClose").unbind("click").click(function(){
			$("#BaiduBridgePigeon").hide();					
		});
		if($("#BaiduBridgePigeon").is(":visible")){
			$("#BaiduBridgePigeon").hide();
			$("#BDBridgeIconWrap").unbind("click").click(function(){
				$("#BaiduBridgePigeon, #BdBPBody, #BdBPFoot").show();
				$("#BaiduBridgePigeon").height(320);
			});
		}
		if($("#BDBridgeIconWrap").length != 0){
			$("#BDBridgeIconWrap").mouseenter(function(){
				$("#bridgehead").addClass("BDActive");
			}).mouseleave(function(){
				$("#bridgehead").removeClass("BDActive");
			});
		}
		
	}
},100);

	//ie6 fixed 
	if((parseFloat($.browser.version) <= 6.0)){
		var BDFixed = function(){
			$("#BDBridgeIconWrap").css({
				position:"absolute",
				top:$(window).scrollTop()+$(window).height()-180,
				right:0,
				left:"auto",
				bottom:"auto", 
				"margin-bottom":0
			});
			$("#floatLayer").css({
				position:"absolute",
				top:$(window).scrollTop()+$(window).height()-125,
				right:0
			});
			$("#loginInner").css({
				position:"absolute",
				top:$(window).scrollTop()+$(window).height()-450
			});
			$(".apply_popup").css({
				position:"absolute",
				top:$(window).scrollTop()+$(window).height()-450
			});
		};
		var timer = setInterval(function(){
			if($("#BDBridgeIconWrap").length != 0){
				clearInterval(timer);
				BDFixed();
				$(window).scroll(function(){
					BDFixed();
				});			
			}
		},100);
		
		
		
	}
	
})();



var Souche = Souche||{};
Souche.Util = function(){
	var appearKV = {

	};
	return {
		/**
		 * 混合配置
		 */
		 mixin:function(target,source){
		 	for(var i in source){
		 		target[i]=source[i];
		 	}
		 },
		/**
		 * 元素第一次出现的时候执行某方法，之后不再执行
		 */
		 appear:function(id,bindFunc){
		 	appearKV[id]=appearKV[id]||[];
		 	appearKV[id].push(bindFunc);
		 },
		 init:function(){
		 	var viewportWidth = $(window).width();
		 	var viewportHeight = $(window).height();

		 	$(window).scroll(function(){
		 		var windowScrollTop = $(window).scrollTop();
		 		for(var i in appearKV){
		 			var offset = $(i).offset();

		 			if(offset.top-windowScrollTop>0&&offset.top-windowScrollTop<viewportHeight){
		 				for(var b =0;b<appearKV[i].length;b++){
		 					appearKV[i][b]();
		 				}
		 				appearKV[i]=[];
		 			}
		 		}
		 	});
		 }
		};
	}();

	Souche.Util.init();


